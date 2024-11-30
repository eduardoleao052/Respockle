import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postPicture, setPostPicture] = useState('');
  const [community, setCommunity] = useState('')
  const [User, setUser] = useState(null);
  const [communities, setCommunities] = useState([]);
  const navigateTo = useNavigate()

  useEffect(() => {
    getUsers();
  },[])

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }

  const getUsers = () => {
    api
    .get("/api/posts/user/")
    .then((res) => res.data)
    .then((data) => {setUser(data); getCommunities(data);})
    .catch((error) => alert(error))
  }

  const getCommunities = (user) => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {setCommunities(data.filter((el) => el.members.includes(user.id)))})
    .catch((error) => alert(error))
  }

  const createPost = () => {
    if (document.getElementById("community").value === "") {
        return
    }
    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("community", community);
    if (postPicture) {
        formData.append("post_picture", postPicture); // Only add if file is selected
    }

    api.post(`/api/posts/create/`, formData).then((res) => {
      if (res.status === 201 || res.status === 200) {
        console.log('posted')
        navigateTo(`/community/${community}`)
      } else {
        alert("Failed to create post!")
      }
    }).catch((error) => alert(error))
    setTitle('');
    setContent('');
    setCommunity(null);
    setPostPicture(null);
    document.getElementById("community").value = "";
  }

  return (
    <div className='main'>
      <h2>Create Post</h2>
      <form>
        <label htmlFor="title">Title</label>
        <br />
        <input type="text" id="title" value={title} name="title" required onChange={(e) => setTitle(e.target.value)}/>
        <br />
        <label htmlFor="content">Content</label>
        <br />
        <input type="file" accept="image/*" onChange={(e) => setPostPicture(e.target.files[0])}/>
        <br />
        <textarea id="content" value={content} name="content" required onChange={(e) => setContent(e.target.value)}></textarea>
        <br />
        <label htmlFor="community">Choose a Community:</label>
            <select onChange={(e) => {setCommunity(e.target.value)}} id="community" name="community">
            <option value=""> -- select an option -- </option>
            {communities.map((el, id) => <option key={id} value={el.id} required>{el.name}</option>)}
            </select>
        <br />
      </form>
      <button onClick={createPost}>Post</button>
    </div>
  )
}
