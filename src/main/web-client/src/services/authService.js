import axios from 'axios'

const SERVER_PORT = 'http://localhost:8080'

export const signIn = async (userDetails) => {
  return await axios.post(`${SERVER_PORT}/api/signIn`, userDetails)
}

export const signUp = async (newUserDetails) => {
  return await axios.post(`${SERVER_PORT}/api/signUp`, newUserDetails)
}
