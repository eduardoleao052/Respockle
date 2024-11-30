import { useState, useEffect} from 'react'
import api from "../api"
import { ACCESS_TOKEN } from '../constants'
import '../index.css'
import CommunitySearchBar from './CommunitySearchBar'
import ResultsList from './ResultsList'
import { useNavigate } from 'react-router-dom'

export default function Header() {
    let [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [profile, setProfile] = useState('');
    const navigateTo = useNavigate()

    useEffect(() => {
        setInterval(() => {
            setToken(localStorage.getItem(ACCESS_TOKEN));
        },10);
        if (token) {
          getUser()
        }
    },[token])

    useEffect(() => {
      const enterListener = addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          setShowDropdown(false)
        }
      })
      return removeEventListener('keydown',enterListener);
    }, [])

    useEffect(() => {
      const clickListener = addEventListener('click', (e) => {
        setShowDropdown(false)
      })
      return removeEventListener('click',clickListener);
    }, [])

    const handlePullData = () => {
        api
        .get("/api/communities/")
        .then((res) => res.data)
        .then((data) => {setData(data)})
        .catch((error) => alert(error))
    }
    
    const handleSearch = (query) => {
      setShowDropdown(true)
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
        <nav className='header-navbar'>
          <h1 className='header-title'>Dalilah the Crafty's Wonderful App for Diabeticals</h1>
            {
                token ? 
                <div className='header-navbar-authfalse'>
                    <a href="/logout" onClick={() => isLoggedIn()}>Logout</a>
                    <div>
                        <CommunitySearchBar onClick={handlePullData} onSearch={handleSearch} />
                        {(document.activeElement === document.getElementById('header-searchbar') && showDropdown) ?
                        <ResultsList results={filteredData} /> :
                        null}
                    </div>
                    <button onClick={() => {navigateTo('/create_post')}}>Create Post</button>
                    <a 
                      className="header-profile-a" 
                      href={`/profile/${user?.id}`}  
                      onClick={() => isLoggedIn()}>
                      <img 
                        className="header-profile-picture" 
                        src={`${import.meta.env.VITE_API_URL}${profile ? profile.profile_picture : 'assets/default_profile_picture.png'}`}>
                      </img>
                      <p>
                        {user?.username}
                      </p>
                    </a>                  
                </div>
                : 
                <div className='header-navbar-authtrue'>
                    <a href="/login" onClick={() => isLoggedIn()}>Login</a> 
                    <br />
                    <a href="/register"  onClick={() => isLoggedIn()}>Register</a>
                </div>
            }
        </nav>
  )
}
