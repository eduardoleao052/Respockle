import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import "../index.css"

export default function Community({setTrigger, feed, setFeed}) {
  const [posts, setPosts] = useState([]);
  const [User, setUser] = useState(null);
  const [dropDown, toggleDropDown] = useState(false);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [usersInCommunity, setUsersInCommunity] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const communityId = Number(window.location.href.split("/").pop());
  const navigateTo = useNavigate()
  const location = useLocation()

  useEffect(() => {
    getUsers();
    getLikesByUser();
    getCommunities();
    if (feed==='created_at') {
      getCommunityPosts();
    } else if (feed==='likes') {
      getCommunityPostsByLikes();
    } else if (feed==='reports') {
      getCommunityPostsByReports();
    }
    getUsersInCommunity();
  },[location])

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

  const getCommunityPostsByLikes = () => {
    api
    .get(`/api/community_by_like/${communityId}/`)
    .then((res) => res.data)
    .then((data) => {setPosts(data); setFilteredPosts(data)})
    .catch((error) => alert(error))
  }

  const getCommunityPostsByReports = () => {
    api
    .get(`/api/community_by_report/${communityId}/`)
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

  const getCommunityPosts = () => {
    api
    .get(`/api/community/${communityId}/`)
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

  const getUsersInCommunity = () => {
    api
    .get(`/api/community/users_in_community/${communityId}/`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== usersInCommunity) {
        setUsersInCommunity(data)
      }
    }) 
    .catch((error) => alert(error))
  }

  const deleteCommunity = () => {
    api.delete(`/api/community/delete/${communityId}/`).then((res) => {
      if (res.status === 204 || res.status === 200) {
        navigateTo('/')
        setTrigger((t) => !t)
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

  const handle_membership = () => {
    api.post(`/api/community/handle_membership/${communityId}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getUsersInCommunity();
        getCommunities();
        getCommunityPosts();
        setTrigger((t) => !t)
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  return (
    <div>
      <h2>{communities ? communities.filter((c) => c.id === communityId)[0].name : null}</h2>
      <h4>{communities ? communities.filter((c) => c.id === communityId)[0].description : null}</h4>
      <h4>{communities ? communities.filter((c) => c.id === communityId)[0].members.length : null}</h4>
      {(communities?.filter((c) => c.id === communityId)[0].author === User?.id) ? 
      <button onClick={() => setDeletePopUp(true)}>Delete Community</button> :
      <button onClick={() => handle_membership()}>{User ? (getFields(usersInCommunity, 'id').includes(User.id) ? 'leave' : 'join') : false}</button>}
      {deletePopUp ?
        <>
          <div className='popup-div'>
            <p>You sure you wanna delete?</p>
            <button onClick={() => setDeletePopUp(false)}>Cancel</button>
            <button onClick={() => deleteCommunity()}>
              Confirm
            </button>
          </div>
          <div className='popup-blackout'></div>
        </> :
        null
      }
      <div>
        <div>
          <button onClick={() => toggleDropDown((d) => !d)}>Sort By</button>
          {dropDown ? 
          <div>
            <button 
              style={{backgroundColor: feed === 'likes' ? 'blue' : 'white'}}
              onClick={() => {getCommunityPostsByLikes(); setFeed('likes')}}>
              Most Popular
              </button>
            <button 
              style={{backgroundColor: feed === 'created_at' ? 'blue' : 'white'}}
              onClick={() => {getCommunityPosts(); setFeed('created_at')}}>
              Recent
            </button>
            {communities?.filter((c) => c.id === communityId)[0].author === User?.id ?
            <button 
              style={{backgroundColor: feed === 'reports' ? 'blue' : 'white'}}
              onClick={() => {getCommunityPostsByReports(); setFeed('reports')}}>
              Controversial
            </button> : null}
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
          {communities?.filter((c) => c.id === el.community)[0].author === User?.id ? <p>Reports: {el.reports}</p> : null}
          <p>{formatTime(el.created_at)}</p>
          <button onClick={() => window.scrollTo(0, 0)}>
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
