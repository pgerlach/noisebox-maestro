var express = require("express"),
	http = require("http"),
	player = require('./player'),
	querystring = require('querystring'),
	_ = require('underscore'),
	config = require('./config').config,
	led = require('./leds');

var app = express.createServer();

app.get('/', function(req, res){
    res.send("Let's play some music !");
});

app.get('/tag/:idTag', function(req, res){

	console.log('Seen tag ' + idTag);
	led.blink('green');

	var additionalParams = {};
	if ('boxid' in config) {
		additionalParams.boxid = config.boxid;
	}
	var additionalParamsStr = _.isEmpty(additionalParams) ? '' : ('?' + querystring.stringify(additionalParams));

	var options = {
	  host: config.server_host,
	  port: config.server_port,
	  path: '/tag/' + req.params.idTag + additionalParamsStr,
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
			res.send("Tag " + req.params.idTag + ' plays ' + JSON.stringify(content.content));
			player.play(content.content);
		}
		else {
		    res.send("Seen tag " + req.params.idTag + ' but no can haz content');
		    led.blink('red');
		}
	  });
	});
	apiReq.end();
});

app.get('/cmd/playpause', function(req, res){
	player.playpause()
    res.send("play/pause");
});

app.get('/cmd/stop', function(req, res){
	player.stop()
    res.send("stop");
});

app.get('/cmd/next', function(req, res){
	player.next()
    res.send("next");
});

app.get('/cmd/prev', function(req, res){
	player.prev()
    res.send("prev");
});

app.get('/cmd/vplus', function(req, res){
	player.vplus()
    res.send("vplus");
});

app.get('/cmd/vminus', function(req, res){
	player.vminus()
    res.send("vminus");
});

player.init()
leds.init()

if (undefined != config.boxid) {
	console.log("Boxid : [" + config.boxid + "]");
}
else {
	console.log("No boxid defined.");
}

app.listen(4242);
