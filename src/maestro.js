var express = require("express"),
	http = require("http"),
	player = require('./player')

var app = express.createServer();

var serverHost = "diynoisebox.herokuapp.com"

app.get('/', function(req, res){
    res.send("Let's play some music !");
});

app.get('/tag/:idTag', function(req, res){
	var options = {
	  host: serverHost,
	  port: 80,
	  path: '/tag/' + req.params.idTag,
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
			res.send("Tqg " + req.params.idTag + ' plays ' + JSON.stringify(content.content))
			player.play(content.content)
		}
		else {
		    res.send("Seen tag " + req.params.idTag + ' but no can haz content');
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

app.listen(3000);
