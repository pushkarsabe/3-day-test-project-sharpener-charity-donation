console.log('admin dashboard js file');

const HOST = 'localhost';

function showMessage(message, type) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;
    messageContainer.textContent = message;

    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        console.log('token = ', token);

        if (!token) {
            console.log('admin do not have token');
            showMessage('Admin do not have token', 'failure');
            return;
        }

        const response1 = await axios.get(`http://${HOST}:5000/admin/userData`, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log('response1 = ', response1);

        displayUser(response1.data.getAllUserData);

        const response2 = await axios.get(`http://${HOST}:5000/admin/charityData`, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log('response2 = ', response2);

        displayCharity(response2.data.getAllCharityData);

    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Failed to fetch data', 'failure');
    }
})

function displayUser(users) {
    if (!users) {
        console.error('Error: No users data found');
        return;
    }

    const userCardsContainer = document.getElementById('userCards');
    userCardsContainer.innerHTML = '';

    users.forEach(user => {
        // olny display user which is not deleted
        if (!user.isDeleted) {
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `user-card-${user._id}`; // Set unique ID for the card element

            card.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phoneNumber || 'N/A'}</p>
                <p><strong>ID:</strong> ${user._id}</p>
                <button onclick="deleteUser('${user._id}')">Delete</button>
            `;
            userCardsContainer.appendChild(card);
        }
    });
}

function displayCharity(charities) {
    const charityCardsContainer = document.getElementById('charityCards');
    if (!charityCardsContainer) {
        console.error('Element with id "charityCards" not found');
        return;
    }

    charityCardsContainer.innerHTML = ''; // Clear previous data

    charities.forEach(charity => {
        // Only display approved charities
        console.log('charity = ', charity);
        if (!charity.isApproved) {
            const card = document.createElement('div');
            card.className = 'card';
            card.id = `charity-card-${charity._id}`; // For easy DOM removal

            card.innerHTML = `
                    <div class="charity-card-header">
                        <h3>${charity.name}</h3>
                    </div>
                    <div class="charity-card-body">
                        <p><strong>Category:</strong> ${charity.category}</p>
                        <p><strong>Beneficiary:</strong> ${charity.beneficiaryName}</p>
                        <p><strong>Funds Raised:</strong> ${charity.funds}</p>
                    </div>
                    <div class="charity-card-footer">
                        <button class="donate-btn" onclick="deleteCharity('${charity._id}')">Delete Charity</button>
                    </div>
                `;

            charityCardsContainer.appendChild(card);
        }

    });
}


async function deleteUser(userid) {
    const token = localStorage.getItem('token');
    console.log('token = ', token);

    if (!token) {
        console.log('admin do not have token');
        showMessage('Admin do not have token', 'failure');
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
        showMessage('Admin do not want to delete the user', 'failure');
        return;
    }

    try {
        const response = await axios.delete(`http://${HOST}:5000/admin/manageUser-delete/${userid}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log('response = ', response);

        //remove the user card from the frontend
        const userCard = document.getElementById(`user-card-${userid}`);
        if (userCard) {
            userCard.remove();
        }

        showMessage('User deleted successfully', 'success');

    } catch (error) {
        console.error('Delete error:', error);
        showMessage('Failed to delete user', 'failure');
    }
}

async function deleteCharity(charityId) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('admin does not have token');
        showMessage('Admin do not have token', 'failure');
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this charity?");
    if (!confirmDelete) {
        showMessage('Admin do not want to delete the charity', 'failure');
        return;
    }

    try {
        const response = await axios.delete(`http://${HOST}:5000/admin/manageCharity-reject/${charityId}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log('response = ', response);

        // Remove the card from DOM
        const charityCard = document.getElementById(`charity-card-${charityId}`);
        if (charityCard) {
            charityCard.remove();
        }

        showMessage('Charity deleted successfully', 'success');

    } catch (error) {
        console.error('Delete error:', error.response?.data || error.message);
        showMessage('Failed to delete charity', 'failure');
    }
}



