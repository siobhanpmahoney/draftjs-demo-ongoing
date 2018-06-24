import {
  getDefaultKeyBinding,
  RichUtils,
} from 'draft-js';

const basicTextStylePlugin = {
  keyBindingFn(event) {
    return getDefaultKeyBinding(event);
  },

  handleKeyCommand(command, editorState, { getEditorState, setEditorState}) {
    const newEditorState = RichUtils.handleKeyCommand(
      editorState, command
    );
    if (newEditorState) {
      setEditorState(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }
};

export default basicTextStylePlugin;
