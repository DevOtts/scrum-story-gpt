import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.css']
})
export class ChatGPTComponent {

  public chatgptToken: string | undefined;
  public savedSuccess: boolean = false;
  public maxChatGptApiKeyLength = 10

  constructor(private storageService: StorageService) {
    console.log('chatgpt config')
    this.chatgptToken = this.storageService.getChatGPTKey();
  }

  saveAPIKey() {
    if (this.chatgptToken != undefined){
      this.storageService.saveChatGPKey(this.chatgptToken.toString());
      this.savedSuccess = true
    }
      
  }
}
