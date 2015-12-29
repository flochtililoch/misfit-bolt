Bolt = require('.');

// Discover every nearby Bolt
Bolt.discover(function(bolt) {

  // Each time a bolt is discovered, connect to it
  bolt.connect(function() {
    var i = 0,
        colors = [[228,41,15,10],
                  [216,62,36,10],
                  [205,55,56,10],
                  [211,27,76,10],
                  [166,18,97,10]];

    // Change color every 500 ms
    setInterval(function(){
      var color = colors[i++ % colors.length];
      bolt.setRGBA(color, function(){
        // set complete
      });
    }, 500);
  });
});
