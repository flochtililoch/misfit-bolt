"use strict";

const packageName = require('../package').name,
      Color = require('color'),
      valid = require('./util').valid,
      debug = require('debug')(`${packageName}#state`);

const DEFAULT_STATE_RE = /CLTMP 3200/,
      RIGHT_PADDING_RE = /,+$/,
      VALUE_RE = /(\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})+/,
      ALPHA_RE = /,(\d{1,3})$/,
      COLOR_SEPARATOR = ',',
      EMPTY_STRING = '',
      MAX_LENGTH = 18,
      MAX_COLOR = 255,
      MAX_ALPHA = 100,
      MAX_HUE = 360;

class State {

  constructor(id) {
    this.id = id;
    this.buffer = new Buffer(EMPTY_STRING);
    State.states.push(this);
  }

  get buffer() {
    return this._buffer;
  }

  set buffer(buffer) {
    if (!buffer) {
      buffer = new Buffer(EMPTY_STRING);
    }
    debug(`set buffer with "${buffer}"`);
    this._buffer = buffer;
  }

  get value() {
    let value = this.buffer.toString()
      .replace(RIGHT_PADDING_RE, EMPTY_STRING)
      .replace(DEFAULT_STATE_RE, [MAX_COLOR, MAX_COLOR, MAX_COLOR].join(COLOR_SEPARATOR));

    if (!value.match(VALUE_RE)) {
      debug(`current value "${value}" does not match expected pattern, using default value instead`);
      value = [MAX_COLOR, MAX_COLOR, MAX_COLOR, MAX_ALPHA].join(COLOR_SEPARATOR);
    }

    return value;
  }

  set value(value) {
    debug(`set value with "${value}"`);
    const length = MAX_LENGTH;
    const padding = COLOR_SEPARATOR.repeat(length);
    const string = `${value}${padding}`.substring(0, length);
    this.buffer = new Buffer(string);
  }

  get color() {
    const rgba = this.value.replace(ALPHA_RE, (_, alpha) => {
      return `${COLOR_SEPARATOR}${alpha / MAX_ALPHA}`;
    });
    return new Color(`rgba(${rgba})`);
  }

  set color(color) {
    debug('set color with ', color);
    const rgb = color.rgb(),
          alpha = parseInt(color.alpha() * MAX_ALPHA, 10),
          rgba = [rgb.r, rgb.g, rgb.b, alpha],
          value = rgba.join(COLOR_SEPARATOR);
    this.value = value;
  }

  get red() {
    return this.color.red();
  }

  set red(red) {
    valid('red', red, MAX_COLOR);
    debug(`set red with "${red}"`);
    this.color = this.color.red(red);
  }

  get green() {
    return this.color.green();
  }

  set green(green) {
    valid('green', green, MAX_COLOR);
    debug(`set green with "${green}"`);
    this.color = this.color.green(green);
  }

  get blue() {
    return this.color.blue();
  }

  set blue(blue) {
    valid('blue', blue, MAX_COLOR);
    debug(`set blue with "${blue}"`);
    this.color = this.color.blue(blue);
  }

  get alpha() {
    debug(`get alpha: "${this.color.alpha()}"`);
    return parseInt(this.color.alpha() * MAX_ALPHA, 10);
  }

  set alpha(alpha) {
    valid('alpha / brightness', alpha, MAX_ALPHA);
    debug(`set alpha with "${alpha}"`);
    this.color = this.color.alpha(alpha / MAX_ALPHA);
  }

  get hue() {
    return this.color.hue();
  }

  set hue(hue) {
    valid('hue', hue, MAX_HUE);
    debug(`set hue with "${hue}"`);
    this.color = this.color.hue(hue);
  }

  get saturation() {
    return this.color.saturation();
  }

  set saturation(saturation) {
    valid('saturation', saturation, MAX_ALPHA);
    debug(`set saturation with "${saturation}"`);
    this.color = this.color.saturationv(saturation);
  }

  get brightness() {
    return this.alpha;
  }

  set brightness(brightness) {
    debug(`set brightness with "${brightness}"`);
    this.alpha = brightness;
  }

  get rgba() {
    return [
      this.red,
      this.green,
      this.blue,
      this.alpha
    ];
  }

  set rgba(rgba) {
    debug(`set rgba with "${rgba}"`);
    this.red = rgba[0];
    this.green = rgba[1];
    this.blue = rgba[2];
    this.alpha = rgba[3];
  }

  get hsb() {
    return [
      this.hue,
      this.saturation,
      this.brightness
    ];
  }

  set hsb(hsb) {
    debug(`set hsb with "${hsb}"`);
    this.hue = hsb[0];
    this.saturation = hsb[1];
    this.brightness = hsb[2];
  }

  get state() {
    return this.alpha > 0;
  }

  set state(state) {
    debug(`set state with "${state}" and previous alpha set to "${this._previousAlpha}"`);
    let alpha;
    if (state) {
      alpha = this._previousAlpha || MAX_ALPHA;
    } else {
      this._previousAlpha = this.alpha;
      alpha = 0;
    }
    this.alpha = alpha;
  }

  static getState(id) {
    let state = State.states.filter((state) => {
      return state.id === id;
    })[0];
    return state ? state : new State(id);
  }

}

State.states = [];

module.exports = State;
