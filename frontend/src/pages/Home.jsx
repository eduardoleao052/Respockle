import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [User, setUser] = useState(null);;
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);;

  useEffect(() => {
    getPosts();
    getUsers();
    getLikesByUser();
  },[])

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}

  const getPosts = () => {
    api
    .get("/api/posts/")
    .then((res) => res.data)
    .then((data) => {setPosts(data)})
    .catch((error) => alert(error))
  }

  const getUsers = () => {
    api
    .get("/api/posts/user/")
    .then((res) => res.data)
    .then((data) => {setUser(data)})
    .catch((error) => alert(error))
  }

  const getLikesByUser = () => {
    api
    .get(`/api/posts/posts_liked_by_user/`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== PostsLikedByUsers) {
        setPostsLikedByUsers(data)
      }
    }) 
    .catch((error) => alert(error))
  }

  const deletePost = (id) => {
    api.delete(`/api/posts/delete/${id}/`).then((res) => {
      if (res.status === 204 || res.status === 200) {
        getPosts()
      }
      else alert("Failed to delete post!")
    }).catch((error) => alert(error))
  }

  const handleMoveUp = (id) => {
    if (id !== 0) {
      const newPosts = [...posts];
      [newPosts[id],newPosts[id - 1]] = [newPosts[id -1],newPosts[id]];
      setPosts(newPosts);
    }
  }

  const handleMoveDown = (id) => {
    if (id !== posts.length - 1) {
      const newPosts = [...posts];
      [newPosts[id],newPosts[id + 1]] = [newPosts[id + 1],newPosts[id]];
      setPosts(newPosts);
    }
  }

  const handleLike = (el) => {
    api.post(`/api/posts/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPosts();
        getLikesByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const createPost = (e) => {
    e.preventDefault()
    api.post(`/api/posts/create/`, {content,title}).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPosts()
      } else {
        alert("Failed to create post!")
      }
    }).catch((error) => alert(error))
    setTitle('');
    setContent('');
  }

  return (
    <div>
      <div>
        <h2>Posts</h2>
        <p>{User ? User.username : null}</p>
        {posts.map((el,id) => 
        <div className="post-div" key={id}>
          <p><b>{el.title}</b></p>
          <p>{el.content}</p>
          <p>{el.author_username}</p>
          <p>{el.likes}</p>
          <button onClick={() => deletePost(el.id)}>Delete</button>
          <button onClick={() => handleMoveUp(id)}>Up</button>
          <button onClick={() => handleMoveDown(id)}>Down</button>
          <button
              style={{backgroundColor: getFields(PostsLikedByUsers, 'id').includes(el.id) ? 'blue' : 'white'}} 
              onClick={() => handleLike(el)}>Like</button>
        </div>)}
      </div>
      <h2>Create Post</h2>
      <form onSubmit={createPost}>
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
