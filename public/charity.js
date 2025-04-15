console.log('inside charity');

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

window.addEventListener('DOMContentLoaded', async () => {
    console.log('inside DOMContentLoaded');
    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) {
        showPopup('Token not found', 'error');
        console.error('Token not found');
        return;
    }

    const searchInputs = ['searchName', 'searchLocation', 'searchCategory'];
    searchInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            fetchAndDisplayCharities(token);
        })
    })

    fetchAndDisplayCharities(token);

    try {
        const response = await axios.get('http://localhost:5000/charity/charity-data', {
            headers: { Authorization: token }
        });

        if (response.data.message === 'success') {
            console.log('response:', response);
            displayCharityCards(response.data.allCharityData);

        } else {
            console.error('Failed to fetch charity data');
            showPopup('Failed to fetch charity data', 'error');
        }

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
        console.error('Error fetching charity data:', err);
    }

})//to add the charity to the page after loading


function displayCharityCards(charityData) {
    console.log('inside displayCharityCards charityData', charityData);

    if (charityData === undefined) {
        return;
    }
    else {
        const container = document.getElementById('charityCards');
        container.innerHTML = ''; // Clear existing cards

        charityData.forEach(charity => {
            // only display which are not deleted
            if (!charity.isApproved) {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <h3>${charity.name || 'N/A'}</h3>
                    <p><strong>Category:</strong> ${charity.category || 'N/A'}</p>
                    <p><strong>Location:</strong> ${charity.beneficiaryLocationCity || 'N/A'}</p>
                    <p><strong>Status:</strong> ${charity.hospitalisationStatus || 'N/A'}</p>
                    <p><strong>Story:</strong> ${charity.storyForFundraising || 'No story provided.'}</p>
                    <p><strong>Funds:</strong> ₹${charity.funds?.toLocaleString('en-IN') || '0'}</p>
                    <p><strong>Phone:</strong> ${charity.phoneNumber || 'Not provided'}</p>
                    <button onclick="donateMoney('${charity._id}')">Donate Money</button>
                `;
                container.appendChild(card);
            }
        });
    }
}//displayCharityCards


async function fetchAndDisplayCharities(token) {
    console.log('inside fetchAndDisplayCharities token', token);

    const name = document.getElementById('searchName').value.trim();
    const location = document.getElementById('searchLocation').value.trim();
    const category = document.getElementById('searchCategory').value.trim();
    console.log('name = ' + name);
    console.log('location = ' + location);
    console.log('category = ' + category);

    try {
        const response = await axios.get('http://localhost:5000/charity/filter', {
            headers: { Authorization: token },
            params: { name, location, category }
        });

        if (response.data.message === 'success') {
            displayCharityCards(response.data.charityByFilter);
        } else {
            console.error('Failed to filter charity data');
            showPopup('Failed to filter charity data', 'error');
        }
    } catch (err) {
        console.error('Error fetching charity data:', err);
    }

}

async function donateMoney(charityId) {
    console.log('Inside charity and Donate clicked for:', charityId);

    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) {
        console.error('Token not found');
        showPopup('Token not found', 'error');
        return;
    }

    const amount = prompt("Enter the amount you wish to donate (in ₹):");

    if (amount === null) {
        console.log('Donation canceled');
        return;
    }

    const donationAmount = parseFloat(amount);

    if (isNaN(donationAmount) || donationAmount <= 0) {
        alert("Please enter a valid donation amount.");
        return;
    }
    console.log(`Donating ₹${donationAmount} to charity ID: ${charityId}`);

    try {
        const orderResponse = await axios.post('http://localhost:5000/charity/create-order', {
            amount: donationAmount,
            charityId: charityId
        }, {
            headers: { Authorization: token }
        });
        console.log('orderResponse:', orderResponse);

        const { order } = orderResponse.data;
        console.log('order:', order);
        console.log('key:', orderResponse.data.key);

        const options = {
            key: orderResponse.data.key, // Replace with Razorpay key_id
            amount: order.amount,
            currency: "INR",
            name: "Charity Donation",
            description: "Donation Payment",
            order_id: order.id,
            handler: async function (response) {

                try {
                    await axios.post('http://localhost:5000/charity/record-donation', {
                        order_id: options.order_id,
                        charityId,
                        amount: donationAmount,
                        razorpayPaymentId: response.razorpay_payment_id
                    }, {
                        headers: { Authorization: token }
                    });

                    showPopup("Payment successful! Thank you for your donation", 'success');

                    //Refresh cards by fetching updated data
                    fetchAndDisplayCharities(token);

                }
                catch (err) {
                    console.error("Error recording donation:", err);
                    showPopup("Payment succeeded, but donation could not be recorded.", 'error');
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    }
    catch (err) {
        console.error("Payment failed:", err);
        showPopup("Error initiating payment.", 'error');
    }
}

