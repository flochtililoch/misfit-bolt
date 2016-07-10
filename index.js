"use strict";

// Module Imports
const debug = require('debug')(require('./package').name),
      State = require('./lib/state'),
      NobleDevice = require('./lib/noble-device'),
      assertFunction = require('./lib/util').assertFunction;


// Constants
const ADVERTISEMENT_NAME = 'MFBOLT',
      SERVICE_UUID = 'fff0',
      CONTROL_UUID = 'fff1',
      EFFECT_UUID = 'fffc',
      NAME_UUID = 'fff8',
      ON = 'CLTMP 3200,100',
      OFF = 'CLTMP 3200,0',
      GRADUAL_MODE = 'TS',
      NON_GRADUAL_MODE = 'TE',
      PERSIST_DEFAULT_COLOR = 'DF',
      DELAYED_WRITE_MS = 500,
      DELAYED_PERSIST_MS = 1000,
      DISCOVERY_LOOP_MS = 15000;


function setter (property) {
  return function (value, done) {
    debug(`set ${property} with "${value}"`);
    return this.setInternalState(property, value, done);
  }
};

function getter (property) {
  return function (done) {
    assertFunction(done);
    debug(`get ${property}`);
    return this._readStateValue((error) => {
      debug(`got ${property}: "${this.state[property]}"`);
      done(error, this.state[property]);
    });
  }
};


/** @namespace */
const Bolt = function(peripheral) {
  NobleDevice.call(this, peripheral);
  this.id = peripheral.id;
  this.state = State.getState(this.id);
};

NobleDevice.Util.inherits(Bolt, NobleDevice);


/**
 * Retrieve Red, Green, Blue and Alpha values of the bolt in the form of an Array of Integers.
 * @example
 * bolt.getRGBA(function(error, rgba) {
 *   console.log('Current RGBA values are: ', rgba);
 * });
 *
 * @param {Function} done - completion callback
 * @param {NumbersGetterCallback} done - completion callback
 * @returns {Bolt}
 * @memberof Bolt
 * @public
 */
Bolt.prototype.getRGBA = getter('rgba');


/**
 * Set RGBA values of the bolt.
 * @example
 * bolt.setRGBA([255, 0, 0, 10], function(error) {
 *   console.log('Bolt now set to red !');
 * });
 * @param {Array<number>} rgba - Red (0 to 255) / Green (0 to 255) / Blue (0 to 255) / Alpha (0 to 100) values
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setRGBA = setter('rgba');


/**
 * Retrieve Red value of the bolt.
 * @example
 * bolt.getRed(function(error, red) {
 *   console.log('Current Red value is: ', red);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getRed = getter('red');


/**
 * Set Red value of the bolt.
 * @example
 * bolt.setRed(10, function(error) {
 *   console.log('Red is now set to 10');
 * });
 * @param {number} red - Red value (0 to 255)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setRed = setter('red');


/**
 * Retrieve Green value of the bolt.
 * @example
 * bolt.getGreen(function(error, green) {
 *   console.log('Current Green value is: ', green);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getGreen = getter('green');


/**
 * Set Green value of the bolt.
 * @example
 * bolt.setGreen(10, function(error) {
 *   console.log('Green is now set to 10');
 * });
 * @param {number} green - Green value (0 to 255)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setGreen = setter('green');


/**
 * Retrieve Blue value of the bolt.
 * @example
 * bolt.getBlue(function(error, blue) {
 *   console.log('Current Blue value is: ', blue);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getBlue = getter('blue');


/**
 * Set Blue value of the bolt.
 * @example
 * bolt.setBlue(10, function(error) {
 *   console.log('Blue is now set to 10');
 * });
 * @param {number} blue - Blue value (0 to 255)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setBlue = setter('blue');


/**
 * Retrieve Alpha value of the bolt.
 * @example
 * bolt.getAlpha(function(error, alpha) {
 *   console.log('Current Alpha value is: ', alpha);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getAlpha = getter('alpha');


/**
 * Set Alpha value of the bolt.
 * @example
 * bolt.setAlpha(10, function(error) {
 *   console.log('Alpha is now set to 10');
 * });
 * @param {number} alpha - Alpha value (0 to 100)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setAlpha = setter('alpha');


/**
 * Retrieve Hue, Saturation and Brightness values of the bolt in the form of an Array of Integers.
 * @example
 * bolt.getHSB(function(error, hsb) {
 *   console.log('Current HSB values are: ', hsb);
 * });
 * @param {NumbersGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getHSB = getter('hsb');


/**
 * Set HSB values of the bolt.
 * @example
 * bolt.setHSB([0, 100, 10], function(error) {
 *   console.log('Bolt now set to red !');
 * });
 * @param {Array<number>} rgba - Hue (0 to 360) / Saturation (0 to 100) / Brightness (0 to 100) values
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setHSB = setter('hsb');


/**
 * Retrieve Hue value of the bolt.
 * @example
 * bolt.getHue(function(error, hue) {
 *   console.log('Current Hue value is: ', hue);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getHue = getter('hue');


/**
 * Set Hue value of the bolt.
 * @example
 * bolt.setHue(10, function(error) {
 *   console.log('Hue is now set to 10');
 * });
 * @param {number} hue - Hue value (0 to 360)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setHue = setter('hue');


/**
 * Retrieve Saturation value of the bolt.
 * @example
 * bolt.getSaturation(function(error, saturation) {
 *   console.log('Current Saturation value is: ', saturation);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getSaturation = getter('saturation');


/**
 * Set Saturation value of the bolt.
 * @example
 * bolt.setSaturation(10, function(error) {
 *   console.log('Saturation is now set to 10');
 * });
 * @param {number} saturation - Saturation value (0 to 100)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setSaturation = setter('saturation');


/**
 * Retrieve Brightness value of the bolt.
 * @example
 * bolt.getBrightness(function(error, brightness) {
 *   console.log('Current Brightness value is: ', brightness);
 * });
 * @param {NumberGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getBrightness = getter('brightness');


/**
 * Set Brightness value of the bolt.
 * @example
 * bolt.setBrightness(10, function(error) {
 *   console.log('Brightness is now set to 10');
 * });
 * @param {number} brightness - Brightness value (0 to 100)
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setBrightness = setter('brightness');


/**
 * Retrieve State value of the bolt.
 * @example
 * bolt.getState(function(error, state) {
 *   console.log(`Bolt is ${state ? 'on' : 'off'}`);
 * });
 * @param {BooleanGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getState = getter('state');


/**
 * Set State value of the bolt.
 * @example
 * bolt.setState(true, function(error) {
 *   console.log(`Bolt is now on !`);
 * });
 * @param {boolean} state - State value
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setState = setter('state');


/**
 * Retrieve Gradual Mode value of the bolt. Indicates whether transition between states is progressive or immediate.
 * @see http://www.yeelight.com/download/yeelight_blue_message_interface_v1.0.pdf
 * @param {BooleanGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getGradualMode = function (done) {
  assertFunction(done);
  debug(`get gradual mode`);
  this._read(EFFECT_UUID, done);
  return this;
};


/**
 * Set Gradual Mode value of the bolt.
 * @param {boolean} gradualMode - Gradual Mode value
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setGradualMode = function (gradualMode, done) {
  debug(`set gradual mode with "${gradualMode}"`);
  this._write(EFFECT_UUID, new Buffer(gradualMode ? GRADUAL_MODE : NON_GRADUAL_MODE), done);
  return this;
};


/**
 * Retrieve Name value of the bolt (as visible by the Bluetooth client).
 * @param {StringGetterCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.getName = function (done) {
  assertFunction(done);
  debug(`get name`);
  this._read(NAME_UUID, done);
  return this;
};


/**
 * Set Name value of the bolt.
 * @param {string} name - Name value
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @public
 */
