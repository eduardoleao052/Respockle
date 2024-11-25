import React from 'react'
import Form from '../components/Form'
import "../styles/Login.css"
import {useLocation} from  'react-router-dom'


export default function Register() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/'; 

  return (
    <div style={{textAlign: "center"}}>
      <Form url={from} route="/api/user/register/" method="register" />
      <p>Already have an account?</p>
      <a href="/login"><button className='register-button'>Login</button></a>
    </div>
  )
}
