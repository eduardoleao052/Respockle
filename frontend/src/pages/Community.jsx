import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useLocation } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [User, setUser] = useState(null);;
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);;
  const [communities, setCommunities] = useState(null);
  const communityId = Number(window.location.href.split("/").pop());
  const location = useLocation();

  useEffect(() => {
    getUsers();
    getLikesByUser();
    getCommunities();
    getCommunityPosts();
  },[location])

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}

  const getCommunityPosts = () => {
    api
    .get(`/api/community/${communityId}/`)
    .then((res) => res.data)
    .then((data) => {setPosts(data);console.log(data)})
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
        getCommunityPosts()
      }
      else alert("Failed to delete post!")
    }).catch((error) => alert(error))
  }

  const handleLike = (el) => {
    api.post(`/api/posts/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getCommunityPosts();
        getLikesByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  return (
    <div>
      <h2>Posts</h2>
      <p>{User ? User.username : null}</p>
      {posts.map((el,id) => 
        <div className="post-div" key={id}>
          <a key={id} href={`/detail/${el.id}`}>
          <p><b>Title: {el.title}</b></p>
          </a>
          <p>Content: {el.content}</p>
          <p>Author: {el.author_username}</p>
          <p>Likes: {el.likes}</p>
          <a href={`/community/${el.community}`}>
          <p>Community: {communities ? communities.filter((community) => community.id === el.community)[0].name : null}</p>
          </a>
          <button onClick={() => deletePost(el.id)}>Delete</button>
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