Bolt.prototype.setName = function (name, done) {
  debug(`set name with "${name}"`);
  this._write(NAME_UUID, new Buffer(name), done);
};


/**
 * Clean up disconnected bolts from internal registry
 * Automatically called on disconnect event
 * @private
 */
Bolt.prototype.onDisconnect = function () {
  debug(`disconnected: ${this.id}`);
  Bolt.remove(this.id);
};


/**
 * Set internal state property with value
 * @param {string} property - property to set
 * @param {integer|boolean|string} value - value to set
 * @param {SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype.setInternalState = function(property, value, done) {
  try {
    this.state[property] = value;
  } catch (error) {
    done(error);
    return this;
  }
  return this._writeStateValue(done);
};


/**
 * Read specific characteristic of the bolt
 * @param {string} characteristic - UUID of characteristic to read
 * @param {SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._read = function (characteristic, done) {
  assertFunction(done);
  debug(`get characteristic ${characteristic} of service ${SERVICE_UUID}`);
  this.readDataCharacteristic(SERVICE_UUID, characteristic, (error, buffer) => {
    if (buffer === undefined) {
      error = new Error("couldn't read buffer value for characteristic ${characteristic} of service ${SERVICE_UUID}");
    }
    debug(`got buffer "${buffer}"`);
    done(error, buffer);
  });

  return this;
};


/**
 * Writes value to the bolt
 * @param {string} characteristic - UUID of characteristic to write
 * @param {Buffer} characteristic - Buffer value to write
 * @param {SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._write = function (characteristic, buffer, done) {
  assertFunction(done);
  debug(`set characteristic ${characteristic} of service ${SERVICE_UUID} with buffer ${buffer}`);
  this.writeDataCharacteristic(SERVICE_UUID, characteristic, buffer, done);
  return this;
};


/**
 * Read current value of the bolt and update internal state
 * @param {SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._readStateValue = function (done) {
  assertFunction(done);
  debug(`reading state value`);
  this._read(CONTROL_UUID, (error, buffer) => {
    if (error) {
      return done(error);
    }
    this.state.buffer = buffer;
    done(undefined, this.state.value);
  });

  return this;
};


/**
 * Write current internal state value on the bolt.
 * Real write is defered, callback is immediately invoked.
 * @param {?SimpleCallback} done - completion callback
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._writeStateValue = function (done) {
  if (typeof done === "function") {
    done();
  } else {
    debug('tried to call _writeStateValue with non function callback:', typeof done);
  }
  return this._delayedWrite();
};


/**
 * Delays writing to the bolt until DELAYED_WRITE_MS has elapsed.
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._delayedWrite = function () {
  clearTimeout(this.writeTimer);
  this.writeTimer = setTimeout(() => {
    debug(`writing state value with "${this.state.value}"`);
    this._write(CONTROL_UUID, this.state.buffer, () => {
      this._delayedPersist();
    });
  }, DELAYED_WRITE_MS);
  return this;
};


/**
 * Delays saving default value set to the bolt until DELAYED_PERSIST_MS has elapsed.
 * This essentially allows remembering the last value set if the bolt if physically turned off / unplugged.
 * @returns {Bolt}
 * @private
 */
