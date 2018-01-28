const OPTION_LIST = {
  'blur': { text: 'Blur pictures'},
  'remove': { text: 'Remove pictures'},
  'replace': { text: 'Replace pictures'}
};

const SUB_OPTIONS_LIST = {
  "black" : { text: 'black'},
  "custom" : { text: 'custom'}
}

let options;

// Saves options to chrome.storage.sync.
function saveOptions() {
  // Save options, then flash a status to let user know options were saved.
  return new Promise((resolve, reject) => chrome.storage.sync.set({ 
    selectedOption: document.querySelector('input[name=options]:checked').value
  }, resolve))
    .then(() => {
      flashStatus('Options saved.');
    }) 
}

// Restores select box and checkbox state using the preferences // stored in chrome.storage.
function loadOptions() {
  const DEFAULT_OPTIONS = { selectedOption: 'blur' };
  return new Promise((resolve, reject) => chrome.storage.sync.get(DEFAULT_OPTIONS, resolve))
    .then(loadedOptions => options = loadedOptions);
}

function renderOptionList() {
  const generateItem = ([key, opt]) => `<input type="radio" id="${key}" name="options" class="radios" ${options.selectedOption === key ?
    "checked" : ""} value="${key}"> <label for="${key}">${opt.text}</label>`;
  document.getElementById('list').innerHTML = Object.entries(OPTION_LIST).reduce((acc, item) => acc + generateItem(item), '');
  document.getElementById('replace').addEventListener('click', showSubOptions);
  document.getElementById('blur').addEventListener('click', hideSubOptions);
  document.getElementById('remove').addEventListener('click', hideSubOptions);

  document.getElementById('custom').addEventListener('click', launchCustom);
}

function flashStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => status.textContent = '', 750);
}

function launchCustom() {
  var addCustom = confirm("Would you like to add a custom image?");
  if (!addCustom) {
    return
  }
  var url = prompt("Please add your url here: ");
  // check url
  chrome.tabs.create({url: url});
}

function showSubOptions() {
  document.getElementById('subList').style.display = "block";
}

function hideSubOptions() {
  document.getElementById('subList').style.display = "none";
}

// Set up event handlers
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('save').addEventListener('click', saveOptions);
  loadOptions().then(() => renderOptionList());
});