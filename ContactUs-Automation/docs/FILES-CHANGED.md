# Files Created / Modified

All paths relative to `ContactUs-Automation/`.

| File | Purpose |
|------|---------|
| `package.json` | Project metadata and npm scripts (test, headed, ui, debug, report) |
| `package-lock.json` | Dependency lockfile |
| `playwright.config.ts` | Chromium-only config: retries 0, failure screenshot/trace/video, baseURL |
| `tsconfig.json` | TypeScript compiler options |
| `.gitignore` | Ignore node_modules, reports, test-results |
| `README.md` | Install and execution commands |
| `pages/HomePage.ts` | Homepage POM (load, locate Contact Us, open new tab) |
| `pages/ContactUsPage.ts` | Contact Us POM (fill, submit, reset, success/error helpers) |
| `test-data/contactUsData.ts` | Deterministic functional, validation, boundary, security data |
| `tests/home.spec.ts` | Homepage smoke / tile presence |
| `tests/contact-us-navigation.spec.ts` | New-tab navigation from homepage |
| `tests/contact-us-functional.spec.ts` | Structure, happy path, equivalence, boundaries |
| `tests/contact-us-validation.spec.ts` | Required fields, invalid email, whitespace |
| `tests/contact-us-reset.spec.ts` | Reset clear + post-error Reset unavailable |
| `tests/contact-us-security.spec.ts` | Non-destructive security-oriented input probes |
| `docs/investigation-report.md` | Observed application behavior |
| `docs/coverage-matrix.md` | Scenario coverage matrix |
| `docs/execution-results.md` | Headless/headed results and assessment |
| `docs/defects/README.md` | Defect log (none confirmed) + template |
| `docs/security-findings/SF-01-input-handling.md` | Security findings |
| `docs/FILES-CHANGED.md` | This inventory |

**Not modified:** `PWDemos/` learning project (intentionally separate).
