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
  openAIApiErrorLbl: boolean = false
  openAIErrorType: string = ''
  chatGptError: boolean = false
  openai: OpenAIApi | undefined;
  gptModel = 'gpt-3.5-turbo';

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

      //populate the last description used
      this.description = this.storageService.getLastDescription();

      if (global.chatGPTKey != null && global.chatGPTKey.length >= 10) {
        this.chatGPTConfigStatus = true;        
        this.useChatGPT = true;
        this.openAIApiErrorLbl = false;                
        this.openai = new OpenAIApi(new Configuration({
          apiKey: global.chatGPTKey,
        }));
        console.log('openai instantiated')
      }
    }
    console.log('description init')
  }

  load() {
    var test = this.storageService.load()
    console.log('test', test)
  }

  onTextAreaBlur(event: any): void {
    const text = event.target.value;
    this.storageService.saveLastDescription(text);
  }

  async addDescription() {
    var obj = this;
    this.chatGptError = false
    var textIn :string | undefined = this.description;    
    this.loading.emit(true);
    console.log('addDescription')
    var platform = this.storageService.getPlatform();
    if (this.useChatGPT && this.openai != undefined) {

      if (chrome.tabs != undefined) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
          var processingHtml = '<div class="ak-editor-panel" data-panel-type="info" style="">    <div class="ak-editor-panel__icon" contenteditable="false"><span role="img" aria-label="Panel info"            class="css-snhnyn"            style="--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF);"><svg                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"                role="presentation">                <path fill-rule="evenodd" clip-rule="evenodd"                    d="M12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22V22ZM12 11.375C11.6685 11.375 11.3505 11.5067 11.1161 11.7411C10.8817 11.9755 10.75 12.2935 10.75 12.625V15.75C10.75 16.0815 10.8817 16.3995 11.1161 16.6339C11.3505 16.8683 11.6685 17 12 17C12.3315 17 12.6495 16.8683 12.8839 16.6339C13.1183 16.3995 13.25 16.0815 13.25 15.75V12.625C13.25 12.2935 13.1183 11.9755 12.8839 11.7411C12.6495 11.5067 12.3315 11.375 12 11.375ZM12 9.96875C12.4558 9.96875 12.893 9.78767 13.2153 9.46534C13.5377 9.14301 13.7188 8.70584 13.7188 8.25C13.7188 7.79416 13.5377 7.35699 13.2153 7.03466C12.893 6.71233 12.4558 6.53125 12 6.53125C11.5442 6.53125 11.107 6.71233 10.7847 7.03466C10.4623 7.35699 10.2812 7.79416 10.2812 8.25C10.2812 8.70584 10.4623 9.14301 10.7847 9.46534C11.107 9.78767 11.5442 9.96875 12 9.96875Z"                    fill="currentColor"></path>            </svg></span></div>    <div class="ak-editor-panel__content">        <p>scrumStoryGPT is working in your story... wait a minute please!</p>    </div></div>'
          chrome.tabs.sendMessage(tabs[0].id, { platform: platform, action: 'descriptionText', text: processingHtml, saveIt: false });
        });
      }

      //save in localStorage the last Description used
      this.storageService.saveLastDescription(textIn);

      var finalText = await this.generateText(textIn)
      if (finalText?.success)
        textIn = finalText.text?.toString()
    }

    if (chrome.tabs != undefined) {
      try {
        console.log('adding content to description')
        console.log(textIn)

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
          chrome.tabs.sendMessage(tabs[0].id, { platform: platform, action: 'descriptionText', text: textIn, saveIt: true });
          obj.loading.emit(false);
        });
        obj.loading.emit(false);
      } catch (error) {
        obj.loading.emit(false);
      }
    }
  }


  async generateText(description: string) {
    var obj = this;
    if (this.openai !== undefined) {
      this.openAIApiErrorLbl = false
      this.openAIErrorType = ''
      var prompt = this.storageService.getPrompt();

      console.log('prompt:', prompt)

      if (prompt != null) {
        prompt = prompt.replace('{description}', description);
        console.log('scrumStoryGPT - prompt: ' + prompt)

        try {
          var response = await this.openai.createChatCompletion({
            model: this.gptModel,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 2000
          });

          console.log('RESPONSE', response);
          console.log(response.status)
          if (!response.data || !response.data.choices) {
            return this.handleOpenAIError({
              success: false,
              text: "The bot didn't respond. Please try again later.",
              code: response.status.toString(), // Default error code,
              message : "unknown_error"
            });
          } 

          return {
            success: true,
            text: response.data.choices[0].message?.content,
            messageId: response.data.id,
          };        
        } catch (error: any) {          
          return this.handleOpenAIError({
            success: false,
            text: error?.message,
            code: error?.response?.data?.error?.code || "unknown_error", // Extracting the error code
            message: error?.response?.data?.error?.message || "Unknown error" // Extracting the error message
          });
        }
      }
      else {
        console.log('scrumStoryGPT - empty prompt:' + prompt)
        return {
          success: false,
          text: 'Empty Prompt',
          code: "empty_prompt" // Error code for empty prompt
        };
      }
    } else {
      console.log('scrumStoryGPT - OpenAI API key not defined')
      return {
        success: false,
        text: 'Invalid API Key',
        code: "invalid_api_key" // Error code for invalid API key
      };
    }

  }

  handleOpenAIError(errorData: { success: boolean, text: string, code: string, message: string }) {
    console.log('OpenAI Error', errorData);
    this.openAIApiErrorLbl = true;
    this.openAIErrorType = errorData.code;
    return errorData
    // Here you can handle the error as needed, for example, displaying a user-friendly message based on the error code
  }

  addSubTasks() {
    var obj = this;
    this.loading.emit(true);
    var subTasks = this.storageService.getSubTasks();
    var strSubTasks = JSON.stringify(subTasks)
    var platform = this.storageService.getPlatform();

    console.log('add subtasks', strSubTasks)
    console.log('chrometabs', chrome.tabs)
    if (chrome.tabs != undefined) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { platform: platform, action: 'subTasks', subTasks: strSubTasks });
        obj.loading.emit(false);
      });
    }
  }
}
