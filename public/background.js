/* eslint-disable no-undef */
chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 650,
    height: 800,
  });
});
