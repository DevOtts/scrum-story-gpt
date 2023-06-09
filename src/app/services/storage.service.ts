import { Injectable } from '@angular/core';
import { GlobalConfig } from '../models/globalconfig.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageName = "jiraStoryGPT";


  getChatGPTKey(): string | undefined {
    var global = this.get();
    return global?.chatGPTKey;
  }

  saveChatGPKey(chatgptToken: string) {
    var global = this.get();
    if (global == null) {
      global = {} as GlobalConfig
    }

    global.chatGPTKey = chatgptToken
    this.save(global);

  }

  save(value: GlobalConfig): void {
    localStorage.setItem(this.storageName, JSON.stringify(value));
  }

  get(): GlobalConfig {
    const value = localStorage.getItem(this.storageName);
    return value ? JSON.parse(value) : null;
  }

  remove(): void {
    localStorage.removeItem(this.storageName);
  }

  clear(): void {
    localStorage.clear();
  }
}
