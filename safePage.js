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
    processImage(el);
  });

  const updateInterval = UPDATE_INTERVALS[Math.min(Math.floor(censorCount / INTERVAL_COUNT), UPDATE_INTERVALS.length - 1)];
  setTimeout(censorImages, updateInterval);
}

function processImage(imageEl) {
  if (skipImage(imageEl)) return unblurImage(imageEl);
  chrome.runtime.sendMessage({imageURL: imageEl.src},
    block => {
      if (block) {
        blurImage(imageEl);
      } else {
        unblurImage(imageEl);
      }
    }
  );
}

function unblurImage(imageEl) {
  imageEl.classList.remove('blurred-image');
  imageEl.setAttribute('data-safespace-status', 'allowed');
}

function blurImage(imageEl) {
  imageEl.classList.add('blurred-image');
  imageEl.setAttribute('data-safespace-status', 'blocked');
}

function skipImage(imageEl) {
  return imageEl.width < 50 || imageEl.height < 50;
}

censorImages();
