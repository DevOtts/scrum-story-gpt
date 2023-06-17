import { Component, EventEmitter, Output } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Emitter } from '../models/emitter.model';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGPTComponent implements Emitter {
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  public chatgptToken: string | undefined;
  public savedSuccess: boolean = false;
  public maxChatGptApiKeyLength = 10

  constructor(private storageService: StorageService) {
    console.log('chatgpt config')
    this.chatgptToken = this.storageService.getChatGPTKey();
  }

  isValidApiKey(value: string): boolean {
    // OpenAI API keys are expected to start with "sk-"
    if (!value.startsWith("sk-")) {
      return false;
    }
  
    // OpenAI API keys should consist of 42 characters
    if (value.length < 30) {
      return false;
    }
  
    // OpenAI API keys should consist of only alphanumeric characters
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(value.slice(3))) {
      return false;
    }
  
    return true;
  }
  
  

  saveAPIKey() {
    if (this.chatgptToken != undefined){
      this.storageService.saveChatGPKey(this.chatgptToken.toString());
      this.savedSuccess = true
    }
      
  }
}
