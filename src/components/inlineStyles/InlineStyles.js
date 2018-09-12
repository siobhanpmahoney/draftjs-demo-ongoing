import React from "react";
import { EditorState, Editor, RichUtils, AtomicBlockUtils } from "draft-js";
import StyleButton from "../blockStyles/StyleButton";

const highlightLabel = () => {
  return <i className="material-icons">border_color</i>
}


export const INLINE_HEADINGS = [
  { label: "U", style: "UNDERLINE"},
  { label: "I", style: "ITALIC" },
  { label: "B", style: "BOLD" },
  { label: "</>", style: "CODE" }
]

export const InlineStyles = props => {
	const { editorState, onToggle, contentState } = props;
  const key = editorState.getSelection().getStartKey();
  const sty = editorState.getCurrentInlineStyle()
  let newState = RichUtils.toggleInlineStyle(editorState, sty)

	return (
		<span className="RichEditor-controls">


			{INLINE_HEADINGS.map(type => (
				<StyleButton
					key={type.label}
					active={sty.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
          className="inline styleButton"
          id={type.style.toLowerCase()}
				/>
			))}

      <StyleButton
        key = "highlight"
        active={sty.has("HIGHLIGHT")}
        label={highlightLabel()}
        onToggle={props.onToggle}
        style="HIGHLIGHT"
        className="inline styleButton"
        id="highlight"
      />
		</span>
	);
};
