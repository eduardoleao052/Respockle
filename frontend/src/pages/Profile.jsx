import React from 'react'
import { useState, useEffect } from 'react'
import api from "../api"
import "../index.css"
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function Profile({feed, setFeed}) {
  const [posts, setPosts] = useState([]);
  const [User, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [popUp, setPopUp] = useState(false);
  const [profile, setProfile] = useState(null);
  const [dropDown, toggleDropDown] = useState(false);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [communities, setCommunities] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigateTo = useNavigate();
  const location = useLocation();
  const userId = Number(window.location.href.split("/").pop());


  useEffect(() => {
    getUsers();
    getProfile(userId);
    getLikesByUser();
    getCommunities();
    if (feed==='created_at') {
      getUserPosts();
    } else {
      getUserPostsByLikes();
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

  const getUserPostsByLikes = () => {
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

  const getUserPosts = () => {
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

  const getProfile = (id) => {
    api
    .get(`/api/user/profile/${id}/`)
    .then((res) => res.data)
    .then((data) => {setProfile(data)})
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

  const handleUpdateProfile = () => {

    let formData = new FormData();
    formData.append("bio", bio);
    if (profilePicture) {
        formData.append("profile_picture", profilePicture); 
    }

    api.post(`/api/user/profile/update/${User.id}/`, formData).then((res) => {
      if (res.status === 201 || res.status === 200) {
        console.log('posted')
        getProfile(userId);
        setPopUp(false);
      } else {
        alert("Failed to create post!")
      }
    }).catch((error) => alert(error))
    setBio('');
    setProfilePicture(null);
  }

  return (
    <div className='main'>
      <div className='main-profile-profile-header'>
        <img className='main-profile-profile-picture' src={`${import.meta.env.VITE_API_URL}${profile ? profile.profile_picture : 'assets/default_profile_picture.png'}`} alt="profile_picture" />
        <div className='main-profile-profile-header-div'>
          <p>{User ? User.username : '...'}</p>
          <p>Joined {profile ? formatTime(profile.created_at) : '...'} ago</p>
        </div>
      </div>
      <p>{profile ? profile.bio : '...'}</p>
      <div>
        <button className='main-profile-update-button' onClick={(t) => setPopUp(true)}>Update Profile</button>
        {popUp ?
        <> 
          <div className='popup-div'>
            <p>Bio:</p>
            <textarea name="description" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
            <p>Profile picture:</p>
            <input type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])}/>
            <button onClick={() => setPopUp(false)}>Cancel</button>
            <button onClick={handleUpdateProfile}>Submit</button>
          </div>
          <div className='popup-blackout'></div>
        </>
         : null}
      </div>
      <h2>User's Posts</h2>
      <div>
        <div>
          <button onClick={() => toggleDropDown((d) => !d)}>Sort By</button>
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
      {"FEED"}
    </div>
  )
}
