# Feature: User Login

## Overview
Users should be able to log in to the application using their email and password.

## Acceptance Criteria
- User can navigate to the login page at /login
- User sees an email field and a password field
- User sees a "Sign In" button
- When valid credentials are entered and the button is clicked, the user is redirected to /dashboard
- When invalid credentials are entered, the user sees an error message: "Invalid email or password"
- The email field should validate proper email format
- If either field is empty and the user clicks Sign In, they should see a validation error