console.log('[SafeSpace] Loaded content script');

const UPDATE_INTERVALS = [10, 20, 50, 100, 200, 500, 3000];
const INTERVAL_COUNT = 5;

let censorCount = 0;

function censorImages() {

  Array.from(document.getElementsByTagName('img')).forEach(el => {
    if (el.getAttribute('data-safespace-seen') === 'true') return;
    console.log()
    // Image has not been seen before
    el.setAttribute('data-safespace-seen', 'true');
    el.classList.add('pending-image');
    el.setAttribute('data-safespace-status', 'pending');
    processImage(el);
  });

  const updateInterval = UPDATE_INTERVALS[Math.min(Math.floor(++censorCount / INTERVAL_COUNT), UPDATE_INTERVALS.length - 1)];
  setTimeout(censorImages, updateInterval);
}

function processImage(imageEl) {
  if (skipImage(imageEl)) return allowImage(imageEl);
  chrome.runtime.sendMessage({imageURL: imageEl.src},
    block => {
      if (block === null) {
        console.log('Backend could not access the following image:', imageEl.src)
      }
      (block ? blockImage : allowImage)(imageEl)
  });
}

function allowImage(imageEl) {
  imageEl.classList.remove('pending-image');
  imageEl.classList.add('allowed-image');
  imageEl.setAttribute('data-safespace-status', 'allowed');
}

function blockImage(imageEl) {
  imageEl.setAttribute('data-safespace-status', 'blocked');

  const DEFAULT_OPTIONS = {
    selectedOption: 'remove',
    replaceUrl: `https://dummyimage.com/${imageEl.width}x${imageEl.height}/000000/000000`
  };
  chrome.storage.sync.get(DEFAULT_OPTIONS, options => {
    const dimensions = {
      width: imageEl.width,
      height: imageEl.height
    };

    imageEl.classList.remove('pending-image');

    if (options.selectedOption === 'blur') {
      imageEl.classList.add('blocked-image');
      imageEl.classList.add('blurred-image');
      imageEl.addEventListener('mousedown', () => imageEl.classList.add('ss-peek'));
      imageEl.addEventListener('mouseup', () => imageEl.classList.remove('ss-peek'));
      return;
    }

    if (options.selectedOption === 'replace') {
      imageEl.setAttribute('data-original-url', imageEl.src);
      imageEl.src = options.replaceUrl;
      imageEl.addEventListener('mousedown', () => imageEl.src = imageEl.getAttribute('data-original-url'));
      imageEl.addEventListener('mouseup', () => imageEl.src = options.replaceUrl);
      return;
    }

    const newDiv = document.createElement('div');
    newDiv.classList.add('blocked-image');
    newDiv.style.width = dimensions.width;
    newDiv.style.height = dimensions.height;
    newDiv.innerHTML = '<p class="safespace-blocked-msg">Blocked <br>Click and hold to reveal</p>';
    imageEl.addEventListener('mouseup', () => {newDiv.classList.remove('ss-peek'); imageEl.classList.remove('ss-peek');});
    newDiv.addEventListener('mousedown', () => {
      newDiv.classList.add('ss-peek');
      imageEl.classList.add('ss-peek');
    });
    imageEl.insertAdjacentElement('afterend', newDiv);
    imageEl.classList.add('blocked-image');
  });
}

function skipImage(imageEl) {
  return imageEl.width < 50 || imageEl.height < 50;
}

censorImages();
