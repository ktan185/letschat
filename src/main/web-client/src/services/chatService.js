import axios from 'axios'

const SERVER_PORT = 'http://localhost:8080'

export const getChats = async () => {
    try {
      const response = await axios.get(`${SERVER_PORT}/chats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  }