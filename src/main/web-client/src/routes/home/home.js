import React, { useEffect, useState } from 'react'
import styles from './home.module.css'
import { getAllChats } from '../../services/chatService'
import {
  ChatRoomList,
  CreateChat,
} from '../../components/chat/chatComponents.js'
import Button from 'react-bootstrap/esm/Button'

function Home() {
  const [chatList, setChatList] = useState([])
  const [showModal, setShowModal] = useState(false)

  const fetchChats = async () => {
    const chatsData = await getAllChats()
    setChatList(chatsData)
  }
  
  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.chats}>
        <h1>Join a chat room!</h1>
        <CreateChat fetchChats={fetchChats} show={showModal} onHide={() => setShowModal(false)} />
        <ChatRoomList chatlist={chatList} />
        <div className={styles.createChatButton}>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Create a chat!
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home
