# Coverage Matrix — Contact Us

| ID | Area | Scenario | Partition/Boundary | Test Data | Expected | Observed | Automated | Result |
|----|------|----------|--------------------|-----------|----------|----------|-----------|--------|
| H01 | Homepage | Page loads | Smoke | N/A | Brand + challenges visible | As expected | Yes `home.spec.ts` | Pass |
| H02 | Homepage | Contact Us tile | Presence | `#contact-us` | Visible, enabled, `_blank` | As expected | Yes | Pass |
| N01 | Navigation | Open Contact Us | New tab | Click tile | New tab → contactus.html; home remains | As expected | Yes `contact-us-navigation.spec.ts` | Pass |
| F01 | Form structure | Controls present | Structure | N/A | FN/LN/Email/Comments/Reset/Submit | As expected | Yes `contact-us-functional.spec.ts` | Pass |
| F02 | Positive | Valid submit | Happy path | Automation / Tester / automation.tester@example.com / message | Thank You heading; same URL | As expected | Yes | Pass |
| F03 | Positive | Hyphen/apostrophe names | Equivalence | Mary-Jane / O'Connor / +email | Success | As expected | Yes | Pass |
| F04 | Positive | Unicode | Equivalence | José / Müller / JP comment | Success | As expected | Yes | Pass |
| F05 | Positive | Multiline comments | Equivalence | Multi-line text | Success | As expected | Yes | Pass |
| B01 | Boundary | Min length | 1 char | A/B/a@b.co/C | Success | As expected | Yes | Pass |
| B02 | Boundary | ~500 chars comments | Exploratory | `A`×500 | Success | As expected | Yes | Pass |
| B03 | Boundary | ~2000 chars comments | Exploratory oversized | `B`×2000 | Success | As expected | Yes | Pass |
| V01 | Required | All empty | Negative | Empty all | Both errors | As expected | Yes `contact-us-validation.spec.ts` | Pass |
| V02 | Required | Missing first name | Negative | firstName empty | Required only | As expected | Yes | Pass |
| V03 | Required | Missing last name | Negative | lastName empty | Required only | As expected | Yes | Pass |
| V04 | Required | Missing email | Negative | email empty | Both errors | As expected | Yes | Pass |
| V05 | Required | Missing comments | Negative | comments empty | Required only | As expected | Yes | Pass |
| E01 | Email | Missing @ | Invalid email | `automation.testerexample.com` | Invalid email only | As expected | Yes | Pass |
| E02 | Email | Missing local | Invalid email | `@example.com` | Invalid email only | As expected | Yes | Pass |
| E03 | Email | Missing domain | Invalid email | `automation.tester@` | Invalid email only | As expected | Yes | Pass |
| E04 | Email | Missing suffix | Invalid email | `automation.tester@example` | Invalid email only | As expected | Yes | Pass |
| E05 | Email | Spaces | Invalid email | space in local | Invalid email only | As expected | Yes | Pass |
| E06 | Email | Multiple @ | Invalid email | `a@b@example.com` | Invalid email only | As expected | Yes | Pass |
| W01 | Whitespace | Whitespace-only FN | Edge | `   ` | Required only | As expected | Yes | Pass |
| W02 | Whitespace | Whitespace-only comments | Edge | tabs/newlines | Required only | As expected | Yes | Pass |
| W03 | Whitespace | Trimmed valid values | Edge | padded fields | Success | As expected | Yes | Pass |
| R01 | Reset | Clears fields | State | validContact then Reset | All empty; same URL | As expected | Yes `contact-us-reset.spec.ts` | Pass |
| R02 | Reset | After error | State transition | Invalid submit | Form gone; Try Again visible | As expected | Yes | Pass |
| S01 | Security | HTML-like comments | HTML injection | `<b>` / img onerror | Success; no execution/reflection | As expected | Yes `contact-us-security.spec.ts` | Pass |
| S02 | Security | XSS script comments | XSS probe | `<script>...` | Success; no execution | As expected | Yes | Pass |
| S03 | Security | SQL-like comments | SQLi-like | `'; DROP TABLE...` | Success as text | As expected | Yes | Pass |
| S04 | Security | Special chars | Special | `<>&"'\;/[]` | Success; no execution | As expected | Yes | Pass |
| S05 | Security | URL/protocol text | URL-like | http + javascript: | Success; no execution | As expected | Yes | Pass |
| S06 | Security | XSS-like first name | XSS probe | script in FN | Success; no execution | As expected | Yes | Pass |

**Totals:** 33 matrix rows · 32 automated tests · 32 passed (headless & headed) · retries = 0
