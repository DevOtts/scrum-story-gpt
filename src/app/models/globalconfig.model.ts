export class GlobalConfig {
    chatGPTKey: string;
    platform: string;
    descriptionPrompt: string;
    lastDescription: string = '';
    defaultSubTasks: any[];

    constructor(chatGPTKey: string,platform: string, descriptionPrompt: string, defaultSubTasks: any[]) {
        this.chatGPTKey = chatGPTKey;
        this.platform = platform;
        this.descriptionPrompt = descriptionPrompt;
        this.defaultSubTasks = defaultSubTasks;
      }
  }