import { useState, useEffect} from 'react'
import api from "../api"
import { ACCESS_TOKEN } from '../constants'
import '../index.css'
import CommunitySearchBar from './CommunitySearchBar'
import ResultsList from './ResultsList'

export default function Header() {
    let [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [profile, setProfile] = useState('');

    useEffect(() => {
        setInterval(() => {
            setToken(localStorage.getItem(ACCESS_TOKEN));
        },10);
        console.log("aaaaa")
        if (token) {
          getUser()
        }
    },[token])

    const handlePullData = () => {
        api
        .get("/api/communities/")
        .then((res) => res.data)
        .then((data) => {setData(data)})
        .catch((error) => alert(error))
    }
    
    const handleSearch = (query) => {
      if (query === "") {
        setFilteredData(data);
      } else {
        const results = data.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(results);
      }
    };

    const getUser = () => {
        api
        .get("/api/posts/user/")
        .then((res) => res.data)
        .then((data) => {
            setUser(data);
            getProfile(data.id)
        })
        .catch((error) => console.log(`User not logged in. Error message: ${error}`))
    }

    const getProfile = (pk) => {
        api
        .get(`/api/user/profile/${pk}/`)
        .then((res) => res.data)
        .then((data) => {
            setProfile(data);
        })
        .catch((error) => console.log(`User not logged in. Error message: ${error}`))
    }

  return (
    <>
        <h1 className='header-title'>Dalilah the Crafty's Wonderful App for Diabeticals</h1>
        <nav className='header-navbar'>
            {
                token ? 
                <div className='header-navbar-authfalse'>
                    <a href="/logout" onClick={() => isLoggedIn()}>Logout</a>
                    <div style={{ padding: '20px' }}>
                        <CommunitySearchBar onClick={handlePullData} onSearch={handleSearch} />
                        {document.activeElement === document.getElementById('community_searchbar') ? <ResultsList results={filteredData} /> : null}
                    </div>
                    <a href="/create_post">Create Post</a>    
                    <br />
                    <a className="header-profile-a" href={`/profile/${user?.id}`}  onClick={() => isLoggedIn()}><p>{user?.username}</p><img className="header-profile-picture" src={`${import.meta.env.VITE_API_URL}${profile.profile_picture}`}></img></a>                  
                </div>
                : 
                <div className='header-navbar-authtrue'>
                    <a href="/login" onClick={() => isLoggedIn()}>Login</a> 
                    <br />
                    <a href="/register"  onClick={() => isLoggedIn()}>Register</a>
                </div>
            }
        </nav>
    </>
  )
}
