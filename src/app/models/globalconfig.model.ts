export class GlobalConfig {
    chatGPTKey: string;
    descriptionPrompt: string;
    defaultSubTasks: any[];  

    constructor(chatGPTKey: string, descriptionPrompt: string, defaultSubTasks: any[]) {
        this.chatGPTKey = chatGPTKey;
        this.descriptionPrompt = descriptionPrompt;
        this.defaultSubTasks = defaultSubTasks;
      }
  }