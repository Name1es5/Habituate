// Relay COUNT_UPDATE messages from content scripts to any open popup.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'COUNT_UPDATE') {
    chrome.storage.session.set({ ljb_count: msg.count });
  }
  sendResponse();
});
