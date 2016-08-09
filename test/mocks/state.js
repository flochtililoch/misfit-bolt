"use strict";

class State {
  set rgba(rgba) {
    this._rgba = rgba;
  }
  get rgba() {
    return this._rgba;
  }
  set hue(hue) {
    this._hue = hue;
  }
  get hue() {
    return this._hue;
  }
  set saturation(saturation) {
    this._saturation = saturation;
  }
  get saturation() {
    return this._saturation;
  }
  set brightness(brightness) {
    this._brightness = brightness;
  }
  get brightness() {
    return this._brightness;
  }
}

module.exports = State;
