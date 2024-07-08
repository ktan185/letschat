import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL
export const signIn = async (userDetails) => {
  return await axios.post(`${API_URL}/api/signIn`, userDetails)
}

export const signUp = async (newUserDetails) => {
  return await axios.post(`${API_URL}/api/signUp`, newUserDetails)
}
