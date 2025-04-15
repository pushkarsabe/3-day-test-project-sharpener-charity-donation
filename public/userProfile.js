console.log('user profile js file');

function showPopup(message, type = 'success') {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.classList.add('popup');
    popup.classList.add(type === 'success' ? 'popup-success' : 'popup-error');

    document.body.appendChild(popup);

    // Animate fade in
    setTimeout(() => {
        popup.style.opacity = '1';
    }, 10);

    // Fade out and remove after 3 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('inside DOMContentLoaded');
    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) {
        showPopup('Token not found', 'error');
        console.error('Token not found');
        return;
    }

    try {
        const decoded = jwt_decode(token);
        let userid = decoded.userid;
        console.log('userid:', userid);

        const response = await axios.get(`http://localhost:5000/user/user-data/${userid}`, {
            headers: { Authorization: token }
        });

        if (response.data.message === 'success') {
            console.log('response:', response.data.singleUserData);
            showPopup('Fetched user data', 'success');


            const { name, email, phoneNumber } = response.data.singleUserData;
            document.getElementById('name').textContent = name;
            document.getElementById('email').textContent = email;
            document.getElementById('phone').textContent = phoneNumber;

            //update the user profile name
            const userProfileDiv = document.getElementById('userProfile');
            if (userProfileDiv) {
                userProfileDiv.textContent = `Hello, ${name}`;
            }

        } else {
            console.error('Failed to fetch user data');
            showPopup('Failed to fetch user data', 'error');

        }
    } catch (err) {
        console.error('Error fetching charity data:', err);
    }

})

document.getElementById('editProfileBtn').addEventListener('click', edit);

const editBtn = document.getElementById('editProfileBtn');
const popupOverlay = document.getElementById('popupOverlay');
const saveBtn = document.getElementById('saveBtn');
const closeBtn = document.getElementById('closeBtn');

function edit() {
    console.log('Edit profile clicked');
    // Get existing user data from the page
    const name = document.getElementById('name')?.textContent || '';
    const email = document.getElementById('email')?.textContent || '';
    const phone = document.getElementById('phone')?.textContent || '';
    console.log('name = ' + name);
    console.log('email = ' + email);
    console.log('phone = ' + phone);

    // Set values into popup input fields
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPhone').value = phone;

    // Show popup
    popupOverlay.style.display = 'flex';
}

// Open popup on edit icon click
editBtn.addEventListener('click', edit);

// Close popup
closeBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

//save btn after editing data
saveBtn.addEventListener('click', async () => {
    console.log('save profile clicked');

    const updatedName = document.getElementById('editName').value;
    const updatedEmail = document.getElementById('editEmail').value;
    const updatedPhone = document.getElementById('editPhone').value;
    console.log('updatedName = ' + updatedName);
    console.log('updatedEmail = ' + updatedEmail);
    console.log('updatedPhone = ' + updatedPhone);

    try {
        const token = localStorage.getItem('token');
        console.log('token:', token);

        if (!token) {
            showPopup('Token not found', 'error');
            console.error('Token not found');
            return;
        }
        let obj = {
            name: updatedName,
            email: updatedEmail,
            phoneNumber: updatedPhone
        }

        const response = await axios.put(`http://localhost:5000/user/user-update`, obj, {
            headers: { Authorization: token }
        });
        console.log('response:', response.data.updatedUser);

        let user = response.data.updatedUser;

        // Optionally update UI with new values
        document.getElementById('name').textContent = user.name
        document.getElementById('email').textContent = user.email;
        document.getElementById('phone').textContent = user.phoneNumber;

        //update the username inside the profile
        document.getElementById('userProfile').textContent = `Hello, ${user.name}`;

        popupOverlay.style.display = 'none';
        showPopup('Profile updated successfully!', 'success');
    } catch (err) {
        console.error('Error updating profile:', err);
        showPopup('Failed to update profile', 'error');
    }
});




















