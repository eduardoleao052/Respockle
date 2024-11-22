import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {getNotes(); getUsers();},[])

  const getNotes = () => {
    api
    .get("/api/notes/")
    .then((res) => res.data)
    .then((data) => {console.log(data);setNotes(data)})
    .catch((error) => alert(error))
  }
  const getUsers = () => {
    api
    .get("/api/notes/")
    .then((res) => res.data)
    .then((data) => {console.log(data);setNotes(data)})
    .catch((error) => alert(error))
  }

  const deleteNote = (id) => {
    console.log(id)
    api.delete(`/api/notes/delete/${id}/`).then((res) => {
      if (res.status === 204 || res.status === 200) {
        console.log("Note deleted!")
        //setNotes(n => [...n, {content,title}])
        getNotes()
      }
      else alert("Failed to delete note!")
    }).catch((error) => alert(error))
  }

  const handleMoveUp = (id) => {
    console.log(id !== 0)
    if (id !== 0) {
      const newNotes = [...notes];
      [newNotes[id],newNotes[id - 1]] = [newNotes[id -1],newNotes[id]];
      setNotes(newNotes);
    }
  }

  const handleMoveDown = (id) => {
    console.log(id !== notes.length - 1)
    if (id !== notes.length - 1) {
      const newNotes = [...notes];
      [newNotes[id],newNotes[id + 1]] = [newNotes[id + 1],newNotes[id]];
      setNotes(newNotes);
    }
  }

  const handleLike = (el) => {
    api.post(`/api/notes/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        console.log("Note liked!")
        getNotes()
      } else {
        alert("Failed to like note!")
      }
    }).catch((error) => alert(error))
  }

  const createNote = (e) => {
    e.preventDefault()
    api.post(`/api/notes/create/`, {content,title}).then((res) => {
      if (res.status === 201 || res.status === 200) {
        console.log("Note created!")
        getNotes()
      } else {
        alert("Failed to create note!")
      }
    }).catch((error) => alert(error))
    console.log(notes)
    setTitle('');
    setContent('');
  }

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((el,id) => 
        <div className="note-div" key={id}>
          <p><b>{el.title}</b></p>
          <p>{el.content}</p>
          <p>{el.likes}</p>
          <button onClick={() => deleteNote(el.id)}>Delete</button>
          <button onClick={() => handleMoveUp(id)}>Up</button>
          <button onClick={() => handleMoveDown(id)}>Down</button>
          <button onClick={() => handleLike(el)}>Like</button>
        </div>)}
      </div>
      <h2>Create Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title</label>
        <br />
        <input type="text" id="title" value={title} name="title" required onChange={(e) => setTitle(e.target.value)}/>
        <br />
        <label htmlFor="content">Content</label>
        <br />
        <textarea id="content" value={content} name="content" required onChange={(e) => setContent(e.target.value)}></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}
