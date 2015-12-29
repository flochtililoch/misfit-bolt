/*jshint expr: true*/

'use strict';

var Bolt = require('.');
var sinon = require('sinon');
var chai = require('chai');

var Peripheral = require('noble/lib/peripheral');
var bolt;
var peripheral;


describe('Bolt', () => {

  before(() => {
    peripheral = new Peripheral();
    peripheral.id = 'foo';
    bolt = new Bolt(peripheral);
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

  });

  describe('#connect', () => {

    describe('without callback', () => {

      it('throws an error if first parameter is not a function', () => {
        chai.expect(() => bolt.connect()).to.throw(/Bolt#connect : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      var connectSpy, getLightSpy;

      before((done) => {
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
        chai.expect(connectSpy.calledBefore(getLightSpy));
      });

      it('then calls `getLight` on the instance object', () => {
        chai.expect(getLightSpy.calledAfter(connectSpy));
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

    var discoverLightSpy,
        characteristics = [{uuid: 'foo'}, {uuid:'fff1'}];

    before(() => {
      discoverLightSpy = sinon.sandbox.stub(peripheral, 'discoverAllServicesAndCharacteristics', (cb) => {
        cb(undefined, undefined, characteristics);
      });
    });

    describe('with `_light` not defined', () => {
      var returnedLight;
      before((done) => {
        bolt._light = undefined;
        bolt.getLight((error, light) => {
          returnedLight = light;
          done();
        });
      });

      it('calls `discoverAllServicesAndCharacteristics` on the peripheral object', () => {
        chai.expect(discoverLightSpy.called);
      });

      it('sets first characteristic as `_light` instance property', () => {
        chai.expect(bolt._light).to.deep.equal(characteristics[1]);
      });

      it('passes back the cached `_light` property', () => {
        chai.expect(returnedLight).to.equal(bolt._light);
      });
    });

    describe('with `_light` defined', () => {
      var returnedLight;
      before((done) => {
        bolt._light = 'foo';
        bolt.getLight((error, light) => {
          returnedLight = light;
          done();
        });
      });

      it('does not call `discoverAllServicesAndCharacteristics` on the peripheral object', () => {
        chai.expect(!discoverLightSpy.called);
      });

      it('passes back the cached `_light` property', () => {
        chai.expect(returnedLight).to.equal(bolt._light);
      });

    });

  });

  describe('#set', () => {

    describe('without value', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.set()
        ).to.throw(/Bolt#set : first argument should be a string of 18 chars max/);
      });

    });

    describe('with non-string value', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.set({})
        ).to.throw(/Bolt#set : first argument should be a string of 18 chars max/);
      });

    });

    describe('with value exceeding size', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.set(".".repeat(19))
        ).to.throw(/Bolt#set : first argument should be a string of 18 chars max/);
      });

    });

    describe('with valid value', () => {

      var value = 'abc';

      describe('without callback', () => {

        it('throws an error', () => {
          chai.expect(
            () => bolt.set(value)
          ).to.throw(/Bolt#set : second argument should be a function/);
        });

      });

      describe('with callback', () => {

        describe('when `_connected` is false', () => {

          before(() => {
            bolt._connected = false;
          });

          it('throws an error', () => {
            chai.expect(
              () => bolt.set(value, () => {})
            ).to.throw(/Bolt#set : bulb is not connected/);
          });

        });

        describe('when `_connected` is true', () => {

          var spy, expectedBuffer;

          before((done) => {
            bolt._connected = true;

            expectedBuffer = new Buffer(`${value},,,,,,,,,,,,,,,`);

            // stub light property, and create spy on write method
            bolt._light = {write: () => {}};
            spy = sinon.sandbox.stub(bolt._light, 'write', (buffer, withoutResponse, callback) => {
              callback();
            });

            bolt.set(value, done);
          });

          it('calls the `write` method on the light property with the correct buffer', () => {
            chai.expect(spy.called);
            chai.expect(spy.args[0][0].toString()).to.equal(expectedBuffer.toString());
          });

        });

      });

    });

  });

  describe('#setRGBA', () => {

    var expectedSetValue, spy;

    describe('when red is not in [0, 255] range', () => {
      it('throws an error', () => {
        chai.expect(
          () => bolt.setRGBA([256,0,0,0], () => {})
        ).to.throw(/Bolt#setRGBA : red should be an integer between 0 and 255/);
      });
    });

    describe('when green is not in [0, 255] range', () => {
      it('throws an error', () => {
        chai.expect(
          () => bolt.setRGBA([0,256,0,0], () => {})
        ).to.throw(/Bolt#setRGBA : green should be an integer between 0 and 255/);
      });
    });

    describe('when blue is not in [0, 255] range', () => {
      it('throws an error', () => {
        chai.expect(
          () => bolt.setRGBA([0,0,256,0], () => {})
        ).to.throw(/Bolt#setRGBA : blue should be an integer between 0 and 255/);
      });
    });

    describe('when alpha is not in [0, 100] range', () => {
      it('throws an error', () => {
        chai.expect(
          () => bolt.setRGBA([0,0,0,101], () => {})
        ).to.throw(/Bolt#setRGBA : alpha should be an integer between 0 and 100/);
      });
    });

    describe('when rgba is valid', () => {

      var spy, rgba = [100,100,100,100];

      before((done) => {
        spy = sinon.sandbox.stub(bolt, 'set', (value, cb) => {
          cb();
        });
        bolt.setRGBA(rgba, done);
      });

      it('calls #set method with the right value', () => {
        chai.expect(spy.called);
        chai.expect(spy.args[0][0]).to.equal(rgba.join(','));
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

      var spy, expectedValue, returnedValue;

      before((done) => {
        // stub light property, and create spy on read method
        bolt._light = {read: () => {}};
        expectedValue = 'foo';
        spy = sinon.sandbox.stub(bolt._light, 'read', (cb) => {
          cb(undefined, new Buffer(`${expectedValue},,,,,,,,,,,,,,,`));
        });

        bolt.get((error, value) => {
          returnedValue = value;
          done();
        });
      });

      it('calls the `read` method on the light property', () => {
        chai.expect(spy.called);
        chai.expect(returnedValue).to.equal(expectedValue);
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

      var spy, returnedValue;

      before((done) => {
        spy = sinon.sandbox.stub(bolt, 'get', (cb) => {
          cb(undefined, "123,234,345,0");
        });
        bolt.getRGBA((error, value) => {
          returnedValue = value;
          done();
        });
      });

      it('calls #get method then parses the returned value', () => {
        chai.expect(spy.called);
        chai.expect(returnedValue).to.deep.equal([123,234,345,0]);
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

      describe('when `_connected` is false', () => {

        before(() => {
          bolt._connected = false;
        });

        it('throws an error', () => {
          chai.expect(
            () => bolt.getState(() => {})
          ).to.throw(/Bolt#getState : bulb is not connected/);
        });

      });

      describe('when `_connected` is true', () => {
        var spy, getValue, returnedValue;

        before(() => {
          bolt._connected = true;
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
            chai.expect(spy.called);
          });

          it('return `false`', () => {
            chai.expect(!returnedValue);
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
            chai.expect(spy.called);
          });

          it('return `true`', () => {
            chai.expect(returnedValue);
          });

        });

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
      chai.expect(spy.called);
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
      chai.expect(spy.called);
      chai.expect(spy.args[0][0]).to.equal(expectedSetValue);
    });
  });

});
