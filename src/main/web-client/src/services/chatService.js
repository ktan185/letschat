import axios from 'axios'

export const getAllChats = async () => {
  try {
    const response = await axios.get(`/api/getAllChats`)
    return response.data
  } catch (error) {
    console.error('Error fetching chats:', error)
  }
}

export const getChat = async ({ ownerToken, uniqueChatID }) => {
  try {
    const response = await axios.get(
      `/chat?ownerToken=${ownerToken}&uniqueChatID=${uniqueChatID}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching chats:', error)
  }
}

export const createChat = async (payload) => {
  try {
    const userToken = payload.userToken
    const body = payload.chatName
    const response = await axios.post(
      `/api/addChat?userToken=${userToken}`,
      body
    )
    return response.data
  } catch (error) {
    console.error('Error creating a new chat!')
  }
}
