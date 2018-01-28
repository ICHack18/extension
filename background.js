chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  shouldHideImage(request.imageURL)
    .then(response => sendResponse(response.images[0].hide))
    .catch(err => console.error(err));
  return true;
});

function shouldHideImage(url) {
  return getTags().then(tags => {
    return fetch("http://safespace.westeurope.cloudapp.azure.com/hide", {
    method: 'post',
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(
      {
        "use-cache": true,
        "tags": tags,
        "urls": [url]
      }
    )
  })})
  .then(function (response) {return response.json()})
  .then(function (data) {
    return data;
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
}

function getTags() {
  const DEFAULT_HURT_LIST = {
    hurtList: [{text: 'dog', checked: true}]
  };
  return new Promise((resolve, reject) => chrome.storage.sync.get(DEFAULT_HURT_LIST,
    ({ hurtList }) => resolve(hurtList.filter(h => h.checked).map(h => h.text))
  ));
}
