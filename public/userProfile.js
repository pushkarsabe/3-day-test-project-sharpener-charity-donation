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
        showPopup('Access denied: Please log in first.', 'error');
        console.error('Token not found');
        setTimeout(() => {
            window.location.href = "/login.html"
        }, 2000)
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

            const { name, email, phoneNumber, donations } = response.data.singleUserData;
            document.getElementById('name').textContent = name;
            document.getElementById('email').textContent = email;
            document.getElementById('phone').textContent = phoneNumber;

            //update the user profile name
            const userProfileDiv = document.getElementById('userProfile');
            if (userProfileDiv) {
                userProfileDiv.textContent = `Hello, ${name}`;
            }

            // also display the total donations here
            const userTotalDonations = document.getElementById('userTotalDonations');

            userTotalDonations.innerHTML = `
                    <div class="donation-card">
                        <h3>Total Donations</h3>
                        <p>₹${donations.toLocaleString()}</p>
                    </div>
                `;

        } else {
            console.error('Failed to fetch user data');
            showPopup('Failed to fetch user data', 'error');

        }
    } catch (err) {
        console.error('Error fetching charity data:', err);
    }

})

document.getElementById('showDonationRecordBtn').addEventListener('click', async () => {
    console.log('showDonationRecordBtn called');

    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) {
        showPopup('Token not found', 'error');
        console.error('Token not found');
        return;
    }

    try {
        const response = await axios.get(`http://localhost:5000/purchase/getOrderData/`, {
            headers: { Authorization: token }
        });

        const orders = response.data.allOrderData;
        console.log('res:', orders);

        displayOrders(orders);

        // Make the table visible
        const table = document.getElementById('donationRecordsTable');

        if (table) {
            table.style.display = 'table'; // or 'block' depending on your CSS
        }
    } catch (err) {
        console.error('Error fetching order data:', err);
    }
});


document.getElementById('hideDonationRecordBtn').addEventListener('click', () => {
    document.getElementById('donationRecordsTable').style.display = 'none'; // Hide table after clicking on hide donations
    document.getElementById('hideDonationRecordBtn').style.display = 'none'; // Hide dhide records button
});


function displayOrders(orders) {
    console.log('displayOrders called');
    console.log('orders:', orders);

    const tableBody = document.querySelector('#donationRecordsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (!orders || orders.length === 0) {

        showPopup('No donation records found', 'error');
        tableBody.innerHTML = '<tr><td colspan="3">No donation records found.</td></tr>';
        return;
    }

    orders.forEach((order, index) => {
        const row = document.createElement('tr');

        // Format date
        const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.charityId?.name || 'N/A'}</td>
            <td>${date}</td>
            <td>${order.paymentid}</td>
            <td>${order.status}</td>
            <td>${order.amount ?? 'N/A'}</td>
        `;

        tableBody.appendChild(row);
    });

    document.getElementById('hideDonationRecordBtn').style.display = 'inline-block'; // or 'block'
}


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




















