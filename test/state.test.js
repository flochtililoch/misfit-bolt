/*jshint expr: true*/

"use strict";

const sinon = require('sinon'),
      chai = require('chai'),
      proxyquire = require('proxyquire'),
      Color = require('./mocks/color');

const State = proxyquire('../lib/state', {
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

  describe('#value', () => {

    describe('getter', () => {

      var string = "foobar,,,,";

      before(() => {
        state._buffer = new Buffer(string);
      });

      it('returns internal buffer as a string right trimmed from commas', () => {
        chai.expect(state.value).to.equal("foobar");
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

  describe('#rgba', () => {

    describe('getter', () => {

      describe('when value matches expected format', () => {

        before(() => {
          state.value = "123,456,789,012";
        });

        it('extracts separated colors and luminosity as an array', () => {
          chai.expect(state.rgba).to.deep.equal([123, 456, 789, 12]);
        });

      });

      describe('when value does not match expected format and is recognized as `on` value', () => {

        before(() => {
          state.value = "foobarbaz";
        });

        it('returns default separated colors and full luminosity as an array', () => {
          chai.expect(state.rgba).to.deep.equal([255, 255, 255, 100]);
        });

      });

      describe('when value does not match expected format and is not recognized as `on` value', () => {

        before(() => {
          state.value = "foobarbaz,0";
        });

        it('returns default separated colors and min luminosity as an array', () => {
          chai.expect(state.rgba).to.deep.equal([255, 255, 255, 0]);
        });

      });

    });

    describe('setter', () => {

      describe('when red is not in [0, 255] range', () => {
        it('throws an error', () => {
          chai.expect(
            () => state.rgba = [256,0,0,0]
          ).to.throw(/State, set rgba : red should be an integer between 0 and 255/);
        });
      });

      describe('when green is not in [0, 255] range', () => {
        it('throws an error', () => {
          chai.expect(
            () => state.rgba = [0,256,0,0]
          ).to.throw(/State, set rgba : green should be an integer between 0 and 255/);
        });
      });

      describe('when blue is not in [0, 255] range', () => {
        it('throws an error', () => {
          chai.expect(
            () => state.rgba = [0,0,256,0]
          ).to.throw(/State, set rgba : blue should be an integer between 0 and 255/);
        });
      });

      describe('when alpha is not in [0, 100] range', () => {
        it('throws an error', () => {
          chai.expect(
            () => state.rgba = [0,0,0,101]
          ).to.throw(/State, set rgba : alpha should be an integer between 0 and 100/);
        });
      });

      describe('when rgba is valid', () => {

        var rgba = [100,100,100,100];

        before(() => {
          state.rgba = rgba;
        });

        it('sets value', () => {
          chai.expect(state.value).to.equal(rgba.join(','));
        });

      });

    });

  });

  describe('Color related methods', () => {

    var color;

    describe('#color', () => {

      describe('getter', () => {

        const rgba = [1, 2, 3, 4];

        before(() => {
          state.rgba = rgba;
          color = state.color;
        });

        it('returns an instance of `Color`', () => {
          chai.expect(color).to.be.instanceof(Color);
        });

        it('is instanciated with value of rgba', () => {
          chai.expect(color.args.length).to.equal(1);
          chai.expect(color.args[0]).to.equal(`rgba(${rgba.join(',')})`);
        });

      });

      describe('setter', () => {

        const rgb = {r:5, g:6, b:7};

        before(() => {
          color = new Color();
          spy = sandbox.stub(color, 'rgb', () => { return rgb; });
          state.brightness = 32;
          state.color = color;
        });

        it('sets rgba property using rgb from color', () => {
          chai.expect(spy.calledOnce).to.be.true;
        });

        it('sets rgba property with color details and internal brightness', () => {
          chai.expect(state.rgba).to.deep.equal([rgb.r, rgb.g, rgb.b,state.brightness]);
        });

      });

    });

    describe('#hue', () => {

      const hue = "hue";

      describe('getter', () => {

        var returnedHue;

        before(() => {
          spy = sandbox.stub(Color.prototype, 'hue', () => {
            return hue;
          });
          returnedHue = state.hue;
        });

        it('returns value from color.hue', () => {
          chai.expect(spy.calledOnce).to.be.true;
          chai.expect(returnedHue).to.equal(hue);
        });

      });

      describe('setter', () => {

        // TODO

      });

    });

    describe('#saturation', () => {

      const saturation = "saturation";

      describe('getter', () => {

        var returnedSaturation;

        before(() => {
          spy = sandbox.stub(Color.prototype, 'saturation', () => {
            return saturation;
          });
          returnedSaturation = state.saturation;
        });

        it('returns value from color.saturation', () => {
          chai.expect(spy.calledOnce).to.be.true;
          chai.expect(returnedSaturation).to.equal(saturation);
        });

      });

      describe('setter', () => {

        // TODO

      });

    });

  });

  describe('#brightness', () => {

    describe('getter', () => {

      const rgba = [0, 0, 0, 27];
      var returnedBrightness;

      before(() => {
        state.rgba = rgba;
        returnedBrightness = state.brightness;
      });

      it('returns last value of rgba array', () => {
        chai.expect(returnedBrightness).to.equal(rgba[3]);
      });

    });

    describe('setter', () => {

      // TODO

    });

  });

});
