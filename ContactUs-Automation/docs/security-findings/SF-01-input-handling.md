# Security Findings — Contact Us Form Input Handling

## Summary

Non-destructive probes (HTML-like, XSS-like, SQL-like, special characters, URL/protocol-looking text, Unicode, oversized comments) were submitted through the Contact Us form.

**Observed handling:** Inputs that satisfy required-field + email regex rules produce the static success UI (`Thank You for your Message!`). Submitted values are **not reflected** into the success or error DOM. No script execution was detected via an overridden `window.alert` probe flag.

**Security expectation / risk:** Reflected XSS risk on the result path is **low** for these probes because values are discarded rather than echoed. This does **not** prove broader site security; only this form’s client-side result rendering was assessed.

Active exploitation was intentionally **not** escalated after confirming non-execution / non-reflection.

---

## Finding SF-01 — No reflected execution of XSS/HTML probes on success path

| Field | Detail |
|-------|--------|
| Input vector | First Name, Comments (and related fields) |
| Payload category | HTML injection, XSS-like script tags, img onerror, SQL metacharacters, special chars, javascript: URL text |
| Observed handling | Accepted as form text when validation passes; success page is static |
| Execution/rendering | No `alert` firing; success body does not contain injected `<script>` / onerror markup from payloads |
| Potential risk | Low for reflected XSS on this response path |
| Evidence | Automated suite `tests/contact-us-security.spec.ts` — all 6 scenarios passed headless and headed |
| Reproducibility | 2/2 suite runs (headless + headed) |
| Exploitation stopped | Yes — detection only |

## Finding SF-02 — Client-side-only validation (informational)

| Field | Detail |
|-------|--------|
| Input vector | Entire form |
| Payload category | Architecture note |
| Observed handling | Validation and success/error UI occur entirely in browser JS (`validateContactForm`) |
| Potential risk | Informational for a practice site; no server validation observed on this path |
| Evidence | DOM inspection of inline script; see investigation report |
| Reproducibility | Always |

No Critical/High security defects requiring failing functional assertions were identified for this feature path.
