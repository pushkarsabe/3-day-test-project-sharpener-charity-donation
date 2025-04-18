let HOST = 'localhost';
// let HOST = '16.16.201.152';

console.log('signup.js loaded');
document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Submit event triggered');
    submitData();
});

document.getElementById('loginBtn').addEventListener('click', function () {
    window.location.href = './login.html';
});

//function to display the message
function showMessage(msgText, className) {
    return new Promise(resolve => {
        const msg = document.getElementById('message');
        const div = document.createElement('div');
        const textNode = document.createTextNode(msgText);
        div.appendChild(textNode);
        msg.appendChild(div);
        msg.classList.add(className);

        setTimeout(() => {
            msg.classList.remove(className);
            msg.removeChild(div);
            resolve();
        }, 2000);
    })
}

async function submitData() {
    // Get values from the form
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const phoneNumber = document.getElementById('inputPhoneNumber').value;
    const password = document.getElementById('inputPassword').value;
    console.log('name = ' + name);
    console.log('email = ' + email);
    console.log('password = ' + password);
    console.log('phoneNumber = ' + phoneNumber);

    if (name == "" || email == "" || phoneNumber == "" || password == "") {
        console.log('data is missing');
        await showMessage('Data is missing', 'failureMessage');
    } else {
        const obj = {
            name: name,
            email: email,
            password: password,
            phoneNumber: phoneNumber
        }
        try {
            const response = await axios.post(`http://${HOST}:5000/user/signup`, obj);

            console.log('data added');
            console.log('response data = ' + JSON.stringify(response));
            console.log('response name = ' + response.data.newUserData.name);
            console.log('response email = ' + response.data.newUserData.email);
            console.log('response phoneNumber = ' + response.data.newUserData.phoneNumber);
            console.log('response password = ' + response.data.newUserData.password);

            await showMessage('User Signup Successful', 'succesMessage');

        } catch (error) {
            console.error('Error during form submission:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Something went wrong!';
            await showMessage(errorMessage, 'failureMessage');
        }
    }
    //to clear the input feilds after user clicks on submit
    document.getElementById('inputName').value = "";
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputPhoneNumber').value = "";
    document.getElementById('inputPassword').value = "";

}//submitData
