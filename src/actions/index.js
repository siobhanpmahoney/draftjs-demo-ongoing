export const LOAD_ALL_NOTES = 'LOAD_ALL_NOTES'
export const UPDATE_NOTE = 'UPDATE_NOTE'
export const CREATE_NOTE = 'CREATE_NOTE'

export function loadAllNotes() {
  return(dispatch) => {
    fetch('https://draftjsdemo-api.herokuapp.com//api/v1/notes')
    .then(response => response.json())
    .then(json => dispatch({
      type: LOAD_ALL_NOTES,
      payload: json
    }))
  }
}

export function createNote(noteTitle, noteContent) {
  return (dispatch) => {
    fetch('https://draftjsdemo-api.herokuapp.com//api/v1/notes',
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accepts': 'application/json'
      }, body: JSON.stringify({
        title: noteTitle,
        content: noteContent
      })
    })
    .then(response => response.json())
    .then(json => {
      dispatch({
        type: CREATE_NOTE,
        newNote: json
      })
    })
  }
}

export function updateNote(note_id, note_title, note_content) {
  return (dispatch) => {
    fetch(`https://draftjsdemo-api.herokuapp.com//api/v1/notes/${note_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accepts': 'application/json'
        },
        body: JSON.stringify({
          title: note_title,
          content: note_content
        })
      })
      .then(response => response.json())
      .then(json => dispatch({
        type: UPDATE_NOTE,
        updated_note: json
      }))
    }
  }
