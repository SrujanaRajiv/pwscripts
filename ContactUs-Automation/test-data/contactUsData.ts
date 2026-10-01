export const validContact = {
  firstName: 'Automation',
  lastName: 'Tester',
  email: 'automation.tester@example.com',
  comments: 'Automated Playwright test submission.',
} as const;

export const validEquivalenceContacts = [
  {
    name: 'hyphenated and apostrophe names',
    data: {
      firstName: "Mary-Jane",
      lastName: "O'Connor",
      email: 'mary.jane+qa@example.com',
      comments: 'Comments with punctuation: OK!',
    },
  },
  {
    name: 'Unicode names and comments',
    data: {
      firstName: 'José',
      lastName: 'Müller',
      email: 'jose.muller@example.com',
      comments: 'こんにちは — Unicode comment.',
    },
  },
  {
    name: 'multiline comments',
    data: {
      firstName: 'Line',
      lastName: 'Break',
      email: 'line.break@example.com',
      comments: 'First line\nSecond line\nThird line',
    },
  },
] as const;

export const requiredFieldOmissions = [
  {
    name: 'all fields empty',
    data: { firstName: '', lastName: '', email: '', comments: '' },
    expected: 'both' as const,
  },
  {
    name: 'missing first name',
    data: { ...validContact, firstName: '' },
    expected: 'required' as const,
  },
  {
    name: 'missing last name',
    data: { ...validContact, lastName: '' },
    expected: 'required' as const,
  },
  {
    name: 'missing email',
    data: { ...validContact, email: '' },
    expected: 'both' as const,
  },
  {
    name: 'missing comments',
    data: { ...validContact, comments: '' },
    expected: 'required' as const,
  },
] as const;

export const invalidEmails = [
  { name: 'missing @', email: 'automation.testerexample.com' },
  { name: 'missing local part', email: '@example.com' },
  { name: 'missing domain', email: 'automation.tester@' },
  { name: 'missing domain suffix', email: 'automation.tester@example' },
  { name: 'spaces in email', email: 'automation tester@example.com' },
  { name: 'multiple @', email: 'a@b@example.com' },
] as const;

export const whitespaceCases = [
  {
    name: 'whitespace-only first name',
    data: { ...validContact, firstName: '   ' },
    expected: 'required' as const,
  },
  {
    name: 'whitespace-only comments',
    data: { ...validContact, comments: '\t\n  ' },
    expected: 'required' as const,
  },
  {
    name: 'leading and trailing spaces on valid values',
    data: {
      firstName: '  Automation  ',
      lastName: '  Tester  ',
      email: '  automation.tester@example.com  ',
      comments: '  Trimmed comments  ',
    },
    expected: 'success' as const,
  },
] as const;

export const boundaryCases = [
  {
    name: 'single character fields',
    data: {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.co',
      comments: 'C',
    },
  },
  {
    name: 'long but reasonable comments (~500 chars)',
    data: {
      ...validContact,
      comments: 'A'.repeat(500),
    },
  },
  {
    name: 'oversized comments (~2000 chars)',
    data: {
      ...validContact,
      comments: 'B'.repeat(2000),
    },
  },
] as const;

export const securityPayloads = [
  {
    name: 'HTML-like comments',
    data: {
      ...validContact,
      comments: '<b>bold</b> <img src=x onerror=alert(1)>',
    },
  },
  {
    name: 'XSS-like script in comments',
    data: {
      ...validContact,
      comments: '<script>window.__xssFired=true</script>',
    },
  },
  {
    name: 'SQL-like comments',
    data: {
      ...validContact,
      comments: "'; DROP TABLE users; --",
    },
  },
  {
    name: 'special characters across fields',
    data: {
      firstName: 'A<>&"',
      lastName: "B';\\/",
      email: 'special.chars@example.com',
      comments: '<>&"\';[]{};',
    },
  },
  {
    name: 'URL and protocol-looking comments',
    data: {
      ...validContact,
      comments: 'https://example.com javascript:alert(1)',
    },
  },
] as const;
