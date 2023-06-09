// popup.component.ts
declare const chrome: any;
import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  confirmBtnDisabled: boolean = true;
  message: string = '';
  textInput: string = '';

  constructor() {
    console.log('popup')
    // chrome.runtime.onMessage.addListener((request: any) => {
    //   if (request.mainTextFound === true) {
    //     this.confirmBtnDisabled = false;
    //     this.message = '';
    //   } else {
    //     this.confirmBtnDisabled = true;
    //     this.message = 'Please show the modal before confirming';
    //   }
    // });
  }

  addDescription() {
    var textIn = this.textInput
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'descriptionText', text: textIn });
    });
  }

  addSubTasks() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'subTasks' });
    });
  }
}
