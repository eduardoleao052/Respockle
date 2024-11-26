import {useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import api from "../api"

export default function Sidebar({trigger}) {

  const [userCommunities, setUserCommunities] = useState([]);
  const [origin, setOrigin] = useState(null);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; 
  

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
  
  useEffect(() => {
    getUserCommunities();
  },[trigger])

  useEffect(() => {
    getOrigin();
  },[location])

  return (
    <div>
      <h1>Sidebar</h1>
        <div style={{backgroundColor: origin === 'home' ? 'gray' : 'white'}}>
          <a href={`/`}>Home</a>
          <p> All posts</p>      
        </div>
        <div style={{backgroundColor: origin === 'saved_posts' ? 'gray' : 'white'}}>
          <a href={`/saved_posts`}>Saved Posts</a>
          <p> My saved posts</p>      
        </div>
      {userCommunities.map((el,id)=>
        <div key={el.id} style={{backgroundColor: el.id === origin ? 'gray' : 'white'}}>
          <a href={`/community/${el.id}`}>{el.name}</a>
          <p> {el.description}</p>  
        </div>

      )}
    </div>
  )
}
