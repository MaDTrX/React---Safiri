import React from "react";
import { } from 'react-dotenv'
import { Button } from '@mui/material'
import { myContext } from './Context'
import axios from 'axios'

const options = {
  method: "GET",
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true
  }
}

function App() {
  const [userObj, setUserObj] = React.useState()

  React.useEffect(() => {
    async function user() {
      const res = await axios.get('http://localhost:3001/login/success', options)
      console.log(res.data)
      if (res.data) {
        setUserObj(res.data)
      } else {
        console.log('err')
      }
    }
    user()
  }, [])
  

  function handleLogin() {
    window.open('http://localhost:3001/auth/google', '_self')
  }
  async function handleLogOut() {
   const res = await axios.get("http://localhost:3001/logout", options)
      console.log(res.data)
  }
  return (
    <div>
      <Button variant='contained' onClick={handleLogin}>Log in</Button>
      <Button variant='contained' onClick={handleLogOut}>Log Out</Button>
    </div>
  );
}

export default App;
