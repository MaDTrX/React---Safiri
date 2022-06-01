import React, { createContext } from 'react'
import axios from 'axios'

export const myContext = createContext({})
const options = {
    method: "GET", 
    credentials: "include", 
    headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
    }
}

function Context(props) {
    const [userObj, setUserObj] = React.useState()
    React.useEffect(() => {
        async function user () {
           const res = await axios.get('http://localhost:3001/login/success', options)
           console.log(res)
            if (res.data) {
                console.log(res.data)
                setUserObj(res.data)
            } else {
                console.log('err')
            }
        }
        user()
    }, [])
  return (
    <myContext.Provider value={userObj}>{props.children}</myContext.Provider>
  )
}

export default Context