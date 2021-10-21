import axios from 'axios'
import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default class CreateNote extends Component {

  state = {
    users: [],
    userSelected: "",
    title: "",
    content: "",
    date: new Date(),

    // define si actualiza
    editing: false,
    _id: ""
  }

  //monta el componente por primera vez
  async componentDidMount() {
    const res = await axios.get('https://app-notes-react.herokuapp.com/api/users')

    // recorro los usuarios para no enviar toda la data
    this.setState({
      users: res.data.map(user => user.username),
      //configura el usuario por defecto
      userSelected: res.data[0].username
    })

    //recibe parametros de otra ruta
    console.log(this.props.match.params);
    //convierte el formulario a edición
    if (this.props.match.params.id) {
      const res = await axios.get('https://app-notes-react.herokuapp.com/notes/' + this.props.match.params.id)
      console.log(res);

      this.setState({
        editing: true,
        _id: this.props.match.params.id,
        title: res.data.title,
        date: new Date(res.data.date),
        content: res.data.content,
        userSelected: res.data.author
      })
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const note = {
      title: this.state.title,
      content: this.state.content,
      author: this.state.userSelected,
      date: this.state.date
    }

    if (this.state.editing) {
      const res = await axios.put('https://app-notes-react.herokuapp.com/api/notes/' + this.state._id, note)
      console.log(res);
    }
    else {
      const res = await axios.post('https://app-notes-react.herokuapp.com/api/notes', note)
      console.log(res);
    }

    //redirige al inicio
    window.location.href = '/'
  }

  onInputChange = (event) => {
    console.log(event.target.name, event.target.value);

    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onChangeDate = (date) => {
    this.setState({ date: date })
  }

  render() {
    return (
      <div className="col-md-6 offset-md-3">
        <div className="card card-body">
          <h4>Create note</h4>

          {/* SELECT USER */}
          <div className="form-group">
            <select
              name="userSelected"
              className="form-control"
              onChange={this.onInputChange}
              value={this.state.userSelected}
            >

              {
                this.state.users.map(user =>
                  <option value={user}
                    key={user}
                  >
                    {user}
                  </option>
                )
              }
            </select>
          </div>

          {/* TITLE NOTE */}
          <div className="form-group">
            <input
              type="text"
              className="form-control" placeholder="Title"
              name="title"
              required
              onChange={this.onInputChange}
              value={this.state.title}
            />
          </div>

          {/* CONTENT NOTE */}
          <div className="form-group">
            <textarea
              name="content"
              placeholder="Content"
              className="form-control"
              required
              onChange={this.onInputChange}
              value={this.state.content}
            ></textarea>
          </div>

          {/* DATE NOTE */}
          <div className="form-group">
            <DatePicker
              className="form-control"
              selected={this.state.date}
              onChange={this.onChangeDate}
              value={this.state.date}
            />
          </div>

          <form onSubmit={this.onSubmit} >

            <button className="btn btn-primary">
              Save
            </button>

          </form>
        </div>
      </div>
    )
  }
}
