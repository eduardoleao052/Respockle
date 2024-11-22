import React from 'react'
import Form from '../components/Form'
import "../styles/Login.css"

export default function Register() {
  return (
    <div style={{textAlign: "center"}}>
      <Form route="/api/user/register/" method="register" />
      <p>Already have an account?</p>
      <a href="/login"><button className='register-button'>Login</button></a>
    </div>
  )
}
