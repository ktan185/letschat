import { useSearchParams } from 'react-router-dom';
import styles from './chatroom.module.css'
import SockJS from 'sockjs-client';
import { useState, useEffect } from 'react';
import { Client, Stomp } from '@stomp/stompjs';
import { useAuth } from '../../contexts/AuthProvider'

export function ChatRoom() {

    let [searchParams, setSearchParams] = useSearchParams();
    const auth = useAuth()
    const user = auth.getUserDetails();
    const ownerToken = searchParams.get('ownerToken');
    const uniqueChatID = searchParams.get('uniqueChatID');
    const serverPort = 'http://localhost:8080'
    const [messages, setMessages] = useState([])
    const [stompClient, setStompClient] = useState(null)

    useEffect(() => {
        const socket = new SockJS(`${serverPort}/chat`);
        const tempStompClient = Stomp.over(socket);
        setStompClient(tempStompClient)
        tempStompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            console.log(`/topic/messages/${ownerToken}${uniqueChatID}`)
            tempStompClient.subscribe(`/topic/messages/${ownerToken}${uniqueChatID}`,
                function (messageOutput) {
                    setMessages((messages) => [...messages, messageOutput])
                }
            )
        })
        return () => {
            if (tempStompClient != null) {
                tempStompClient.disconnect();
            }
            console.log("Disconnected");
        }

    }, [ownerToken, uniqueChatID]);

    useEffect(() => {
        console.log(messages)
    }, [messages]);

    function sendMessage() {
        const username = user.userName
        stompClient.send("/app/chat", {}, JSON.stringify({ 'from': username, 'text': ' ', 'chatID': `${ownerToken}${uniqueChatID}` }))
    }

    return (
        <>
            <div className={styles.container}>Welcome the owner of this chat is {ownerToken} and the uniqueChatID is {uniqueChatID}</div>
            <button className={styles.button} onClick={sendMessage}>CLICK TO SEND DEMO WEBSOCKET</button>
        </>

    )
}
export default ChatRoom