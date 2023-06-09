import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { GlobalConfig } from 'rxjs';
declare const chrome: any;

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})

export class DescriptionComponent {
  confirmBtnDisabled: boolean = true;
  message: string = '';
  textInput: string = '';
  useChatGPT: boolean = true;
  chatGPTConfigStatus: boolean = false

  constructor(private storageService: StorageService) {
    console.log('description page')
    if (chrome.runtime.onMessage != undefined) {
      chrome.runtime.onMessage.addListener((request: any) => {
        console.log('description listener')
        if (request.action == "validateDescriptionAvailable"){
          if (request.mainTextFound === true) {
            this.confirmBtnDisabled = false;
            this.message = '';
          } else {
            this.confirmBtnDisabled = true;
            this.message = 'Please show the modal before confirming';
          }
        }      
      });
    }
  }

  ngOnInit(): void{    
    var global = this.storageService.get()
    if (global != null){
      if (global.chatGPTKey != null && global.chatGPTKey.length >= 10){
        this.chatGPTConfigStatus = true;
        this.useChatGPT = true;
      }
    }
  }

  addDescription() {
    if (this.useChatGPT){
      //if (!this.chatGPTConfigStatus)
    }

    var textIn = this.textInput
    if (chrome.tabs != undefined) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'descriptionText', text: textIn });
      });
    }
  }

  addSubTasks() {
    if (chrome.tabs != undefined) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'subTasks' });
      });
    }
  }
}
