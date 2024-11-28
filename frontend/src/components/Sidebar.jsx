import {useState,useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../api"
import "../index.css"

export default function Sidebar({trigger}) {

  const [userCommunities, setUserCommunities] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [community_picture, set_community_picture] = useState('');
  const [createCommunityForm, toggleCreateCommunityForm] = useState(false);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; 
  const [communities, setCommunities] = useState(null);
  const navigateTo = useNavigate()

  function getFields(input, field) {
    if (!input) return []
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
  }

  const getOrigin = () => {
    const HERE = window.location.href;
    if (HERE.split('/')[HERE.split('/').length - 1] === '') {
      setOrigin('home')
    } else if (HERE.split('/')[HERE.split('/').length - 1] === 'saved_posts') {
      setOrigin('saved_posts')
    } else if (HERE.split('/')[HERE.split('/').length - 2] === 'community') {
      setOrigin(Number(HERE.split('/')[HERE.split('/').length - 1]))
    } else if (HERE.split("/")[HERE.split('/').length - 2] === 'detail') {
      if (from === '/') {
        setOrigin('home')
      } else if (from === '/saved_posts') {
        setOrigin('saved_posts')
      } else if (from.split('/')[from.split('/').length - 2] === 'community') {
        setOrigin(Number(from.split('/')[from.split('/').length - 1]))
      }
    }
  }

  const getUserCommunities = () => {
    api
    .get("/api/user/communities/")
    .then((res) => res.data)
    .then((data) => {
      setUserCommunities(data);
    })
    .catch((error) => alert(error))
  }

  const handleCreateCommunity = () => {
    if (getFields(communities, 'name').map((el) => el.toLowerCase()).includes(name.toLowerCase())) {
      alert(`There already is a community called ${name}`)
      return
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (community_picture) {
        formData.append("community_picture", community_picture); // Only add if file is selected
    }

    api.post(`/api/community/create/`, formData).then((res) => {
      if (res.status === 201 || res.status === 200) {
        console.log('created')
        getCommunities(name)
      } else {
        alert("Failed to create post!")
      }
    }).catch((error) => alert(error))
    setName('');
    setDescription('');
    set_community_picture(null);
  }
  
  useEffect(() => {
    getUserCommunities();
  },[trigger])

  useEffect(() => {
    getCommunities();
  },[trigger])

  useEffect(() => {
    getOrigin();
  },[location])

  const getCommunities = (name) => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {
      setCommunities(data);
      if (name) {
        const communityId = data.filter((el) => el.name === name)[0].id
        toggleCreateCommunityForm(false)
        navigateTo(`/community/${communityId}`)
      }
    })
    .catch((error) => alert(error))
  }

  return (
    <div>
      {createCommunityForm ?
      <> 
        <div className='popup-div'>
          <p>Name:</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          <p>Description:</p>
          <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          <input type="file" accept="image/*" onChange={(e) => set_community_picture(e.target.files[0])}/>
          <button onClick={() => toggleCreateCommunityForm((c) => !c)}>Cancel</button>
          <button onClick={handleCreateCommunity}>Create</button>
        </div>
        <div className='popup-blackout'></div>
      </> : null}
      <h1>Sidebar</h1>
        <div style={{backgroundColor: origin === 'home' ? 'gray' : 'white'}}>
          <a href={`/`}>Home</a>
        </div>
        <div style={{backgroundColor: origin === 'saved_posts' ? 'gray' : 'white'}}>
          <a href={`/saved_posts`}>Saved</a>
        </div>
        <br />
        <div style={{backgroundColor: origin === 'create_community' ? 'gray' : 'white'}}>
          <button onClick={() => toggleCreateCommunityForm(!createCommunityForm)}>[+]</button>
        </div>
      {userCommunities.map((el,id)=>
        <div key={el.id} style={{backgroundColor: el.id === origin ? 'gray' : 'white'}}>
          <button onClick={() => navigateTo(`/community/${el.id}`)}>{el.name}</button>
        </div>
      )}
    </div>
  )
}
