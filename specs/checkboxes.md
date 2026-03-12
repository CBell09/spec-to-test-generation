# Feature: Checkboxes

## Overview
Users can interact with checkboxes on the Checkboxes page at /checkboxes.

## Target Page
- URL: /checkboxes
- The page contains two checkboxes inside a `#checkboxes` container
- Checkbox 1: `input[type="checkbox"]:nth-of-type(1)` — unchecked by default
- Checkbox 2: `input[type="checkbox"]:nth-of-type(2)` — checked by default

## Acceptance Criteria
- User can navigate to the checkboxes page at /checkboxes
- User sees two checkboxes on the page
- Checkbox 1 is unchecked by default
- Checkbox 2 is checked by default
- User can check Checkbox 1 and it becomes checked
- User can uncheck Checkbox 2 and it becomes unchecked
- Both checkboxes can be toggled independently without affecting each other
