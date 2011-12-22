var express = require("express")

var app = express.createServer();

app.get('/', function(req, res){
    res.send("Let's play some music !");
});

app.get('/tag/:idTag', function(req, res){
    res.send("Seen tag " + req.params.idTag);
});

app.get('/cmd/playpause', function(req, res){
    res.send("play/pause");
});

app.get('/cmd/next', function(req, res){
    res.send("next");
});

app.get('/cmd/prev', function(req, res){
    res.send("prev");
});

app.get('/cmd/vplus', function(req, res){
    res.send("vplus");
});

app.get('/cmd/vminus', function(req, res){
    res.send("vminus");
});

app.listen(3000);
