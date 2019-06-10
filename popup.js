var btnSave = document.getElementById("save");
var btnFind = document.getElementById("find");

btnSave.onclick = function() {
	chrome.extension.getBackgroundPage().save();
}

btnFind.onclick = function() {
	chrome.extension.getBackgroundPage().find();
}