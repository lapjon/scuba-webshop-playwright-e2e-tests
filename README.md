**Scuba Webshop**

Welcome to the Scuba Webshop – a demo project showcasing a functional e-commerce website built with Node.js, Express, and Playwright for automated testing. It is a clone of https://github.com/lapjon/scuba-webshop-cypress-tests. This project is designed as a QA portfolio piece, highlighting end-to-end (E2E) testing workflows and automated UI testing.

Features:

- User Authentication: Sign-up, login, and logout functionality.
- Dynamic Cart: Add, remove, and persist items in the cart.
- Checkout Flow: Validate user input during checkout and complete orders.
- Responsive Design: Optimized for desktop and mobile devices.
- Automated Testing: Comprehensive Playwright tests for all key workflows.

Technologies Used:

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: SQLite
- Testing: Playwright
- CI/CD: GitHub Actions

Project Structure:

The project consists of the following main components:

Public Directory: Contains static HTML, CSS, and JavaScript files for the front-end, including pages like Welcome, Login, Signup, Basket, Gear, and Checkout.
* Source Directory: Includes backend source code, such as the main server.js file.
* Tests Directory: Holds Playwright test files for automated testing, including E2E and UI responsiveness tests.
* GitHub Workflows: Pre-configured CI workflows to run tests on push or pull requests.
* Package File: Manages Node.js dependencies and scripts.
* Documentation: This README file provides detailed instructions and information about the project.

Installation:

1. Clone the repository:
git clone git@github.com:lapjon/scuba-webshop-playwright-e2e-tests.git
cd scuba-webshop-playwright-e2e-tests

2. Install dependencies:
npm install

3. Start the server:
npm run start

4. Open your browser and navigate to http://localhost:5000.



1. Running Tests:
npx playwright test

2. Run tests for a specific browser:
npx playwright test --project=chromium

3. Run tests with debugging mode:
npx playwright test --debug

4. View HTML reports:
npx playwright show-report


GitHub Actions:

The project includes a pre-configured CI workflow to:

* Run tests automatically on every push or pull request.
* Test on multiple browsers (Chrome and Firefox).


**Key Test Scenarios:**

**signup.test.js**    
TC1: Verify successful sign up with valid credentials
TC2: Verify error should display for invalid email format
TC3: Verify error should display for invalid password: No uppercase letters
TC4: Verify error should display for invalid password: No numbers                  
TC5: Verify error should display for invalid password: No letters
TC6: Verify error should display for invalid password: Less than 8 characters            
TC7: Verify error should display for mismatched passwords
TC8: Verify multiple submissions should be prevented
TC9: Verify error error message should display for email already in use
TC10: Verify error error message when only password field is filled
TC11: Verify error error message when only confirm password field is filled
TC12: Verify error error message should display for email exceeding 254 characters
TC13: Verify the password in password field is not visible while typing
TC14: Verify the password in confirm password field is not visible while typing

**login.test.js**
TC1: Verify successful login with valid credentials     
TC2: Verify login should fail with invalid credentials           
TC3: Verify user can log out successfully
TC4: Verify user cannot log in with non-existing user
TC5: Verify error message for empty password field
TC6: Verify error message for empty email field
TC7: Verify error message for invalid email format

**items.test.js**
TC1: Add items from Welcome page as unsigned user
TC2: Add items from Gear page as unsigned user
TC3: Add and remove items from Gear page as unsigned user
TC4: Add multiple items from Welcome page and Gear page as unsigned user
TC5: Verify item count on Gear page
TC6: Verify item count on Welcome page
TC7: Add multiples of the same item to cart and verify quantity and total amount
TC8: Add multiple items to cart and verify cart counter and total amount 
TC9: Remove items from cart and verify cart counter and total amount
TC10: Empty cart and verify cart counter and total amount  
TC11: Verify Cart persistence after page reload   

**navigation.test.js**
TC1: Verify page links as unsigned user
TC2: Verify navigation to Gear page when clicking link
TC3: Verify navigation to About page when clicking link
TC4: Verify navigation to Login page when clicking link
TC5: Verify navigation to Cart page when clicking link
TC6: Verify redirect link from Login page to Signup page for unsigned user
TC7: Verify Checkout page CTA redirects to Login page as un-signed user

**checkout.test.js**    
TC1: Error message should display for missing email
TC2: Error message should display for invalid email format
TC3: Error message should display for numbers in first name field
TC4: Error message should display for missing first name 
TC5: Error message should display for numbers in last name field
TC6: Error message should display for missing last name 
TC7: Error message should display for too short address
TC8: Error message should display for missing address
TC10: Error message should display for missing city
TC11: Error message should display for too short postcode
TC12: Error message should display for too long postcode
TC13: Error message should display for numbers in card holder name field
TC14: Error message should display for invalid card number
TC15: Error message should display for past expiry date
TC16: Error message should display for invalid cvv number

**purchase.test.js**     
TC1: Verify successful purchase flow for signed-in user           
TC2: Verify cart summary on Checkout page  

**end2end.flow.cy.js**    
E2E Happy Flow: browse gear, add items, register, login, checkout and complete order



License

This project is licensed under the MIT License.

Author

Created by Jon Laprevote – QA Engineer | Portfolio Project
