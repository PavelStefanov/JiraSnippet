
function createButton(parent, buttonID, buttonTxt) {
  const buttonText = buttonTxt;
  const button = document.createElement("button");
  button.textContent = buttonText;
  button.id = buttonID;
  button.className = "copy-btn-for-jira";

  button.onclick = function () {
    let pageTitle = document.title;
    pageTitle = pageTitle.replace(' - Jira Lamoda.ru', '');

    const urlWithoutQueryParams = window.location.origin + window.location.pathname;

    const textType = "text/plain";
    const htmlType = "text/html";
    const linkText = '<a href="' + urlWithoutQueryParams + '">' + pageTitle + '</a>';
    const blobHtml = new Blob([linkText], { type: htmlType });
    const blobText = new Blob([pageTitle], { type: textType });
    const data = [new ClipboardItem({
      [textType]: blobText,
      [htmlType]: blobHtml,
    })];

    navigator.clipboard.write(data)

    button.textContent = 'Copied';
    setTimeout(function () {
      button.textContent = buttonText;
    }, 2000);
  };

  const parentDiv = document.createElement("div");
  parentDiv.className = "copy-btn-for-jira-div aui-buttons pluggable-ops";
  parentDiv.appendChild(button);
  parent.appendChild(parentDiv);
}

var buttonIDJiraSnippet = 'CopyBtnJiraSnippet';

var observer = new MutationObserver(function (mutations, me) {
  var summaryElement = document.getElementById("summary-val");
  var parentJiraButton = document.getElementsByClassName('aui-toolbar2-primary')[0];

  if (summaryElement && parentJiraButton) {
    if (!document.getElementById(buttonIDJiraSnippet)) {
      createButton(parentJiraButton, buttonIDJiraSnippet, 'Copy link');
    }
  }
});

observer.observe(document, {
  childList: true,
  subtree: true
});

