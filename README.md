# Misfit Bolt Javascript Interface

Thin wrapper around [sandeepmistry/noble](https://github.com/sandeepmistry/noble), that helps [Misfit Bolt](https://misfit.com/products/bolt) bulbs discovery, and allows turning them on/off and changing their color and brightness, as well as reading their currently set values.
Currently support setting color and brightness via [RGBA](https://en.wikipedia.org/wiki/RGBA_color_space).


## Prerequisites

To connect to the Misfit Bolt, you need BLE capabilities.
[See sandeepmistry/noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites) for more details.


## Setup

```bash
npm install misfit-bolt
```


## API Methods

### discover

**Type** static

**Arguments**

1. callback (*function*): function to be invoked once a Bolt is discovered. Takes a `Bolt` instance as first argument.
2. uuids (*Array*, optional): list of Bolt uuid to discover.

**Returns**

`undefined`

**Example**
```javascript
Bolt.discover(function(bolt) {
  // do something
}, ['29852E52-67A0-490A-BC55-7FAB809AD0C0']);
```


### connect

**Type** instance

**Arguments**

1. callback (*function*)

**Returns**

instance

**Example**

```javascript
bolt.connect(function() {
  // do something
});
```


### disconnect

**Type** instance

**Arguments**

1. callback (*function*)

**Returns**

instance

**Example**

```javascript
bolt.disconnect(function(){
  // do something
});
```


### on

**Type** instance

**Arguments**

1. callback (*function*)

**Returns**

instance

**Example**

```javascript
bolt.on(function(){
  // do something
});
```


### off

**Type** instance

**Arguments**

1. callback (*function*)

**Returns**

instance

**Example**

```javascript
bolt.off(function(){
  // do something
});
```


### set

**Type** instance

**Arguments**

1. value (*String*): value to set on bulb. Mostly in the form or RGBA. Also accepts `CLTMP 3200,0` or `CLTMP 3200,1` (used to toggle on / off). Other undocumented formats might exist.
2. callback (*function*)

**Returns**

instance

**Example**

```javascript
bolt.set("228,41,15,10", function(){
  // do something
});
```


### setRGBA

**Type** instance

**Arguments**

1. value (*Array*): value to set on bulb. Should be in the form of `[red, green, blue, alpha]`.
2. callback (*function*)

**Returns**

instance

**Example**

```javascript
bolt.setRGBA([228,41,15,10], function(){
  // do something
});
```


### get

**Type** instance

**Arguments**

1. callback (*function*): function invoked when value is available. Return value of `String` type.

**Returns**

instance

**Example**

```javascript
bolt.get(function(error, value) {
  // do something with value
});

```

### getRGBA

**Type** instance

**Arguments**

1. callback (*function*): function invoked when value is available. Return value of `Array` type.

**Returns**

instance

**Example**

```javascript
bolt.get(function(error, rgbaValue) {
  // do something with rgbaValue
});
```

### getState

**Type** instance

**Arguments**

1. callback (*function*): function invoked when state is available. Return value of `Bool` type.

**Returns**

instance

**Example**

```javascript
bolt.getState(function(error, state) {
  // do something with state
});
```

### setState

**Type** instance

**Arguments**

1. callback (*function*): function invoked when state is set.

**Returns**

instance

**Example**

```javascript
bolt.setState(true, function(error, state) {
  // do something with state
});
```

## Example

```javascript
Bolt = require('misfit-bolt');

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

```


## TODO
- CLI tool

## Notes
- Inspired by [fayep's Python implementation](https://github.com/fayep/bolt)
- PRs welcomed!
