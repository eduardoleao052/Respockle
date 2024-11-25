import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [User, setUser] = useState(null);;
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);;
  const [communities, setCommunities] = useState(null);
  const navigateTo = useNavigate()

  useEffect(() => {
    getPosts();
    getUsers();
    getLikesByUser();
    getCommunities();
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

  const getCommunities = () => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {setCommunities(data)})
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

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((el,id) => 
        <div className="post-div" key={id}>
          <button key={id} onClick={() => navigateTo(`/detail/${el.id}`)}>
          Title: {el.title}
          </button>
          <p>Content: {el.content}</p>
          <p>Author: {el.author_username}</p>
          <p>Likes: {el.likes}</p>
          <button onClick={() => navigateTo(`/community/${el.community}`)}>
          <p>Community: {communities ? communities.filter((community) => community.id === el.community)[0].name : null}</p>
          </button>
          {el.author === User?.id ? <button onClick={() => deletePost(el.id)}>Delete</button> : null}
          <button
              style={{backgroundColor: getFields(PostsLikedByUsers, 'id').includes(el.id) ? 'blue' : 'white'}} 
              onClick={() => handleLike(el)}>
              Like
          </button>
        </div>
      )}
    </div>
  )
}
