import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { DescriptionComponent } from './description/description.component';
import { ChatGPTComponent } from './chat-gpt/chat-gpt.component';
import { ConfigComponent } from './config/config.component';
import { SubTaskComponent } from './sub-task/sub-task.component';
import { StorageService } from './services/storage.service';
import { GlobalConfig } from 'rxjs';
import { Emitter } from './models/emitter.model';
declare const chrome: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('modalContent', { read: ViewContainerRef }) modalContentRef: ViewContainerRef | undefined;
  selectedMenuItem: string = '';
  loading: boolean = false

  constructor(private storageService: StorageService, private resolver: ComponentFactoryResolver) {    
  }

  ngAfterViewInit() {
    console.log('after init')
    //load globalConfig
    this.storageService.load();
    this.loadComponent('Description', null)

    // if (chrome.tabs != undefined) {
    //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: any) {
    //     chrome.tabs.sendMessage(tabs[0].id, { action: 'descriptionText', text: 'jiraGPT is working in your story... wait a minute please!' });
    //   });
    // }
  }

  loadComponent(componentName: string, event: Event | null) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedMenuItem = componentName;

    // Clear the current content
    if (this.modalContentRef != undefined) {
      this.modalContentRef.clear();

      // Resolve the component based on the menu item clicked
      let component: any;
      switch (componentName) {
        case 'Description':
          component = DescriptionComponent;
          break;
        case 'SubTasks':
          component = SubTaskComponent;
          break;
        case 'ChatGPT':
          component = ChatGPTComponent;
          break;
        case 'Config':
          component = ConfigComponent;
          break;
      }

      // Create the component dynamically and add it to the view
      const factory = this.resolver.resolveComponentFactory(component);
      const componentRef = this.modalContentRef.createComponent(factory);
      
      const childComponent = componentRef.instance as Emitter;

      childComponent.loading.subscribe((type: any) => {        
        console.log('loading:', type);
        this.loading = type
      });
    }    
  }
}