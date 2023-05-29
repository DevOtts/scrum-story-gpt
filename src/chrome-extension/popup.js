document.addEventListener('DOMContentLoaded', function () {
  var confirmBtn = document.getElementById('confirmBtn');
  var subTaskBtn = document.getElementById('subtaskBtn');
  var textArea = document.getElementById('textArea');

  confirmBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'replaceText', text: textArea.value });
    });
  });

  subTaskBtn.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'subTasks' });
    });
  });
});
