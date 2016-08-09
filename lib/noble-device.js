"use strict";

// This hack is to allow running tests suite in hosts without bluetooth support

let NobleDevice;

if (process.env.NODE_ENV === "test") {
  NobleDevice = function() {};
  NobleDevice.Util = require("noble-device/lib/util");
} else {
  NobleDevice = require("noble-device");
}

module.exports = NobleDevice;
