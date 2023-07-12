import { Injectable } from '@angular/core';
import { GlobalConfig } from '../models/globalconfig.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
declare const chrome: any;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageName = "jiraStoryGPT";

  constructor(private http: HttpClient) { }
  getChatGPTKey(): string | undefined {
    var global = this.get();
    return global?.chatGPTKey;
  }

  getPrompt(): string | undefined {
    var global = this.get();
    return global?.descriptionPrompt;
  }

  getSubTasks(): string[] | undefined {
    var global = this.get();
    return global?.defaultSubTasks;
  }

  saveSubTasks(subTasks: string[]) {
    var global = this.get();
    if (global == null) {
      global = {} as GlobalConfig
    }
    global.defaultSubTasks = subTasks
    this.save(global);
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


  async load(): Promise<any> {

    console.log('JiraGPT - loadStorage trying to load')
    const value = localStorage.getItem(this.storageName);

    if (value) {
      return of(JSON.parse(value));
    } else {
      console.log('load2')
      var global = await this.loadGlobalConfigFromJson().then(
        (data) => {
          console.log('load2.1' , data)
          var globalConfig: GlobalConfig = JSON.parse(data);
          if (globalConfig) {
            console.log('JiraGPT - loadStorage loaded')
            this.save(globalConfig);
            console.log('load2.2')
            return globalConfig;
          }
          return '';
        },
        (err) => {
          console.log('load error:', err);
          return '';
        }
      );
    }
  }


  async loadGlobalConfigFromJson(): Promise<string> {
    var obj = this;
    return new Promise<string>((resolve, reject) => {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL('global-config.json'), true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            //... The content has been read in xhr.responseText
            console.log(xhr.responseText);
            resolve(xhr.responseText);
          }
        };
        xhr.send();
      } catch (error) {
        console.error('Catch error loading global config from JSON:', error);
        reject('');
      }
    });
  }
}
