import axios from 'axios'

const SERVER_PORT = process.env.SERVER_PORT

export const signIn = async (userDetails) => {
  return await axios.post(`${SERVER_PORT}/signIn`, userDetails)
}
