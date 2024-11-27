import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function SavedPosts({feed, setFeed}) {
  const [posts, setPosts] = useState([]);
  const [User, setUser] = useState(null);
  const [dropDown, toggleDropDown] = useState(false);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigateTo = useNavigate()
  const location = useLocation();

  useEffect(() => {
    getUsers();
    getLikesByUser();
    getCommunities();
    if (feed==='created_at') {
      getSavedPosts();
    } else {
      getSavedPostsByLikes();
    }
  },[])

  function formatTime(time) {
    let timeSinceCreation = (Date.now() - new Date(time).getTime())/1000;
    let days = Math.floor(timeSinceCreation/84600)
    let hours = Math.floor((timeSinceCreation - days*84600)/3600)
    let minutes = Math.floor((timeSinceCreation - 3600*hours - days*84600)/60)
    let seconds = Math.floor((timeSinceCreation - 3600*hours - 60*minutes - days*84600))
    if (days >= 1) {
      return `${days} days`;
    } else if (hours >= 1) {
      return `${hours} h`
    } else if (minutes >= 1) {
      return `${minutes} m`
    } else if (seconds >= 1) {
      return `${seconds} s`
    } else return 'now'
  }

  const getSavedPostsByLikes = () => {
    api
    .get("/api/posts/saved_posts_by_likes/")
    .then((res) => res.data)
    .then((data) => {setPosts(data); setFilteredPosts(data)})
    .catch((error) => alert(error))
  }

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }

  const handleSearch = (query) => {
    if (query === "") {
      setFilteredPosts(posts);
    } else {
      const results = posts.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
        || item.content.toLowerCase().includes(query.toLowerCase())
        || item.author_username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(results);
    }
  };

  const getSavedPosts = () => {
    api
    .get(`/api/posts/saved_posts/`)
    .then((res) => res.data)
    .then((data) => {setPosts(data); setFilteredPosts(data)})
    .catch((error) => alert(error))
  }

  const getPost = (id) => {
    api
    .get(`/api/posts/detail/${id}/`)
    .then((res) => res.data)
    .then((data) => {
      setPosts((p) => 
        [...p.slice(0,getFields(p,'id').indexOf(data.id)),
          data,
        ...(p.slice(getFields(p,'id').indexOf(data.id) + 1, p.length))])
      setFilteredPosts((p) => 
        [...p.slice(0,getFields(p,'id').indexOf(data.id)),
          data,
        ...(p.slice(getFields(p,'id').indexOf(data.id) + 1, p.length))])
    })
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
        setPosts((p) => p.filter((el) => el.id !== id))
        setFilteredPosts((p) => p.filter((el) => el.id !== id))
      }
      else alert("Failed to delete post!")
    }).catch((error) => alert(error))
  }

  const handleLike = (el) => {
    api.post(`/api/posts/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost(el.id)
        getLikesByUser(); 
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  return (
    <div>
      <h2>Saved Posts</h2>
      <div>
        <div>
          <button onClick={() => toggleDropDown((d) => !d)}>Dropdown</button>
          {dropDown ? 
          <div>
            <button 
              style={{backgroundColor: feed === 'created_at' ? 'white' : 'blue'}}
              onClick={() => {getSavedPostsByLikes(); setFeed('likes')}}>
              Most Popular
              </button>
            <button 
              style={{backgroundColor: feed === 'created_at' ? 'blue' : 'white'}}
              onClick={() => {getSavedPosts(); setFeed('created_at')}}>
              Recent
            </button>
          </div> : null}
        </div>
        <div style={{ padding: '20px' }}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      {filteredPosts.map((el,id) => 
        <div className="post-div" key={id}>
          <button key={id} onClick={() => navigateTo(`/detail/${el.id}`,{ state: {from: location} })}>
            Title: {el.title}
          </button>
          <p>Content: {el.content}</p>
          <p>Author: {el.author_username}</p>
          <p>Likes: {el.likes}</p>
          <p>{formatTime(el.created_at)}</p>
          <button onClick={() => navigateTo(`/community/${el.community}`)}>
          <p>Community: {communities ? communities.filter((community) => community.id === el.community)[0].name : null}</p>
          </button>
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
