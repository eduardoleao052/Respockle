import {useEffect, useState} from 'react'
import api from "../api"

export default function Header() {
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState(null);

    useEffect(() => isLoggedIn(), []);

    const isLoggedIn = () => {
        api
        .get("/api/posts/user/")
        .then((res) => res.data)
        .then((data) => {
            setUser(data);
            setLinks(<a href="/logout" onClick={() => isLoggedIn()}>Logout</a>)
        })
        .catch((error) => setLinks(<>
                                        <a href="/login" onClick={() => isLoggedIn()}>Login</a> 
                                        <br />
                                        <a href="/register"  onClick={() => isLoggedIn()}>Register</a>
                                    </>))
    }

  return (
    <>
        <h1 className='header-title'>Respockle</h1>
        <nav className='header-navbar'>
            {
                links
            }
        </nav>
    </>
  )
}
