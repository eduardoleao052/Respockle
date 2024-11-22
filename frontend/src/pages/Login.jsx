import React from 'react'
import Form from '../components/Form'
import '../styles/Login.css'

export default function Login() {
  return (
    <div style={{textAlign: "center"}}>
      <Form route="/api/token/" method="login" />
      <p>Don't have an account?</p>
      <a href="/register"><button className='register-button'>Register</button></a>
    </div>
  )
}
