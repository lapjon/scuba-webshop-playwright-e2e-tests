 // Load the reusable header dynamically
document.addEventListener("DOMContentLoaded", function () {
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            const basketCounter = document.getElementById('basket-counter');
            const loginLink = document.getElementById('login-link');
            const loggedInUser = document.getElementById('logged-in-user');
            const userEmailElement = document.getElementById('user-email');
            const basket = JSON.parse(localStorage.getItem('basket')) || [];
            const userEmail = localStorage.getItem('userEmail');
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            // Update basket counter
            if (basketCounter) {
                basketCounter.textContent = basket.length;
            }

            // Handle login/logout UI
            if (isLoggedIn && userEmail) {
                loggedInUser.style.display = 'inline';
                userEmailElement.textContent = userEmail;
                loginLink.style.display = 'none';

                const logoutLink = document.getElementById('logout-link');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function (event) {
                        event.preventDefault();
                        // Clear login data
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('userEmail');
                        // Redirect to welcome page
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

// Load basket items and update UI on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    updateBasketUI();
});

// Function to update the basket UI dynamically
function updateBasketUI() {
    const basketItemsContainer = document.getElementById('basket-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    let totalItems = 0;
    let totalPrice = 0;

    // Clear the container first
    basketItemsContainer.innerHTML = '';

    if (basket.length === 0) {
        basketItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalItemsElement.textContent = 0;
        totalPriceElement.textContent = '0.00';

        // Update the header's basket counter dynamically
        const basketCounter = document.getElementById('basket-counter');
        if (basketCounter) {
            basketCounter.textContent = 0;
        }

        return;
    }

     // Group items by ID
     const groupedItems = basket.reduce((acc, item) => {
        if (acc[item.id]) {
            acc[item.id].quantity += 1;
            acc[item.id].totalPrice += item.price;
        } else {
            acc[item.id] = { ...item, quantity: 1, totalPrice: item.price };
        }
        return acc;
    }, {});

    // Render grouped items
    Object.values(groupedItems).forEach((item, index) => {
        totalItems += item.quantity;
        totalPrice += item.totalPrice;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('basket-item');
        itemDiv.innerHTML = `
            <span>${item.name} (x${item.quantity}) - $${item.totalPrice.toFixed(2)}</span>
            <button data-id="${item.id}" class="remove-item">Remove</button>
        `;
        basketItemsContainer.appendChild(itemDiv);
    });

    // Update totals
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = totalPrice.toFixed(2);

    // Attach click event listeners to the Remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'), 10); // Get the ID from the button
            removeSingleInstanceFromBasket(itemId); // Call the remove function
        });
    });

    // Update the header's basket counter dynamically
    const basketCounter = document.getElementById('basket-counter');
    if (basketCounter) {
        basketCounter.textContent = totalItems;
    }
}

// Function to remove a single instance of an item from the basket
function removeSingleInstanceFromBasket(itemId) {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];

    // Confirmation alert
    const userConfirmed = confirm(`Are you sure you want to remove this item from your cart?`);
    if (!userConfirmed) {
        return; // Exit if user cancels the confirmation
    }

    const itemIndex = basket.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
        basket.splice(itemIndex, 1); // Remove only the first instance of the item
        localStorage.setItem('basket', JSON.stringify(basket)); // Update localStorage
        updateBasketUI(); // Update the UI immediately
    } else {
        console.error('Item not found in basket:', itemId);
    }
}