// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

// Create one test item for each context type.
var context = "image"

var title = "Block " + context;
var parentId = chrome.contextMenus.create({"title": title, "contexts":[context], "id": "parent" + context});
console.log("'" + context + "' item:" + parentId);

var title_child = "Block similar content";
var childId = chrome.contextMenus.create({"title": title_child, "contexts":[context], "id": "child" + context});

// var title_child = "Block similar content";
// var child1Id = chrome.contextMenus.create({"title": title_child, "contexts":[context], "id": "child1" + context});


chrome.contextMenus.onClicked.addListener(function(event) {
	return getTags().then(tags => {
		return fetch("http://safespace.westeurope.cloudapp.azure.com/hide", {
			method: 'post',
			headers: { "Content-type": "application/json" },
			body: JSON.stringify(
			{
				"useCache": true,
				"tags": [],
				"urls": [event.srcUrl]
			}
			)
		})})
	.then(function (response) {return response.json()})
	.then(function (data) {
		console.log(data);
		return data;
	})
	.catch(function (error) {
		console.log('Request failed', error);
	});
})

// Create a parent item and two children.
