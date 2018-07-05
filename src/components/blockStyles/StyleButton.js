import React from "react";
import { EditorState, Editor, RichUtils, AtomicBlockUtils } from "draft-js";
import {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BLOCK_TYPE_HEADINGS,
  BlockStyleControls
} from "./BlockStyles";

class StyleButton extends React.Component {

  onToggle = (e) => {
    e.preventDefault()
    this.props.onToggle(this.props.style)
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }

    return (
        <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
        </span>
    );
  }
}

export default StyleButton;