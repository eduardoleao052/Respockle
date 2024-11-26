import React, { useEffect, useState } from 'react'
import api from "../api"
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";


export default function DetailPost() {
  const navigateTo = useNavigate();
  const idRoot = window.location.href.split("/").pop()
  const id = Number(isNaN(idRoot) ? idRoot.slice(0, idRoot.length - 1) : idRoot);
  const [post, setPost] = useState()
  const [content, setContent] = useState("")
  const [comments, setComments] = useState([])
  const [communities, setCommunities] = useState(null);
  const [PostsLikedByUsers, setPostsLikedByUsers] = useState(null);
  const [PostsSavedByUsers, setPostsSavedByUsers] = useState(null);
  const [CommentsLikedByUsers, setCommentsLikedByUsers] = useState(null);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    getPost();
    getCommunities();
    getPostsLikedByUser();
    getPostsSavedByUser();
    getCommentsLikedByUser();
    getComments();
  },[])


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
      <div className="post-div" key={id}>
        <button onClick={() => navigateTo(-1)}>Back</button>
        <p><b>Title: {post.title}</b></p>
        <p>Content: {post.content}</p>
        <p>Author: {post.author_username}</p>
        <p>Likes: {post.likes}</p>
        <button onClick={() => navigateTo(`/community/${post.community}`)}>
        <p>Community: {communities ? communities.filter((community) => community.id === post.community)[0].name : null}</p>
        </button>        
        <button onClick={() => deletePost()}>Delete</button>
        <button 
            style={{backgroundColor: getFields(PostsSavedByUsers, 'id').includes(post.id) ? 'blue' : 'white'}} 
            onClick={() => handleSave(post)}>
            Save
        </button>
        <button
            style={{backgroundColor: getFields(PostsLikedByUsers, 'id').includes(post.id) ? 'blue' : 'white'}} 
            onClick={() => handleLike(post)}>
            Like
        </button>
        { commenting ? 
        <div>
          <form action=''>
          <textarea onChange={(e) => handleChangeComment(e)} value={content} id="comment-content-form"></textarea>
          </form>
          <button onClick={createComment}>Comment</button>
        </div>
        :
        <button onClick={() => toggleCommenting()}>Comment</button>
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
