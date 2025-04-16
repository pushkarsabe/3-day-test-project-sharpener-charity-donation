
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
    console.log('token:' + token);

    if (!token) {
        showPopup('Access denied: Please log in first.', 'error');
        console.error('Token not found');
        setTimeout(() => {
            window.location.href = "/login.html"
        }, 2000)
        return;
    }

    try {
        const response = await axios.get('http://localhost:5000/charity/charity-data', {
            headers: { Authorization: token }
        });

        if (response.data.message === 'success') {
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


function displayCharityCards(data) {
    console.log('inside displayCharityCards data', data);

    const container = document.getElementById('charityCardContainer');
    container.innerHTML = ''; // Clear previous data

    data.forEach(charity => {
        //only display medical category and which are not deleted
        if (charity.category.toLowerCase() == 'medical' && charity.isApproved === false) {
            const card = document.createElement('div');
            card.className = 'charity-card';

            card.innerHTML = `
                <h3>${charity.name || 'N/A'}</h3>
                <p><strong>Cause:</strong> ${charity.category || 'N/A'}</p>
                <p><strong>Location:</strong> ${charity.beneficiaryLocationCity || 'N/A'}</p>
                <p><strong>Status:</strong> ${charity.hospitalisationStatus || 'N/A'}</p>
                <p><strong>Funds:</strong> ₹${charity.funds || 0}</p>
                <p><strong>Phone:</strong> ${charity.phoneNumber || 'N/A'}</p>
                <p class="story">${charity.storyForFundraising || ''}</p>
                <div class="card-buttons">
                <button onclick="openDonationModal('${charity._id}')">Donate Money</button>
                <button onclick="editCharity('${charity._id}')">Edit Charity</button>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

let selectedCharityId = null; // Global to track charity

function openDonationModal(charityId) {
    selectedCharityId = charityId;
    document.getElementById('donationModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('donationModal').style.display = 'none';
    document.getElementById('donationAmountInput').value = '';
}


document.getElementById('donateNowBtn').addEventListener('click', async () => {
    const amountInput = document.getElementById('donationAmountInput');
    const donationAmount = parseFloat(amountInput.value);

    if (isNaN(donationAmount) || donationAmount <= 0) {
        // alert("Please enter a valid donation amount.");
        showPopup('Please enter a valid donation amount', 'error');
        return;
    }

    closeModal(); // Close modal before payment
    await donateMoney(selectedCharityId, donationAmount);
});


async function donateMoney(charityId, donationAmount) {
    console.log('inside donateMoney of donatekart and donate clicked for:', charityId);
    console.log('donationAmount:', donationAmount);

    const token = localStorage.getItem('token');
    console.log('token:', token);

    if (!token) {
        console.error('Token not found');
        return;
    }

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
                showPopup("Payment successful! Thank you for your donation.");

                try {
                    await axios.post('http://localhost:5000/charity/record-donation', {
                        order_id: options.order_id,
                        charityId,
                        amount: donationAmount,
                        razorpayPaymentId: response.razorpay_payment_id
                    }, {
                        headers: { Authorization: token }
                    });

                    // rfresh charity data after successful donation record
                    const updatedResponse = await axios.get('http://localhost:5000/charity/charity-data', {
                        headers: { Authorization: token }
                    });

                    if (updatedResponse.data.message === 'success') {
                        displayCharityCards(updatedResponse.data.allCharityData);
                    }
                }
                catch (err) {
                    console.error("Error recording donation:", err);
                    alert("Payment succeeded, but donation could not be recorded.");
                    showPopup('Payment succeeded, but donation could not be recorded.', 'error');

                }
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();

    }
    catch (err) {
        console.error("Payment failed:", err);
        showPopup('Error initiating payment', 'error');
    }
}

async function editCharity(charityId) {
    console.log('Editing charity:', charityId);

    const token = localStorage.getItem('token');

    try {
        const res = await axios.get(`http://localhost:5000/charity/single-charity-data/${charityId}`, {
            headers: { Authorization: token }
        });

        const charity = res.data.singleCharityData;

        document.getElementById('editCharityId').value = charity._id;
        document.getElementById('editCategory').value = charity.category || '';
        document.getElementById('editBeneficiary').value = charity.beneficiary || '';
        document.getElementById('editBeneficiaryName').value = charity.beneficiaryName || '';
        document.getElementById('editRelation').value = charity.relation || '';
        document.getElementById('editHospitalName').value = charity.hospitalName || '';
        document.getElementById('editHospitalLocationState').value = charity.hospitalLocationState || '';
        document.getElementById('editHospitalLocationCity').value = charity.hospitalLocationCity || '';
        document.getElementById('editMedicalCondition').value = charity.medicalCondition || '';
        document.getElementById('editStatus').value = charity.hospitalisationStatus || '';
        document.getElementById('editDate').value = charity.date?.substring(0, 10) || '';
        document.getElementById('editFundraiserName').value = charity.fundraiserName || '';
        document.getElementById('editFunds').value = charity.funds || '';
        document.getElementById('editPhone').value = charity.phoneNumber || '';
        document.getElementById('editStory').value = charity.storyForFundraising || '';

        document.getElementById('editCharityPopup').style.display = 'flex';
    } catch (err) {
        console.error("Failed to fetch charity data:", err);
    }
}

function closeEditPopup() {
    document.getElementById('editCharityPopup').style.display = 'none';
}

document.getElementById('editCharityForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log('Update charity');

    const token = localStorage.getItem('token');
    const id = document.getElementById('editCharityId').value;

    const updatedCharity = {
        category: document.getElementById('editCategory').value,
        beneficiary: document.getElementById('editBeneficiary').value,
        beneficiaryName: document.getElementById('editBeneficiaryName').value,
        relation: document.getElementById('editRelation').value,
        hospitalName: document.getElementById('editHospitalName').value,
        hospitalLocationState: document.getElementById('editHospitalLocationState').value,
        hospitalLocationCity: document.getElementById('editHospitalLocationCity').value,
        medicalCondition: document.getElementById('editMedicalCondition').value,
        hospitalisationStatus: document.getElementById('editStatus').value,
        date: document.getElementById('editDate').value,
        fundraiserName: document.getElementById('editFundraiserName').value,
        funds: parseFloat(document.getElementById('editFunds').value),
        phoneNumber: document.getElementById('editPhone').value,
        storyForFundraising: document.getElementById('editStory').value
    };

    try {
        let response1 = await axios.put(`http://localhost:5000/charity/update/${id}`, updatedCharity, {
            headers: { Authorization: token }
        });
        console.log('response1 = ', response1);

        closeEditPopup();

        //refresh the charity data
        const response2 = await axios.get('http://localhost:5000/charity/charity-data', {
            headers: { Authorization: token }
        });

        displayCharityCards(response2.data.allCharityData);

        showPopup("Charity updated successfully!", 'success');
    } catch (err) {
        console.error("Failed to update charity:", err);
        alert("Error updating charity.");
    }
});

window.addEventListener('DOMContentLoaded', fetchAndRenderChart);

async function fetchAndRenderChart() {
    console.log('fetchAndRenderChart called');

    const token = localStorage.getItem('token');
    console.log('token = ', token);

    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const response = await axios.get('http://localhost:5000/user/user-data', {
            headers: { Authorization: token }
        });
        console.log('response = ', response);

        const data = response.data.allUserData;

        // Extract labels and values
        const labels = data.map(item => item.name); // Example: charity names or categories
        const values = data.map(item => item.donations); // Example: donation amount

        renderBarChart(labels, values);
        return true; // Return something to indicate success
    } catch (err) {
        console.error('Error fetching chart data:', err);
        throw err; // Properly throw the error
    }
}

let chartInstance = null;

function renderBarChart(labels, values) {
    console.log('🎨 renderBarChart called');
    console.log('Labels:', labels);
    console.log('Values:', values);

    const ctx = document.getElementById('barChart').getContext('2d');


    if (chartInstance) {
        chartInstance.destroy();
    }

    // Assign the new chart to chartInstance
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Donations (in ₹)',
                data: values,
                backgroundColor: 'rgba(33, 203, 243, 0.6)',
                borderColor: 'rgba(33, 203, 243, 1)',
                borderWidth: 2,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `₹${value}`
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: context => `₹${context.parsed.y}`
                    }
                }
            }
        }
    });
}















