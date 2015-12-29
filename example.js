Bolt = require('.');

Bolt.discover(function(bolt) {
  bolt.connect(function() {
    var i = 0,
        colors = [['253','100%','49%'],
                  ['117','100%','49%'],
                  ['0','100%','49%'],
                  ['62','100%','49%'],
                  ['304','100%','49%']];

    setInterval(function(){
      var color = colors[i++ % colors.length];
      bolt.setHSL(color, 10, function() {});
    }, 2000);
  });
});
