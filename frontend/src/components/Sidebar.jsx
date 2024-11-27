import {useState,useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import api from "../api"

export default function Sidebar({trigger}) {

  const [userCommunities, setUserCommunities] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
    console.log(HERE)
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
      console.log(data)
    })
    .catch((error) => alert(error))
  }

  const handleCreateCommunity = () => {
    if (getFields(communities, 'name').map((el) => el.toLowerCase()).includes(name.toLowerCase())) {
      alert(`There already is a community called ${name}`)
      return
    }
    api.post(`/api/community/create/`, {name,description}).then((res) => {
      if (res.status === 201 || res.status === 200) {
        console.log('created')
        console.log({name,description})
        navigateTo(0)
      } else {
        alert("Failed to create post!")
      }
    }).catch((error) => alert(error))
    setName('');
    setDescription('');
    //navigateTo(`/community/${XXXXXXXXX}`)
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

  const getCommunities = () => {
    api
    .get("/api/communities/")
    .then((res) => res.data)
    .then((data) => {setCommunities(data)})
    .catch((error) => alert(error))
  }

  return (
    <div>
      {createCommunityForm ? <div className='sidebar-create-community-pupup-div'>
        <p>Name:</p>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        <p>Description:</p>
        <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <button onClick={handleCreateCommunity}>Create!</button>
      </div> : null}
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
          <a href={`/community/${el.id}`}>{el.name}</a>
        </div>
      )}
    </div>
  )
}
