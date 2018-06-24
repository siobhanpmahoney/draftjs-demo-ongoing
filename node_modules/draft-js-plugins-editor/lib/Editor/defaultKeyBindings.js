'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

exports.default = {
  keyBindingFn: function keyBindingFn(event) {
    return (0, _draftJs.getDefaultKeyBinding)(event);
  }
};