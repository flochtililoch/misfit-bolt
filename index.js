"use strict";

const debug = require('debug')(require('./package').name),
      Peripheral = require('noble/lib/peripheral'),
      State = require('./lib/state'),
      noble = require('./lib/noble'),
      util = require('./lib/util'),
      assert = util.assert,
      isOn = util.isOn;

const advertisementName = 'MFBOLT',
      lightCharacteristicUUID = 'fff1',
      on = 'CLTMP 3200,100',
      off = 'CLTMP 3200,0',
      retryAfter = 500;


class Bolt {

  constructor(peripheral) {
    assert(peripheral instanceof Peripheral, 'Bolt : first argument should be instance of Peripheral');
    this.id = peripheral.uuid;
    this.peripheral = peripheral;
    this.state = new State();
    this.connected = false;
    this.peripheral.on('disconnect', () => {
      debug(`disconnected: ${this.peripheral.uuid}`);
      this.connected = false;
      this.light = undefined;
      Bolt.remove(this.id);
    });
  }

  getLight(done) {
    debug('getting light');
    if (this.light) {
      debug('got cached light');
      return done(undefined, this.light);
    } else if (this.gettingLight) {
      debug('already getting light...');
      setTimeout(() => {
        this.getLight(done);
      }, retryAfter);
    } else {
      this.gettingLight = true;
      this.peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
        this.gettingLight = false;
        debug('got light');
        var characteristic;
        for (var i = 0; i < characteristics.length; i ++) {
          characteristic = characteristics[i];
          if(characteristic.uuid == lightCharacteristicUUID) {
            this.light = characteristic;
          }
        }
        assert(characteristic, 'Bolt#getLight : could not find light characteristic');
        done(error, this.light);
      });
    }
  }

  connect(done) {
    assert(typeof done === 'function', 'Bolt#connect : first argument should be a function');

    debug('connecting');
    if (this.connected) {
      debug('already connected');
      this.getLight(done);
    } else if (this.connecting) {
      debug('already connecting...');
      setTimeout(() => {
        this.connect(done);
      }, retryAfter);
    } else {
      this.connecting = true;
      this.peripheral.connect((error) => {
        this.connecting = false;
        this.connected = true;
        debug(`connected: ${this.peripheral.uuid}`);
        this.getLight(done);
      });
    }
    return this;
  }

  disconnect(done) {
    assert(typeof done === 'function', 'Bolt#disconnect : first argument should be a function');
    debug('disconnecting');
    if (!this.connected) {
      debug('already disconnected');
      return done();
    }
    this.peripheral.disconnect((error) => {
      this.connected = false;
      this.light = undefined;
      debug('disconnected');
      done(error);
    });
    return this;
  }

  get(done) {
    assert(typeof done === 'function', 'Bolt#get : first argument should be a function');
    assert(this.connected, 'Bolt#get : bulb is not connected.');
    debug('reading');
    this.getLight((error, light) => {
      light.read((error, buffer) => {
        this.state.buffer = buffer;
        debug('read: ', this.state.buffer.toString());
        done(error, this.state.value);
      });
    });
    return this;
  }

  set(value, done) {
    assert(typeof done === 'function', 'Bolt#set : second argument should be a function');
    assert(this.connected, 'Bolt#set : bulb is not connected.');
    this.state.value = value;
    this.getLight((error, light) => {
      debug(`set light: ${light} with value: ${this.state.buffer.toString()}`);
      light.write(this.state.buffer, undefined, done);
    });
    return this;
  }

  getRGBA(done) {
    assert(typeof done === 'function', 'Bolt#getRGBA : first argument should be a function');
    assert(this.connected, 'Bolt#getRGBA : bulb is not connected.');
    this.get((error) => {
      done(error, this.state.rgba);
    });
    return this;
  }

  setRGBA(rgba, done) {
    assert(typeof done === 'function', 'Bolt#setRGBA : second argument should be a function');
    assert(this.connected, 'Bolt#setRGBA : bulb is not connected.');
    this.state.rgba = rgba;
    return this.set(this.state.value, done);
  }

  getHue(done) {
    assert(typeof done === 'function', 'Bolt#getHue : first argument should be a function');
    assert(this.connected, 'Bolt#getHue : bulb is not connected.');
    this.get((error) => {
      done(error, this.state.hue);
    });
    return this;
  }

  setHue(hue, done) {
    assert(typeof done === 'function', 'Bolt#setHue : second argument should be a function');
    assert(this.connected, 'Bolt#setHue : bulb is not connected.');
    this.state.hue = hue;
    return this.set(this.state.value, done);
  }

  getSaturation(done) {
    assert(typeof done === 'function', 'Bolt#getSaturation : first argument should be a function');
    assert(this.connected, 'Bolt#getSaturation : bulb is not connected.');
    this.get((error) => {
      done(error, this.state.saturation);
    });
    return this;
  }

  setSaturation(saturation, done) {
    assert(typeof done === 'function', 'Bolt#setSaturation : second argument should be a function');
    assert(this.connected, 'Bolt#setSaturation : bulb is not connected.');
    this.state.saturation = saturation;
    return this.set(this.state.value, done);
  }

  getBrightness(done) {
    assert(typeof done === 'function', 'Bolt#getBrightness : first argument should be a function');
    assert(this.connected, 'Bolt#getBrightness : bulb is not connected.');
    this.get((error) => {
      done(error, this.state.brightness);
    });
    return this;
  }

  setBrightness(brightness, done) {
    assert(typeof done === 'function', 'Bolt#setBrightness : second argument should be a function');
    assert(this.connected, 'Bolt#setBrightness : bulb is not connected.');
    this.state.brightness = brightness;
    return this.set(this.state.value, done);
  }

  getState(done) {
    assert(typeof done === 'function', 'Bolt#getState : first argument should be a function');
    assert(this.connected, 'Bolt#getState : bulb is not connected.');
    this.get((error, value) => {
      done(error, isOn(value));
    });
  }

  setState(state, done) {
    return this.set(state ? on : off, done);
  }

  off(done) {
    return this.set(off, done);
  }

  on(done) {
    return this.set(on, done);
  }

  static discover(done, uuids) {
    noble.on('discover', (peripheral) => {
      if (peripheral.advertisement.localName === advertisementName) {
        if (uuids !== undefined) {
          assert(uuids instanceof Array, 'Bolt.discover : second optional argument should be an array');
          if (uuids.indexOf(peripheral.uuid) == -1) {
            debug(`Bolt ${peripheral.uuid} not part of requested uuids`);
            return;
          }
        }
        if (Bolt.get(peripheral.uuid)) {
          return;
        }
        debug(`Bolt ${peripheral.uuid} created`);
        const bolt = new Bolt(peripheral);
        Bolt.bolts.push(bolt);
        if (done) {
          assert(typeof done === 'function', 'Bolt.discover : first argument should be a function');
          done(bolt);
        }
      }
    });

    noble.on('stateChange', (state) => {
      debug(`State changed to ${state}`);
      if (state === 'poweredOn') {
        noble.startScanning([], true);
      } else {
        noble.stopScanning();
      }
    });

    noble.on('warning', (warning) => {
      debug(`Warning sent: ${warning}`)
    });
  }

  static get(id) {
    return Bolt.bolts.filter((bolt, index) => {
      return bolt.id === id;
    })[0];
  }

  static remove(id) {
    const bolt = Bolt.get(id);
    const index = Bolt.bolts.indexOf(bolt),
          found = index >= 0;
    if (found) {
      Bolt.bolts.splice(index, 1);
    }
    return found;
  }

}

Bolt.bolts = [];

module.exports = Bolt;
