import { Route, Routes } from "react-router"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"
import PSINavbar from "./components/PSINavbar"
import { useEffect, useState } from "react"
import axios from "axios"
import PSIOffCanvas from "./components/PSIOffCanvas"
import Home from "./pages/Home"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [showOffCanvas, setShowOffCanvas] = useState(false);

  function handleLoggedIn(theval) {
    setIsLoggedIn(theval)
    if (theval) {
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
      axios.get(import.meta.env.VITE_APP_ENDPOINT + '/user', config)
        .then((response) => {
          const datanya = response.data
          setUserInfo({ ...datanya })
        }).catch(error => {
          console.log({ at: 'app.jsx', error })
          if (error.status) {
            if (error.status === 401) {
              localStorage.removeItem('token')
              navigate('/')
            }
          }
        })
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      handleLoggedIn(true)
    } else {
      handleLoggedIn(false)
    }
  }, [])

  function handleShowOffCanvas() {
    setShowOffCanvas(true)
  }
  function handleCloseOffCanvas() {
    setShowOffCanvas(false)
  }


  return (
    <div>
      {
        isLoggedIn ? <><PSINavbar userInfo={userInfo} onShowOffCanvas={handleShowOffCanvas} />
          <PSIOffCanvas onLoggedIn={handleLoggedIn} showOffCanvas={showOffCanvas} userInfo={userInfo} onCloseOffCanvas={handleCloseOffCanvas} /></> : ''
      }
      <Routes>
        {/* <Route path="/" element={<Login onLoggedIn={handleLoggedIn} />} />
        <Route path="/dashboard" element={<Dashboard userInfo={userInfo} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Login onLoggedIn={handleLoggedIn} />} /> */}
        <Route index element={<Login onLoggedIn={handleLoggedIn} />} />
        <Route path="dashboard" element={<Dashboard userInfo={userInfo} />} >
          <Route index element={<Home userInfo={userInfo} />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Dashboard userInfo={userInfo} />} />
        </Route>
        <Route>
          <Route path="*" element={<Dashboard userInfo={userInfo} />} />
        </Route>
      </Routes>
    </div>
  )
}