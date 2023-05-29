import { Component } from '@angular/core';
declare const chrome: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {
    this.injectContentScript();
  }

  private injectContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs : any) => {
      chrome.tabs.executeScript(tabs[0].id, { file: 'content-script.js' });
    });
  }
  
  
}
