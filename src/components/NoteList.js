import React, { Component } from 'react'
import axios from 'axios'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'

export default class NoteList extends Component {

  state = {
    notes: []
  }

  getNotes = async () => {
    const res = await axios.get('https://app-notes-react.herokuapp.com/api/notes')

    this.setState({ notes: res.data })
  }

  async componentDidMount() {
    this.getNotes()
  }

  deleleteNote = async (id) => {
    const res = await axios.delete('https://app-notes-react.herokuapp.com/api/notes/' + id)

    console.log(res);
    this.getNotes()
  }

  render() {
    return (
      <div className="row">
        {
          this.state.notes.map(note => (
            <div className="col-md-4" key={note._id}>
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h5>{note.title}</h5>
                  <Link className="btn btn-secondary" to={"/edit/" + note._id}>
                    Edit
                  </Link>

                </div>
                <div className="card-body">
                  <p>{note.content}</p>
                  <p>{note.author}</p>
                  <p>{format(note.date)}</p>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => this.deleleteNote(note._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
