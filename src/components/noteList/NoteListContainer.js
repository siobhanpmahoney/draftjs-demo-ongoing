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
        this.props.loadAllNotes
      }

    }



  render() {
    if (this.props.notes.length > 0) {
      return(
        <div className="noteListContainer">
          <span className="note-list-header">All Notes <button onClick={this.props.selectNote} id="new"> + </button></span>
          {this.props.notes.map((note) => {
            return <NoteListItem selectNote={this.props.selectNote} id={note.id} note={note}/>
          })}

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
