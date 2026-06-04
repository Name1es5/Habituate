(() => {
  const STORAGE_KEY = 'ljb_enabled';
  let isEnabled = true;
  let hiddenCount = 0;
  let observer = null;

  // All known selectors for a top-level job card element
  const CARD_SELECTORS = [
    'li[data-occludable-job-id]',
    '.jobs-search-results__list-item',
    '.job-card-container',
    '.job-card-list',
    '.scaffold-layout__list-container > ul > li',
    '.discovery-templates-entity-item',
    '.feed-shared-update-v2',   // feed posts that embed a job ad
    '.jobs-job-board-list__item',
  ].join(', ');

  // Text labels LinkedIn uses to mark promoted content (case-insensitive)
  const PROMOTED_LABELS = /^promoted$/i;

  function isPromoted(card) {
    // 1. Explicit promoted class (LinkedIn adds this sometimes)
    if (card.classList.contains('job-card-container--promoted')) return true;

    // 2. data-* attribute hint
    if (card.dataset.promoted === 'true') return true;

    // 3. "Promoted" label anywhere inside the card
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (PROMOTED_LABELS.test(node.textContent.trim())) return true;
    }

    return false;
  }

  function hideCard(card) {
    if (card.dataset.ljbHidden) return;
    card.dataset.ljbHidden = 'true';
    card.style.setProperty('display', 'none', 'important');
    hiddenCount++;
    broadcastCount();
  }

  function showCard(card) {
    if (!card.dataset.ljbHidden) return;
    delete card.dataset.ljbHidden;
    card.style.removeProperty('display');
    hiddenCount = Math.max(0, hiddenCount - 1);
    broadcastCount();
  }

  function processCards() {
    if (!isEnabled) return;
    document.querySelectorAll(CARD_SELECTORS).forEach(card => {
      if (isPromoted(card)) hideCard(card);
    });
  }

  function restoreAll() {
    document.querySelectorAll('[data-ljb-hidden]').forEach(card => showCard(card));
    hiddenCount = 0;
    broadcastCount();
  }

  function broadcastCount() {
    chrome.runtime.sendMessage({ type: 'COUNT_UPDATE', count: hiddenCount }).catch(() => {});
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(mutations => {
      if (!isEnabled) return;
      let shouldScan = false;
      for (const m of mutations) {
        if (m.addedNodes.length) { shouldScan = true; break; }
      }
      if (shouldScan) processCards();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function stopObserver() {
    observer?.disconnect();
    observer = null;
  }

  function init(enabled) {
    isEnabled = enabled;
    if (isEnabled) {
      processCards();
      startObserver();
    } else {
      stopObserver();
      restoreAll();
    }
  }

  // Load persisted setting then start
  chrome.storage.sync.get(STORAGE_KEY, result => {
    const enabled = result[STORAGE_KEY] !== false; // default ON
    init(enabled);
  });

  // Listen for toggle messages from the popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SET_ENABLED') init(msg.enabled);
    if (msg.type === 'GET_COUNT') broadcastCount();
  });
})();
