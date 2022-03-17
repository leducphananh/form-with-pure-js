const tableElement = document.querySelector('.table');
const tbodyElement = tableElement.querySelector('tbody');
const formElement = document.querySelector('#form');
const submitButtonElement = document.querySelector('button[type="submit"]');
const updateButtonElement = document.getElementById('btn-update');

class User {
    constructor(id, name, gender, dob, phone, email, address, description, level) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.description = description;
        this.level = level;
    }
}

let listUsers = [];
// console.log(localStorage.getItem('listUsers'))
if (localStorage.getItem('listUsers') != null) {
    listUsers = JSON.parse(localStorage.getItem('listUsers'));
}

const hadId = (id) => {
    return listUsers.some((user) => user.id === id);
}

const getUserById = (id) => {
    for (let i = 0; i < listUsers.length; i++) {
        if (listUsers[i].id == id) return listUsers[i];
    }
    return null;
}

const renderUI = (listUsers) => {
    let usersHTML = listUsers.reduce((output, user) => {
        return output +
            `<tr>
                <td>${user.name}</td>
                <td>${user.gender}</td>
                <td>${user.dob}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.address}</td>
                <td>${user.description}</td>
                <td>${user.level}</td>
                <td>
                    <a href=""  id="edit-button-${user.id}">Edit</a>
                     | 
                    <a href=""  id="delete-button-${user.id}">Delete</a>
                </td>
            </tr>`
    }, '');

    tbodyElement.innerHTML = usersHTML;

    // Save to localStorage
    localStorage.setItem('listUsers', JSON.stringify(listUsers));
}

// const resetForm = () => {
//     document.getElementById('name').value = '';
//     document.querySelector('input[name="gender" id="male"]').checked = true;
//     document.getElementById('dob').value = '';
//     document.getElementById('phone').value = '';
//     document.getElementById('email').value = '';
//     document.getElementById('address').value = '';
//     document.getElementById('description').value = '';
//     let inputCheckboxElements = document.querySelectorAll('input[name="level"]');
//     for (let i = 0; i < inputCheckboxElements.length; i++) {
//         inputCheckboxElements[i].checked = false;
//     }
// }

renderUI(listUsers);

// Handle submit form
const submitForm = () => {
    // Get value from form
    let name = document.getElementById('name').value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let dob = document.getElementById('dob').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let description = document.getElementById('description').value;
    let checkedValue = '';
    let inputCheckboxElements = document.querySelectorAll('input[name="level"]');
    for (let i = 0; i < inputCheckboxElements.length; i++) {
        if (inputCheckboxElements[i].checked) {
            checkedValue += inputCheckboxElements[i].value + ', ';
        }
    }
    checkedValue = checkedValue.slice(0, checkedValue.length - 2);

    // Random id
    const id = Math.floor(Math.random() * 10000);
    while (hadId(id)) {
        id = Math.floor(Math.random() * 10000);
    }

    // Init new user
    let user = new User(id, name, gender, dob, phone, email, address, description, checkedValue);
    listUsers.push(user);

    // Re-render UI
    renderUI(listUsers);
    location.reload();
}

// Add event for edit and delete
for (let i = 0; i < listUsers.length; i++) {
    let user = listUsers[i];
    let editButtonElement = document.getElementById(`edit-button-${user.id}`);
    let deleteButtonElement = document.getElementById(`delete-button-${user.id}`);

    // Add event for edit button
    editButtonElement.onclick = (e) => {
        e.preventDefault();
        document.getElementById('id').value = user.id;
        document.getElementById('name').value = user.name;
        if (user.gender === 'Male') {
            document.querySelector('input[id="male"]').checked = true;
        } else {
            document.querySelector('input[id="female"]').checked = true;
        }
        document.getElementById('dob').value = user.dob;
        document.getElementById('phone').value = user.phone;
        document.getElementById('email').value = user.email;
        document.getElementById('address').value = user.address;
        document.getElementById('description').value = user.description;
        let inputCheckboxElements = document.querySelectorAll('input[name="level"]');
        let checkedValue = user.level.split(', ');
        for (let i = 0; i < inputCheckboxElements.length; i++) {
            if (checkedValue.includes(inputCheckboxElements[i].value)) {
                inputCheckboxElements[i].checked = true;
            } else {
                inputCheckboxElements[i].checked = false;
            }
        }
        submitButtonElement.classList.add('btn-inactive');
        submitButtonElement.classList.remove('btn-active');
        updateButtonElement.classList.add('btn-active');
        updateButtonElement.classList.remove('btn-inactive');
    }

    // Add event for delete button 
    deleteButtonElement.onclick = (e) => {
        e.preventDefault();
        listUsers.splice(listUsers.indexOf(user), 1);

        renderUI(listUsers);
        location.reload();
    }
}

// Add event for update button
updateButtonElement.onclick = (e) => {
    e.preventDefault();

    // Get value from form
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let dob = document.getElementById('dob').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;
    let description = document.getElementById('description').value;
    let checkedValue = '';
    let inputCheckboxElements = document.querySelectorAll('input[name="level"]');
    for (let i = 0; i < inputCheckboxElements.length; i++) {
        if (inputCheckboxElements[i].checked) {
            checkedValue += inputCheckboxElements[i].value + ', ';
        }
    }
    checkedValue = checkedValue.slice(0, checkedValue.length - 2);

    let user = getUserById(id);
    // console.log(user);
    if (user === null) return;
    user.name = name;
    user.gender = gender;
    user.dob = dob;
    user.phone = phone;
    user.email = email;
    user.address = address;
    user.description = description;
    user.level = checkedValue;

    let index = listUsers.indexOf(user);
    listUsers[index] = user;

    renderUI(listUsers);
    submitButtonElement.classList.add('btn-active');
    submitButtonElement.classList.remove('btn-inactive');
    updateButtonElement.classList.add('btn-inactive');
    updateButtonElement.classList.remove('btn-active');
    location.reload();
}
