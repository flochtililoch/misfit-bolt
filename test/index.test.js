/*jshint expr: true*/

"use strict";

const sinon = require('sinon'),
      chai = require('chai'),
      proxyquire = require('proxyquire'),
      Peripheral = require('noble/lib/peripheral'),
      State = require('./mocks/state');

var bolt,
    peripheral;

const Bolt = proxyquire('../', {
  '../lib/state': State
});

describe('Bolt', () => {

  before(() => {
    peripheral = new Peripheral();
    peripheral.id = 'foo';
    bolt = new Bolt(peripheral);
    bolt.state = new State();
  });

  afterEach(() => {
    sinon.sandbox.restore();
  });

  describe('#constructor', () => {

    it('throws an error if first parameter is not a Peripheral instance', () => {
      chai.expect(() => new Bolt()).to.throw(/Bolt : first argument should be instance of Peripheral/);
    });

    it('sets `peripheral.uuid` as `id` instance property', () => {
      chai.expect(peripheral.uuid).to.equal(bolt.id);
    });

    it('sets `peripheral` parameter as instance property', () => {
      chai.expect(peripheral).to.equal(bolt.peripheral);
    });

    it('holds a new state instance', () => {
      chai.expect(bolt.state).to.be.instanceof(State);
    });

  });

  describe('#connect', () => {

    describe('without callback', () => {

      it('throws an error if first parameter is not a function', () => {
        chai.expect(() => bolt.connect()).to.throw(/Bolt#connect : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when not already connected', () => {

        var connectSpy, getLightSpy;

        before((done) => {
          bolt.connected = false;
          connectSpy = sinon.sandbox.stub(peripheral, 'connect', (cb) => {
            cb();
          });
          getLightSpy = sinon.sandbox.stub(bolt, 'getLight', (cb) => {
            cb();
          });
          bolt.connect(() => {
            done();
          });
        });

        it('first calls `connect` on the peripheral object', () => {
          chai.expect(connectSpy.calledBefore(getLightSpy)).to.be.true;
        });

        it('then calls `getLight` on the instance object', () => {
          chai.expect(getLightSpy.calledAfter(connectSpy)).to.be.true;
        });

      });

      describe('when already connected', () => {

        var connectSpy, getLightSpy;

        before((done) => {
          bolt.connected = true;
          connectSpy = sinon.sandbox.stub(peripheral, 'connect', (cb) => {
            cb();
          });
          getLightSpy = sinon.sandbox.stub(bolt, 'getLight', (cb) => {
            cb();
          });
          bolt.connect(() => {
            done();
          });
        });

        it('does not call `connect` on the peripheral object', () => {
          chai.expect(connectSpy.called).to.be.false;
        });

        it('then calls `getLight` on the instance object', () => {
          chai.expect(getLightSpy.called).to.be.true;
        });

      });

    });

  });

  describe('#disconnect', () => {

    describe('without callback', () => {

      it('throws an error if first parameter is not a function', () => {
        chai.expect(() => bolt.connect()).to.throw(/Bolt#connect : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      var disconnectSpy;

      before((done) => {
        disconnectSpy = sinon.sandbox.stub(peripheral, 'disconnect', (cb) => {
          cb();
        });
        bolt.disconnect(() => {
          done();
        });
      });

      it('calls `disconnect` on the peripheral object', () => {
        chai.expect(disconnectSpy.called).to.be.true;
      });

    });

  });

  describe('#getLight', () => {

    describe('with `light` not defined', () => {

      var discoverLightSpy, returnedLight,
          characteristics = [{uuid: 'foo'}, {uuid:'fff1'}];

      before((done) => {
        bolt.light = undefined;
        discoverLightSpy = sinon.sandbox.stub(peripheral, 'discoverAllServicesAndCharacteristics', (cb) => {
          cb(undefined, undefined, characteristics);
        });
        bolt.getLight((error, light) => {
          returnedLight = light;
          done();
        });
      });

      it('calls `discoverAllServicesAndCharacteristics` on the peripheral object', () => {
        chai.expect(discoverLightSpy.called).to.be.true;
      });

      it('sets first characteristic as `light` instance property', () => {
        chai.expect(bolt.light).to.deep.equal(characteristics[1]);
      });

      it('passes back the cached `light` property', () => {
        chai.expect(returnedLight).to.equal(bolt.light);
      });
    });

    describe('with `light` defined', () => {

      var discoverLightSpy, returnedLight;

      before((done) => {
        bolt.light = 'foo';
        discoverLightSpy = sinon.sandbox.spy(peripheral, 'discoverAllServicesAndCharacteristics');
        bolt.getLight((error, light) => {
          returnedLight = light;
          done();
        });
      });

      it('does not call `discoverAllServicesAndCharacteristics` on the peripheral object', () => {
        chai.expect(discoverLightSpy.called).to.be.false;
      });

      it('passes back the cached `light` property', () => {
        chai.expect(returnedLight).to.equal(bolt.light);
      });

    });

  });

  describe('#get', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.get()
        ).to.throw(/Bolt#get : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when `connected` is false', () => {

        before(() => {
          bolt.connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.getRGBA(() => {})
          ).to.throw(/Bolt#getRGBA : bulb is not connected/);
        });

      });

      describe('when `connected` is true', () => {

        var spy, expectedBuffer, returnedValue;

        before((done) => {
          bolt.connected = true;
          // stub light property, and create spy on read method
          bolt.light = {read: () => {}};
          bolt.state.value = 'foo';
          expectedBuffer = new Buffer('abc');
          spy = sinon.sandbox.stub(bolt.light, 'read', (cb) => {
            cb(undefined, expectedBuffer);
          });

          bolt.get((error, value) => {
            returnedValue = value;
            done();
          });
        });

        it('sets state buffer with read value', () => {
          chai.expect(bolt.state.buffer.toString()).to.equal(expectedBuffer.toString());
        });

        it('calls the `read` method on the light property and returns state value', () => {
          chai.expect(spy.called).to.be.true;
          chai.expect(returnedValue).to.equal(bolt.state.value);
        });

      });

    });

  });

  describe('#set', () => {

    var value = 'abc';

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.set(value)
        ).to.throw(/Bolt#set : second argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when `connected` is false', () => {

        before(() => {
          bolt.connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.set(value, () => {})
          ).to.throw(/Bolt#set : bulb is not connected/);
        });

      });

      describe('when `connected` is true', () => {

        var spy, expectedBuffer;

        before((done) => {
          bolt.connected = true;
          bolt.state.buffer = new Buffer('abc');

          // stub light property, and create spy on write method
          bolt.light = {write: () => {}};
          spy = sinon.sandbox.stub(bolt.light, 'write', (buffer, withoutResponse, callback) => {
            callback();
          });

          bolt.set(value, done);
        });

        it('calls the `write` method on the light property with the state buffer', () => {
          chai.expect(spy.called).to.be.true;
          chai.expect(spy.args[0][0].toString()).to.equal(bolt.state.buffer.toString());
        });

        it('sets the value on the state object', () => {
          chai.expect(bolt.state.value).to.equal(value);
        });

      });

    });

  });

  describe('#getRGBA', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getRGBA()
        ).to.throw(/Bolt#getRGBA : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when `connected` is false', () => {

        before(() => {
          bolt.connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.getRGBA(() => {})
          ).to.throw(/Bolt#getRGBA : bulb is not connected/);
        });

      });

      describe('when `connected` is true', () => {

        var spy;

        before(() => {
          bolt.connected = true;
          spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
            cb();
          });
          bolt.getRGBA(() => {});
        });

        it('calls internal getter', () => {
          chai.expect(spy.called).to.be.true;
        });

      });

    });

  });

  describe('#setRGBA', () => {

    var rgba = 'rgba';

    describe('when `connected` is false', () => {

      before(() => {
        bolt.connected = false;
      });

      it('throws an error', () => {
        chai.expect(
          () => bolt.setRGBA(rgba, () => {})
        ).to.throw(/Bolt#setRGBA : bulb is not connected/);
      });

    });

    describe('when `connected` is true', () => {

      var spy;

      before(() => {
        bolt.connected = true;
        bolt.state.value = "foo";
        spy = sinon.sandbox.stub(bolt, 'set', (value, cb) => {
          chai.expect(value).to.equal(bolt.state.value);
          cb();
        });
        bolt.setRGBA(rgba, () => {});
      });

      it('sets state rgba property', () => {
        chai.expect(bolt.state.rgba).to.equal(rgba);
      });

      it('calls internal setter with state value', () => {
        chai.expect(spy.called).to.be.true;
        chai.expect(spy.args[0][0]).to.equal(bolt.state.value);
      });

    });

  });

  describe('#getHue', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getHue()
        ).to.throw(/Bolt#getHue : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when `connected` is false', () => {

        before(() => {
          bolt.connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.getHue(() => {})
          ).to.throw(/Bolt#getHue : bulb is not connected/);
        });

      });

      describe('when `connected` is true', () => {

        var spy;

        before(() => {
          bolt.connected = true;
          spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
            cb();
          });
          bolt.getHue(() => {});
        });

        it('calls internal getter', () => {
          chai.expect(spy.called).to.be.true;
        });

      });

    });

  });

  describe('#setHue', () => {

    var hue = 'hue';

    describe('when `connected` is false', () => {

      before(() => {
        bolt.connected = false;
      });

      it('throws an error', () => {
        chai.expect(
          () => bolt.setHue(hue, () => {})
        ).to.throw(/Bolt#setHue : bulb is not connected/);
      });

    });

    describe('when `connected` is true', () => {

      var spy;

      before(() => {
        bolt.connected = true;
        bolt.state.value = "foo";
        spy = sinon.sandbox.stub(bolt, 'set', (value, cb) => {
          chai.expect(value).to.equal(bolt.state.value);
          cb();
        });
        bolt.setHue(hue, () => {});
      });

      it('sets state hue property', () => {
        chai.expect(bolt.state.hue).to.equal(hue);
      });

      it('calls internal setter with state value', () => {
        chai.expect(spy.called).to.be.true;
        chai.expect(spy.args[0][0]).to.equal(bolt.state.value);
      });

    });

  });

  describe('#getSaturation', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getSaturation()
        ).to.throw(/Bolt#getSaturation : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when `connected` is false', () => {

        before(() => {
          bolt.connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.getSaturation(() => {})
          ).to.throw(/Bolt#getSaturation : bulb is not connected/);
        });

      });

      describe('when `connected` is true', () => {

        var spy;

        before(() => {
          bolt.connected = true;
          spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
            cb();
          });
          bolt.getSaturation(() => {});
        });

        it('calls internal getter', () => {
          chai.expect(spy.called).to.be.true;
        });

      });

    });

  });

  describe('#setSaturation', () => {

    var saturation = 'saturation';

    describe('when `connected` is false', () => {

      before(() => {
        bolt.connected = false;
      });

      it('throws an error', () => {
        chai.expect(
          () => bolt.setSaturation(saturation, () => {})
        ).to.throw(/Bolt#setSaturation : bulb is not connected/);
      });

    });

    describe('when `connected` is true', () => {

      var spy;

      before(() => {
        bolt.connected = true;
        bolt.state.value = "foo";
        spy = sinon.sandbox.stub(bolt, 'set', (value, cb) => {
          chai.expect(value).to.equal(bolt.state.value);
          cb();
        });
        bolt.setSaturation(saturation, () => {});
      });

      it('sets state saturation property', () => {
        chai.expect(bolt.state.saturation).to.equal(saturation);
      });

      it('calls internal setter with state value', () => {
        chai.expect(spy.called).to.be.true;
        chai.expect(spy.args[0][0]).to.equal(bolt.state.value);
      });

    });

  });

  describe('#getBrightness', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getBrightness()
        ).to.throw(/Bolt#getBrightness : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when `connected` is false', () => {

        before(() => {
          bolt.connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.getBrightness(() => {})
          ).to.throw(/Bolt#getBrightness : bulb is not connected/);
        });

      });

      describe('when `connected` is true', () => {

        var spy;

        before(() => {
          bolt.connected = true;
          spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
            cb();
          });
          bolt.getBrightness(() => {});
        });

        it('calls internal getter', () => {
          chai.expect(spy.called).to.be.true;
        });

      });

    });

  });

  describe('#setBrightness', () => {

    var brightness = 'brightness';

    describe('when `connected` is false', () => {

      before(() => {
        bolt.connected = false;
      });

      it('throws an error', () => {
        chai.expect(
          () => bolt.setBrightness(brightness, () => {})
        ).to.throw(/Bolt#setBrightness : bulb is not connected/);
      });

    });

    describe('when `connected` is true', () => {

      var spy;

      before(() => {
        bolt.connected = true;
        bolt.state.value = "foo";
        spy = sinon.sandbox.stub(bolt, 'set', (value, cb) => {
          chai.expect(value).to.equal(bolt.state.value);
          cb();
        });
        bolt.setBrightness(brightness, () => {});
      });

      it('sets state brightness property', () => {
        chai.expect(bolt.state.brightness).to.equal(brightness);
      });

      it('calls internal setter with state value', () => {
        chai.expect(spy.called).to.be.true;
        chai.expect(spy.args[0][0]).to.equal(bolt.state.value);
      });

    });

  });

  describe('#getState', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getState()
        ).to.throw(/Bolt#getState : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      describe('when `connected` is false', () => {

        before(() => {
          bolt.connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.getState(() => {})
          ).to.throw(/Bolt#getState : bulb is not connected/);
        });

      });

      describe('when `connected` is true', () => {
        var spy, getValue, returnedValue;

        before(() => {
          bolt.connected = true;
        });

        describe('when get returns `CLTMP 3200,0`', () => {

          before((done) => {
            spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
              cb(undefined, 'CLTMP 3200,0');
            });
            bolt.getState((error, value) => {
              returnedValue = value;
              done();
            });
          });

          it('calls #get method', () => {
            chai.expect(spy.called).to.be.true;
          });

          it('return `false`', () => {
            chai.expect(returnedValue).to.be.false;
          });

        });

        describe('when get returns `CLTMP 3200,100`', () => {

          before((done) => {
            spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
              cb(undefined, 'CLTMP 3200,100');
            });
            bolt.getState((error, value) => {
              returnedValue = value;
              done();
            });
          });

          it('calls #get method', () => {
            chai.expect(spy.called).to.be.true;
          });

          it('return `true`', () => {
            chai.expect(returnedValue).to.be.true;
          });

        });

        describe('when light brightness is set', () => {

          before((done) => {
            spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
              cb(undefined, '255,255,255,1');
            });
            bolt.getState((error, value) => {
              returnedValue = value;
              done();
            });
          });

          it('calls #get method', () => {
            chai.expect(spy.called).to.be.true;
          });

          it('return `true`', () => {
            chai.expect(returnedValue).to.be.true;
          });

        });

      });

    });

  });

  describe('#setState', () => {

    describe('with state = `true`', () => {

      var expectedSetValue, spy;

      before(() => {
        expectedSetValue = 'CLTMP 3200,0';
        spy = sinon.sandbox.stub(bolt, 'set');
        bolt.off();
      });

      it('calls #set method with the right value', () => {
        chai.expect(spy.called).to.be.true;
        chai.expect(spy.args[0][0]).to.equal(expectedSetValue);
      });

    });

    describe('with state = `false`', () => {

      var expectedSetValue, spy;

      before(() => {
        expectedSetValue = 'CLTMP 3200,0';
        spy = sinon.sandbox.stub(bolt, 'set');
        bolt.off();
      });

      it('calls #set method with the right value', () => {
        chai.expect(spy.called).to.be.true;
        chai.expect(spy.args[0][0]).to.equal(expectedSetValue);
      });

    });

  });

  describe('#on', () => {

    var expectedSetValue, spy;

    before(() => {
      expectedSetValue = 'CLTMP 3200,100';
      spy = sinon.sandbox.stub(bolt, 'set');
      bolt.on();
    });

    it('calls #set method with the right value', () => {
      chai.expect(spy.called).to.be.true;
      chai.expect(spy.args[0][0]).to.equal(expectedSetValue);
    });

  });

  describe('#off', () => {

    var expectedSetValue, spy;

    before(() => {
      expectedSetValue = 'CLTMP 3200,0';
      spy = sinon.sandbox.stub(bolt, 'set');
      bolt.off();
    });

    it('calls #set method with the right value', () => {
      chai.expect(spy.called).to.be.true;
      chai.expect(spy.args[0][0]).to.equal(expectedSetValue);
    });
  });

});
