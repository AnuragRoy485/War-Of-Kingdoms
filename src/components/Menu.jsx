import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateId } from '../helpers'
import { useUser } from '../contexts/UserContext'
import { useSocket } from '../contexts/SocketContext'
import Loader from './Loader'

import { inDevelopment } from '../vars'

export default function Menu() {
  const [myGames, setMyGames] = useState()
  const [loading, setLoading] = useState(false)
  const [isPrivate, setIsPrivate] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const navigate = useNavigate()
  const socket = useSocket()
  const { username, id } = useUser()
  let showOnline = true;
  
  useEffect(() => {
    if(!socket) return
    socket.emit('username', username)
  }, [username, socket])

  useEffect(() => {
    if(!socket) return
    function gotogame(id) {
      navigate('/game/' + id)
    }
    socket.on('game id', gotogame)
    socket.emit('get-users')
    socket.on('get-users', _users => {
      setOnlineUsers(_users)
    })
  }, [socket])

  return (
    <div className='menu'>
      { 
        loading ? <Loader /> :
        <>
          <div className='menu-title'><img src='/img/bP.png' /><h1>Live Chess</h1></div>
            <div className='menu-buttons'>
            <button onClick={() => {
              setLoading(true)
              socket.emit('create')
            }}>Private Game<span>Send a link to a friend</span></button>
            <button onClick={() => {
              setLoading(true)
              socket.emit('waitlist', username)
            }}>Random Opponent<span>Start a Battle With Unknown Player</span></button>
          </div>
          { showOnline && <div style={{position: 'fixed', top: '2em', left: '2em'}}>Online: {onlineUsers.length}</div> }
          <div className='footer'>Sound from <a href="https://www.zapsplat.com">Zapsplat.com</a> & Made By <a href="https://anurag485.blogspot.com/">Anurag Roy</a>.</div>
          { inDevelopment && <div className='slide-down develop-message'>Development in process. Sorry for any inconvenience.</div> }
        </>
      }
    </div>
  )
    }