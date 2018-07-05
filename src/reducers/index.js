import { combineReducers } from 'redux';
import { LOAD_ALL_NOTES, UPDATE_NOTE, CREATE_NOTE } from '../actions'

const notes = (state = { allNotes: [], displayedNote: null }, action) => {
  switch(action.type) {
    case LOAD_ALL_NOTES:
    state = Object.assign({},
      state,
      {
        allNotes: action.payload
      }
    )
    return state;

    case CREATE_NOTE:
    console.log(action.newNote)
      let newNote = action.newNote
      let oldState = state.allNotes.slice(0)
      state = Object.assign({},
        state,
        {
          allNotes: [...oldState, newNote]
        }
      )
      return state;

    case UPDATE_NOTE:
      let updatedNoteId = action.updated_note.id
      let locateOutDatedNote = state.allNotes.find((n) => {
        return n.id == updatedNoteId
      })
      let updatedNote = action.updated_note
      let currentNotesState = state.allNotes.slice(0)
      const savedNotes = [
        ...currentNotesState.slice(0, currentNotesState.indexOf(locateOutDatedNote)),
        updatedNote,
        ...currentNotesState.slice(currentNotesState.indexOf(locateOutDatedNote) + 1)
      ]
      state = Object.assign({},
        state,
        {
          allNotes: savedNotes
        }
      )
      return state;

    default:
    return state;

  }

};

const rootReducer = combineReducers({
  notes
  // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
});

export default rootReducer;
