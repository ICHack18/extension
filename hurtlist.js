let hurtList;

function updateChecked() {
  var options = document.getElementById('list').children;
  for (i = 0; i < options.length; i += 2) {
    hurtList[i/2].checked = options[i].checked
  }
}

// // Saves options to chrome.storage.sync.
function save_options() {
  updateChecked()

  chrome.storage.sync.set({
    hurtList
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Delete all saved preferences
function clear_options() {
  chrome.storage.sync.clear(function() {
    hurtList = [];
    renderhurtList();
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    hurtList: [{text: 'dogs', checked: true}]
  }, function(options) {
    hurtList = options.hurtList;
    // console.log(hurtList)
    renderhurtList();
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.getElementById('clear').addEventListener('click',
    clear_options);

document.getElementById("add").onclick = function() {
    var text = document.getElementById("idea").value; //.value gets input values
    if (text) {
      hurtList.push({text: text, checked: true});
      renderhurtList();
      save_options();
      document.getElementById("idea").value = "";
    }
}

function renderhurtList() {
  document.getElementById('list').innerHTML = hurtList.map(generateItem).reduce((s, a) => s + a, '');
}

function generateItem(el) {
  var idName = el.text;
  return `<input type="checkbox" id="${idName}" class="checkboxes" ${el.checked ? "checked" : ""}> <label for="${idName}">${el.text}</label>`
}
