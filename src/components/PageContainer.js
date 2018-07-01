import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions'
import { EditorState, RichUtils, AtomicBlockUtils, convertToRaw, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { mediaBlockRenderer } from './entities/mediaBlockRenderer'
import basicTextStylePlugin from './plugins/basicTextStylePlugin';
import addLinkPlugin from './plugins/addLinkPlugin';
import createHighlightPlugin from './plugins/highlightPlugin';
import {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BlockStyleControls
} from "./blockStyles/BlockStyles";
import StyleButton from "./blockStyles/BlockStyles"


const highlightPlugin = createHighlightPlugin();

class PageContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
    }

    this.plugins = [
      addLinkPlugin,
      highlightPlugin,
      basicTextStylePlugin,
    ];

  }

  componentDidMount() {
		let displayedNote = this.props.displayedNote
		if (typeof displayedNote == "object") {
			let rawContentFromFile = displayedNote
			debugger
			this.setState({
				editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.displayedNote.content)))
			})
		} else {
			this.setState({
				noteTitle: "",
				editorState: EditorState.createEmpty()
			})
		}
	}

	componentDidUpdate(prevProps, prevState) {
    if (prevProps.displayedNote != this.props.displayedNote) {
			let displayedNote = this.props.displayedNote
			if (typeof displayedNote == "object") {
				let rawContentFromFile = displayedNote
				let persistedTitle = displayedNote.title
				this.setState({
					editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.displayedNote.content))),
					noteTitle: persistedTitle
				})
			} else {
				this.setState({
					noteTitle: "",
					editorState: EditorState.createEmpty()
				})

			}
		}
  }

  onChange = editorState => {
		this.setState({
			editorState
		});
	}


  submitEditor = () => {
		let displayedNote = this.props.displayedNote
		let contentState = this.state.editorState.getCurrentContent()
		if (displayedNote == "new") {
			let noteTitle = this.state.noteTitle
			let note = {title: noteTitle, content: convertToRaw(contentState)}
			note["content"] = JSON.stringify(note.content)
			console.log(note)
			this.props.createNote(note.title, note.content)
		} else {
			let noteTitle = this.state.noteTitle
			let note = {title: noteTitle, content: convertToRaw(contentState)}
			note["content"] = JSON.stringify(note.content)
			this.props.updateNote(displayedNote.id, note.title, note.content)
		}
	}

	captureTitle = (event) => {
		event.preventDefault()
		let value = event.target.value
		this.setState({
			noteTitle: value
		})
	}

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  onUnderlineClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
  }

  onItalicClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
  }

  onHighlight = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT'))
  }

  isAddingOrUpdatingLink = () => {
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    let url = '';
    if (linkKey != null) {
      const linkInstance = contentState.getEntity(linkKey);
      url = linkInstance.getData().url;
      const updatedLink = window.prompt('Update link-', url)
      const selection = editorState.getSelection();
      if (updatedLink == null) {
        return;
      } else if (url != updatedLink)  {
        const contentWithEntity = contentState.replaceEntityData(linkKey, { url: updatedLink });
        const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity')
        this.onChange(RichUtils.toggleLink(newEditorState, selection, linkKey))
      }
    } else {
      this.onAddLink()
    }
  }

  onAddLink = () => {
    const command = "add-link"
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const link = window.prompt('Paste the link -')
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return 'handled';
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
    const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
    return 'handled';
  }

  onURLChange = (e) => this.setState({urlValue: e.target.value});

  focus = () => this.refs.editor.focus();

  onAddImage = (e) => {
    e.preventDefault();
    const editorState = this.state.editorState;
    const urlValue = window.prompt('Paste Image Link')
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', {src: urlValue});
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity}, 'create-entity');
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }

  render() {
    console.log(this.props)
  if (!this.props.displayedNote) {
    return <div>Loading...</div>
  }
    return(
      <div className="editorContainer">
        <div className="aboveEditor">
    <div><button className="submitNote" onClick={this.submitEditor}>Save</button></div>
    <input type="text" name="noteTitle" className="noteTitle" value={this.state.noteTitle} onChange={this.captureTitle}/>
  </div>
        <div className="buttonContainer">
          <button className="inline styleButton" id="underline" onClick={this.onUnderlineClick}>
            U
          </button>

          <button className="inline styleButton" id="bold"onClick={this.onBoldClick}>
            B
          </button>

          <button className="inline styleButton" id="italic" onClick={this.onItalicClick}>
            I
          </button>

          <button className="inline styleButton" id="highlight" onClick = {this.onHighlight}>
            <i className="material-icons">border_color</i>
          </button>

          <button id="link_url" onClick = {this.isAddingOrUpdatingLink} className="add-link">
            <i className="material-icons">attach_file</i>
          </button>

          <button className="inline styleButton" onClick={this.onAddImage}>
            <i className="material-icons">photo</i>
          </button>



          <BlockStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
            />
        </div>
        <div className="editors">
          <Editor
            blockRendererFn={mediaBlockRenderer}
            blockStyleFn={getBlockStyle}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange= { this.onChange }
            plugins={this.plugins}
            ref="editor"
            />
        </div>
      </div>
    )
  }
}


function mapStateToProps(state, props) {
	return {
		notes: state.notes.allNotes,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer)
