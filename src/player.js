var spawn = require('child_process').spawn,
	config = require('./config').config

// the process running, if not null.
var currentProcess = null

// the current volume
var volume = 40
var volumeMax = 150
var volumeIncr = 10


var spotifyPlayer = "/Users/pgerlach/work/perso/noisebox/spotify_cmd/bin/spotify_cmd"
var mplayer = "/Applications/VLC.app/Contents/MacOS/VLC"


var init = function() {
	console.log("init volume to " + volume)
	spawn("amixer", ["sset", "Speaker", volume]);
	// we can forget about him
}

var play = function(content) {
	console.log("will play " + JSON.stringify(content))

	stop()

	switch (content.type)
	{
		case "spotify":
			currentProcess = spawn(spotifyPlayer, [config.spotify.username, config.spotify.password, content.uri]);
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
	volume += volumeIncr
	if (volume > volumeMax) {
		volume = volumeMax
	}
	spawn("amixer", ["sset", "Speaker", volume]);
	console.log("increase volume to " + volume)
}

var vminus = function() {
	console.log("will vminus")
	if (volume > volumeIncr) {
		volume -= volumeIncr
	}
	else {
		volume = 0
	}
	spawn("amixer", ["sset", "Speaker", volume]);
	console.log("decrease volume to " + volume)
}


exports.init = init
exports.play = play
exports.stop = stop
exports.playpause = playpause
exports.next = next
exports.prev = prev
exports.vplus = vplus
exports.vminus = vminus
