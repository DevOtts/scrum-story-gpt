import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { GlobalConfig } from 'rxjs';
import { Configuration, OpenAIApi } from 'openai';

declare const chrome: any;

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})

export class DescriptionComponent {
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
  }

  load(){
    this.storageService.load()
  }

  async addDescription() {
    this.chatGptError = false
    var textIn = this.description
    if (this.useChatGPT && this.openai != undefined) {
      var finalText = await this.generateText(textIn)
      if (finalText != '' && finalText != undefined)
        textIn = finalText
    }
    
    if (chrome.tabs != undefined) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'descriptionText', text: textIn });
      });
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
              max_tokens: 256
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
    if (chrome.tabs != undefined) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'subTasks' });
      });
    }
  }
}
