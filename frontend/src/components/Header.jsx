import { useState, useEffect} from 'react'
import api from "../api"
import { ACCESS_TOKEN } from '../constants'
import '../index.css'

export default function Header() {
    let [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setInterval(() => {
            setToken(localStorage.getItem(ACCESS_TOKEN));
        },10);
    },[])

    const getUser = () => {
        api
        .get("/api/posts/user/")
        .then((res) => res.data)
        .then((data) => {
            setUser(data);
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
                    
                    <a href="/create_post">Create Post</a>  
                    
                    <a href="/">Home</a>  
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
