var saved;
var action;
var url;
var time;
var activeTab;

function getTab(cb) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		activeTab = tabs[0].id;
		cb(tabs[0].id);
	});
}


async function find() {
	getTab(function(tab) {
		chrome.tabs.executeScript(tab, {
			file: 'inject.js',
			allFrames: true
		});
		action = 0;
	})
}

async function save() {
	getTab(function(tab) {
		chrome.tabs.executeScript(tab, {
			file: 'inject.js',
			allFrames: true
		});
		action = 1;
	})
}

function newtab() {
	chrome.tabs.create({url:url}, (tab) => {
		chrome.tabs.update(tab.id, {muted:true});
		chrome.tabs.executeScript(tab.id, {
			file: 'find.js'
		});
	});
}

chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
	msg = JSON.parse(msg);
	switch(msg.status) {
		case 0:
			switch(action) {
				case 0:
					respond(JSON.stringify({action:action, min:75, max:240, saved:saved})); // send find settings
					break;
				case 1:
					respond(JSON.stringify({action:action, time:time}));
					break;
			}
			break;
		case 1:
			respond(JSON.stringify({})); // kill tab
			console.log("received: "+ msg.time);
			chrome.tabs.sendMessage(activeTab, JSON.stringify({status:4, time:msg.time}));
			break;
		case 2:
			url = msg.url;
			time = msg.time;
			newtab();
			break;
		case 3:
			respond(JSON.stringify({})); // kill tab
			saved = msg.saved; // save saved frame
			console.log("got saved")
			break;
		case 5:
			chrome.tabs.update(activeTab, {highlighted: true}); // switch back to main tab
			break;
	}
});
