# Misfit Bolt Javascript Interface

Thin wrapper on the top of [sandeepmistry/noble](https://github.com/sandeepmistry/noble), that discovers Misfit Bolt bulbs, and allows turning them on/off and changing their color, as well as reading their currently set color.


## Prerequisites

To connect to the Misfit Bolt, you need BLE capabilities.
[See sandeepmistry/noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites) for more details.


## Setup

```bash
npm install misfit-bolt
```


## API

### Discover
```javascript
Bolt.discover(callback(bolt), [uuid]);
```

### Connect
```javascript
bolt.connect(callback);
```

### Disconnect
```javascript
bolt.connect([callback]);
```

### On
```javascript
bolt.on();
```

### Off
```javascript
bolt.off();
```

### Set
```javascript
bolt.set("228,41,15,10");
```

### SetRGBA
```javascript
bolt.setRGBA(228,41,15,10);
```

### Get
```javascript
bolt.get(callback(currentValue));
```

### GetRGBA
```javascript
bolt.get(callback(currentRGBAValue));
```


## Example

```javascript
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
```


## TODO
- CLI tool

## Notes
- Inspired by [fayep's Python implementation](https://github.com/fayep/bolt)
- PRs welcomed!
