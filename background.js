const imageFilter = {
  types: ["image"],
  urls: ['*://*/*']
};
chrome.webRequest.onBeforeRequest.addListener(beforeRequest, imageFilter, []);
chrome.webRequest.onCompleted.addListener(requestComplete, imageFilter, "blocking");

function beforeRequest(e) {
  console.log(e);
}

function requestComplete(e) {
  console.log(e);
}