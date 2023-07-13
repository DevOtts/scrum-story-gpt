
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'subTasks' && request.subTasks) {
    console.log('Creating subtasks:', request.subTasks);
    createSubTasks(JSON.parse(request.subTasks))
      .then(() => {
        console.log('All subtasks added');
      })
      .catch(error => {
        console.error('An error occurred while  creating the subtasks:', error);
      });
  }

  if (request.action === 'descriptionText') {
    console.log(request.text)
    createDescription(request.text, request.saveIt);
  }
});

function createDescription(text, clickSave) {
  if (jQuery('div[role="textbox"]').length > 0) {
    jQuery('div[role="textbox"]').append(text);
  }

  if (clickSave) {
    const typeInterval = setTimeout(() => {
      simulateButtonSaveDescriptionClick();
      clearInterval(typeInterval);
    }, 2000);
  }
}

async function createSubTasks(list) {
  simulateButtonAddSubTaskClick('Create subtask');

  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    await createSubTask(item, clickSubTask);
  }
}

// Main function to perform the actions
async function createSubTask(text, clickSubTask) {

  const inputElement = getFocusedInputElement();
  if (inputElement) {

    await delay(1000);
    jQuery(inputElement).sendkeys(text);
    console.log('typing ' + text);

    await delay(1000);
    console.log('click add ' + text);
    simulateButtonCreateSubTaskClick();
  }
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

// Simulates a click event on an element
function simulateClick(element) {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  element.dispatchEvent(event);
}

// Finds the focused input element and returns it
function getFocusedInputElement() {
  const focusedElement = document.activeElement;
  if (focusedElement && focusedElement instanceof HTMLInputElement) {
    return focusedElement;
  }
  return null;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}