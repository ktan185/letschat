import { useSearchParams } from 'react-router-dom'
import styles from './chat.module.css'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import { createChat } from '../../services/chatService'

export function Chat() {
  const { searchParams } = useSearchParams()
  const ownerToken = searchParams.get('ownerToken')
  const uniqueChatID = searchParams.get('uniqueChatID')

  return (
    <div className={styles.container}>
      Welcome the owner of this chat is {ownerToken} and the uniqueChatID is{' '}
      {uniqueChatID}
    </div>
  )
}

export function CreateChat(props) {
  const [chatName, setChatName] = useState('')
  const auth = useAuth()
  const user = auth.getUserDetails()

  const handleChatNameChange = (e) => {
    setChatName(e.target.value)
  }

  function createNewChat(e) {
    e.preventDefault()
    try {
      const payload = {
        userToken: user.token,
        chatName: chatName,
      }
      createChat(payload)
      props.onHide(true)
      alert('You have sucessfully created a new chat!')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a new chat room!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="chatName">
            <Form.Label>Enter a chatroom name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Chat room name"
              value={chatName}
              onChange={handleChatNameChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <Button onClick={createNewChat}>Create Chat!</Button>
      </Modal.Footer>
    </Modal>
  )
}

export function getChatUrl(chat) {
  return `/chat?ownerToken=${chat.chatID.ownerToken}&uniqueChatID=${chat.chatID.uniqueChatID}`
}
