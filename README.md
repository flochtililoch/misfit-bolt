# Misfit Bolt Javascript Interface

Thin wrapper around [sandeepmistry/noble](https://github.com/sandeepmistry/noble), that helps Misfit Bolt bulbs discovery, and allows turning them on/off and changing their color and brightness, as well as reading their currently set values.


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
  // do something with bolt instance
}, ['29852E52-67A0-490A-BC55-7FAB809AD0C0']);
```


### connect

**Type** instance

**Arguments**

1. callback (*function*): gets called when connection is complete.

**Returns**

instance

**Example**

```javascript
bolt.connect(function() {
  // do something with bolt instance
});
```


### disconnect

**Type** instance

**Arguments**

1. callback (*function*, optional): gets called when disconnection is complete.

**Returns**

instance

**Example**

```javascript
bolt.disconnect();
```


### on

**Type** instance

**Arguments**

none

**Returns**

instance

**Example**

```javascript
bolt.on();
```


### off

**Type** instance

**Arguments**

none

**Returns**

instance

**Example**

```javascript
bolt.off();
```


### set

**Type** instance

**Arguments**

1. value (*String*): value to set on bulb. Mostly in the form or RGBA. Accepts "CLTMP 3200,0" or "CLTMP 3200,1" (used for toggle on / off). Other undocumented formats might exist.

**Returns**

instance

**Example**

```javascript
bolt.set("228,41,15,10");
```


### setRGBA

**Type** instance

**Arguments**

1. value (*Array*): value to set on bulb. Although not enforced yet, should be in the form of `[red, gree, blue, alpha]`.

**Returns**

instance

**Example**

```javascript
bolt.setRGBA([228,41,15,10]);
```


### get

**Type** instance

**Arguments**

1. callback (*function*): function invoked when value is available. Return value of `String` type.

**Returns**

instance

**Example**

```javascript
bolt.get(function(value) {
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
bolt.get(function(rgbaValue) {
  // do something with rgbaValue
});
```


## Usage

```javascript

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
