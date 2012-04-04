var spawn = require('child_process').spawn,
	config = require('./config').config,
	http = require('http')

// the process running, if not null.
var currentProcess = null

// the current volume
var volume = 40
var volumeMax = 150
var volumeIncr = 10


var spotifyPlayer = "/home/root/spotify_cmd/bin/spotify_cmd"
var mplayer = "/home/root/noisebox-player/noisebox-player.sh"


var init = function() {
	console.log("init volume to " + volume)
	spawn("amixer", ["sset", "Speaker", volume]);
	// we can forget about him
};


var play = function(content) {
	console.log("will play " + JSON.stringify(content))

	stop()

	switch (content.type)
	{
		case "spotify":
			spotifyHandleContent(content.params);
			break ;
		case "http-mp3":
			httpMp3HandleContent(content.params);
			break ;
		default:
			console.log('bad content type')
			return ;
	}
}

var stop = function() {
	// should stop the process currentProcess
	if (null != currentProcess) {
		currentProcess.stdin.write('stop\n');
//		currentProcess.kill()
		currentProcess = null
	}
};

var playpause = function() {
	console.log("will play/pause")
	if (null != currentProcess) {
		currentProcess.stdin.write('playpause\n');
	}
}

var next = function() {
	console.log("will next")
	if (null != currentProcess) {
		currentProcess.stdin.write('next\n');
	}
}

var prev = function() {
	console.log("will prev")
	if (null != currentProcess) {
		currentProcess.stdin.write('prev\n');
	}
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
	console.log('would launch ' + spotifyPlayer + ' ' + [config.spotify.username, config.spotify.password].concat(uris).join(' '));
	currentProcess = spawn(spotifyPlayer, [config.spotify.username, config.spotify.password].concat(uris));
//	currentProcess = spawn('/bin/echo', ['coucou']);
//	console.log('currentProcess: ' + JSON.stringify(currentProcess));
	if (null != currentProcess) {
		currentProcess.on('exit', function(code) {
			console.log('process exited')
			if (0 != code) {
				console.log('exit code: ' + code)
			}
			currentProcess = null;
		})
	}
	else {
		console.log('currentProcess = null');
	}
}


var httpMp3HandleContent = function(params) {
	currentProcess = spawn(mplayer, [params.uri]);

	if (null != currentProcess) {
		currentProcess.on('exit', function(code) {
			console.log('process exited')
			if (0 != code) {
				console.log('exit code: ' + code)
			}
			currentProcess = null;
		})
	}
	else {
		console.log('currentProcess = null');
	}
}

var spotifyHandleContent = function (params) {
	// track of album ? (playlists will have to be handled by spotify_cmd itself)
	if (params.uri.match('^spotify:track:')) {
		spotifyLaunchPlayer([params.uri])
	}
	else if (params.uri.match('^spotify:album:')) {
		// http://ws.spotify.com/lookup/1/.json?uri=spotify:album:6G9fHYDCoyEErUkHrFYfs4&extras=track

		console.log('spotify album. querying metadata api');

		// ask spotify metadata api for album tracks
		var options = {
		  host: 'ws.spotify.com',
		  port: 80,
		  path: '/lookup/1/.json?uri=' + params.uri + '&extras=track',
		  method: 'GET'
		};

		var data = ''

		console.log('url: http://' + options.host + options.path);

	 	var apiReq = http.request(options, function(apiRes) {
			console.log('STATUS: ' + apiRes.statusCode);
			apiRes.setEncoding('utf8');
			apiRes.on('data', function (chunk) {
				console.log('http request data. BODY: ' + chunk);
				data += chunk;
			});
			apiRes.on('end', function () {
				console.log('http request end');
				var content = JSON.parse(data);
				if (null != content) {
					tracksArray = [];
					// TODO handle exception
					content.album.tracks.forEach(function(e) {tracksArray.push(e.href);});
					console.log('array: ' + tracksArray)
					spotifyLaunchPlayer(tracksArray)
				}
				else {
				    console.log('No haz undertand spotify API json response');
				    console.log(data);
				}
			});
		});
		apiReq.end();
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
