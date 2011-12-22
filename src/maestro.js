var express = require("express")

var app = express.createServer();

app.get('/', function(req, res){
    res.send("Let's play some music !");
});

app.listen(3000);
