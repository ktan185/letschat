import { createChat } from '../../services/chatService'
import { useRef, useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import Modal from 'react-bootstrap/Modal'
import { Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import styles from './chat.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom'

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

function getChatUrl(chat) {
  return `/chatroom?ownerToken=${chat.chatID.ownerToken}&uniqueChatID=${chat.chatID.uniqueChatID}`
}

export function ChatRoomList({ chatlist }) {
  const navigate = useNavigate()
  return (
    <>
      {chatlist?.length > 0 ? (
        <ListGroup>
          {chatlist.map((chat, index) => (
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

function ChatMessages({ messages }) {
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ListGroup className={styles.scrollableList} ref={listRef}>
      {messages?.length > 0 ? (
        messages.map((chat, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{chat.from}</div>
              {chat.text}
            </div>
            <Badge className={styles.time}>{`Sent at ${chat.time}`}</Badge>
          </ListGroup.Item>
        ))
      ) : (
        <p className={styles.default}>Begin chatting!</p>
      )}
    </ListGroup>
  )
}

export function ChatBox({ stompClient, chatRoom, messages }) {
  let [searchParams] = useSearchParams()
  const ownerToken = searchParams.get('ownerToken')
  const uniqueChatID = searchParams.get('uniqueChatID')
  const [inputBox, setInputBox] = useState('')
  const auth = useAuth()
  const user = auth.getUserDetails()

  const handleMessageChange = (e) => {
    e.preventDefault()
    setInputBox(e.target.value)
  }

  function sendMessage(message) {
    const username = user.userName
    if (stompClient && stompClient.connected) {
      stompClient.send(
        '/app/chat',
        {},
        JSON.stringify({
          from: username,
          text: message,
          ownerToken: ownerToken,
          uniqueChatID: uniqueChatID,
        })
      )
      setInputBox('')
    } else {
      console.error('Stomp client is not connected')
    }
  }

  return (
    <div className={styles.cardContainer}>
      <Card>
        <Card.Header>{chatRoom?.chatName}</Card.Header>
        <Card.Body>
          <ChatMessages messages={messages} />
          <div className={styles.input}>
            <Form.Control
              type="text"
              value={inputBox}
              onChange={handleMessageChange}
            />
            <Button
              size="sm"
              variant="sucess"
              className={styles.button}
              onClick={() => sendMessage(inputBox)}
            >
              Send
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
