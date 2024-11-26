import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate, useLocation } from 'react-router-dom';

export default function Community({setTrigger}) {
  const [posts, setPosts] = useState([]);
  const [User, setUser] = useState(null);;
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [usersInCommunity, setUsersInCommunity] = useState(null);
  const [communities, setCommunities] = useState(null);
  const communityId = Number(window.location.href.split("/").pop());
  const navigateTo = useNavigate()
  const location = useLocation()

  useEffect(() => {
    getUsers();
    getLikesByUser();
    getCommunities();
    getCommunityPosts();
    getUsersInCommunity();
  },[])

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

  const getUsersInCommunity = () => {
    api
    .get(`/api/community/users_in_community/${communityId}`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== usersInCommunity) {
        setUsersInCommunity(data)
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

  const handle_membership = () => {
    api.post(`/api/community/handle_membership/${communityId}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getUsersInCommunity();
        getCommunityPosts();
        //navigateTo(0)
        setTrigger((t) => !t)
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  return (
    <div>
      <h2>{communities ? communities.filter((c) => c.id === communityId)[0].name : null}</h2>
      <button onClick={() => handle_membership()}>{User ? (getFields(usersInCommunity, 'id').includes(User.id) ? 'leave' : 'join') : false}</button>
      {posts.map((el,id) => 
        <div className="post-div" key={id}>
          <button key={id} onClick={() => navigateTo(`/detail/${el.id}`,{ state: {from: location} })}>
            Title: {el.title}
          </button>
          <p>Content: {el.content}</p>
          <p>Author: {el.author_username}</p>
          <p>Likes: {el.likes}</p>
          <button onClick={() => window.scrollTo(0, 0)}>
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
