import { useSearchParams } from 'react-router-dom'
import styles from './chatroom.module.css'
import SockJS from 'sockjs-client'
import { useState, useEffect } from 'react'
import { Stomp } from '@stomp/stompjs'
import { useAuth } from '../../contexts/AuthProvider'
import { ChatBox } from '../../components/chat/chatComponents'
import { getChat } from '../../services/chatService'

export function ChatRoom() {
  let [searchParams] = useSearchParams()
  const [chatRoom, setChatRoom] = useState(null)
  const [userList, setUserList] = useState([])
  const auth = useAuth()
  const user = auth.getUserDetails()
  const ownerToken = searchParams.get('ownerToken')
  const uniqueChatID = searchParams.get('uniqueChatID')
  const SERVER = 'http://localhost:8080'
  const [messages, setMessages] = useState([])
  const [stompClient, setStompClient] = useState(null)

  useEffect(() => {
    const fetchChatRoom = async () => {
      const chat = await getChat(ownerToken, uniqueChatID)
      setChatRoom(chat)
      setMessages(chat.chatMessages)
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
              const tempUserList=JSON.parse(decodedUserList);
              setUserList(tempUserList)
            }
          )
        tempStompClient.send(
            '/app/connected',
            {},
            JSON.stringify({
                chatID:{
                    ownerToken:ownerToken,
                    uniqueChatID:uniqueChatID
                },
                user:user
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
          messages={messages}
          userList={userList}
        />
      </div>
    </>
  )
}

export default ChatRoom
