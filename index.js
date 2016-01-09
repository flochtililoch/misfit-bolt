'use strict';
var debug = require('debug')(require('./package').name);
var noble = require('noble');
var Peripheral = require('noble/lib/peripheral');

var advertisementName = 'MFBOLT',
    lightCharacteristicUUID = 'fff1',
    on = 'CLTMP 3200,100',
    off = 'CLTMP 3200,0';

function isOn(value) {
  var str = ',100';
  return value.substr(value.length - str.length, str.length) === str;
}

class Bolt {

  constructor(peripheral) {
    if (!(peripheral instanceof Peripheral)) {
      throw new Error('Bolt : first argument should be instance of Peripheral');
    }
    this.id = peripheral.uuid;
    this.peripheral = peripheral;
    this._connected = false;
  }

  getLight(done) {
    debug('getting light');
    if (this._light) {
      debug('got cached light');
      return done(undefined, this._light);
    }
    this.peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
      debug('got light');
      var characteristic;
      for (var i = 0; i < characteristics.length; i ++) {
        characteristic = characteristics[i];
        if(characteristic.uuid == lightCharacteristicUUID) {
          this._light = characteristic;
        }
      }
      if (!characteristic) {
        throw new Error('Bolt#connect : could not find light characteristic');
      }
      done(error, this._light);
    });
  }

  connect(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#connect : first argument should be a function');
    }
    debug('connecting');
    if (this._connected) {
      this.getLight(done);
    } else {
      this.peripheral.connect((error) => {
        this._connected = true;
        debug(`connected: ${this.peripheral.uuid}`);
        this.getLight(done);
      });
    }
    return this;
  }

  disconnect(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#disconnect : first argument should be a function');
    }
    debug('disconnecting');
    if (!this._connected) {
      return done();
    }
    this.peripheral.disconnect((error) => {
      this._connected = false;
      this._light = undefined;
      debug('disconnected');
      done(error);
    });
    return this;
  }

  set(value, done) {
    if (typeof value !== 'string' || value.length > 18) {
      throw new Error('Bolt#set : first argument should be a string of 18 chars max');
    }
    if (typeof done !== 'function') {
      throw new Error('Bolt#set : second argument should be a function');
    }
    if (!this._connected) {
      throw new Error('Bolt#set : bulb is not connected.');
    }

    var length = 18;
    var padding = ','.repeat(length);
    var string = `${value}${padding}`.substring(0, length);
    var buffer = new Buffer(string);
    this.getLight((error, light) => {
      debug(`set light: ${light} with value: ${string}`);
      light.write(buffer, undefined, done);
    });
    return this;
  }

  get(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#get : first argument should be a function');
    }
    if (!this._connected) {
      throw new Error('Bolt#get : bulb is not connected.');
    }
    debug('reading');
    this.getLight((error, light) => {
      light.read((error, buffer) => {
        var string = buffer.toString();
        debug('read: ', string);
        done(error, string.replace(/,+$/, ''));
      });
    });
    return this;
  }

  setRGBA(rgba, done) {
    if (!this._connected) {
      throw new Error('Bolt#setRGBA : bulb is not connected.');
    }
    function error(property, max) {
      if (!max) {
        max = 255;
      }
      throw new Error(`Bolt#setRGBA : ${property} should be an integer between 0 and ${max}`);
    }
    if (rgba[0] < 0 || rgba[0] > 255) { error('red'); }
    if (rgba[1] < 0 || rgba[1] > 255) { error('green'); }
    if (rgba[2] < 0 || rgba[2] > 255) { error('blue'); }
    if (rgba[3] < 0 || rgba[3] > 100) { error('alpha', 100); }
    return this.set(rgba.join(','), done);
  }

  getRGBA(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#getRGBA : first argument should be a function');
    }
    if (!this._connected) {
      throw new Error('Bolt#getRGBA : bulb is not connected.');
    }
    this.get((error, value) => {
      var r, g, b, a;
      try {
        var rgba = value.match(/(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})/).slice(1, 5);
        r = +rgba[0];
        g = +rgba[1];
        b = +rgba[2];
        a = +rgba[3];
      } catch (e) {
        r = 255;
        g = 255;
        b = 255;
        a = isOn(value) ? 100 : 0;
      }
      done(error, [r, g, b, a]);
    });
    return this;
  }

  setState(state, done) {
    return this.set(state ? on : off, done);
  }

  getState(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#getState : first argument should be a function');
    }
    if (!this._connected) {
      throw new Error('Bolt#getState : bulb is not connected.');
    }
    this.get((error, value) => {
      done(error, isOn(value));
    });
  }

  off(done) {
    return this.set(off, done);
  }

  on(done) {
    return this.set(on, done);
  }

  static discover(done, uuids) {
    if (typeof done !== 'function') {
      throw new Error('Bolt.discover : first argument should be a function');
    }

    noble.on('discover', (peripheral) => {
      if (peripheral.advertisement.localName == advertisementName) {
        if (uuids !== undefined) {
          if (!(uuids instanceof Array)) {
            throw new Error('Bolt.discover : second optional argument should be an array');
          } else if (uuids.indexOf(peripheral.uuid) == -1) {
            return;
          }
        }
        done(new Bolt(peripheral));
      }
    });

    noble.on('stateChange', (state) => {
      if (state === 'poweredOn') {
        noble.startScanning();
      } else {
        noble.stopScanning();
      }
    });
  }
}

module.exports = Bolt;
