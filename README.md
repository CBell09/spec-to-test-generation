# Spec-to-Test Generator

An AI-powered tool that converts human-readable feature specifications into executable Playwright end-to-end tests using the Anthropic Claude API. Write a spec in plain markdown, run one command, and get production-ready TypeScript test code.

---

## The Problem

Writing E2E tests is time-consuming and often lags behind feature development. QA engineers spend significant time translating acceptance criteria into test code — a largely mechanical process that requires knowing the right selectors, test patterns, and framework idioms. This project automates that translation step, letting teams move faster while maintaining test coverage discipline.

---

## How It Works

```
Feature Spec (.md)
      │
      ▼
Claude AI (claude-haiku-4-5)
  ├─ Reads acceptance criteria
  ├─ Identifies target page and selectors
  ├─ Generates positive and negative test cases
  └─ Returns structured JSON response
      │
      ▼
Test Generator (src/generate.ts)
  ├─ Parses JSON response
  ├─ Writes .spec.ts file to /output
  └─ Logs Claude's test strategy to console
      │
      ▼
Playwright Test Runner
  └─ Executes generated tests against target application
```

### Key Design Decisions

- **Structured JSON output** — The system prompt instructs Claude to return raw JSON only (no markdown wrapping), with fields for `filename`, `testCode`, and `reasoning`. This makes parsing deterministic and keeps the generator simple.
- **Haiku model** — Uses `claude-haiku-4-5` for cost efficiency. Test generation is a well-scoped task that doesn't require a larger model.
- **Acceptance criteria → test names** — Each acceptance criterion in the spec maps directly to a named test case, keeping tests traceable to requirements.
- **Positive and negative cases** — The system prompt explicitly requests both happy-path and failure-scenario tests.
- **Real selectors** — Specs include actual HTML selectors from the target page, grounding Claude's output in real DOM structure rather than guesses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI / LLM | Anthropic Claude API (`claude-haiku-4-5`) |
| Test Framework | Playwright 1.58 |
| Language | TypeScript (strict mode, ES modules) |
| Runtime | Node.js via `tsx` |
| Package Manager | pnpm |

---

## Project Structure

```
spec-to-test-generation/
├── src/
│   └── generate.ts        # Core generator — calls Claude, writes test file
├── specs/
│   ├── sample.md          # Login feature spec
│   ├── add-remove-elements.md
│   └── checkboxes.md
├── output/
│   ├── login.spec.ts      # Generated Playwright tests
│   ├── add-remove-elements.spec.ts
│   └── checkboxes.spec.ts
├── playwright.config.ts   # Playwright config (baseURL, browsers, reporters)
├── package.json
└── tsconfig.json
```

---

## Setup

**Prerequisites:** Node.js 18+, pnpm

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install chromium

# Add your Anthropic API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env
```

---

## Usage

### Generate tests from a spec

```bash
pnpm run generate specs/sample.md
```

This reads the spec, sends it to Claude, and writes the generated test file to `output/`. Claude's reasoning about test strategy is printed to the console.

**Example output:**

```
Test file written to: output/login.spec.ts

Claude's reasoning:
Generated 8 test cases covering the login feature:
- Valid credentials redirect and display success flash message
- Invalid username returns error flash message
- Invalid password returns error flash message
- Empty username field returns validation error
...
```

### Run the generated tests

```bash
pnpm test
```

Runs all `.spec.ts` files in `output/` against `https://the-internet.herokuapp.com`. An HTML report is generated in `playwright-report/`.

```bash
# View the HTML report
pnpm exec playwright show-report
```

---

## Spec Format

Specs are markdown files that describe a feature's acceptance criteria and the page structure under test. The generator works best when specs include:

- A clear **Feature** description
- The **target URL** and relevant HTML selectors
- **Test data** (valid and invalid values)
- Explicit **Acceptance Criteria** as a bulleted list

**Example (`specs/sample.md`):**

```markdown
# Feature: User Login

## Overview
Users authenticate via a username/password form. Successful login redirects
to a secure area; invalid credentials display an error message.

## Target Page
- URL: /login
- Username field: `input#username`
- Password field: `input#password`
- Submit button: `button[type="submit"]`
- Flash message: `.flash`

## Credentials
- Valid: tomsmith / SuperSecretPassword!
- Invalid username: invaliduser / SuperSecretPassword!
- Invalid password: tomsmith / wrongpassword

## Acceptance Criteria
- Valid credentials redirect to /secure and display a success flash message
- Invalid username displays "Your username is invalid!" error
- Invalid password displays "Your password is invalid!" error
- Empty username field displays a validation error
- Empty password field displays a validation error
```

---

## Generated Test Example

Running the generator against `specs/sample.md` produces:

```typescript
// output/login.spec.ts (generated by Claude)
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Valid credentials redirect to /secure with success message', async ({ page }) => {
    await page.locator('input#username').fill('tomsmith');
    await page.locator('input#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/secure/);
    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');
  });

  test('Invalid username displays error flash message', async ({ page }) => {
    await page.locator('input#username').fill('invaliduser');
    await page.locator('input#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.flash.error')).toContainText('Your username is invalid!');
  });

  // ... 6 more generated test cases
});
```

---

## Extending the Generator

To test a new feature, create a spec file in `specs/` following the format above and run the generator. No code changes required. The system prompt in `src/generate.ts` can be tuned to adjust test style, naming conventions, or output structure.
