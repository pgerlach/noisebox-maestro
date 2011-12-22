spawn = require('child_process').spawn

// the process running, if not null.
var currentProcess = null


var spotifyPlayer = "/Users/pgerlach/work/perso/noisebox/spotify_cmd/bin/spotify_cmd"
var mplayer = "/Applications/VLC.app/Contents/MacOS/VLC"

var play = function(content) {
	console.log("will play " + JSON.stringify(content))

	stop()

	switch (content.type)
	{
		case "spotify":
			currentProcess = spawn(spotifyPlayer, [content.uri]);
			break ;
		case "http-mp3":
			currentProcess = spawn(mplayer, [content.uri]);
			break ;
		default:
			console.log('bad content type')
			return ;
	}

	currentProcess.on('exit', function(code) {
		console.log('process exited')
		if (0 != code) {
			console.log('exit code: ' + code)
		}
	})
}

var stop = function() {
	// should stop the process currentProcess
	if (null != currentProcess) {
		currentProcess.kill()
		currentProcess = null
	}
}

var playpause = function() {
	// ... how ?
	console.log("will play/pause")
}

var next = function() {
	// if playing spotify-playlist, yes. if not -> stop.
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
exports.stop = stop
exports.playpause = playpause
exports.next = next
exports.prev = prev
exports.vplus = vplus
exports.vminus = vminus
