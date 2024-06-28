import axios from 'axios'

const SERVER_PORT = 'http://localhost:8080'

export const getChats = async () => {
  try {
    const response = await axios.get(`${SERVER_PORT}/api/getAllChats`)
    return response.data
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export const getChat=async ({ownerToken,uniqueChatID}) =>{
  try{
    const response= await axios.get(`${SERVER_PORT}/chat?ownerToken=${ownerToken}&uniqueChatID=${uniqueChatID}`)
    return response.data
  }catch(error){
    console.error("Error fetching chats:", error);
    return null
  }
}
