var play = function(content) {
	console.log("will play " + JSON.stringify(content))
}

var playpause = function() {
	console.log("will play/pause")
}

var next = function() {
	console.log("will next")
}

var prev = function() {
	console.log("will prev")
}

var vplus = function() {
	console.log("will vplus")
}

var vminus = function() {
	console.log("will vminus")
}


exports.play = play
exports.playpause = playpause
exports.next = next
exports.prev = prev
exports.vplus = vplus
exports.vminus = vminus
