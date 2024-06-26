import React, { useEffect, useState } from 'react';
import styles from './home.module.css';
import { getChats } from '../../services/chatService';

function Home() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const chatsData = await getChats();
      setChats(chatsData);
    };

    fetchChats();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Welcome back!</h1>
      <div className={styles.chats}>
        {chats.length > 0 ? (
          chats.map(chat => (
            <div key={chat.chatID} className={styles.chat}>
              <h2>{chat.chatName}</h2>
            </div>
          ))
        ) : (
          <h2>No Chats Available</h2>
        )}
      </div>
    </div>
  );
}

export default Home;
