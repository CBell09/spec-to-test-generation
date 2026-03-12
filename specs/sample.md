# Feature: User Login

## Overview
Users should be able to log in to the secure area using a username and password on the Form Authentication page at /login.

## Target Page
- URL: /login
- Page title: "The Internet"
- Input fields: `input#username` (username), `input#password` (password)
- Submit button: `button[type="submit"]` with text "Login"

## Credentials
- Valid: username `tomsmith`, password `SuperSecretPassword!`
- Invalid: any other combination

## Acceptance Criteria
- User can navigate to the login page at /login
- User sees a username field and a password field
- User sees a "Login" button
- When valid credentials (tomsmith / SuperSecretPassword!) are entered and Login is clicked, the user is redirected to /secure and sees a flash success message
- When an invalid username is entered, the user sees a flash error message: "Your username is invalid!"
- When an invalid password is entered with a valid username, the user sees a flash error message: "Your password is invalid!"
- When the username field is left empty and Login is clicked, the user sees a flash error message indicating the username is invalid
- When the password field is left empty and Login is clicked, the user sees a flash error message indicating the password is invalid
