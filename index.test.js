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
    bolt = new Bolt(peripheral);
  });

  afterEach(() => {
    sinon.sandbox.restore();
  });

  describe('#constructor', () => {

    it('throws an error if first parameter is not a Peripheral instance', () => {
      chai.expect(() => new Bolt()).to.throw(/Bolt : first argument should be instance of Peripheral/);
    });

    it('sets peripheral parameter as instance property', () => {
      sinon.match(peripheral, bolt.peripheral);
    });

  });

  describe('#connect', () => {

    describe('without callback', () => {

      it('throws an error if first parameter is not a function', () => {
        chai.expect(() => bolt.connect()).to.throw(/Bolt#connect : first argument should be a function/);
      });

    });

    describe('with callback', () => {

      var connectSpy, discoverLightSpy,
          characteristics = ['foo'];

      before((done) => {
        connectSpy = sinon.stub(peripheral, 'connect', (cb) => {
          cb();
        });
        discoverLightSpy = sinon.stub(peripheral, 'discoverAllServicesAndCharacteristics', (cb) => {
          cb(undefined, undefined, characteristics);
        });
        bolt.connect(() => {
          done();
        });
      });

      it('first calls `connect` on the peripheral object', () => {
        connectSpy.calledBefore(discoverLightSpy);
      });

      it('then calls `discoverAllServicesAndCharacteristics` on the peripheral object', () => {
        discoverLightSpy.calledAfter(connectSpy);
      });

      it('sets first characteristic as `light` instance property', () => {
        sinon.match(bolt.light, characteristics[0]);
      });

    });

  });

  describe('#disconnect', () => {

    var disconnectSpy;

    before(() => {
      disconnectSpy = sinon.stub(peripheral, 'disconnect', (cb) => {
        cb();
      });
    });

    describe('without callback', () => {

      before(() => {
        bolt.disconnect();
      });

      it('calls `disconnect` on the peripheral object', () => {
        chai.expect(disconnectSpy.called).to.be.true;
      });

    });

    describe('with callback', () => {

      before((done) => {
        bolt.disconnect(() => {
          done();
        });
      });

      it('calls `disconnect` on the peripheral object', () => {
        chai.expect(disconnectSpy.called).to.be.true;
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

      var value, spy, expectedBuffer;

      before(() => {
        value = "abc";
        expectedBuffer = new Buffer("abc,,,,,,,,,,,,,,,");

        // stub light property, and create spy on write method
        bolt.light = {write: () => {}};
        spy = sinon.sandbox.stub(bolt.light, 'write');

        bolt.set(value);
      });

      it('calls the `write` method on the light property with the correct buffer', () => {
        chai.expect(spy.called);
        chai.expect(spy.args[0][0].toString()).to.equal(expectedBuffer.toString());
      });

    });

  });

  describe('#setRGBA', () => {

    var expectedSetValue, spy;

    before(() => {
      var r = 123,
          g = 345,
          b = 567,
          a = 789;
      expectedSetValue = [r,g,b,a].join(',');
      spy = sinon.sandbox.stub(bolt, 'set');
      bolt.setRGBA(r, g, b, a);
    });

    it('calls #set method with the right value', () => {
      chai.expect(spy.called);
      chai.expect(spy.args[0][0]).to.equal(expectedSetValue);
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
        bolt.light = {read: () => {}};
        expectedValue = 'foo';
        spy = sinon.sandbox.stub(bolt.light, 'read', (cb) => {
          cb(undefined, new Buffer(`${expectedValue},,,,,,,,,,,,,,,`));
        });

        bolt.get((value) => {
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
          cb("123,234,345,0");
        });
        bolt.getRGBA((value) => {
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


  describe('#on', () => {

    var expectedSetValue, spy;

    before(() => {
      expectedSetValue = 'CLTMP 3200,1';
      spy = sinon.sandbox.stub(bolt, 'set');
      bolt.on();
    });

    it('calls #set method with the right value', () => {
      chai.expect(spy.called);
      chai.expect(spy.args[0][0]).to.equal(expectedSetValue);
    });

  });

  describe('#off', () => {

  });

});
