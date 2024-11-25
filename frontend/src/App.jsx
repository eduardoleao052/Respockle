import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import "./styles/index.css"
import CreatePost from "./pages/CreatePost"
import DetailPost from "./pages/DetailPost"
import Community from "./pages/Community"
import SavedPosts from "./pages/SavedPosts"
import { useState } from "react"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />;
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="app">

          <Routes>
            <Route path="/" element={<ProtectedRoute><><Sidebar /><Home /></></ProtectedRoute>}/>
            <Route path="/create_post" element={<ProtectedRoute><><Sidebar /><CreatePost /></></ProtectedRoute>}/>
            <Route path="/login" element={<Login />} />
            <Route path='/detail/:id' element={<ProtectedRoute><><Sidebar /><DetailPost /></></ProtectedRoute>} />
            <Route path='/community/:id' element={<ProtectedRoute><><Sidebar /><Community /></></ProtectedRoute>} />
            <Route path='/saved_posts/' element={<ProtectedRoute><><Sidebar /><SavedPosts /></></ProtectedRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="*" element={<NotFound />}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
