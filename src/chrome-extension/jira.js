
class Jira{
  createDescription(text, clickSave) {
    if (jQuery('div[role="textbox"]').length > 0) {
      jQuery('div[role="textbox"]').append(text);
    }
  
    if (clickSave) {
      const typeInterval = setTimeout(() => {
        this.simulateButtonSaveDescriptionClick();
        clearInterval(typeInterval);
      }, 2000);
    }
  }
  
  async createSubTasks(list) {
    this.simulateButtonAddSubTaskClick('Create subtask');
  
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      await this.createSubTask(item);
    }
  }
  
  // Main to perform the actions
  async createSubTask(text) {
  
    const inputElement = this.getFocusedInputElement();
    if (inputElement) {
  
      await this.delay(1000);
      jQuery(inputElement).sendkeys(text);
      console.log('typing ' + text);  
      await this.delay(1000);
      this.simulateButtonCreateSubTaskClick();
    }
  }
  
  // Finds the first button with the specified aria-label and simulates a click on it
  simulateButtonAddSubTaskClick(ariaLabel) {
    const button = jQuery(`button[aria-label="${ariaLabel}"]`).get(0);
    if (button) {
      this.simulateClick(button);
    }
  }
  
  simulateButtonCreateSubTaskClick() {
    const button = jQuery('button[data-testid="issue.views.common.child-issues-panel.inline-create.add-child-trigger-button"]').get(0);
    if (button) {
      this.simulateClick(button);
    }
  }
  
  simulateButtonSaveDescriptionClick() {
    const button = jQuery('button[data-testid="comment-save-button"]').get(0);
    if (button) {
      this.simulateClick(button);
    }
  }
  
  // Simulates a click event on an element
  simulateClick(element) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }
  
  // Finds the focused input element and returns it
  getFocusedInputElement() {
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement instanceof HTMLInputElement) {
      return focusedElement;
    }
    return null;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.Jira = Jira;