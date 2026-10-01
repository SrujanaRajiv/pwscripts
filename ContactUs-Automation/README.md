# Contact Us Automation

Playwright + TypeScript end-to-end suite for the **WebDriverUniversity Contact Us** feature.

| Item | Value |
|------|--------|
| Application | [https://www.webdriveruniversity.com/](https://www.webdriveruniversity.com/) |
| Feature URL | [https://www.webdriveruniversity.com/Contact-Us/contactus.html](https://www.webdriveruniversity.com/Contact-Us/contactus.html) |
| Framework | Playwright Test |
| Language | TypeScript |
| Pattern | Page Object Model (POM) |
| Browsers | Playwright Chromium + installed Microsoft Edge (`msedge`) |
| Retries | `0` (failures are not hidden) |

---

## Table of contents

1. [What this project covers](#what-this-project-covers)
2. [Architecture](#architecture)
3. [Folder structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Start from scratch (Windows)](#start-from-scratch-windows)
6. [Start from scratch (macOS)](#start-from-scratch-macos)
7. [How to run the suite](#how-to-run-the-suite)
8. [Understanding the tests](#understanding-the-tests)
9. [Configuration highlights](#configuration-highlights)
10. [Reports and failure artifacts](#reports-and-failure-artifacts)
11. [Troubleshooting](#troubleshooting)
12. [Documentation index](#documentation-index)

---

## What this project covers

The suite investigates and automates:

- Homepage load and Contact Us tile presence
- New-tab navigation from homepage → Contact Us
- Form structure (First Name, Last Name, Email, Comments, Reset, Submit)
- Happy-path submission (thank-you message → **Back to Homepage**)
- Required-field and invalid-email validation (error messages → **Home**)
- Whitespace / equivalence / exploratory length cases
- Reset behavior
- Non-destructive security-oriented input handling (HTML / XSS-like / SQL-like / special chars)

Validation rules are taken from **observed** client-side behavior (`validateContactForm()`), not assumptions.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│  Specs (tests/*.spec.ts)                                │
│  - Orchestrate scenarios                                │
│  - Assert business outcomes                             │
│  - Use data from test-data/                             │
└──────────────────────────┬──────────────────────────────┘
                           │ calls
┌──────────────────────────▼──────────────────────────────┐
│  Page Objects (pages/)                                  │
│  - HomePage: homepage + open Contact Us in new tab      │
│  - ContactUsPage: form fill/submit/reset +              │
│    success/error Home navigation helpers                │
└──────────────────────────┬──────────────────────────────┘
                           │ drives
┌──────────────────────────▼──────────────────────────────┐
│  Playwright (Chromium / Microsoft Edge)                 │
│  → https://www.webdriveruniversity.com                  │
└─────────────────────────────────────────────────────────┘
```

### Design rules

| Layer | Responsibility |
|-------|----------------|
| **tests/** | What to verify (scenarios, data-driven loops, comments) |
| **pages/** | How to interact with the UI (locators + actions) |
| **test-data/** | Deterministic inputs (no random data for regression) |
| **docs/** | Investigation notes, coverage matrix, test-case Excel |

Assertions for page state often live as helpers on the page object (e.g. `expectSuccessThenReturnHome()`). Specs still own the scenario flow.

### Typical success flow

1. Open Contact Us (`beforeEach` in form specs)
2. Fill deterministic data → Submit
3. Assert **Thank You for your Message!**
4. Click **Back to Homepage**
5. Assert homepage URL + key elements (brand, challenges, Contact Us tile)

### Typical error flow

1. Submit invalid / incomplete data
2. Assert exact error text(s)
3. Click error-page **Home**
4. Assert homepage URL + key elements

---

## Folder structure

```text
pwscripts/                          # Git repository root
├── README.md                       # Repo pointer
└── ContactUs-Automation/           # This Playwright project
    ├── package.json                # Scripts and dependencies
    ├── package-lock.json
    ├── playwright.config.ts        # Browsers, retries, artifacts
    ├── tsconfig.json
    ├── .gitignore
    ├── README.md                   # This file
    ├── pages/
    │   ├── HomePage.ts
    │   └── ContactUsPage.ts
    ├── tests/
    │   ├── home.spec.ts
    │   ├── contact-us-navigation.spec.ts
    │   ├── contact-us-functional.spec.ts
    │   ├── contact-us-validation.spec.ts
    │   ├── contact-us-reset.spec.ts
    │   └── contact-us-security.spec.ts
    ├── test-data/
    │   └── contactUsData.ts
    └── docs/
        ├── investigation-report.md
        ├── coverage-matrix.md
        ├── execution-results.md
        ├── ContactUs-TestCases-Review.xlsx
        ├── defects/
        └── security-findings/
```

---

## Prerequisites

Install these before cloning/running:

| Tool | Windows | macOS | Notes |
|------|---------|-------|-------|
| **Node.js** (LTS 18+ or 20+) | [nodejs.org](https://nodejs.org/) or `winget install OpenJS.NodeJS.LTS` | [nodejs.org](https://nodejs.org/) or `brew install node` | Includes `npm` |
| **Git** | [git-scm.com](https://git-scm.com/) or `winget install Git.Git` | Xcode CLT / `brew install git` | Needed to clone |
| **Microsoft Edge** (optional) | Usually preinstalled | Install Edge if you want `--project=msedge` | Chromium works without Edge |

Verify:

```bash
node -v
npm -v
git --version
```

---

## Start from scratch (Windows)

### 1. Clone the repository

```powershell
cd $env:USERPROFILE\Desktop
git clone https://github.com/SrujanaRajiv/pwscripts.git
cd pwscripts\ContactUs-Automation
```

### 2. Install npm dependencies

```powershell
npm install
```

### 3. Install Playwright browsers

Chromium (required for the default project):

```powershell
npx playwright install chromium
```

If OS dependencies are needed (rare on Windows):

```powershell
npx playwright install --with-deps chromium
```

### 4. (Optional) Edge project

Edge tests use the **installed** Microsoft Edge channel (`msedge`). Install Edge from Microsoft if missing, then:

```powershell
npm run test:edge
```

### 5. Run the full suite (headless)

```powershell
npm test
```

This runs **Chromium and Edge** projects (64 tests if both browsers are available).

Chromium only:

```powershell
npm run test:chromium
```

---

## Start from scratch (macOS)

### 1. Clone the repository

```bash
cd ~/Desktop
git clone https://github.com/SrujanaRajiv/pwscripts.git
cd pwscripts/ContactUs-Automation
```

### 2. Install npm dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

On a clean Mac, system dependencies may be required:

```bash
npx playwright install --with-deps chromium
```

### 4. (Optional) Edge on Mac

Install [Microsoft Edge for Mac](https://www.microsoft.com/edge), then:

```bash
npm run test:edge
```

If Edge is not installed, use Chromium only (`npm run test:chromium`) — the `msedge` project will fail to launch without Edge.

### 5. Run the suite

```bash
# All configured projects
npm test

# Chromium only (recommended first run on Mac)
npm run test:chromium
```

---

## How to run the suite

Run all commands from:

```text
pwscripts/ContactUs-Automation
```

| Goal | Command |
|------|---------|
| Full suite (Chromium + Edge), headless | `npm test` |
| Chromium only | `npm run test:chromium` |
| Edge only | `npm run test:edge` |
| Headed (see the browser) | `npm run test:headed` |
| Headed Chromium only | `npx playwright test --project=chromium --headed` |
| Playwright UI mode | `npm run test:ui` |
| Step debugger | `npm run test:debug` |
| One spec file | `npx playwright test tests/contact-us-validation.spec.ts` |
| One test by title | `npx playwright test -g "valid submission"` |
| Open last HTML report | `npm run report` |

### Suggested first-time path

1. `npm run test:chromium` — confirm environment works  
2. `npx playwright test --project=chromium --headed` — watch a run  
3. `npm run test:edge` — only if Edge is installed  
4. `npm run report` — if anything failed  

---

## Understanding the tests

| Spec file | Purpose |
|-----------|---------|
| `home.spec.ts` | Homepage smoke; Contact Us tile attributes |
| `contact-us-navigation.spec.ts` | Real click → new tab (does not `goto` Contact Us directly) |
| `contact-us-functional.spec.ts` | Form structure, happy path, equivalence, boundaries |
| `contact-us-validation.spec.ts` | Required fields, invalid emails, whitespace |
| `contact-us-reset.spec.ts` | Reset clears fields; error page → Home |
| `contact-us-security.spec.ts` | Non-destructive payload handling |

Data-driven inputs live in `test-data/contactUsData.ts`.

For a review spreadsheet of all cases, open:

`docs/ContactUs-TestCases-Review.xlsx`

---

## Configuration highlights

From `playwright.config.ts`:

| Setting | Value | Why |
|---------|--------|-----|
| `baseURL` | `https://www.webdriveruniversity.com` | Short `page.goto('/')` paths |
| `retries` | `0` | Surface real failures / flakiness |
| `timeout` | 60s (Edge project 120s) | Max time per test |
| `screenshot` / `trace` / `video` | On failure only | Evidence without bloating green runs |
| Projects | `chromium`, `msedge` | Local multi-browser coverage |
| Edge workers | `1` | Avoids flaky new-tab under parallel Edge load |

There are **no** hard-coded sleeps (`waitForTimeout`). Sync uses Playwright auto-wait and assertions.

---

## Reports and failure artifacts

After a run:

| Artifact | Location | When |
|----------|----------|------|
| HTML report | `playwright-report/` | Always generated; open with `npm run report` |
| Screenshots / videos / traces | `test-results/` | **Failed** tests only |

View a trace:

```bash
npx playwright show-trace test-results/<folder>/trace.zip
```

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `Executable doesn't exist` for Chromium | `npx playwright install chromium` |
| Edge project fails to launch | Install Microsoft Edge, or run `npm run test:chromium` only |
| Network / DNS failures | Confirm you can open the site in a normal browser |
| OneDrive / path lock issues (Windows) | Clone to a non-OneDrive folder (e.g. `C:\dev\pwscripts`) if file locks occur |
| `git` commit needs identity | Set `user.name` / `user.email` locally (your machine), then commit |
| Tests fail only under parallel Edge | Edge is configured with `workers: 1`; do not raise without re-checking navigation |

---

## Documentation index

| Document | Description |
|----------|-------------|
| [docs/investigation-report.md](docs/investigation-report.md) | Observed app behavior |
| [docs/coverage-matrix.md](docs/coverage-matrix.md) | Scenario ↔ automation mapping |
| [docs/execution-results.md](docs/execution-results.md) | Last documented run summary |
| [docs/ContactUs-TestCases-Review.xlsx](docs/ContactUs-TestCases-Review.xlsx) | Test cases for human review |
| [docs/security-findings/SF-01-input-handling.md](docs/security-findings/SF-01-input-handling.md) | Security-oriented findings |
| [docs/defects/README.md](docs/defects/README.md) | Defect log / template |

---

## License / target site

This automation targets the public practice site **WebDriverUniversity**. Use it for learning and non-destructive testing only.
