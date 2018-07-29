import React from "react";
import { EditorState, Editor, RichUtils, AtomicBlockUtils } from "draft-js";
import StyleButton from "./StyleButton";
import HeadingStyleDropDown from './HeadingStyleDropDown'


export const styleMap = {
	CODE: {
		fontFamily: '"Andale Mono", "Menlo", "Consolas", monospace',
		fontSize: 14,
		padding: 2,
		color: '#ff595a'
	},


};



export function getBlockStyle(block) {
	switch (block.getType()) {
		case "blockquote":
			return "RichEditor-blockquote";

		case "code-block":
			return "code-block";
		default:
			return null;
	}
}

export const BLOCK_TYPES = [
	{ label: " “ ” ", style: "blockquote" },
	{ label: "UL", style: "unordered-list-item" },
	{ label: "OL", style: "ordered-list-item" },
	{ label: "{ }", style: "code-block" }
];

export const BLOCK_TYPE_HEADINGS = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" }
]

export const BlockStyleControls = props => {
	const { editorState } = props;
	const selection = editorState.getSelection();
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType();

	return (
		<span className="RichEditor-controls">

      <HeadingStyleDropDown blockTypeHeadings={BLOCK_TYPE_HEADINGS} active={blockType} onToggle={props.onToggle} />

			{BLOCK_TYPES.map(type => (
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</span>
	);
};
