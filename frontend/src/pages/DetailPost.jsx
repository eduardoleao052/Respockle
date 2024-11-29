import React, { useEffect, useState } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";
import "../index.css"


export default function DetailPost() {
  const navigateTo = useNavigate();
  const idRoot = window.location.href.split("/").pop()
  const id = Number(isNaN(idRoot) ? idRoot.slice(0, idRoot.length - 1) : idRoot);
  const [post, setPost] = useState()
  const [User, setUser] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false)
  const [reportPopUp, setReportPopUp] = useState(false)
  const [content, setContent] = useState("")
  const [comments, setComments] = useState([])
  const [communities, setCommunities] = useState(null);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [PostsReportedByUsers, setPostsReportedByUsers] = useState(null);
  const [PostsSavedByUsers, setPostsSavedByUsers] = useState(null);
  const [CommentsLikedByUsers, setCommentsLikedByUsers] = useState(null);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    getPost();
    getUsers();
    getCommunities();
    getPostsLikedByUser();
    getPostsSavedByUser();
    getPostsReportedByUser();
    getCommentsLikedByUser();
    getComments();
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

  const getPostsLikedByUser = () => {
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

  const getPostsReportedByUser = () => {
    api
    .get(`/api/posts/posts_reported_by_user/`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== PostsReportedByUsers) {
        setPostsReportedByUsers(data)
      }
    }) 
    .catch((error) => alert(error))
  }

  const getPostsSavedByUser = () => {
    api
    .get(`/api/posts/posts_saved_by_user/`)
    .then((res) => res.data)
    .then((data) => {
      console.log(data)
      setPostsSavedByUsers(data)
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

  const getCommentsLikedByUser = () => {
    api
    .get(`/api/posts/comments_liked_by_user/${id}`)
    .then((res) => res.data)
    .then((data) => {
      if (data !== PostsLikedByUsers) {
        setCommentsLikedByUsers(data)
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

  const getComments = () => {
    api
    .get(`/api/posts/comments/${id}/`)
    .then((res) => res.data)
    .then((data) => {setComments(data)})
    .catch((error) => alert(error))
  }

  const getCommunities = () => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {setCommunities(data)})
    .catch((error) => alert(error))
  }

  const deletePost = () => {
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
        getPostsLikedByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const handleReport = (id) => {
    api.post(`/api/posts/report/${id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost();
        getPostsReportedByUser();
        setReportPopUp(false);
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const handleSave = (el) => {
    api.post(`/api/posts/save/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getPost();
        getPostsSavedByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }


  const handleCommentLike = (el) => {
    api.post(`/api/posts/comments/like/${el.id}/`).then((res) => {
      if (res.status === 201 || res.status === 200) {
        getComments();
        getCommentsLikedByUser();
      } else {
        alert("Failed to like post!")
      }
    }).catch((error) => alert(error))
  }

  const toggleCommenting = () => {
    setCommenting(!commenting)
  }

  const createComment = (e) => {
    e.preventDefault()
    if (content) {
      api.post(`/api/posts/comments/create/${id}/`, {content}).then((res) => {
        if (res.status === 201 || res.status === 200) {
          getComments()
        } else {
          alert("Failed to create post!")
        }
      }).catch((error) => alert(error))
      setContent('');
    }
  }

  const handleChangeComment = (e) => {
    setContent(e.target.value)
  }


  return (
    post ? 
      <div className="post-detail" key={id}>
        <button onClick={() => navigateTo(-1)}>Back</button>
        <div className="main-feed-post-header">
        <img className="main-feed-post-header-image" src={`${import.meta.env.VITE_API_URL}${communities ? communities.filter((c) => c.id === post.community)[0]?.community_picture ? communities.filter((c) => c.id === post.community)[0]?.community_picture : 'assets/default_community_image.png': 'assets/default_community_image.png'}`} alt="" />          
        <div className="main-feed-post-header-info">
          <button className='main-feed-post-url bold' onClick={() => navigateTo(`/community/${post.community}`)}>
            {communities ? communities.filter((community) => community.id === post.community)[0].name : null}
          </button>  
          <button className='main-feed-post-url' onClick={(e) => {navigateTo(`/profile/${el.author}`);}}>
            {post.author_username}
          </button>
          </div>
        </div>
        <p className="main-feed-post-body-title">Title: {post.title}</p>
        <p className="main-feed-post-body-content">Content: {post.content}</p>
        {post.post_picture ? <img src={`${import.meta.env.VITE_API_URL}${post.post_picture}`} alt="error loading post image"/> : null}
        {communities?.filter((c) => c.id === post.community)[0].author === User?.id ? <p>Reports: {post.reports}</p> : null}      
        {(post.author === User?.id || communities?.filter((c) => c.id === post.community)[0].author === User?.id) ? <button onClick={() => setDeletePopUp(post.id)}>Delete</button> : null}
        {deletePopUp ? 
        <>
          <div className='popup-div'>
            <p>You sure you wanna delete?</p>
            <button onClick={() => setDeletePopUp(false)}>Cancel</button>
            <button onClick={() => deletePost(deletePopUp)}>
              Confirm
            </button>
          </div>
          <div className='popup-blackout'></div>
        </> :
        null
        }
        {reportPopUp ? 
        <>
          <div className='popup-div'>
            <p>You sure you wanna report?</p>
            <button onClick={() => setReportPopUp(false)}>Cancel</button>
            <button onClick={() => handleReport(reportPopUp)}>
              Confirm
            </button>
          </div>
          <div className='popup-blackout'></div>
        </> :
        null
        }
        <div className="main-feed-post-body-footer">
          <div className="main-feed-post-body-footer-left">
            <button
              className='main-feed-post-body-likes'
              style={{backgroundColor: getFields(PostsLikedByUsers, 'id').includes(post.id) ? '#0571d3' : '#a1a1a1'}} 
              onClick={() => {handleLike(post)}}>
              {post.likes} likes
            </button>
            <button 
              className='main-feed-post-body-likes'
              style={{backgroundColor: getFields(PostsSavedByUsers, 'id').includes(post.id) ? '#0571d3' : '#a1a1a1'}} 
              onClick={() => handleSave(post)}>
              Save
            </button>
            <button className="main-feed-post-body-likes"
              style={{backgroundColor: commenting ? '#0571d3' : '#a1a1a1'}}  
              onClick={() => toggleCommenting()}>Comment
            </button>
            {!(post.author === User?.id) ? 
            <button className="main-feed-post-body-likes"
                style={{backgroundColor: getFields(PostsReportedByUsers, 'id').includes(post.id) ? '#9c1010' : '#a1a1a1'}} 
                onClick={() => {
                  if (false) {
                    console.log('uau')
                  } else {
                    getFields(PostsReportedByUsers, 'id').includes(post.id) ?
                    handleReport(post.id) : 
                    setReportPopUp(post.id)
                  }
                }}>
                Report
            </button> : null}
            </div>
            <p className="main-feed-post-body-time">{formatTime(post.created_at)}</p>
          </div>
        { commenting ? 
        <div>
          <form action=''>
          <textarea onChange={(e) => handleChangeComment(e)} value={content} id="comment-content-form"></textarea>
          </form>
          <button className="main-feed-post-body-comment" onClick={createComment}>Submit</button>
        </div>
        :
        null
        }
        <div>
        {comments.map((el,id) => 
        <div className="post-div" key={id}>
          <p>Content: {el.content}</p>
          <p>Author: {el.author_username}</p>
          <p>Likes: {el.likes}</p>
          <button
              style={{backgroundColor: getFields(CommentsLikedByUsers, 'id').includes(el.id) ? 'blue' : 'white'}} 
              onClick={() => handleCommentLike(el)}>
              Like
          </button>
        </div>
      )}
        </div>
      </div> : null
    )
}
