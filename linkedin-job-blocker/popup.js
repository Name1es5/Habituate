const STORAGE_KEY = 'ljb_enabled';

const toggle = document.getElementById('toggle');
const countEl = document.getElementById('count');
const dot = document.getElementById('statusDot');

function setUI(enabled) {
  toggle.checked = enabled;
  dot.classList.toggle('active', enabled);
}

function refreshCount() {
  chrome.storage.session.get('ljb_count', result => {
    countEl.textContent = result.ljb_count ?? 0;
  });
}

// Load saved state
chrome.storage.sync.get(STORAGE_KEY, result => {
  const enabled = result[STORAGE_KEY] !== false;
  setUI(enabled);
});

refreshCount();

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ [STORAGE_KEY]: enabled });
  setUI(enabled);

  // Tell all LinkedIn tabs about the change
  chrome.tabs.query({ url: '*://*.linkedin.com/*' }, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { type: 'SET_ENABLED', enabled }).catch(() => {});
    });
  });
});

// Poll count while popup is open
setInterval(refreshCount, 1500);
