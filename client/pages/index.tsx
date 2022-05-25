import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useSockets} from '../context/socket.context'

import RoomsContainers from '../containers/Rooms'
import MessageContainers from '../containers/Messages'
import { useEffect, useRef } from 'react'


export default function Home() {
  const {socket, username, setUsername} = useSockets()
  const usernameRef = useRef(null)

  const  handleSetUsername =() =>{
    const value = usernameRef.current.value
    if(!value){
      return
    }

    setUsername(value)
    localStorage.setItem("username",value)
  }
  
  
  useEffect(() => {
   
    if (usernameRef)
      usernameRef.current.value = localStorage.getItem("username") || "";
  },[])
  return (
    <div>
      {!username && 
      <div className={styles.usernameWrapper}>
        <div className={styles.usernameInner}>
          <input placeholder='username' ref={usernameRef}/>
          <button onClick={handleSetUsername}>Start</button>
        </div>
      </div>
      }

      {username && (
        <div className={styles.container}>
            <RoomsContainers/>
            <MessageContainers/>
        </div>
      )}

    </div>
  )
}
