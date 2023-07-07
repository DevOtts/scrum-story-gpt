
console.log("content-ott 2.2");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content-ott addListener");
  if (request.action === 'subTasks') {
    createSubTasks('my first subtask', true).then(() => {
      createSubTasks('my second subtask', true).then(() => {
        createSubTasks('my third subtask', true);
      });
    });
  }

  if (request.action === 'descriptionText') {
    console.log(request.text)
    createDescription(request.text, request.saveIt);
  }
});

// Simulates a click event on an element
function simulateClick(element) {
  console.log("simulate click");
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  element.dispatchEvent(event);
}

// Finds the first button with the specified aria-label and simulates a click on it
function simulateButtonAddSubTaskClick(ariaLabel) {
  const button = jQuery(`button[aria-label="${ariaLabel}"]`).get(0);
  if (button) {
    simulateClick(button);
  }
}

function simulateButtonCreateSubTaskClick() {
  const button = jQuery('button[data-testid="issue.views.common.child-issues-panel.inline-create.add-child-trigger-button"]').get(0);
  if (button) {
    simulateClick(button);
  }
}

function simulateButtonSaveDescriptionClick() {
  const button = jQuery('button[data-testid="comment-save-button"]').get(0);
  if (button) {
    simulateClick(button);
  }
}

// Finds the focused input element and returns it
function getFocusedInputElement() {
  const focusedElement = document.activeElement;
  if (focusedElement && focusedElement instanceof HTMLInputElement) {
    return focusedElement;
  }
  return null;
}

// Types text in the specified input element
function typeTextInInputElement(inputElement, text) {
  console.log("typing subtask...");
  jQuery(inputElement).sendkeys(text);
}

function typeTextWithDelay(inputElement, text, delay) {
  return new Promise(resolve => {
    const typeInterval = setInterval(() => {
      jQuery(inputElement).sendkeys(text);
      clearInterval(typeInterval);
      setTimeout(() => {
        simulateButtonCreateSubTaskClick();
        resolve();
      }, 2000);
    }, delay);
  });
}

function createDescription(text, clickSave) {
  if (jQuery('div[role="textbox"]').length > 0) {
    jQuery('div[role="textbox"]').append(text);
  }
  // clearInterval(typeInterval);
  if (clickSave){
    const typeInterval = setTimeout(() => {
      simulateButtonSaveDescriptionClick();
      clearInterval(typeInterval);
    }, 2000);
  }  
}

// Main function to perform the actions
async function createSubTasks(text, clickSubTask) {

  if (clickSubTask)
    simulateButtonAddSubTaskClick('Create subtask');

  const inputElement = getFocusedInputElement();
  if (inputElement) {
    await typeTextWithDelay(inputElement, text, 100);
  }
}