//local variables
const HOST = 'localhost';
console.log('admin login.js loaded');

document.getElementById('signupBtn').addEventListener('click', function () {
    window.location.href = './adminSignup.html';
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log('Submit event triggered');
    // Get values from the form
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;

    console.log('password = ' + password);
    console.log('email = ' + email);;

    if (email === "" || password === "") {
        console.log("Empty Admin fields");
        await showMessage('Data is missing', 'failureMessage');
    }
    else {
        const obj = {
            email: email,
            password: password
        }

        try {
            const response = await axios.post(`http://${HOST}:5000/admin/login`, obj);
            console.log('response  = ', response);
            //this will give the data inside the array
            console.log('email = ' + response.data.adminDetails.email);
            console.log('token = ' + response.data.token);
            localStorage.setItem('token', response.data.token);

            await showMessage('Email and Password verified', 'succesMessage');

            //user will be redirected to home page after 2 sec of login
            setTimeout(() => {
                window.location.href = './adminDashboard.html';
            }, 1000);
        }
        catch (error) {
            let errorMessage = 'An unexpected error occurred';

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = 'Invalid password';
                        break;
                    case 403:
                        errorMessage = 'Access forbidden';
                        break;
                    case 404:
                        errorMessage = 'Admin not found';
                        break;
                    default:
                        errorMessage = error.response.data.message || 'Server error';
                }
            } else if (error.request) {
                errorMessage = 'No response from server';
            }
            await showMessage(errorMessage, 'failureMessage');
        }
    }

    //to clear the fields
    document.getElementById('inputEmail').value = "";
    document.getElementById('inputPassword').value = "";
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
