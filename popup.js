function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {

    var hurtlist = document.getElementById('hurtlist');
    if (hurtlist) {
      hurtlist.addEventListener('click', function() {
          chrome.tabs.create({url: 'hurtlist.html'})
      })
    }

    var options = document.getElementById("options");
    if (options) {
      options.addEventListener("click", function(){
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
      })
    }

    var images = document.images;

    const testPageBtn = document.getElementById("test-page-btn");
    if (testPageBtn) {
      testPageBtn.addEventListener('click', () =>
        chrome.tabs.create({url: 'test.html'})
      );
    } else {
      console.error('Test page button not found!');
    }

  });
});



