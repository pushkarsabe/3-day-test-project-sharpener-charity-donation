console.log('inside charity.js ');

const showPopup = (message, isSuccess = true) => {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';

    }, 2000);
};

document.addEventListener('DOMContentLoaded', async() => {
    console.log('inside DOMContentLoaded ');
    const token = localStorage.getItem('token');
    // console.error('token:', token);

    if (!token) {
        showPopup('User not authenticated!', false);
        return;
    }
    try {
        const decoded = jwt_decode(token);
        let userid = decoded.userid;
        console.log('userid = ', userid);

        const res = await axios.get(`http://localhost:5000/user/user-data/${userid}`, {
            headers: { Authorization: token }
        });

        console.log('res:', res.data.singleUserData);
        let user = res.data.singleUserData;

        //update the user profile name
        const userProfileDiv = document.getElementById('userProfile');
        if (userProfileDiv) {
            userProfileDiv.textContent = `Hello, ${user.name}`;
        }

    } catch (err) {
        console.error('Error fetching user data:', err);
    }
})

document.getElementById('charityForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log('inside fund raiser form submit function');

    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) {
        showPopup('User not authenticated!', false);
        return;
    }

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log('data:', data);

    try {
        const response = await axios.post('http://localhost:5000/charity/register-charity', data, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }

        });
        console.log('response = ', response);

        showPopup('Charity successfully submitted!');
        document.getElementById('charityForm').reset();

        setTimeout(() => {
            window.location.href = '/donatekart.html';
        }, 1000);

    } catch (error) {
        console.error('Network error:', error);
        showPopup('An error occurred while submitting the form.', false);
    }
});
