import {useEffect, useState} from 'react'
import api from "../api"
import { ACCESS_TOKEN } from '../constants'

export default function Header() {
    let [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    setInterval(() => {
        setToken(localStorage.getItem(ACCESS_TOKEN));
    },10);

    const getUser = () => {
        api
        .get("/api/posts/user/")
        .then((res) => res.data)
        .then((data) => {
            setUser(data);
        })
        .catch((error) => console.log("User not logged in."))
    }

  return (
    <>
        <h1 className='header-title'>Respockle</h1>
        <nav className='header-navbar'>
            {
                token ? 
                <>
                    <a href="/logout" onClick={() => isLoggedIn()}>Logout</a>
                    <br />
                    <a href="/create_post">Create Post</a>  
                    <br />
                    <a href="/">Home</a>  
                </>
                : 
                <>
                    <a href="/login" onClick={() => isLoggedIn()}>Login</a> 
                    <br />
                    <a href="/register"  onClick={() => isLoggedIn()}>Register</a>
                </>
            }
        </nav>
    </>
  )
}
