
console.log("content-ott 2.2");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content-ott addListener");
  if (request.action === 'subTasks' && request.subTasks) {
   
      try {
        console.log('Creating subtasks:',request.subTasks);
        createSubTasks(JSON.parse(request.subTasks))
          .then(() => {
            console.log('All items processed');
          })
          .catch(error => {
            console.error('An error occurred:', error);
          });
        
      } catch (error) {
        console.error('An error occurred while creating subTasks:', error);
      }

    // createSubTasks('my first subtask', true).then(() => {
    //   createSubTasks('my second subtask', true).then(() => {
    //     createSubTasks('my third subtask', true);
    //   });
    // });
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
  // clearInterval(typeInterval);
  if (clickSave){
    const typeInterval = setTimeout(() => {
      simulateButtonSaveDescriptionClick();
      clearInterval(typeInterval);
    }, 2000);
  }  
}

async function createSubTasks(list) {

  simulateButtonAddSubTaskClick('Create subtask');

  list.forEach(async (item, index) => {
    var clickSubTask = !(index === list.length - 1);
    await createSubTask(item,clickSubTask);
  });
  // for (const item of list) {
  //   await createSubTask(item, true);
  // }
}

// Main function to perform the actions
async function createSubTask(text, clickSubTask) {  
  const inputElement = getFocusedInputElement();
  if (inputElement) {
    
    //await typeTextWithDelay(inputElement, text, 100);
    await typingText(inputElement, text, 100).then(() => {
       clickSubTask(inputElement, text, 100).then(() => {
        setTimeout(()=>{},500);
       });
    });
    
  }
}


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

function typingText(inputElement,text,delay) {
  return new Promise(resolve => {
    const typeInterval =  setInterval(function(){
      jQuery(inputElement).sendkeys(text);
      clearInterval(typeInterval);
      resolve();
     }, delay)
    });
}

function clickSubTask() {
  return new Promise(resolve =>
    setTimeout(() => {
      simulateButtonCreateSubTaskClick();
      resolve();
    }, 2000));
}
