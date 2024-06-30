export function validateEmail(email) {
  const emailRegex =
    /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^-]+(?:\.[a-zA-Z0-9_!#$%&'*+/=?`{|}~^-]+)*@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  return emailRegex.test(email)
}

export function detailsValidation(userDetails) {
  if (!validateEmail(userDetails.email)) {
    alert('Please insert a valid email address.')
    return false
  }

  if (userDetails.firstName === '') {
    alert('Please include your first name')
    return false
  }

  if (userDetails.lastName === '') {
    alert('Please include your last name')
    return false
  }

  if (userDetails.userName === '') {
    alert('Please include your a username')
    return false
  }

  if (userDetails.password === '') {
    alert('Your password cannot be empty')
    return false
  }
  return true
}
