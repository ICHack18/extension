console.log('[SafeSpace] Loaded content script');

const UPDATE_INTERVALS = [10, 20, 50, 100, 200, 500, 3000];
const INTERVAL_COUNT = 5;

let censorCount = 0;

function censorImages() {
  censorCount++;
  Array.from(document.getElementsByTagName('img')).forEach(el => {
    if (el.getAttribute('data-safespace-seen') === 'true') return;
    
    el.setAttribute('data-safespace-seen', 'true');
    el.classList.add('blurred-image');
    el.setAttribute('data-safespace-status', 'pending');                 
    shouldHideImage([el])
  });

  const updateInterval = UPDATE_INTERVALS[Math.min(Math.floor(censorCount / INTERVAL_COUNT), UPDATE_INTERVALS.length - 1)];
  setTimeout(censorImages, updateInterval);
}

async function shouldHideImage(urls, tags) {
  fetch("http://localhost:3000/hide", {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(
      {
        "use-cache": true,
        "tags": tags,
        "urls": urls
      }
    )
  })
  .then(function (response) {return response.json()})
  .then(function (data) {
    return data;
  })
  .catch(function (error) {
    console.log('Request failed', error);
  });
}

censorImages();
