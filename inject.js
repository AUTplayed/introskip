var p = document.getElementsByTagName("video")[0];
if(!p) {
	p = document.getElementById("plyr");
}
if(p) {
	console.log("send");
	chrome.runtime.sendMessage(undefined, JSON.stringify({status:2, url:p.currentSrc, time:p.currentTime}));
	chrome.runtime.onMessage.addListener(function(msg) {
		console.log(msg);
		msg = JSON.parse(msg);
		switch(msg.status) {
			case 4:
			p.currentTime = msg.time;
		}
	});
}