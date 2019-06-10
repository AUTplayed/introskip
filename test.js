var originalP = document.getElementsByTagName("video")[0];

var introskip = {
	max: 240,
	min: 75,
	init: function(player) {
		if (player == undefined) {
			introskip.p = document.getElementsByTagName("video")[0];
		} else {
			introskip.p = player;
		}
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
	save: function() {
		introskip.p.currentTime = Math.round(introskip.p.currentTime);
		setTimeout(()=>introskip.saved = introskip.getFrame(), 1000);
	},
	onseeked: function() {
		var frame = introskip.getFrame();
		if (frame == introskip.saved || introskip.p.currentTime > introskip.max) {
			console.log("found at " + introskip.p.currentTime);
		} else {
			introskip.forward();
		}
	},
	find: function(start) {
		introskip.p.onseeked = introskip.onseeked;
		introskip.p.currentTime = start ? start : introskip.min;
	}
}
introskip.init();
introskip.p.currentTime = 100;
introskip.save();