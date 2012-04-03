var fs = require('fs');


var leds = {
  'red' : {mux: 'gpmc_ad12', gpio: 44},
  'green' : {mux: 'gpmc_ad13', gpio: 45}
};

var initLed = function(led) {
  try {
    var muxfile = fs.openSync("/sys/kernel/debug/omap_mux/" + led.mux, "w");
    fs.writeSync(muxfile, "27", null);
  }
  catch (e) {
    console.log('Exception: ' + e);
  }
  try {
    var exportFile = fs.openSync('/sys/class/gpio/export', 'w');
    fs.writeSync(exportFile, led.gpio);
  }
  catch(e) {
    console.log('Exception: ' + e);
  }
  fs.writeFileSync('/sys/class/gpio/gpio' + led.gpio + '/direction', 'out');
  fs.writeFileSync('/sys/class/gpio/gpio' + led.gpio + '/value', '0');
};

var init = function() {
  for (var led in leds) {
    initLed(leds[led]);
  }
};

var recBlink = function(led, counter, ledOn) {
  if (!counter) {
    fs.writeFileSync('/sys/class/gpio/gpio' + led.gpio + '/value', '0');
    led.blinking = false;
    return ;
  }
  fs.writeFileSync('/sys/class/gpio/gpio' + led.gpio + '/value', (ledOn ? '1' : '0'));
  setTimeout(recBlink, 400, led, counter-1, !ledOn);
};

var blink = function(ledName) {
  var led = leds[ledName];
  if (led && !led.blinking) {
    led.blinking = true;
    recBlink(led, 5, true);
  }
};


exports.blink = blink;
exports.init = init;
