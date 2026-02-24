function initializeForm() {

  let submitBtn = document.querySelector("#submitBtn")
  submitBtn.addEventListener("click", submit)

  let cancelBtn = document.querySelector("#cancelBtn")
  cancelBtn.addEventListener("click", function () {
    window.location.href = 'users.html'
  })

  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id') 

  if (!id) { 
    document.getElementById('addTitle').style.display = 'block';
    document.getElementById('editTitle').style.display = 'none';
    return
  }

  document.getElementById('addTitle').style.display = 'none';
  document.getElementById('editTitle').style.display = 'block';

  get(id)
}

function get(id) {

  fetch('http://localhost:51509/api/users/' + id)
    .then(response => {
      if (!response.ok) {
        
        const error = new Error('Request failed. Status: ' + response.status)
        error.response = response 
        throw error  
      }
      return response.json()
    })
    .then(user => { 
      document.querySelector('#username').value = user.username
      document.querySelector('#firstName').value = user.firstName
      document.querySelector('#lastName').value = user.lastName
      const formatted = new Date(user.dateOfBirth).toISOString().split('T')[0]; 
      document.querySelector('#dateOfBirth').value = formatted
    })
    .catch(error => {
      console.error('Error:', error.message)
      if (error.response && error.response.status === 404) {
        alert('user does not exist!')
      } else {
        alert('An error occurred while loading the data. Please try again.')
      }
    })
}

function submit() {
  const form = document.querySelector('#form')
  const formData = new FormData(form)

  const reqBody = {
    username: formData.get('username'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    dateOfBirth: new Date(formData.get('dateOfBirth'))
  }

  const usernameErrorMessage = document.querySelector('#usernameError')
  usernameErrorMessage.textContent = ''
  const firstNameErrorMessage = document.querySelector('#firstNameError')
  firstNameErrorMessage.textContent = ''
  const lastNameErrorMessage = document.querySelector('#lastNameError')
  lastNameErrorMessage.textContent = ''
  const dateOfBirthErrorMessage = document.querySelector('#dateOfBirthError')
  dateOfBirthErrorMessage.textContent = ''

  if (reqBody.username.trim() === '') { 
    usernameErrorMessage.textContent = 'Username field is required.'
    return
  }
  if (reqBody.firstName.trim() === '') {
    firstNameErrorMessage.textContent = 'First name field is required.'
    return
  }
  if (reqBody.lastName.trim() === '') {
    lastNameErrorMessage.textContent = 'Last name field is required.'
    return
  }

  if (!formData.get('dateOfBirth')) {
    dateOfBirthErrorMessage.textContent = 'Date of birth field is required.'
    return
  }

  let method = 'POST'
  let url = 'http://localhost:51509/api/users'
  
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  if (id) {
    method = 'PUT'
    url = 'http://localhost:51509/api/users/' + id
  }

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  })
    .then(response => {
      if (!response.ok) {
        
        const error = new Error('Request failed. Status: ' + response.status)
        error.response = response 
        throw error  
      }
      return response.json()
    })
    .then(data => {
      window.location.href = '../users.html'
    })
    .catch(error => {
      console.error('Error:', error.message)
      
      if (error.response && error.response.status === 404) {
        alert('User does not exist!')
      }
      else if (error.response && error.response.status === 400) {
        alert('Data is invalid!')
      }
      else {
        alert('An error occurred while updating the data. Please try again.')
      }
    })
}

document.addEventListener('DOMContentLoaded', initializeForm)