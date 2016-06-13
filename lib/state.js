"use strict";

const Color = require('color'),
      util = require('./util'),
      debug = require('debug')(require('../package').name);

class State {

  constructor() {
    this._buffer = new Buffer('');
  }

  get value() {
    return this._buffer.toString().replace(/,+$/, '');
  }

  set value(value) {
    const length = 18;
    const padding = ','.repeat(length);
    const string = `${value}${padding}`.substring(0, length);
    this._buffer = new Buffer(string);
  }

  get buffer() {
    return this._buffer;
  }

  set buffer(buffer) {
    this._buffer = buffer;
  }

  get rgba() {
    var r, g, b, a;
    try {
      const rgba = this.value.match(/^(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})$/).slice(1, 5);
      r = +rgba[0];
      g = +rgba[1];
      b = +rgba[2];
      a = +rgba[3];
    } catch (e) {
      r = 255;
      g = 255;
      b = 255;
      a = util.isOn(this.value) ? 100 : 0;
    }
    return [r, g, b, a];
  }

  set rgba(rgba) {
    function error(property, max) {
      if (!max) {
        max = 255;
      }
      return `State, set rgba : ${property} should be an integer between 0 and ${max}`;
    }
    util.assert(rgba[0] >= 0 && rgba[0] <= 255, error('red'));
    util.assert(rgba[1] >= 0 && rgba[1] <= 255, error('green'));
    util.assert(rgba[2] >= 0 && rgba[2] <= 255, error('blue'));
    util.assert(rgba[3] >= 0 && rgba[3] <= 100, error('alpha', 100));

    const value = rgba.join(',');
    debug(`set value with value ${value}`);
    this.value = value;
  }

  get color() {
    return new Color(`rgba(${this.rgba})`);
  }

  set color(color) {
    const rgb = color.rgb(),
          rgba = [rgb.r, rgb.g, rgb.b, this.brightness];
    debug(`set rgba with value ${rgba}`);
    this.rgba = rgba;
  }

  get hue() {
    return this.color.hue();
  }

  set hue(hue) {
    debug(`set hue with value ${hue}`);
    this.color = this.color.hue(hue);
  }

  get saturation() {
    return this.color.saturation();
  }

  set saturation(saturation) {
    debug(`set saturation with value ${saturation}`);
    this.color = this.color.saturationv(saturation);
  }

  get brightness() {
    var rgba = this.rgba;
    return rgba[rgba.length - 1];
  }

  set brightness(brightness) {
    debug(`set brightness with value ${brightness}`);
    var rgba = this.rgba;
    rgba[rgba.length - 1] = brightness;
    this.rgba = rgba;
  }

}

module.exports = State;
