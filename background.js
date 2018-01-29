chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    shouldHideImage(request.imageURL)
      .then(block => sendResponse(block))
      .catch(err => console.error(err));
    return true

});

function addImageToBlockList(url) {
  console.log("blocking:", url);
  chrome.storage.sync.get({
    blockedList: []
  }, function({blockedList}) {
    blockedList.push(url);
    chrome.storage.sync.set({
      blockedList
    })
  });
}

function addTagsToHurtList(imageUrl) {
  fetch("http://localhost:3000/hide", {
            method: 'post',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
               "useCache": true,
               "tags": [],
               "urls": [imageUrl]
            })
          })
        .then(function (response) {return response.json()})
        .then(function (data) {
          return data.images[0].tags.filter((tag) => tag.confidence >= 0.90).map((tag) => ({text: tag.name, checked: true}));
        }).then(addTags);

}

function addTags(tags) {
  return new Promise((resolve) => {
  chrome.storage.sync.get({
    hurtList: []
  }, function({hurtList}) {

    for (tag of tags) {
      hurtList.push(tag);
    }
    chrome.storage.sync.set({
      hurtList
    }, resolve);
  });
})
}

function shouldHideImage(url) {
  return new Promise(resolve => chrome.storage.sync.get({blockedList: []}, resolve))
    .then(({blockedList}) => {
      if (blockedList.includes(url)) return true;
      const DEFAULT_HURT_LIST = {
          hurtList: [{text: 'dog', checked: true}]
      };
        return new Promise((resolve, reject) => chrome.storage.sync.get(DEFAULT_HURT_LIST,
          ({ hurtList }) => resolve(hurtList.filter(h => h.checked).map(h => h.text))
        ))
        .then(tags => {
          console.log('tags =', tags)
          return fetch("http://localhost:3000/hide", {
            method: 'post',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
               "useCache": true,
               "tags": tags,
               "urls": [url]
            })
          })
        })
        .then(function (response) {
          console.log(response)
          return response.json()
        })
        .then(function (data) {
          if (!data.images[0].hide) console.log('Data =', data);
          return data.images[0].tags !== null ? data.images[0].hide : null;
        })
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}

const context = "image"
var title = "Block " + context;
var parentId = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "parent" + context});
console.log("'" + context + "' item:" + parentId);

var title_child = "Block similar content";
var childId = chrome.contextMenus.create({"title": title_child, "contexts":[context], "id": "child" + context});


chrome.contextMenus.onClicked.addListener(function(event) {
  console.log(event)
  if (event.menuItemId === 'parentimage') {
    addImageToBlockList(event.srcUrl);
  } else {
    addTagsToHurtList(event.srcUrl);
  }
});
