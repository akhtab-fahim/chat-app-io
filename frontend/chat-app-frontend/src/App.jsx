import React from 'react'
import {io} from "socket.io-client"
import { useEffect, useState } from 'react'
function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const socket = io("http://localhost:2000")
    socket.on("hello", (arg) => {
      setMessage(arg)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>{message || 'App'}</div>
  )
}

export default App