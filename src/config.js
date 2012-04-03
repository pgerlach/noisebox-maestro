var fs = require('fs');

// config should be downloaded from diynoisebox.herokuapp.com
var config = JSON.parse(fs.readFileSync('./config', 'utf8'));

if (!config.server_host) {
  config.server_host = "diynoisebox.herokuapp.com";
}
if (!config.server_port) {
  config.server_port = 80;
}

exports.config = config;
