'use strict';

var debug = require('debug')('bolt');
var noble = require('noble');
var Peripheral = require('noble/lib/peripheral');

var advertisementName = 'MFBOLT';

class Bolt {

  constructor(peripheral) {
    if (!(peripheral instanceof Peripheral)) {
      throw new Error('Bolt : first argument should be instance of Peripheral');
    }
    this.peripheral = peripheral;
  }

  connect(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#connect : first argument should be a function');
    }
    debug('connecting');
    this.peripheral.connect(() => {
      debug(`connected: ${this.peripheral.uuid}`);
      this.peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
        debug('got light');
        var characteristic;
        for (var i = 0; i < characteristics.length; i ++) {
          characteristic = characteristics[i];
          if(characteristic.uuid == 'fff1') {
            this.light = characteristic;
          }
        }
        if (!characteristic) {
          throw new Error('Bolt#connect : could not find light characteristic');
        }

        done();
      });
    });
    return this;
  }

  disconnect(done) {
    debug('disconnecting');
    this.peripheral.disconnect(() => {
      debug('disconnected');
      if (typeof done == 'function') {
        done();
      }
    });
    return this;
  }

  set(value) {
    if (typeof value !== 'string' || value.length > 18) {
      throw new Error('Bolt#set : first argument should be a string of 18 chars max');
    }

    var length = 18;
    var padding = ','.repeat(length);
    var string = `${value}${padding}`.substring(0, length);
    var buffer = new Buffer(string);
    debug(`set light: ${string}`)
    this.light.write(buffer);
    return this;
  }

  setRGBA(rgba) {
    // TODO: validate rgba values.
    return this.set(rgba.join(','));
  }

  get(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#get : first argument should be a function');
    }
    debug('reading');
    this.light.read((error, buffer) => {
      debug('read');
      var string = buffer.toString();
      done(string.replace(/,+$/, ''));
    });
    return this;
  }

  getRGBA(done) {
    if (typeof done !== 'function') {
      throw new Error('Bolt#getRGBA : first argument should be a function');
    }
    this.get((value) => {
      var r, g, b, a;
      var rgba = value.match(/(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})/).slice(1, 5);
      try {
        r = +rgba[0];
        g = +rgba[1];
        b = +rgba[2];
        a = +rgba[3];
      } catch (e) {
        throw new Error('Bolt#getRGBA : cannot parse current value into RGBA');
      }
      done([r, g, b, a]);
    });
    return this;
  }

  off() {
    return this.set("CLTMP 3200,0");
  }

  on() {
    return this.set("CLTMP 3200,1");
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
