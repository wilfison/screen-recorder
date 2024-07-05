chrome.action.onClicked.addListener(() => {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup",
    width: 1000,
    height: 480,
  });
});
