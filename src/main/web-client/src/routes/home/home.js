import React, { useEffect, useState } from 'react'
import styles from './home.module.css'
import { getChats } from '../../services/chatService'
import { isLoggedIn, useSession } from '../../contexts/SessionContext'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [chats, setChats] = useState([])
  const { session } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn(session)) {
      navigate('/')
    }
  }, [session, navigate])

  useEffect(() => {
    const fetchChats = async () => {
      const chatsData = await getChats()
      setChats(chatsData)
    }
    fetchChats()
  }, [])

  return (
    <div className={styles.container}>
      <h1>Welcome back!</h1>
      <div className={styles.chats}>
        {chats.length > 0 ? (
          chats.map((chat) => {
            return (
              <div key={`${chat.chatID.uniqueChatID}${chat.chatID.ownerEmailAddress}`} className={styles.chat} onClick={() => navigate(`/chat?ownerEmailAddress=${chat.chatID.ownerEmailAddress}&uniqueChatID=${chat.chatID.uniqueChatID}`)}>
                <h2>{chat.chatName}</h2>
              </div>
            );
          })
        ) : (
          <h2>No Chats Available</h2>
        )}
      </div>
    </div>
  )
}

export default Home
