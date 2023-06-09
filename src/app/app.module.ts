import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PopupComponent } from './popup/popup.component';
import { DescriptionComponent } from './description/description.component';
import { SubTaskComponent } from './sub-task/sub-task.component';
import { ChatGPTComponent } from './chat-gpt/chat-gpt.component';
import { ConfigComponent } from './config/config.component';
import { StorageService } from './services/storage.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, PopupComponent, DescriptionComponent, SubTaskComponent, ChatGPTComponent, ConfigComponent],
  imports: [BrowserModule,FormsModule,HttpClientModule],
  providers: [
    StorageService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
