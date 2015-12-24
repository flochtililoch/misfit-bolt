Bolt = require('.');

Bolt.discover(function(bolt) {
  bolt.connect(function() {
    var i = 0,
        colors = [[228,41,15,10],
                  [216,62,36,10],
                  [205,55,56,10],
                  [211,27,76,10],
                  [166,18,97,10]];

    setInterval(function(){
      var color = colors[i++ % colors.length];
      bolt.setRGBA.apply(bolt, color);
    }, 500);
  });
});
