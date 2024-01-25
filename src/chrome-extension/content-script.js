chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  try {
    if (request.platform === 'jira'){
      const jiraClient = new Jira();
      if (request.action === 'subTasks' && request.subTasks) {
        console.log('Creating subtasks:', request.subTasks);
        await jiraClient.createSubTasks(JSON.parse(request.subTasks));
        console.log('All subtasks added');
      }
    
      if (request.action === 'descriptionText') {
        console.log(request.text);
        jiraClient.createDescription(request.text, request.saveIt);
      }
    }

    if (request.platform === 'trello'){
      // Ensure this block has the necessary logic for Trello operations.
      const trelloClient = new Trello();
      // Trello related operations go here...
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});