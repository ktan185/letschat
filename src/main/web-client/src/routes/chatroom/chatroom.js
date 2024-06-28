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
  const auth = useAuth()
  const user = auth.getUserDetails()
  const ownerToken = searchParams.get('ownerToken')
  const uniqueChatID = searchParams.get('uniqueChatID')
  const SERVER = 'http://localhost:8080'
  const [messages, setMessages] = useState([])
  const [stompClient, setStompClient] = useState(null)

  useEffect(() => {
    const fetchChatRoom = async () => {
      const res = await getChat(ownerToken, uniqueChatID)
      setChatRoom(res)
      console.log('This is the chatRoom metadata: ', res)
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
      console.log(`/topic/messages/${ownerToken}${uniqueChatID}`)
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
      console.log('Disconnected')
    }
  }, [ownerToken, uniqueChatID])

  function sendMessage() {
    const username = user.userName
    if (stompClient && stompClient.connected) {
      stompClient.send(
        '/app/chat',
        {},
        JSON.stringify({
          from: username,
          text: 'Testing what happens',
          ownerToken: ownerToken,
          uniqueChatID: uniqueChatID,
        })
      )
    } else {
      console.error('Stomp client is not connected')
    }
  }

  return (
    <>
      <div className={styles.container}>
        Welcome the owner of this chat is {ownerToken} and the uniqueChatID is{' '}
        {uniqueChatID}
        <ChatBox chatRoom={chatRoom} send={sendMessage} messages={messages} />
      </div>
    </>
  )
}

export default ChatRoom
