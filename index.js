'use strict'

var noble = require('noble');
var events = require('events');

function startScanning() {
  noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
      noble.startScanning();
    } else {
      noble.stopScanning();
    }
  });
}

function pad(str) {
  return String(`${str},,,,,,,,,,,,,,,,,`).substring(0, 18);
}

class Bolt {
  constructor(peripheral, services, characteristics) {
    this.peripheral = peripheral;
    this.services = services;
    this.characteristics = characteristics;
  }

  static discover(handler) {
    if (typeof handler !== 'function') {
      throw new Error('Bolt.discover : first argument should be a function');
    }
    noble.on('discover', function(peripheral) {
      if (peripheral.advertisement.localName == 'MFBOLT') {
        peripheral.connect(function(error) {
          peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
            handler(new Bolt(peripheral, services, characteristics));
          })
        });
      }
    });
    startScanning();
  }

  set(value) {
    this.characteristics[0].write(new Buffer(pad(value)));
  }

  off() {
    this.set("CLTMP 3200,0");
  }

  on() {
    this.set("CLTMP 3200,1");
  }

  pink() {
    this.set("255,80,110,50");
  }

  orange() {
    this.set("255,100,0,40")
  }

  silver() {
    this.set("110,80,255,80")
  }

  magenta() {
    this.set("255,0,255,80")
  }

  green() {
    this.set("50,255,0,50")
  }

}
