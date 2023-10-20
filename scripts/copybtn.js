chrome.runtime.onMessage.addListener(notify);

function getIssueId() {
  const searchParam = "selectedIssue=";
  let issueKey;

  if (document.URL.includes(searchParam)) {
    let match = document.URL.match(/selectedIssue=(.*?)(?=&|$)/)[1];
    issueKey = match;
  } else {
    let match = document.title.match(/\[(.*?)\]/)[1];
    issueKey = match;
  }

  return issueKey;
}

function getIssueDataAndWriteToClipboard(issueId)
{
  const restCallForIssue = `${window.location.origin}/rest/api/3/issue/`;

  fetch(`${restCallForIssue}${issueId}`)
  .then((response) => response.json())
  .then((data) => {
    const issueKey = data['key'];
    const issueTitle = data['fields']['summary'];
    const issueDescription = data['fields']['description'];
    const issueType = data['fields']['issuetype'].name;
    const issuePriority = data['fields']['priority']?.name;
    const issueStatus = data['fields']['status'].name;
    const issueReporter = data['fields']['reporter'].displayName;
    const issueAssignee = data['fields']['assignee'] ? data['fields']['assignee'].displayName : 'Unassigned';

    storageGet('format').then(function (storageData) {
      const format = storageData.format || 'mod ({key}): {title}';
      const outputText = format
        .replaceAll('{key}', issueKey)
        .replaceAll('{title}', issueTitle)
        .replaceAll('{description}', issueDescription)
        .replaceAll('{type}', issueType)
        .replaceAll('{priority}', issuePriority)
        .replaceAll('{status}', issueStatus)
        .replaceAll('{reporter}', issueReporter)
        .replaceAll('{assignee}', issueAssignee)
      
        navigator.clipboard.writeText(outputText);
    });
  });
}

function notify(message)
{
  getIssueDataAndWriteToClipboard(message.issueId);
}

function createButton(parent, buttonID, buttonTxt) {
  const buttonText = buttonTxt;
  const button = document.createElement("button");
  button.textContent = buttonText;
  button.id = buttonID;
  button.className = "CopyBtnForJira";
  parent.appendChild(button);

    button.onclick = function () {
        const issueId = getIssueId();
        if (issueId == null) {
            button.textContent = 'Error: No Issue id found!';
        }

        button.id == buttonIDCopyID ? navigator.clipboard.writeText(issueId) : getIssueDataAndWriteToClipboard(issueId);
        
        button.textContent = 'Text has been copied!';
        setTimeout(function () {
            button.textContent = buttonText;
        }, 2000);
    };
}

var buttonIDJiraSnippet = 'CopyBtnJiraSnippet';
var buttonIDCopyID = 'CopyBtnJiraId';

var observer = new MutationObserver(function (mutations, me) {
    var parentJiraButton = document.getElementsByClassName('_otyr1b66 _1yt4swc3 _1e0c116y')[0];
    var parentCopyIDButton = parentJiraButton;

    if (parentJiraButton) {
        if (!document.getElementById(buttonIDJiraSnippet)) {
            createButton(parentJiraButton, buttonIDJiraSnippet, 'Jira Snippet');
        }
    }
    if (parentCopyIDButton) {
        if (!document.getElementById(buttonIDCopyID)) {
            createButton(parentCopyIDButton, buttonIDCopyID, 'Copy ID');
        }
    }
});

observer.observe(document, {
  childList: true,
  subtree: true
});

