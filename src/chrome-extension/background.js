chrome.runtime.onInstalled.addListener(function () {
  chrome.developerPrivate.openDevTools({ tabId: chrome.devtools.inspectedWindow.tabId });
});
