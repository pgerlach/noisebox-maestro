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
			spotifyHandleContent(content.params);
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


// uris is an array of uris
var spotifyLaunchPlayer = function (uris) {
	console.log('would launch ' + uris);
//	currentProcess = spawn(spotifyPlayer, [config.spotify.username, config.spotify.password].concat(uris));
}

var spotifyHandleContent = function (params) {
	// track of album ? (playlists will have to be handled by spotify_cmd itself)
	if (params.uri.match('^spotify:track:')) {
		spotifyLaunchPlayer([params.uri])
	}
	else if (params.uri.match('^spotify:album:')) {
		// http://ws.spotify.com/lookup/1/.json?uri=spotify:album:6G9fHYDCoyEErUkHrFYfs4&extras=track

		// ask spotify metadata api for album tracks
		var options = {
		  host: 'ws.spotify.com',
		  port: 80,
		  path: '/lookup/1/.json?uri=' + params.uri + '&extras=track',
		  method: 'GET'
		};

		var data = ''

	 	var apiReq = http.request(options, function(apiRes) {
			console.log('STATUS: ' + apiRes.statusCode);
			apiRes.setEncoding('utf8');
			apiRes.on('data', function (chunk) {
				console.log('BODY: ' + chunk);
				data += chunk;
			});
			apiRes.on('end', function () {
				var content = JSON.parse(data);
				if (null != content) {
					tracksArray = []
					// TODO handle exception
					for (var i=0; i<content.album.tracks.length; ++i) {
						tracksArray = tracksArray.concat(content.album.tracks[i].href);
					}
					spotifyLaunchPlayer([tracksArray])
				}
				else {
				    console.log('No haz undertand spotify API json response');
				    console.log(data);
				}
			});
		});
	}
	else {
		console.log('unhandled spotify uri type');
	}
}


exports.init = init
exports.play = play
exports.stop = stop
exports.playpause = playpause
exports.next = next
exports.prev = prev
exports.vplus = vplus
exports.vminus = vminus
