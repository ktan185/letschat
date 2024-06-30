import axios from 'axios'

const SERVER_PORT = 'http://localhost:8080'

export const getAllChats = async () => {
  try {
    const response = await axios.get(`${SERVER_PORT}/api/getAllChats`)
    return response.data
  } catch (error) {
    console.error('Error fetching chats:', error)
  }
}

export const getChat = async (ownerToken, uniqueChatID) => {
  try {
    const response = await axios.get(
      `${SERVER_PORT}/chat?ownerToken=${ownerToken}&uniqueChatID=${uniqueChatID}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching chats:', error)
  }
}

export const createChat = async (payload) => {
  try {
    const userToken = payload.userToken
    const body = payload
    const response = await axios.post(
      `${SERVER_PORT}/api/addChat?userToken=${userToken}`,
      body
    )
    return response.data
  } catch (error) {
    console.error('Error creating a new chat!')
  }
}
