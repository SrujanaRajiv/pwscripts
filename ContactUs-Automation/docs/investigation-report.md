# Investigation Report — WebDriverUniversity Contact Us

**Application:** https://www.webdriveruniversity.com/  
**Feature URL:** https://www.webdriveruniversity.com/Contact-Us/contactus.html  

**Browser:** Playwright Chromium 153.0.8010.12  



---

## Homepage behavior

- Homepage loads successfully at `/`.
- Brand link `WebdriverUniversity.com` is visible.
- Heading `Test Automation Challenges` is present.
- Site copy states challenges open in a new tab.

## Navigation behavior

- Contact Us tile: `#contact-us`, class `card-link`.
- `href`: `/Contact-Us/contactus.html` (absolute: `https://www.webdriveruniversity.com/Contact-Us/contactus.html`).
- `target="_blank"` — opens a **new tab**.
- Parent homepage tab remains on the homepage URL.

## New-tab behavior

- Clicking Contact Us creates a new Playwright `Page`.
- Destination loads with title containing `Contact Us`.
- Destination URL matches `/Contact-Us/contactus.html`.

## Contact Us structure

| Control | Tag | name | type | placeholder | HTML5 required | maxlength |
|---------|-----|------|------|-------------|----------------|-----------|
| First Name | INPUT | first_name | text | First Name | false | none |
| Last Name | INPUT | last_name | text | Last Name | false | none |
| Email | INPUT | email | text (not email) | Email Address | false | none |
| Comments | TEXTAREA | message | textarea | Comments | false | none |
| Reset | INPUT | — | reset | — | — | — |
| Submit | INPUT | — | submit | — | — | — |

- Form `id=contact_form`, `method=post`, `action=javascript:void(0);`.
- `onsubmit="return validateContactForm();"` — client-side JS validation replaces the document body; no server navigation for success/error.

## Required fields

After `.trim()`, all four fields are mandatory:

- first_name, last_name, email, message must be non-empty.

## Successful submission rules

When all trimmed fields are non-empty **and** email matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`:

- Body is replaced with success UI.
- Heading: **Thank You for your Message!**
- URL remains `/Contact-Us/contactus.html` (no thank-you.html redirect).
- Submitted values are **not** reflected on the success page.

## Error conditions

Validation rules from `validateContactForm()`:

| Condition | Observed messages |
|-----------|-------------------|
| Any empty field **and** email empty/invalid | `Error: all fields are required` **and** `Error: Invalid email address` |
| Any empty field **but** email valid | `Error: all fields are required` only |
| All filled, email invalid | `Error: Invalid email address` only |

Error UI replaces the form body; “Try Again” / “Home” nav links appear. URL stays on contactus.html.

## Exact error messages

1. `Error: all fields are required`
2. `Error: Invalid email address`

## Email validation behavior

- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Leading/trailing whitespace trimmed before test.
- `type=text` — no native HTML5 email constraint.
- Empty email is always treated as invalid email (combined with required when other empties exist).

## Field validation behavior

- No HTML5 `required` / `pattern` / `maxlength`.
- Whitespace-only values fail after trim (treated as empty).
- Leading/trailing spaces on otherwise-valid values are accepted (trimmed).

## Boundary findings

- No explicit maxlength/minlength in DOM.
- Exploratory lengths 1 char, ~500, ~2000 comments all accepted when other fields valid.
- No distinct length-based error behavior observed.

## Edge-case findings

- Hyphenated / apostrophe names: accepted.
- Unicode (accented names, Japanese comments): accepted.
- Multiline comments: accepted.
- Whitespace-only: rejected as required-field failure.

## Reset behavior

- Native `type=reset` clears all fields to empty strings.
- Does not submit and does not navigate away.
- After a validation error, the form DOM is replaced — Reset is **gone**; user must use “Try Again” (reload) to restore the form.

## Security-oriented findings

- HTML/XSS/SQL-like/special-character payloads that pass field+email rules produce the static success page.
- Success/error UIs do **not** reflect submitted input into the DOM as markup.
- No script execution observed for probe payloads (alert override remained unset).
- See `docs/security-findings/` for formal notes. Risk is low for reflected XSS on this result path because values are not echoed.

## Unexpected behavior

- Modernized client-side handler differs from older server-posted thank-you/error HTML pages some tutorials still describe.
- Success stays on the same URL with in-place body replacement.

## Confirmed defects

- None confirmed as product defects relative to the site’s own observable rules.
- Weak HTML5 constraints and permissive name/content acceptance are **design characteristics of a practice site**, not filed as defects.

## Uncertainties

- No server-side persistence of submissions was verified (handler is fully client-side for the observed path).
- Exact historical vs modernized page differences outside this URL were not audited.
