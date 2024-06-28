import React, { useEffect, useState } from 'react'
import styles from './home.module.css'
import { getAllChats } from '../../services/chatService'
import { useNavigate } from 'react-router-dom'
import { CreateChat, getChatUrl } from '../chat/chatroom.js'
import Button from 'react-bootstrap/esm/Button'

function Home() {
  const [chats, setChats] = useState([])
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChats = async () => {
      const chatsData = await getAllChats()
      setChats(chatsData)
    }
    fetchChats()
  }, [])

  return (
    <div className={styles.container}>
      <h1>Welcome back!</h1>
      <div className={styles.chats}>
        <CreateChat show={showModal} onHide={() => setShowModal(false)} />
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create new chat!
        </Button>
        {chats?.length > 0 ? (
          chats.map((chat) => {
            return (
              <div
                key={`${chat.chatID.uniqueChatID}${chat.chatID.ownerToken}`}
                className={styles.chat}
                onClick={() => navigate(getChatUrl(chat))}
              >
                <h2>{chat.chatName}</h2>
              </div>
            )
          })
        ) : (
          <h2>No Chats Available</h2>
        )}
      </div>
    </div>
  )
}

export default Home
