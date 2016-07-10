/*jshint expr: true*/

"use strict";

const sinon = require('sinon'),
      chai = require('chai'),
      proxyquire = require('proxyquire'),
      Peripheral = require('../mocks/peripheral'),
      State = require('../mocks/state');

var bolt,
    peripheral;

const Bolt = proxyquire('../../', {
  '../../lib/state': State
});

describe('Bolt', () => {

  before(() => {
    bolt = new Bolt(new Peripheral());
    bolt.state = new State();
  });

  afterEach(() => {
    sinon.sandbox.restore();
  });

  describe('#constructor', () => {

    it('holds a new state instance', () => {
      chai.expect(bolt.state).to.be.instanceof(State);
    });

  });

  describe('#getRGBA', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getRGBA()
        ).to.throw(/undefined should be a function/);
      });

    });

    describe('with callback', () => {

      var spy;

      before(() => {
        spy = sinon.sandbox.stub(bolt, '_readStateValue', (cb) => {
          cb();
        });
        bolt.getRGBA(() => {});
      });

      it('calls internal getter', () => {
        chai.expect(spy.called).to.be.true;
      });

    });

  });

  describe('#setRGBA', () => {

    var rgba = 'rgba', spy;

    before(() => {
      spy = sinon.sandbox.stub(bolt, '_writeStateValue', (cb) => {
        cb();
      });
      bolt.setRGBA(rgba, () => {});
    });

    it('sets state rgba property', () => {
      chai.expect(bolt.state.rgba).to.equal(rgba);
    });

    it('calls internal setter with state value', () => {
      chai.expect(spy.called).to.be.true;
    });

  });

  describe('#getHue', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getHue()
        ).to.throw(/undefined should be a function/);
      });

    });

    describe('with callback', () => {

      var spy;

      before(() => {
        spy = sinon.sandbox.stub(bolt, '_readStateValue', (cb) => {
          cb();
        });
        bolt.getHue(() => {});
      });

      it('calls internal getter', () => {
        chai.expect(spy.called).to.be.true;
      });

    });

  });

  describe('#setHue', () => {

    var hue = 'hue', spy;

    before(() => {
      spy = sinon.sandbox.stub(bolt, '_writeStateValue', (cb) => {
        cb();
      });
      bolt.setHue(hue, () => {});
    });

    it('sets state hue property', () => {
      chai.expect(bolt.state.hue).to.equal(hue);
    });

    it('calls internal setter with state value', () => {
      chai.expect(spy.called).to.be.true;
    });

  });

  describe('#getSaturation', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getSaturation()
        ).to.throw(/undefined should be a function/);
      });

    });

    describe('with callback', () => {

      var spy;

      before(() => {
        spy = sinon.sandbox.stub(bolt, '_readStateValue', (cb) => {
          cb();
        });
        bolt.getSaturation(() => {});
      });

      it('calls internal getter', () => {
        chai.expect(spy.called).to.be.true;
      });

    });

  });

  describe('#setSaturation', () => {

    var saturation = 'saturation', spy;

    before(() => {
      spy = sinon.sandbox.stub(bolt, '_writeStateValue', (cb) => {
        cb();
      });
      bolt.setSaturation(saturation, () => {});
    });

    it('sets state saturation property', () => {
      chai.expect(bolt.state.saturation).to.equal(saturation);
    });

    it('calls internal setter with state value', () => {
      chai.expect(spy.called).to.be.true;
    });

  });

  describe('#getBrightness', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getBrightness()
        ).to.throw(/undefined should be a function/);
      });

    });

    describe('with callback', () => {

      var spy;

      before(() => {
        spy = sinon.sandbox.stub(bolt, '_readStateValue', (cb) => {
          cb();
        });
        bolt.getBrightness(() => {});
      });

      it('calls internal getter', () => {
        chai.expect(spy.called).to.be.true;
      });

    });

  });

  describe('#setBrightness', () => {

    var brightness = 'brightness', spy;

    before(() => {
      spy = sinon.sandbox.stub(bolt, '_writeStateValue', (cb) => {
        cb();
      });
      bolt.setBrightness(brightness, () => {});
    });

    it('sets state brightness property', () => {
      chai.expect(bolt.state.brightness).to.equal(brightness);
    });

    it('calls internal setter with state value', () => {
      chai.expect(spy.called).to.be.true;
    });

  });

  describe('#getState', () => {

    describe('without callback', () => {

      it('throws an error', () => {
        chai.expect(
          () => bolt.getState()
        ).to.throw(/undefined should be a function/);
      });

    });

    describe('with callback', () => {

      var spy;

      before(() => {
        spy = sinon.sandbox.stub(bolt, '_readStateValue', (cb) => {
          cb();
        });
        bolt.getState(() => {});
      });

      it('calls internal getter', () => {
        chai.expect(spy.called).to.be.true;
      });

    });

  });

  describe('#setState', () => {

    var state = 'state', spy;

    before(() => {
      spy = sinon.sandbox.stub(bolt, '_writeStateValue', (cb) => {
        cb();
      });
      bolt.setState(state, () => {});
    });

    it('sets state state property', () => {
      chai.expect(bolt.state.state).to.equal(state);
    });

    it('calls internal setter with state value', () => {
      chai.expect(spy.called).to.be.true;
    });

  });

});
