 // Load the reusable header dynamically
document.addEventListener("DOMContentLoaded", function () {
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            // Dynamically update the cart counter
            const basketCounter = document.getElementById('basket-counter');
            const loginLink = document.getElementById('login-link');
            const loggedInUser = document.getElementById('logged-in-user');
            const userEmailElement = document.getElementById('user-email');
            const basket = JSON.parse(localStorage.getItem('basket')) || [];
            const userEmail = localStorage.getItem('userEmail');
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            console.log('Basket:', basket);
            console.log('isLoggedIn:', isLoggedIn);
            console.log('userEmail:', userEmail);

            if (basketCounter) {
                basketCounter.textContent = basket.length;
            }

            if (isLoggedIn && userEmail) {
                loggedInUser.style.display = 'inline';
                userEmailElement.textContent = userEmail;
                loginLink.style.display = 'none';

                const logoutLink = document.getElementById('logout-link');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function (event) {
                        event.preventDefault();
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('userEmail');
                        window.location.href = '/welcome.html';
                    });
                }
            } else {
                loggedInUser.style.display = 'none';
                loginLink.style.display = 'inline';
            }
        })
        .catch(error => console.error('Error loading header:', error));
});

// Check if the user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('You must be logged in to access the checkout page.');
        window.location.href = '/login.html';
    }
});

// Load basket summary
document.addEventListener("DOMContentLoaded", function () {
    const basketSummaryContainer = document.getElementById('basket-summary');
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    let totalPrice = 0;

    basketSummaryContainer.innerHTML = '';

    if (basket.length === 0) {
        basketSummaryContainer.innerHTML = '<p>Your basket is empty.</p>';
    } else {
        const table = document.createElement('table');
        table.classList.add('basket-summary-table');
        const headerRow = `
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>`;
        table.innerHTML = headerRow;

        const itemCounts = {};
        basket.forEach(item => {
            if (itemCounts[item.id]) {
                itemCounts[item.id].quantity += 1;
                itemCounts[item.id].totalPrice += item.price;
            } else {
                itemCounts[item.id] = {
                    ...item,
                    quantity: 1,
                    totalPrice: item.price,
                };
            }
        });

        Object.values(itemCounts).forEach(item => {
            const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.totalPrice.toFixed(2)}</td>
                </tr>`;
            table.innerHTML += row;
            totalPrice += item.totalPrice;
        });

        const totalRow = `
            <tr>
                <td><strong>Total</strong></td>
                <td></td>
                <td><strong>$${totalPrice.toFixed(2)}</strong></td>
            </tr>`;
        table.innerHTML += totalRow;

        basketSummaryContainer.appendChild(table);
    }
});

// Show error
function showError(input, message) {
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
    input.classList.add('invalid');
}

// Clear error
function clearError(input) {
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.style.display = 'none';
    }
    input.classList.remove('invalid');
}

// Validate expiry date
function validateExpiryDate() {
    const expiryDate = document.getElementById('expiry-date');
    const value = expiryDate.value.trim(); // Expected format: YYYY-MM
    console.log('Entered expiry date:', value); // Log the input value

    const [year, month] = value.split('-').map(num => parseInt(num, 10));

    if (!month || !year || isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        console.log('Invalid expiry date format detected');
        showError(expiryDate, 'Invalid expiry date format.');
        return false;
    }

    const today = new Date();
    const expiry = new Date(year, month - 1, 1); // First day of expiry month

    if (expiry < today) {
        console.log('Expiry date is in the past');
        showError(expiryDate, 'Expiry date must be in the future.');
        return false;
    }

    console.log('Expiry date is valid');
    clearError(expiryDate);
    return true;
}

// Form validation
document.getElementById('checkout-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let isValid = true;

    // Clear all errors
    document.querySelectorAll('.error-message').forEach((span) => (span.style.display = 'none'));
    document.querySelectorAll('input').forEach((input) => input.classList.remove('invalid'));

    // Validate Email
    const email = document.getElementById('email');
    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
    }

    // Validate First Name
    const firstName = document.getElementById('first-name');
    if (!/^[a-zA-Z\s]+$/.test(firstName.value) || firstName.value.trim() === '') {
        showError(firstName, 'Please enter a valid first name (letters only).');
        isValid = false;
    }

    // Validate Last Name
    const lastName = document.getElementById('last-name');
    if (!/^[a-zA-Z\s]+$/.test(lastName.value) || lastName.value.trim() === '') {
        showError(lastName, 'Please enter a valid last name (letters only).');
        isValid = false;
    }

    // Validate Address
    const address = document.getElementById('address');
    if (address.value.trim().length < 5) {
        showError(address, 'Address must be at least 5 characters long.');
        isValid = false;
    }

    // Validate Country
    const country = document.getElementById('country');
    if (!country.value) {
        showError(country, 'Please select your country.');
        isValid = false;
    }

    // Validate City
    const city = document.getElementById('city');
    if (city.value.trim() === '') {
        showError(city, 'City cannot be empty.');
        isValid = false;
    }

    // Validate Postcode
    const postcode = document.getElementById('postcode');
    if (!/^\d{4,6}$/.test(postcode.value)) {
        showError(postcode, 'Postcode must be 4-6 digits.');
        isValid = false;
    }

    // Validate Cardholder Name
    const cardName = document.getElementById('card-name');
    if (!/^[a-zA-Z\s]+$/.test(cardName.value) || cardName.value.trim() === '') {
        showError(cardName, 'Cardholder name must contain letters only.');
        isValid = false;
    }

    // Validate Card Number
    const cardNumber = document.getElementById('card-number');
    if (!/^\d{16}$/.test(cardNumber.value)) {
        showError(cardNumber, 'Card number must be 16 digits.');
        isValid = false;
    }

    // Validate Expiry Date
    if (!validateExpiryDate()) {
        isValid = false;
    }

    // Validate CVV
    const cvv = document.getElementById('cvv');
    if (!/^\d{3}$/.test(cvv.value)) {
        showError(cvv, 'CVV must be 3 digits.');
        isValid = false;
    }

    // If valid, proceed
    if (isValid) {
        alert('Thank you for your order!');
        localStorage.removeItem('basket');
        document.getElementById('checkout-form').reset();
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/welcome.html';
    }
});
