chrome.runtime.sendMessage(undefined, JSON.stringify({status:0}), undefined, function(msg) {
	msg = JSON.parse(msg);
	document.getElementsByTagName("video")[0].onloadedmetadata = function() {
		chrome.runtime.sendMessage(undefined, JSON.stringify({status:5}));
		execute(msg);
	}
});

function execute(msg) {
	introskip.init();
	switch(msg.action) {
		case 0:
			find(msg);
			break;
		case 1:
			save(msg);
			break;
	}
}

function find(msg) {
	introskip.max = msg.max;
	introskip.min = msg.min;
	introskip.saved = msg.saved;
	introskip.done = function(time) {
		console.log("found at " + time);
		chrome.runtime.sendMessage(undefined, JSON.stringify({status:1, time: time}), undefined, function() {
			window.close();
		});
	}
	introskip.find();
}

function save(msg) {
	introskip.p.currentTime = msg.time;
	introskip.save(function(saved) {
		chrome.runtime.sendMessage(undefined, JSON.stringify({status:3, saved: saved}), undefined, function() {
			window.close();
		});
	});
}

var introskip = {
	init: function(player) {
		if (player == undefined) {
			introskip.p = document.getElementsByTagName("video")[0];
		} else {
			introskip.p = player;
		}
		introskip.p.pause();
		introskip.canvas = document.createElement("canvas");
		introskip.canvas.height = introskip.p.videoHeight;
		introskip.canvas.width = introskip.p.videoWidth;
		introskip.ctx = introskip.canvas.getContext("2d");

	},
	getFrame: function() {
		introskip.ctx.drawImage(introskip.p, 0, 0, introskip.canvas.width, introskip.canvas.height);
		return introskip.canvas.toDataURL("image/jpeg", 0.1);
	},
	forward: function() {
		introskip.p.currentTime+=1;
	},
	save: function(cb) {
		introskip.p.currentTime = Math.round(introskip.p.currentTime);
		setTimeout(()=> {
			introskip.saved = introskip.getFrame()
			if(cb) cb(introskip.saved);
		}, 3000);
	},
	onseeked: function() {
		var frame = introskip.getFrame();
		if (frame == introskip.saved || introskip.p.currentTime > introskip.max) {
			introskip.done(introskip.p.currentTime);
		} else {
			introskip.forward();
		}
	},
	find: function(start) {
		introskip.p.onseeked = introskip.onseeked;
		introskip.p.currentTime = start ? start : introskip.min;
	}
}