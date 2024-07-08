import { useSearchParams } from 'react-router-dom'
import styles from './chatroom.module.css'
import SockJS from 'sockjs-client'
import { useState, useEffect, useRef } from 'react'
import { Stomp } from '@stomp/stompjs'
import { useAuth } from '../../contexts/AuthProvider'
import { ChatBox } from '../../components/chat/chatComponents'
import { getChat, getChatRange } from '../../services/chatService'

export function ChatRoom() {
  let [searchParams] = useSearchParams()
  const [chatRoom, setChatRoom] = useState(null)
  const [userList, setUserList] = useState([])
  const [userTypingList, setUserTypingList] = useState([])
  const auth = useAuth()
  const user = auth.getUserDetails()
  const ownerToken = searchParams.get('ownerToken')
  const uniqueChatID = searchParams.get('uniqueChatID')
  const SERVER = process.env.REACT_APP_API_URL
  const [messages, setMessages] = useState([])
  const [stompClient, setStompClient] = useState(null)
  const increment = 15
  const [lowerBound, setLowerBound] = useState(0)
  const [upperBound, setUpperBound] = useState(increment)
  const typingTimeouts = useRef({})

  useEffect(() => {
    const fetchChatRoom = async () => {
      const chat = await getChat(ownerToken, uniqueChatID)
      const chatMessages = await getChatRange(
        ownerToken,
        uniqueChatID,
        lowerBound,
        upperBound
      )
      setChatRoom(chat)
      setMessages(chatMessages)
    }
    fetchChatRoom()
  }, [])

  useEffect(() => {
    const socket = new SockJS(`${SERVER}/chat`)
    const tempStompClient = Stomp.over(socket)
    tempStompClient.reconnect_delay = 5000
    tempStompClient.heartbeat.outgoing = 4000
    tempStompClient.heartbeat.incoming = 4000
    setStompClient(tempStompClient)

    tempStompClient.connect({}, function (frame) {
      tempStompClient.subscribe(
        `/topic/connected/${ownerToken}${uniqueChatID}`,
        function (userListOutput) {
          const decodedUserList = new TextDecoder().decode(
            userListOutput._binaryBody
          )
          const tempUserList = JSON.parse(decodedUserList)
          setUserList(tempUserList)
        }
      )
      tempStompClient.send(
        '/app/connected',
        {},
        JSON.stringify({
          chatID: {
            ownerToken: ownerToken,
            uniqueChatID: uniqueChatID,
          },
          user: user,
        })
      )
      tempStompClient.subscribe(
        `/topic/messages/${ownerToken}${uniqueChatID}`,
        function (messageOutput) {
          const messageString = new TextDecoder().decode(
            messageOutput._binaryBody
          )
          const messageJSON = JSON.parse(messageString)
          setMessages((messages) => [...messages, messageJSON])
        }
      )
      tempStompClient.subscribe(
        `/topic/typing/${ownerToken}${uniqueChatID}`,
        function (userOutput) {
          const userMessage = new TextDecoder().decode(userOutput._binaryBody)
          const user = JSON.parse(userMessage)

          setUserTypingList((userTypingList) => {
            const existingUserIndex = userTypingList.findIndex(
              (u) => u.userName === user.userName
            )
            if (user.userName === auth.getUserDetails().userName)
              return userTypingList

            if (existingUserIndex !== -1) {
              clearTimeout(typingTimeouts.current[user.userName])
            } else {
              userTypingList = [...userTypingList, user]
            }

            typingTimeouts.current[user.userName] = setTimeout(() => {
              setUserTypingList((userTypingList) => {
                const updatedList = userTypingList.filter(
                  (u) => u.userName !== user.userName
                )
                return updatedList
              })
            }, 5000)

            return userTypingList
          })
        }
      )
    })
    return () => {
      if (tempStompClient) {
        tempStompClient.disconnect()
      }
    }
  }, [ownerToken, uniqueChatID])

  return (
    <>
      <div className={styles.container}>
        <ChatBox
          chatRoom={chatRoom}
          stompClient={stompClient}
          userList={userList}
          userTypingList={userTypingList}
          setMessages={setMessages}
          messages={messages}
          setLowerBound={setLowerBound}
          setUpperBound={setUpperBound}
          upperBound={upperBound}
          increment={increment}
        />
      </div>
    </>
  )
}

export default ChatRoom
