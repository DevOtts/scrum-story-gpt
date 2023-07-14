
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.platform == 'jira'){
    const jiraClient = new Jira();
    if (request.action === 'subTasks' && request.subTasks) {
      console.log('Creating subtasks:', request.subTasks);
      jiraClient.createSubTasks(JSON.parse(request.subTasks))
        .then(() => {
          console.log('All subtasks added');
        })
        .catch(error => {
          console.error('An error occurred while  creating the subtasks:', error);
        });
    }
  
    if (request.action === 'descriptionText') {
      console.log(request.text)
      jiraClient.createDescription(request.text, request.saveIt);
    }
  }

  if (request.platform == 'trello'){
    const trelloClient = new Trello()
  }
});