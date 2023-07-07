import { Component, EventEmitter, Output } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { GlobalConfig } from 'rxjs';
import { Configuration, OpenAIApi } from 'openai';
import { Emitter } from '../models/emitter.model';

declare const chrome: any;
@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})


export class DescriptionComponent implements Emitter {
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  confirmBtnDisabled: boolean = true;
  message: string = '';
  description: string = '';
  useChatGPT: boolean = true;
  chatGPTConfigStatus: boolean = false
  chatGptError: boolean = false
  openai: OpenAIApi | undefined;

  constructor(private storageService: StorageService) {
    console.log('description page')
    if (chrome.runtime.onMessage != undefined) {
      chrome.runtime.onMessage.addListener((request: any) => {
        console.log('description listener')
        if (request.action == "validateDescriptionAvailable") {
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

  ngOnInit(): void {
    var global = this.storageService.get()
    if (global != null) {
      if (global.chatGPTKey != null && global.chatGPTKey.length >= 10) {
        this.chatGPTConfigStatus = true;
        this.useChatGPT = true;
        this.openai = new OpenAIApi(new Configuration({
          apiKey: global.chatGPTKey,
        }));
      }
    }
    console.log('description init')
  }

  load() {
    var test = this.storageService.load2()
    console.log('test', test)
  }

  async addDescription() {
    var obj = this;
    this.chatGptError = false
    var textIn = this.description
    this.loading.emit(true);
    console.log('addDescription')
    if (this.useChatGPT && this.openai != undefined) {

      if (chrome.tabs != undefined) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
          var processingHtml = '<div class="ak-editor-panel" data-panel-type="info" style="">    <div class="ak-editor-panel__icon" contenteditable="false"><span role="img" aria-label="Panel info"            class="css-snhnyn"            style="--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF);"><svg                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"                role="presentation">                <path fill-rule="evenodd" clip-rule="evenodd"                    d="M12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22V22ZM12 11.375C11.6685 11.375 11.3505 11.5067 11.1161 11.7411C10.8817 11.9755 10.75 12.2935 10.75 12.625V15.75C10.75 16.0815 10.8817 16.3995 11.1161 16.6339C11.3505 16.8683 11.6685 17 12 17C12.3315 17 12.6495 16.8683 12.8839 16.6339C13.1183 16.3995 13.25 16.0815 13.25 15.75V12.625C13.25 12.2935 13.1183 11.9755 12.8839 11.7411C12.6495 11.5067 12.3315 11.375 12 11.375ZM12 9.96875C12.4558 9.96875 12.893 9.78767 13.2153 9.46534C13.5377 9.14301 13.7188 8.70584 13.7188 8.25C13.7188 7.79416 13.5377 7.35699 13.2153 7.03466C12.893 6.71233 12.4558 6.53125 12 6.53125C11.5442 6.53125 11.107 6.71233 10.7847 7.03466C10.4623 7.35699 10.2812 7.79416 10.2812 8.25C10.2812 8.70584 10.4623 9.14301 10.7847 9.46534C11.107 9.78767 11.5442 9.96875 12 9.96875Z"                    fill="currentColor"></path>            </svg></span></div>    <div class="ak-editor-panel__content">        <p>jiraGPT is working in your story... wait a minute please!</p>    </div></div>'
          chrome.tabs.sendMessage(tabs[0].id, { action: 'descriptionText', text: processingHtml, saveIt: false });
          obj.loading.emit(false);
        });
      }

      var finalText = await this.generateText(textIn)
      if (finalText != '' && finalText != undefined)
        textIn = finalText
    }

    if (chrome.tabs != undefined) {
      try {
        console.log('adding content to description')
        console.log(textIn)
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'descriptionText', text: textIn, saveIt: true });
          console.log('loading false')
        });
        obj.loading.emit(false);   
      } catch (error) {
        obj.loading.emit(false);
      }     
    }
  }

  async generateText(description: string): Promise<string | undefined> {
    var obj = this;
    return new Promise<string | undefined>((resolve, reject) => {
      if (this.openai !== undefined) {
        var prompt = this.storageService.getPrompt();
        //test - prompt = 'oi, tudo bom?'
        if (prompt != null) {
          prompt = prompt.replace('{description}', description);
          console.log('JiraGPT - prompt: ' + prompt)
          this.openai
            .createCompletion({
              model: 'text-davinci-003',
              prompt: prompt,
              max_tokens: 2000
            })
            .then(response => {
              console.log('JiraGPT - answer GPT: ' + response.data.choices[0].text)
              resolve(response.data.choices[0].text);
            })
            .catch(error => {
              obj.chatGptError = true
              console.log('JiraGPT - ' + error)
              reject(error);
            });
        } else {
          console.log('JiraGPT - prompt is null')
          reject('');
        }
      } else {
        console.log('JiraGPT - openai without API Key')
        reject('');
      }
    });
  }


  addSubTasks() {
    var obj = this;
    this.loading.emit(true);

    if (chrome.tabs != undefined) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'subTasks' });
        obj.loading.emit(false);
      });
    }
  }
}
