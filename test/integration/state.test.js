/*jshint expr: true*/

"use strict";

const chai = require('chai'),
      State = require('../../lib/state');

describe('State', () => {

  var state;

  describe('setters', () => {

    describe('with invalid values', () => {

      beforeEach(() => {
        state = new State();
        state.buffer = new Buffer('255,255,255,100,,,');
      });

      // Red
      it('throws error when setting red to -1', () => {
        chai.expect(() => { state.red = -1; }).to.throw('red should be an integer between 0 and 255. got -1.');
      });

      it('throws error when setting red to 256', () => {
        chai.expect(() => { state.red = 256; }).to.throw('red should be an integer between 0 and 255. got 256.');
      });

      // Green
      it('throws error when setting green to -1', () => {
        chai.expect(() => { state.green = -1; }).to.throw('green should be an integer between 0 and 255. got -1.');
      });

      it('throws error when setting green to 256', () => {
        chai.expect(() => { state.green = 256; }).to.throw('green should be an integer between 0 and 255. got 256.');
      });

      // Blue
      it('throws error when setting blue to -1', () => {
        chai.expect(() => { state.blue = -1; }).to.throw('blue should be an integer between 0 and 255. got -1.');
      });

      it('throws error when setting blue to 256', () => {
        chai.expect(() => { state.blue = 256; }).to.throw('blue should be an integer between 0 and 255. got 256.');
      });

      // Alpha
      it('throws error when setting alpha to -1', () => {
        chai.expect(() => { state.alpha = -1; }).to.throw('alpha / brightness should be an integer between 0 and 100. got -1.');
      });

      it('throws error when setting alpha to 101', () => {
        chai.expect(() => { state.alpha = 101; }).to.throw('alpha / brightness should be an integer between 0 and 100. got 101.');
      });

      // Hue
      it('throws error when setting hue to -1', () => {
        chai.expect(() => { state.hue = -1; }).to.throw('hue should be an integer between 0 and 360. got -1.');
      });

      it('throws error when setting hue to 361', () => {
        chai.expect(() => { state.hue = 361; }).to.throw('hue should be an integer between 0 and 360. got 361.');
      });

      // Saturation
      it('throws error when setting saturation to -1', () => {
        chai.expect(() => { state.saturation = -1; }).to.throw('saturation should be an integer between 0 and 100. got -1.');
      });

      it('throws error when setting saturation to 101', () => {
        chai.expect(() => { state.saturation = 101; }).to.throw('saturation should be an integer between 0 and 100. got 101.');
      });

      // Brightness
      it('throws error when setting brightness to -1', () => {
        chai.expect(() => { state.brightness = -1; }).to.throw('alpha / brightness should be an integer between 0 and 100. got -1.');
      });

      it('throws error when setting brightness to 101', () => {
        chai.expect(() => { state.brightness = 101; }).to.throw('alpha / brightness should be an integer between 0 and 100. got 101.');
      });

    });

    describe('with valid values', () => {

      beforeEach(() => {
        state = new State();
        state.buffer = new Buffer('255,255,255,100,,,');
      });

      it('sets red', () => {
        state.red = 123;
        chai.expect(state.buffer.toString()).to.equal('123,255,255,100,,,');
      });

      it('sets green', () => {
        state.green = 123;
        chai.expect(state.buffer.toString()).to.equal('255,123,255,100,,,');
      });

      it('sets blue', () => {
        state.blue = 123;
        chai.expect(state.buffer.toString()).to.equal('255,255,123,100,,,');
      });

      it('sets alpha', () => {
        state.alpha = 35;
        chai.expect(state.buffer.toString()).to.equal('255,255,255,35,,,,');
      });

      it('sets RGBA', () => {
        state.rgba = [12, 23, 34, 45];
        chai.expect(state.buffer.toString()).to.equal('12,23,34,45,,,,,,,');
      });

      it('sets hue', () => {
        state.hue = 12; // Setting hue on its own isn't enough to move RGBA. TODO: Maybe improve this test?
        chai.expect(state.buffer.toString()).to.equal('255,255,255,100,,,');
      });

      it('sets saturation', () => {
        state.saturation = 45;
        chai.expect(state.buffer.toString()).to.equal('255,140,140,100,,,');
      });

      it('sets brightness', () => {
        state.brightness = 67;
        chai.expect(state.buffer.toString()).to.equal('255,255,255,67,,,,');
      });

      it('sets HSB', () => {
        state.hsb = [123, 12, 34];
        chai.expect(state.buffer.toString()).to.equal('255,224,224,34,,,,');
      });

    });

  });

  describe('getters', () => {

    const buffer = new Buffer('12,23,34,45,,,,,,,');

    beforeEach(() => {
      state = new State();
    });

    it('gets red', () => {
      state.buffer = buffer;
      chai.expect(state.red).to.equal(12);
    });

    it('gets green', () => {
      state.buffer = buffer;
      chai.expect(state.green).to.equal(23);
    });

    it('gets blue', () => {
      state.buffer = buffer;
      chai.expect(state.blue).to.equal(34);
    });

    it('gets alpha', () => {
      state.buffer = buffer;
      chai.expect(state.alpha).to.equal(45);
    });

    it('gets RGBA', () => {
      state.buffer = buffer;
      chai.expect(state.rgba).to.deep.equal([12, 23, 34, 45]);
    });

    it('gets hue', () => {
      state.buffer = buffer;
      chai.expect(state.hue).to.equal(210);
    });

    it('gets saturation', () => {
      state.buffer = buffer;
      chai.expect(state.saturation).to.equal(48);
    });

    it('gets brightness', () => {
      state.buffer = buffer;
      chai.expect(state.brightness).to.equal(45);
    });

    it('gets HSB', () => {
      state.buffer = buffer;
      chai.expect(state.hsb).to.deep.equal([210, 48, 45]);
    });

  });

  describe('State toggles' , () => {

    before(() => {
      state = new State();
      state.buffer = new Buffer('255,255,255,100,,,');
    });

    it('turns off', () => {
      state.state = false;
      chai.expect(state.buffer.toString()).to.equal('255,255,255,0,,,,,');
    });

    it('turns back on', () => {
      state.state = true;
      chai.expect(state.buffer.toString()).to.equal('255,255,255,100,,,');
    });

    describe('brightness', () => {

      before(() => {
        state.alpha = 34;
        state.state = false;
        state.state = true;
      });

      it('remembers previous alpha', () => {
        chai.expect(state.buffer.toString()).to.equal('255,255,255,34,,,,');
      });

    });

  });

});