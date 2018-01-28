console.log('[SafeSpace] Loaded content script');

const UPDATE_INTERVALS = [10, 20, 50, 100, 200, 500, 3000];
const INTERVAL_COUNT = 5;

let censorCount = 0;

function censorImages() {
  censorCount++;
  Array.from(document.getElementsByTagName('img')).forEach(el => {
    if (el.getAttribute('data-safespace-seen') === 'true') return;

    el.setAttribute('data-safespace-seen', 'true');
    modifyImage(el);
    el.setAttribute('data-safespace-status', 'pending');
    processImage(el);
  });

  const updateInterval = UPDATE_INTERVALS[Math.min(Math.floor(censorCount / INTERVAL_COUNT), UPDATE_INTERVALS.length - 1)];
  setTimeout(censorImages, updateInterval);
}

function processImage(imageEl) {
  if (skipImage(imageEl)) return unModifyImage(imageEl);
  chrome.runtime.sendMessage({imageURL: imageEl.src},
    block => {
      if (block) {
        modifyImage(imageEl);
      } else {
        unModifyImage(imageEl);
      }
    }
  );
}

function unModifyImage(imageEl) {
  const DEFAULT_OPTIONS = { selectedOption: 'blur' };
  chrome.storage.sync.get(DEFAULT_OPTIONS,
    ( options ) => {
      switch(options.selectedOption) {
        case "replace":
          imageEl.src = imageEl.getAttribute('oldSrc');
          break;
        case "blur":
          imageEl.classList.remove('blurred-image');
          break;
      }
      imageEl.setAttribute('data-safespace-status', 'allowed');
    });
}

function modifyImage(imageEl) {
  const DEFAULT_OPTIONS = { selectedOption: 'blur' };
  chrome.storage.sync.get(DEFAULT_OPTIONS,
    ( options ) => {
      switch(options.selectedOption) {
        case "replace":
          chrome.storage.sync.get({replaceUrl: `https://dummyimage.com/${imageEl.width}x${imageEl.height}/000000/000000`}, ( urlOptions ) => {
            const oldSrc = imageEl.src;
            imageEl.src = urlOptions.replaceUrl;
            imageEl.setAttribute('oldSrc', oldSrc);
          });
          break;
        case "blur":
          imageEl.classList.add('blurred-image');
          if (imageEl.getAttribute('data-safespace-status') === 'pending') {
            imageEl.setAttribute('data-safespace-status', 'blocked');
          }
      }
    });
}

function skipImage(imageEl) {
  return imageEl.width < 50 || imageEl.height < 50;
}

censorImages();