Bolt.prototype._delayedPersist = function () {
  clearTimeout(this.persistTimer);
  this.persistTimer = setTimeout(() => {
    debug(`set characteristic ${EFFECT_UUID} of service ${SERVICE_UUID} with data ${PERSIST_DEFAULT_COLOR}`);
    this.writeDataCharacteristic(SERVICE_UUID, EFFECT_UUID, new Buffer(PERSIST_DEFAULT_COLOR));
  }, DELAYED_PERSIST_MS);
  return this;
};


/**
 * Used by Noble Device to detect bolt from other BLE devices.
 * @private
 */
Bolt.SCAN_UUIDS = [SERVICE_UUID];


/**
 * Internal registry to keep track of currently discovered and connected bolts.
 * @private
 */
Bolt.bolts = [];


/**
 * Counter for discover loop. Useful for debugging purposes mostly.
 * @private
 */
Bolt.loopCount = 0;


/**
 * Starts the discovery loop.
 * Loop consist in stopping and starting the Bolt discovery process every DISCOVERY_LOOP_MS.
 * This is to paliate a potential issue with Noble device that becomes stale after a few hours
 * and loose connection with connected bolt / stop detecting previously disconnected bolts.
 * @static
 * @example
 * Bolt.init(function(error, rgba) {
 *   console.log('Current RGBA values are: ', rgba);
 * });
 */
Bolt.init = function() {
  this.loopCount ++;
  debug(`loop: ${Bolt.loopCount}`);
  clearTimeout(Bolt.timer);
  Bolt.stopDiscoverAll(Bolt._setup);
  Bolt.timer = setTimeout(() => {
    Bolt.init();
  }, DISCOVERY_LOOP_MS);
  Bolt.discoverAll(Bolt._setup);
};


/**
 * Retrieve an bolt from internal registry.
 * @param {string} id - bolt identifier
 * @returns {Bolt?}
 * @static
 * @example
 * let bolt = Bolt.get('2312AC5C08E348699B0199458AC644BD');
 * bolt.setState(true, function() {
 *   ...
 * });
 */
Bolt.get = function(id) {
  return Bolt.bolts.filter((bolt, index) => {
    return bolt.id === id;
  })[0];
};


/**
 * Remove an bolt from internal registry.
 * @param {string} id - bolt identifier
 * @returns {boolean}
 * @static
 * @example
 * let bolt = Bolt.remove('2312AC5C08E348699B0199458AC644BD');
 */
Bolt.remove = function(id) {
  const bolt = Bolt.get(id);
  const index = Bolt.bolts.indexOf(bolt),
        found = index >= 0;
  if (found) {
    debug(`removed: ${bolt.id}`);
    Bolt.bolts.splice(index, 1);
    Bolt.init();
  }
  return found;
};


/**
 * Indicate if a BLE peripheral is a bolt.
 * Used by Noble Device during detection process.
 * @param {Noble~Peripheral} peripheral - Noble peripheral object
 * @returns {boolean}
 * @private
 */
Bolt.is = function(peripheral) {
  return peripheral.advertisement.localName === ADVERTISEMENT_NAME;
};


/**
 * Callback used by discoverAll / stopDiscoverAll Noble device helpers.
 * Initialize the internal state representation of the bolt.
 * Keep track of newly discovered bolts in internal registry.
 * @private
 */
Bolt._setup = function (bolt) {
  debug(`discovered: ${bolt.id}`);
  bolt.connectAndSetup(() => {
    bolt.getRGBA((error) => {
      if (error) {
        debug(`error getting initial RGBA: ${error}`);
        Bolt.init();
      } else {
        debug(`ready: ${bolt.id}`);
        Bolt.bolts.push(bolt);
      }
    });
  });
};


/**
 * Simple completion callback
 * @callback SimpleCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 */


/**
 * Numbers getter completion callback
 * @callback NumbersGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?Array<Number>} Value retrieved
 */


/**
 * Number getter completion callback
 * @callback NumberGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?Number} Value retrieved
 */


/**
 * Boolean getter completion callback
 * @callback BooleanGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?Boolean} Value retrieved
 */


/**
 * String getter completion callback
 * @callback StringGetterCallback
 * @memberof Bolt
 * @param {?Error} Error while performing async operation
 * @param {?String} Value retrieved
 */


module.exports = Bolt;
