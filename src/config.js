var fs = require('fs');

// config should be downloaded from diynoisebox.herokuapp.com
var config = JSON.parse(fs.readFileSync('./config', 'utf8'));

exports.config = config;
