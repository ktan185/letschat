import { useSearchParams } from 'react-router-dom';
import styles from './chat.module.css'
import SockJS from 'sockjs-client';
import { useEffect } from 'react';
import { Client, Stomp } from '@stomp/stompjs';

function ChatRoom() {
    let [searchParams, setSearchParams] = useSearchParams();
    const ownerToken = searchParams.get('ownerToken');
    const uniqueChatID = searchParams.get('uniqueChatID');
    const serverPort = 'http://localhost:8080'
    const stompClient = new Stomp();

    useEffect(() => {
        const socket = new SockJS(`${serverPort}/chat`);

        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`topic/messages/${ownerToken}${uniqueChatID}`)
        })
        return () => {
            if (stompClient != null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        }
    }, [ownerToken, uniqueChatID]);


    return (
        <div className={styles.container}>Welcome the owner of this chat is {ownerToken} and the uniqueChatID is {uniqueChatID}</div>
    )
}
export default ChatRoom