import { createChat } from '../../services/chatService'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import styles from './chat.module.css'
import { Navigate, useNavigate } from 'react-router-dom'

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
  return `/chatroom?ownerToken=${chat.chatID.ownerToken}&uniqueChatID=${chat.chatID.uniqueChatID}`
}

export function ChatList({ chats }) {
  const navigate = useNavigate()
  return (
    <>
      {chats?.length > 0 ? (
        <ListGroup>
          {chats.map((chat, index) => (
            <ListGroup.Item
              as="li"
              className={`d-flex justify-content-between align-items-start ${styles.listGroupItem}`}
              key={index}
              action
              onClick={() => navigate(getChatUrl(chat))}
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{chat.chatName}</div>
                description
              </div>
              <Badge bg="primary" pill>
                users chatting: 420
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <h2>No Chats Available</h2>
      )}
    </>
  )
}
