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

  load(): Observable<GlobalConfig> {
    console.log('JiraGPT - loadStorage trying to load')
    const value = localStorage.getItem(this.storageName);

    if (value) {
      return of(JSON.parse(value));
    } else {
      return this.loadGlobalConfigFromJson().pipe(
        map((globalConfig: GlobalConfig | null) => {
          if (globalConfig) {
            console.log('JiraGPT - loadStorage loaded')
            this.save(globalConfig);
            return globalConfig;
          } else {
            console.log('JiraGPT - no file found')
            // Return a default GlobalConfig object if loading fails
            return new GlobalConfig('', '', []);
          }
        }),
        catchError((error) => {
          console.error('Error loading global config from JSON 2:', error);
          return of(new GlobalConfig('', '', [])); // Return a default GlobalConfig instance
        })
       
      );
    }
  }

  remove(): void {
    localStorage.removeItem(this.storageName);
  }

  clear(): void {
    localStorage.clear();
  }

  private loadGlobalConfigFromJson(): Observable<GlobalConfig | null> {
    console.log('getting file')
    try {
       // if (chrome.extension != undefined) {
        const jsonFileURL = chrome.extension.getURL('global-config.json');      
        return this.http.get<GlobalConfig>(jsonFileURL).pipe(
          catchError((error) => {
            console.error('Error loading global config from JSON:', error);
            return of(new GlobalConfig('', '', [])); // Return a default GlobalConfig instance
          })
        );
      //∫}
    } catch (error) {
      console.error('Catch error loading global config from JSON:', error);
      return of(new GlobalConfig('', '', []));
    }
  
  }
}
