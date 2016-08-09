"use strict";

class Color {

  constructor() {
    this.args = arguments;
  }

  rgb() {
    return {r: 255, g: 255, b: 255};
  }

  alpha(value) {
    if (value !== undefined) {
      this._alpha = value;
    } else {
      return 1;
    }
  }

}

module.exports = Color;
