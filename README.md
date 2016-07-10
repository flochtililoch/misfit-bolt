# Misfit Bolt Javascript Interface ![Build status](https://travis-ci.org/flochtililoch/misfit-bolt.svg)

Implementation of [sandeepmistry/noble-device](https://github.com/sandeepmistry/noble-device), that helps driving a [Misfit Bolt](https://misfit.com/products/bolt) LED bluetooth bulbs.
Largely inspired by [fayep's Python implementation](https://github.com/fayep/bolt), and [sandeepmistry's YeeLight Bluetooth implementation](sandeepmistry/node-yeelight-blue).
Based on [Yeelight Blue Message Interface specifications](http://www.yeelight.com/download/yeelight_blue_message_interface_v1.0.pdf).

## Features

-   Control of color via [RGBA](https://en.wikipedia.org/wiki/RGBA_color_space) and [HSB](https://en.wikipedia.org/wiki/HSL_and_HSV) schemes.
-   Control of state, with in-bulb persistence of last color set, and in-app persistence of last brightness set.
-   Control of gradual effect transition (progressive or immediate).
-   Control of the bluetooth name of the bulb.

## Prerequisites

To connect to the Misfit Bolt, you need BLE capabilities.
[See sandeepmistry/noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites) for more details.

## Setup

```bash
npm install misfit-bolt
```

## Developer

```bash
npm run lint
npm run doc-lint
npm run doc-gen
npm test
```

## API

### Bolt

**Parameters**

-   `peripheral`

#### setRGBA

Set RGBA values of the bolt.

**Parameters**

-   `rgba` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** Red (0 to 255) / Green (0 to 255) / Blue (0 to 255) / Alpha (0 to 100) values
-   `done` **?SimpleCallback** completion callback

**Examples**

```javascript
bolt.setRGBA([255, 0, 0, 10], function(error) {
  console.log('Bolt now set to red !');
});
```

Returns **[Bolt](#bolt)**

#### getHSB

Retrieve Hue, Saturation and Brightness values of the bolt in the form of an Array of Integers.

**Parameters**

-   `done` **NumbersGetterCallback** completion callback

**Examples**

```javascript
bolt.getHSB(function(error, hsb) {
  console.log('Current HSB values are: ', hsb);
});
```

Returns **[Bolt](#bolt)**

#### setHSB

Set HSB values of the bolt.

**Parameters**

-   `rgba` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** Hue (0 to 360) / Saturation (0 to 100) / Brightness (0 to 100) values
-   `hsb`
-   `done` **?SimpleCallback** completion callback

**Examples**

```javascript
bolt.setHSB([0, 100, 10], function(error) {
  console.log('Bolt now set to red !');
});
```

Returns **[Bolt](#bolt)**

#### getHue

Retrieve Hue value of the bolt.

**Parameters**

-   `done` **NumberGetterCallback** completion callback

**Examples**

```javascript
bolt.getHSB(function(error, hue) {
  console.log('Current Hue value is: ', hue);
});
```

Returns **[Bolt](#bolt)**

#### setHue

Set Hue value of the bolt.

**Parameters**

-   `hue` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Hue value (0 to 360)
-   `done` **?SimpleCallback** completion callback

**Examples**

```javascript
bolt.setHue(10, function(error) {
  console.log('Hue is now set to 10');
});
```

Returns **[Bolt](#bolt)**

#### getSaturation

Retrieve Saturation value of the bolt.

**Parameters**

-   `done` **NumberGetterCallback** completion callback

**Examples**

```javascript
bolt.getSaturation(function(error, saturation) {
  console.log('Current Saturation value is: ', saturation);
});
```

Returns **[Bolt](#bolt)**

#### setSaturation

Set Saturation value of the bolt.

**Parameters**

-   `saturation` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Saturation value (0 to 100)
-   `done` **?SimpleCallback** completion callback

**Examples**

```javascript
bolt.setSaturation(10, function(error) {
  console.log('Saturation is now set to 10');
});
```

Returns **[Bolt](#bolt)**

#### getBrightness

Retrieve Brightness value of the bolt.

**Parameters**

-   `done` **NumberGetterCallback** completion callback

**Examples**

```javascript
bolt.getBrightness(function(error, brightness) {
  console.log('Current Brightness value is: ', brightness);
});
```

Returns **[Bolt](#bolt)**

#### setBrightness

Set Brightness value of the bolt.

**Parameters**

-   `brightness` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Brightness value (0 to 100)
-   `done` **?SimpleCallback** completion callback

**Examples**

```javascript
bolt.setBrightness(10, function(error) {
  console.log('Brightness is now set to 10');
});
```

Returns **[Bolt](#bolt)**

#### getState

Retrieve State value of the bolt.

**Parameters**

-   `done` **BooleanGetterCallback** completion callback

**Examples**

```javascript
bolt.getState(function(error, state) {
  console.log(`Bolt is ${state ? 'on' : 'off'}`);
});
```

Returns **[Bolt](#bolt)**

#### setState

Set State value of the bolt.

**Parameters**

-   `state` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** State value
-   `done` **?SimpleCallback** completion callback

**Examples**

```javascript
bolt.setState(true, function(error) {
  console.log(`Bolt is now on !`);
});
```

Returns **[Bolt](#bolt)**

#### getGradualMode

Retrieve Gradual Mode value of the bolt. Indicates whether transition between states is progressive or immediate.

**Parameters**

-   `done` **BooleanGetterCallback** completion callback

Returns **[Bolt](#bolt)**

#### setGradualMode

Set Gradual Mode value of the bolt.

**Parameters**

-   `gradualMode` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Gradual Mode value
-   `done` **?SimpleCallback** completion callback

Returns **[Bolt](#bolt)**

#### getName

Retrieve Name value of the bolt (as visible by the Bluetooth client).

**Parameters**

-   `done` **StringGetterCallback** completion callback

Returns **[Bolt](#bolt)**

#### setName

Set Name value of the bolt.

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name value
-   `done` **?SimpleCallback** completion callback

Returns **[Bolt](#bolt)**

#### getRGBA

Retrieve Red, Green, Blue and Alpha values of the bolt in the form of an Array of Integers.

**Parameters**

-   `done` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** completion callback
-   `done` **NumbersGetterCallback** completion callback

**Examples**

```javascript
bolt.getRGBA(function(error, rgba) {
  console.log('Current RGBA values are: ', rgba);
});
```

Returns **[Bolt](#bolt)**

#### init

Starts the discovery loop.
Loop consist in stopping and starting the Bolt discovery process every DISCOVERY_LOOP_MS.
This is to paliate a potential issue with Noble device that becomes stale after a few hours
and loose connection with connected bolt / stop detecting previously disconnected bolts.

**Examples**

```javascript
Bolt.init(function(error, rgba) {
  console.log('Current RGBA values are: ', rgba);
});
```

#### get

Retrieve an bolt from internal registry.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** bolt identifier

**Examples**

```javascript
let bolt = Bolt.get('2312AC5C08E348699B0199458AC644BD');
bolt.setState(true, function() {
  ...
});
```

Returns **[Bolt](#bolt)?**

#### remove

Remove an bolt from internal registry.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** bolt identifier

**Examples**

```javascript
let bolt = Bolt.remove('2312AC5C08E348699B0199458AC644BD');
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

#### SimpleCallback

Simple completion callback

**Parameters**

-   `Error` **?[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** while performing async operation

#### NumbersGetterCallback

Numbers getter completion callback

**Parameters**

-   `Error` **?[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** while performing async operation
-   `Value` **?[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** retrieved

#### NumberGetterCallback

Number getter completion callback

**Parameters**

-   `Error` **?[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** while performing async operation
-   `Value` **?[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** retrieved

#### BooleanGetterCallback

Boolean getter completion callback

**Parameters**

-   `Error` **?[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** while performing async operation
-   `Value` **?[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** retrieved

#### StringGetterCallback

String getter completion callback

**Parameters**

-   `Error` **?[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** while performing async operation
-   `Value` **?[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** retrieved

## TODO

-   CLI tool

## Notes

-   PRs welcomed!
