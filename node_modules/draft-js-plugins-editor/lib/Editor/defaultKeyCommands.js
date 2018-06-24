'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJs = require('draft-js');

exports.default = {
  // handle delete commands
  handleKeyCommand: function handleKeyCommand(command, editorState, _ref) {
    var setEditorState = _ref.setEditorState;

    var newState = void 0;
    switch (command) {
      case 'backspace':
      case 'backspace-word':
      case 'backspace-to-start-of-line':
        newState = _draftJs.RichUtils.onBackspace(editorState);
        break;
      case 'delete':
      case 'delete-word':
      case 'delete-to-end-of-block':
        newState = _draftJs.RichUtils.onDelete(editorState);
        break;
      default:
        return 'not-handled';
    }

    if (newState != null) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }
};