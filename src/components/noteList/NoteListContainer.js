import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions'
import NoteListItem from './NoteListItem'

class NoteListContainer extends React.Component {

  componentDidMount() {
    this.props.loadAllNotes()
  }

  	componentDidUpdate(prevProps, prevState) {
      if (prevProps != this.props) {
        this.listAllNotes
      }

    }

  listAllNotes = () => {
    return this.props.notes.sort((a,b) => parseInt(a.id) - parseInt(b.id)).map((note) => {
      if (note.id != 2 && note.id !="1" && note.id !="6" && note.id !="4" && note.id != "5" && note.id != "3")
      return <NoteListItem selectNote={this.props.selectNote} id={note.id} note={note}/>
    })
  }

  render() {
    if (this.props.notes.length > 0) {
      return(
        <div className="noteListContainer">
          <span className="note-list-header">
            All Notes <button onClick={this.props.selectNote} id="new"> + </button>
        </span>

        <div className="note-list">

        <NoteListItem selectNote={this.props.selectNote} id="2" note={this.props.notes.find((n) => n.id == "2")}/>

        <NoteListItem selectNote={this.props.selectNote} id="2" note={this.props.notes.find((n) => n.id == "1")}/>

          <NoteListItem selectNote={this.props.selectNote} id="2" note={this.props.notes.find((n) => n.id == "6")}/>

          <NoteListItem selectNote={this.props.selectNote} id="2" note={this.props.notes.find((n) => n.id == "4")}/>

          <NoteListItem selectNote={this.props.selectNote} id="2" note={this.props.notes.find((n) => n.id == "5")}/>

          <NoteListItem selectNote={this.props.selectNote} id="2" note={this.props.notes.find((n) => n.id == "3")}/>



        {this.listAllNotes()}
      </div>

        </div>
      )
    } else {
      return (
        <div>No Notes Saved Yet</div>
      )
    }}
  }


function mapStateToProps(state, props) {
  return {
    notes: state.notes.allNotes,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteListContainer)
