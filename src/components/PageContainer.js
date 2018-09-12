import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions'
import { EditorState, RichUtils, AtomicBlockUtils, SelectionState, convertToRaw, convertFromRaw, CompositeDecorator } from 'draft-js';

import Editor from 'draft-js-plugins-editor';
import { mediaBlockRenderer } from './entities/mediaBlockRenderer'
import basicTextStylePlugin from './plugins/basicTextStylePlugin';
import addLinkPlugin from './plugins/addLinkPlugin';
import createHighlightPlugin from './plugins/highlightPlugin';
import {InlineStyles} from './inlineStyles/InlineStyles'
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
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.displayedNote.content)), this.decorator())
      })
    } else {
      this.setState({
        noteTitle: "",
        editorState: EditorState.createEmpty(this.decorator())
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

  decorator = () => new CompositeDecorator([
    {
      strategy: this.linkStrategy,
      component: this.Link,
    },
  ]);

  linkStrategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  };


  Link = (props) => {
    const { contentState, entityKey } = props;
    const { url } = contentState.getEntity(entityKey).getData();
    return (
      <a
        className="link"
        rel="noopener noreferrer"
        target="_blank"
        aria-label={url}
        href={url}
        >{props.children}</a>
    );
  };

  onChange = (editorState) => {
    if (editorState.getDecorator() !== null) {
      this.setState({
        editorState,
      });
    }
  }


  submitEditor = () => {
    let displayedNote = this.props.displayedNote
    let contentState = this.state.editorState.getCurrentContent()
    let note = {title: this.state.noteTitle, content: convertToRaw(contentState)}
    if (this.state.noteTitle == "" || (note.content.blocks.length <= 1 && note.content.blocks[0].depth === 0 && note.content.blocks[0].text == "")) {
      alert("Note cannot be saved if title or content is blank")
    } else {
      note["content"] = JSON.stringify(note.content)
      this.setState({
        noteTitle: "",
        editorState: EditorState.createEmpty()
      }, () => displayedNote == "new" ? this.props.createNote(note.title, note.content) : this.props.updateNote(displayedNote.id, note.title, note.content))
    }
  }

  captureTitle = (event) => {
    event.preventDefault()
    let value = event.target.value
    this.setState({
      noteTitle: value
    })
  }

  toggleInlineStyle = (style) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style))
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
        this.onChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), linkKey))
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
    if (!this.props.displayedNote) {
      return <div>Loading...</div>
    }
    return(
      <div className="editorContainer">
        <div className="aboveEditor">




          <span className="noteTitle">
            <input type="text" placeholder="Title" name="noteTitle" className="noteTitle" value={this.state.noteTitle} onChange={this.captureTitle}/>
          </span>

          <button className="submitNote" onClick={this.submitEditor}>
            Save
          </button>

        </div>

        <div className="tool-bar">

          <button id="link_url" onClick = {this.isAddingOrUpdatingLink} className="add-link">
            <i className="material-icons">attach_file</i>
          </button>

          <button className="inline styleButton" onClick={this.onAddImage}>
            <i className="material-icons">photo</i>
          </button>

          <InlineStyles editorState={this.state.editorState} onToggle={this.toggleInlineStyle}/>



          <BlockStyleControls
            editorState={this.state.editorState}
            onToggle={this.toggleBlockType}
            />
        </div>

        <div className="editors">
          <Editor

            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}

            editorState={this.state.editorState}

            onChange= { this.onChange }
            plugins={this.plugins}
            handleKeyCommand={this.handleKeyCommand}
            blockRendererFn={mediaBlockRenderer}
            blockStyleFn={getBlockStyle}
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
