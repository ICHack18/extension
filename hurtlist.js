let optionList;

function updateChecked() {
  var options = document.getElementById('list').children;
  for (i = 0; i < options.length; i += 2) {
    optionList[i/2].checked = options[i].checked
  }
}

// // Saves options to chrome.storage.sync.
function save_options() {
  updateChecked()

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
    optionList: [{text: 'dogs', checked: true}]
  }, function(options) {
    optionList = options.optionList;
    // console.log(optionList)
    renderoptionList();
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

//Defining a listener for our button, specifically, an onclick handler
document.getElementById("add").onclick = function() {
    var text = document.getElementById("idea").value; //.value gets input values
    optionList.push({text: text, checked: true});
    renderoptionList();
    save_options();
}

function renderoptionList() {
  console.log(optionList);
  document.getElementById('list').innerHTML = optionList.map(generateItem).reduce((s, a) => s + a, '');
}

function isContained(el, ob) {
  for (option of ob) {
    if (el === option.text) {
      return true
    }
  }
  return false
}


function generateItem(el) {
  // check if it exists
  //var idName = isContained(el, optionList) ? el : el;
  var idName = el.text;
  // var idName = "dd"
  return `<input type="checkbox" id="${idName}" ${el.checked ? "checked" : ""}> <label for="${idName}">${el.text}</label>`
  //return el.checked ? `<input type="checkbox" id="${idName}" checked> <label for="${idName}">` +el.text+ '</label>' : '<input type="checkbox"> <label>' +el.text+ '</label>';
}