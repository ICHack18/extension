// // Saves options to chrome.storage.sync.
function save_options() {
  var options = document.getElementById('list').value;
  // var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    options: options
    // likesColor: likesColor
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
    options: 'dogs'
    // likesColor: true
  }, function(items) {
    document.getElementById('options').value = items.options;
    // document.getElementById('like').checked = items.likesColor;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

//Defining a listener for our button, specifically, an onclick handler
document.getElementById("add").onclick = function() {
    var text = document.getElementById("idea").value; //.value gets input values
    document.getElementById('list').innerHTML += ('<li>'+text+'</li>');

    save_options();
}
