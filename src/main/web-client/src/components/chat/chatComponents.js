import { createChat, deleteChat } from '../../services/chatService'
import { useRef, useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthProvider'
import Modal from 'react-bootstrap/Modal'
import { Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import styles from './chat.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { getChatRange } from '../../services/chatService'


export function CreateChat(props) {
  const [chatName, setChatName] = useState('')
  const [chatDescription, setChatDescription] = useState('')
  const auth = useAuth()
  const user = auth.getUserDetails()
  const handleChatNameChange = (e) => {
    setChatName(e.target.value)
  }
  const handleChatDescriptionChange = (e) => {
    setChatDescription(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      createNewChat(e)
    }
  }

  function createNewChat(e) {
    if (chatName === '') {
      alert('Please enter a room name!')
      return
    }
    if (chatDescription === '') {
      alert('Please enter a description!')
      return
    }
    e.preventDefault()
    try {
      const payload = {
        userToken: user.token,
        chatName: chatName,
        description: chatDescription,
      }
      createChat(payload)
      props.onHide(true)
      setChatName('')
      setChatDescription('')
      alert('You have sucessfully created a new chat!')
      props.fetchChats()
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
      className={styles.modal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create a new chat room!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="chatName" onKeyDown={handleKeyDown}>
            <Form.Label>Enter a chatroom name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Chat room name"
              value={chatName}
              onChange={handleChatNameChange}
            />
            <Form.Label>Enter the description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Chat room description"
              value={chatDescription}
              onChange={handleChatDescriptionChange}
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
  const [chatRooms, setChatRooms] = useState([])
  const [hoveredItem, setHoveredItem] = useState(null)

  const handleMouseEnter = (index) => {
    setHoveredItem(index)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  const navigate = useNavigate()
  const SERVER = 'http://localhost:8080'

  useEffect(() => {
    const subscriptions = chatlist.map((chat) => {
      const chatID = chat.chatID
      const ownerToken = chatID.ownerToken
      const uniqueChatID = chatID.uniqueChatID

      const socket = new SockJS(`${SERVER}/chat`)
      const stompClient = Stomp.over(socket)

      stompClient.reconnect_delay = 5000
      stompClient.heartbeat.outgoing = 4000
      stompClient.heartbeat.incoming = 4000

      stompClient.connect({}, function (frame) {
        stompClient.subscribe(
          `/topic/numUsers/${ownerToken}${uniqueChatID}`,
          function (userListOutput) {
            const decodedUserList = new TextDecoder().decode(
              userListOutput._binaryBody
            )
            const numUsers = JSON.parse(decodedUserList)

            setChatRooms((prevChatRooms) => {
              const existingIndex = prevChatRooms.findIndex(
                (room) =>
                  room.chatID.ownerToken === ownerToken &&
                  room.chatID.uniqueChatID === uniqueChatID
              )

              if (existingIndex !== -1) {
                const updatedRooms = [...prevChatRooms]
                updatedRooms[existingIndex] = {
                  ...updatedRooms[existingIndex],
                  numUsers: numUsers,
                }
                return updatedRooms
              } else {
                return [...prevChatRooms, { ...chat, numUsers: numUsers }]
              }
            })
          }
        )

        stompClient.send(
          '/app/getNumUsers',
          {},
          JSON.stringify({
            ownerToken: ownerToken,
            uniqueChatID: uniqueChatID,
          })
        )
      })

      return stompClient
    })

    return () => {
      subscriptions.forEach((client) => client.disconnect())
    }
  }, [chatlist])

  return (
    <>
      {chatRooms?.length > 0 ? (
        <ListGroup className={styles.scrollableList}>
          {chatRooms.map((chat, index) => {
            return (
              <ListGroup.Item
                className={`d-flex justify-content-between align-items-start`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                key={index}
                action
                onClick={() => navigate(getChatUrl(chat))}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{chat.chatName}</div>
                  Description: {chat.description}
                </div>
                <div className={styles.badgeContainer}>
                  <Badge bg="primary" pill>
                    users chatting: {chat.numUsers}
                  </Badge>
                  <DeleteChatButton
                    index={index}
                    hoveredItem={hoveredItem}
                    chat={chat}
                  />
                </div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      ) : (
        <h2>No Chats Available</h2>
      )}
    </>
  )
}

function ChatMessages({
  messages,
  setMessages,
  setLowerBound,
  setUpperBound,
  upperBound,
  increment
}) {
  let [searchParams] = useSearchParams()
  const ownerToken = searchParams.get('ownerToken')
  const uniqueChatID = searchParams.get('uniqueChatID')
  const listRef = useRef(null)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleScroll = async (e) => {
    if (e.currentTarget.scrollTop === 0) {
      const newLowerBound = upperBound;
      const newUpperBound = upperBound + increment;
      setLowerBound(newLowerBound);
      setUpperBound(newUpperBound);

      const chatMessages = await getChatRange(ownerToken, uniqueChatID, newLowerBound, newUpperBound);

      if (chatMessages && chatMessages.length > 0) {

        if (listRef.current) {
          const prevScrollHeight = listRef.current.scrollHeight;

          setMessages((prevMessages) => chatMessages.concat(prevMessages));


          setTimeout(() => {
            if (listRef.current) {
              const newScrollHeight = listRef.current.scrollHeight;
              const scrollHeightIncrease = newScrollHeight - prevScrollHeight;

              listRef.current.scrollTop = scrollHeightIncrease;
            }
          }, 0); 
        }
      }
    }
  };

  return (
    <ListGroup className={styles.scrollableList} ref={listRef} onScroll={handleScroll}>
      {messages?.length > 0 ? (
        messages.map((chat, index) => (
          <ListGroup.Item key={index} className={styles.chatMessageContainer}>
            <div className={styles.text}>
              <div className={styles.title}>{chat.from}</div>
              {chat.text}
            </div>
            <Badge>{`Sent at ${chat.time}`}</Badge>
          </ListGroup.Item>
        ))
      ) : (
        <p className={styles.default}>Begin chatting!</p>
      )}
    </ListGroup>
  )
}

export function ChatBox({
  stompClient,
  chatRoom,
  messages,
  userList,
  userTypingList,
  setMessages,
  setLowerBound,
  setUpperBound,
  upperBound,
  increment
}) {
  let [searchParams] = useSearchParams()
  const ownerToken = searchParams.get('ownerToken')
  const uniqueChatID = searchParams.get('uniqueChatID')
  const [inputBox, setInputBox] = useState('')
  const auth = useAuth()
  const user = auth.getUserDetails()

  const handleMessageChange = (e) => {
    e.preventDefault()
    setInputBox(e.target.value)
    stompClient.send(
      '/app/typing',
      {},
      JSON.stringify({
        chatID: {
          ownerToken: ownerToken,
          uniqueChatID: uniqueChatID,
        },
        user: user,
      })
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage(inputBox)
    }
  }

  function sendMessage(message) {
    if (message === '') return

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
    <Card>
      Number Of Users Currently Active: {userList.length}
      <Card.Header>{chatRoom?.chatName}</Card.Header>
      <Card.Body>
        <ChatMessages
          messages={messages}
          setMessages={setMessages}
          setLowerBound={setLowerBound}
          setUpperBound={setUpperBound}
          upperBound={upperBound}
          increment={increment} />
        <TypingList list={userTypingList} />
        <div className={styles.input}>
          <Form.Control
            type="text"
            value={inputBox}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
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
  )
}

function TypingList({ list }) {
  return (
    <div>
      {list.length > 0 && (
        <div>
          {list.map((user1, index) => (
            <span key={user1.userName}>
              {index > 0 && ', '}
              {user1.userName}
            </span>
          ))}
          {list.length === 1 ? ' is typing...' : ' are typing...'}
        </div>
      )}
    </div>
  )
}

function DeleteChatButton({ index, hoveredItem, chat }) {
  const auth = useAuth()
  const user = auth.getUserDetails()

  const handleDelete = async (e) => {
    e.stopPropagation()
    const token = user.token
    const uniqueChatID = chat.chatID.uniqueChatID
    try {
      await deleteChat(token, uniqueChatID)
      alert('Chat has been deleted!')
    } catch (err) {
      alert('Something when wrong...')
    }
  }

  return (
    <div className={styles.deleteContainer} onClick={handleDelete}>
      {hoveredItem === index && user.token === chat.chatID.ownerToken && (
        <>
          <p>Delete chat? </p>
          <img
            className={styles.delete}
            src="/delete.png"
            alt="Delete Chat"
          ></img>
        </>
      )}
    </div>
  )
}
