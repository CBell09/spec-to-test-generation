# Feature: Add/Remove Elements

## Overview
Users can dynamically add and remove "Delete" button elements on the Add/Remove Elements page at /add_remove_elements/.

## Target Page
- URL: /add_remove_elements/
- "Add Element" button: `button` with text "Add Element" (onclick="addElement()")
- Added elements appear as "Delete" buttons with class `.added-manually`
- Each "Delete" button removes itself when clicked

## Acceptance Criteria
- User can navigate to the add/remove elements page at /add_remove_elements/
- User sees an "Add Element" button on the page
- No "Delete" buttons are visible on page load
- When the user clicks "Add Element", a "Delete" button appears
- When the user clicks "Add Element" multiple times, multiple "Delete" buttons appear
- When the user clicks a "Delete" button, that button is removed from the page
- After removing all added elements, no "Delete" buttons remain on the page
