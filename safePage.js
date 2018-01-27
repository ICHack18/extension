console.log('[SafeSpace] Loaded content script');

const UPDATE_INTERVALS = [10, 20, 50, 100, 200, 500, 3000];
const INTERVAL_COUNT = 5;

let censorCount = 0;

function censorImages(resetMovingAverage) {
  censorCount++;
  const images = Array.from(document.getElementsByTagName('img'));
  images.forEach(imgEl => imgEl.classList.add('blurred-image'));

  const updateInterval = UPDATE_INTERVALS[Math.min(Math.floor(censorCount / INTERVAL_COUNT), UPDATE_INTERVALS.length - 1)];
  console.log(updateInterval)
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
