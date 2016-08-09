/*jshint expr: true*/

"use strict";

const sinon = require('sinon'),
      chai = require('chai'),
      proxyquire = require('proxyquire'),
      Color = require('../mocks/color');

const State = proxyquire('../../lib/state', {
  'color': Color
});

describe('State', () => {

  var state, sandbox, spy;

  before(() => {
    state = new State();
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sinon.sandbox.restore();
  });

  describe('#constructor', () => {

    it('sets an empty string buffer', () => {
      chai.expect(state._buffer.toString()).to.equal('');
    });

  });

  describe('#buffer', () => {

    var buffer = new Buffer('foo');

    describe('getter', () => {

      before(() => {
        state._buffer = buffer;
      });

      it('retrieves internal buffer', () => {
        chai.expect(state.buffer.toString()).to.equal(buffer.toString());
      });

    });

    describe('setter', () => {

      before(() => {
        state.buffer = buffer;
      });

      it('sets internal buffer', () => {
        chai.expect(state._buffer.toString()).to.equal(buffer.toString());
      });

    });

  });

  describe('#value', () => {

    describe('getter', () => {

      describe('with invalid buffer string', () => {

        var string = "foobar,,,,";

        before(() => {
          state._buffer = new Buffer(string);
        });

        it('returns internal buffer set with default value', () => {
          chai.expect(state.value).to.equal("255,255,255,100");
        });

      });

      describe('with valid buffer string', () => {

        var string = "12,34,56,78,,,,,,,";

        before(() => {
          state._buffer = new Buffer(string);
        });

        it('returns internal buffer as a string right trimmed from commas', () => {
          chai.expect(state.value).to.equal("12,34,56,78");
        });

      });

    });

    describe('setter', () => {

      describe('with string shorter than 18 characters', () => {

        var string = "foobar";

        before(() => {
          state.value = string;
        });

        it('sets internal buffer with the string, padded with commas to be 18 characters length', () => {
          chai.expect(state._buffer.toString()).to.equal("foobar,,,,,,,,,,,,");
        });

      });

      describe('with string longer than 18 characters', () => {

        var string = "foobarfoobarfoobarfoobar";

        before(() => {
          state.value = string;
        });

        it('sets internal buffer with the string trimmed to 18 characters', () => {
          chai.expect(state._buffer.toString()).to.equal("foobarfoobarfoobar");
        });

      });

    });

  });

  describe('#color', () => {

    before(() => {
      state.value = "12,34,56,78";
    });

    describe('getter', () => {

      it('returns an instance of color initialized with the right params', () => {
        chai.expect(state.color.args[0]).to.equal('rgba(12,34,56,0.78)');
      });

    });

    describe('setter', () => {

      before(() => {
        state.color = new Color();
      });

      it('correctly sets the state value', () => {
        chai.expect(state.value).to.equal('255,255,255,100');
      });

    });

  });

});
