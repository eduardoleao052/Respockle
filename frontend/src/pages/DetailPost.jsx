import React, { useEffect, useState } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";


export default function DetailPost() {
  const navigateTo = useNavigate();
  const id = Number(window.location.href.split("/").pop());
  const [post, setPost] = useState()
  const [communities, setCommunities] = useState(null);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);;

  useEffect(() => {
    getPost();
    getCommunities();
    getLikesByUser();
  },[])


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

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }

  const getPost = () => {
    api
    .get(`/api/posts/detail/${id}/`)
    .then((res) => res.data)
    .then((data) => {setPost(data)})
    .catch((error) => alert(error))
  }

  const getCommunities = () => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {setCommunities(data)})
    .catch((error) => alert(error))
  }

  const deletePost = (id) => {
    api.delete(`/api/posts/delete/${id}/`).then((res) => {
      if (res.status === 204 || res.status === 200) {
        navigateTo(-1)
      }
      else alert("Failed to delete post!")
    }).catch((error) => alert(error))
  }

  const handleLike = (el) => {
    api.post(`/api/posts/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost();
        getLikesByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  return (
    post ? 
      <div className="post-div" key={id}>
        <button onClick={() => navigateTo(-1)}>Back</button>
        <p><b>Title: {post.title}</b></p>
        <p>Content: {post.content}</p>
        <p>Author: {post.author_username}</p>
        <p>Likes: {post.likes}</p>
        <button onClick={() => navigateTo(`/community/${el.community}`)}>
        <p>Community: {communities ? communities.filter((community) => community.id === post.community)[0].name : null}</p>
        </button>        
        <button onClick={() => deletePost(post.id)}>Delete</button>
        <button
            style={{backgroundColor: getFields(PostsLikedByUsers, 'id').includes(post.id) ? 'blue' : 'white'}} 
            onClick={() => handleLike(post)}>
            Like
        </button>
      </div> : null
    )
}
