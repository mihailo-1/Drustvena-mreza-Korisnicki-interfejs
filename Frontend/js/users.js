function initialize() {
  let addBtn = document.querySelector("#addBtn")
  addBtn.addEventListener("click", function () {
    window.location.href = 'userForm.html'
  })

  getAll()
}

function getAll() {
  fetch('http://localhost:51509/api/users') 
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed. Status: ' + response.status)
      }
      return response.json()
    })
    .then(users => renderData(users))       
    .catch(error => {                       
      console.error('Error:', error.message)
      
      let table = document.querySelector('table')
      if (table) {
        table.style.display = 'none'
      }
      alert('An error occurred while loading the data. Please try again.')
    })

}

function renderData(data) {
  let table = document.querySelector('table tbody')
  table.innerHTML = ''  
  let tableHeader = document.querySelector('table thead') 
  let noDataMessage = document.querySelector('#no-data-message'); 

  
  if (!data || data.length === 0) {
    
    tableHeader.classList.add('hidden');
    noDataMessage.style.display = 'block'; // direktno forsiraj prikaz
    noDataMessage.classList.remove('hidden');

  } else {
    
    let noDataMessage = document.querySelector('#no-data-message');
    if (noDataMessage) {
        noDataMessage.style.display = 'none';
      }
      tableHeader.classList.remove('hidden');
   
    data.forEach(user => {
      let newRow = document.createElement('tr')

     
      let cell1 = document.createElement('td')
      cell1.textContent = user['korisnickoIme']
      newRow.appendChild(cell1)

      
      let cell2 = document.createElement('td')
      cell2.textContent = user['ime']
      newRow.appendChild(cell2)

      
      let cell3 = document.createElement('td')
      cell3.textContent = user['prezime']
      newRow.appendChild(cell3)

      
      let cell4 = document.createElement('td')
      cell4.textContent = user['datumRodjenja'] ? new Date(user['datumRodjenja']).toLocaleDateString('sr-RS') : '/';
      newRow.appendChild(cell4)

      
      let cell5 = document.createElement('td')
      let editButton = document.createElement('button')
      editButton.textContent = 'Edit'
      editButton.addEventListener('click', function () {
        window.location.href = 'userForm.html?id=' + user['id']
      })
      cell5.appendChild(editButton)
      newRow.appendChild(cell5)

      table.appendChild(newRow)
    })
  }
}

document.addEventListener('DOMContentLoaded', initialize)