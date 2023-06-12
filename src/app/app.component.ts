import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { DescriptionComponent } from './description/description.component';
import { ChatGPTComponent } from './chat-gpt/chat-gpt.component';
import { ConfigComponent } from './config/config.component';
import { SubTaskComponent } from './sub-task/sub-task.component';
import { StorageService } from './services/storage.service';
import { GlobalConfig } from 'rxjs';
declare const chrome: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('modalContent', { read: ViewContainerRef }) modalContentRef: ViewContainerRef | undefined;
  selectedMenuItem: string = '';

  constructor(private storageService: StorageService, private resolver: ComponentFactoryResolver) {    
  }

  ngAfterViewInit() {
    console.log('after init')
    //load globalConfig
    this.storageService.load2();
    this.loadComponent('Description', null)
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
    }
  }
}