let optionList;

// // Saves options to chrome.storage.sync.
function save_options() {
  chrome.storage.sync.set({
    optionList
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    optionList: ['dogs']
  }, function(options) {
    optionList = options.optionList;
    console.log(optionList)
    renderoptionList();
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

//Defining a listener for our button, specifically, an onclick handler
document.getElementById("add").onclick = function() {
    var text = document.getElementById("idea").value; //.value gets input values
    optionList.push(text);
    renderoptionList();
    save_options();
}

function renderoptionList() {
  document.getElementById('list').innerHTML = optionList.map(generateItem).reduce((s, a) => s + a, '');
}


function generateItem(el) {
  return '<li>'+el+'</li>'
}