# Verification on Web Portal

### Step 1: Go to the Verification Portal
Click the **Login with Discord** button after navigating to the [Verification Portal](/portal).

![Portal Login](/cdn/guide/img/portal-login.avif)

> **Important:** It could take two to five seconds to redirect to the Discord Oauth process. During this process, please wait patiently and refrain from clicking more than once or refreshing the page.

---

## test

```JavaScript
const js = require('@eslint/js');

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
		},
		rules: {
			'arrow-spacing': ['warn', { before: true, after: true }],
			'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
			'comma-dangle': ['error', 'always-multiline'],
			'comma-spacing': 'error',
			'comma-style': 'error',
			curly: ['error', 'multi-line', 'consistent'],
			'dot-location': ['error', 'property'],
			'handle-callback-err': 'off',
			indent: ['error', 'tab'],
			'keyword-spacing': 'error',
			'max-nested-callbacks': ['error', { max: 4 }],
			'max-statements-per-line': ['error', { max: 2 }],
			'no-console': 'off',
			'no-empty-function': 'error',
			'no-floating-decimal': 'error',
			'no-inline-comments': 'error',
			'no-lonely-if': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
			'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
			'no-trailing-spaces': ['error'],
			'no-var': 'error',
			'no-undef': 'off',
			'object-curly-spacing': ['error', 'always'],
			'prefer-const': 'error',
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'space-before-blocks': 'error',
			'space-before-function-paren': [
				'error',
				{
					anonymous: 'never',
					named: 'never',
					asyncArrow: 'always',
				},
			],
			'space-in-parens': 'error',
			'space-infix-ops': 'error',
			'space-unary-ops': 'error',
			'spaced-comment': 'error',
			yoda: 'error',
		},
	},
];
```
### 🔹 Basic Formatting
- <b>bold</b>
- <strong>strong importance</strong>
- <i>italic</i>
- <em>emphasized</em>
- <u>underlined</u>
- <mark>highlighted</mark>
- <small>small text</small>
- <del>deleted text</del>
- <ins>inserted text</ins>

### 🔹 Quotation & Citation
- <q>short quote</q>
- <blockquote>long quote</blockquote>
- <cite>citation</cite>
- <abbr title="HyperText Markup Language">HTML</abbr>

### 🔹 Code & Preformatted
- <code>inline code</code>
- <pre>preformatted text</pre>
- <kbd>Ctrl</kbd> + <kbd>C</kbd>
- <samp>output text</samp>
- <var>x</var> = 10

### 🔹 Sub/Superscript & Math
- x<sup>2</sup>
- H<sub>2</sub>O

### 🔹 Semantic & Direction
- <span style="color:red;">red span</span>
- <bdi>اسم</bdi>
- <bdo dir="rtl">Reversed text</bdo>

### 🔹 Rare but Useful
- <time datetime="2025-11-11">11 Nov 2025</time>
- <ruby>漢 <rt>kan</rt></ruby>
- <wbr>long<wbr>word<wbr>break<wbr>
- <details><summary>Click me</summary>Hidden text</details>
- <dfn>definition</dfn>
- <address>123 Dreamer St.</address>


---

### Step 2: Authorize with Discord bot
Authorize the Dreamer Helper Discord bot to authenticate your account.
On the authentication screen, click **Continue**. The popup window will automatically close after authentication is finished, so don't block it or close it.

![Discord Authorization](/cdn/guide/img/dc-oauth.avif)

> **Important:** Do not edit or modify the URL during this process.

---

### Step 3: Complete Authentication
You will see your profile as displayed below once you have logged in.

If you haven't verified yet, you will see a **Verify Now** button after logging in.  To start the YouTube verification process, click on it. and wait few seconds for verification token generation.

![user profile](/cdn/guide/img/profile.avif)

---

### Step 4: Connect YouTube Account
The verification interface will be visible to you.  Press the **Connect with YouTube** button. and patiently wait a few seconds without clicking again or reloading the page after clicked on button.

![verify Now page](/cdn/guide/img/verify-now-page.avif)

---

### Step 5: Select Your Google Account
Choose the Google account associated to your YouTube channel.

![Account Selection](/cdn/guide/img/account-selection.avif)

---

### Step 6: Grant Permissions
Continue with read-only permission to verify your YouTube account. Await the completion of the verification process. it will done in approx five seconds.

![Permission Grant](/cdn/guide/img/perm-grant.avif)

> **Privacy Note:** We only access your YouTube account's public data and subscriptions for verification purposes. Your subscriptions are not stored in our database, and we cannot access your email address or any private information.

---

### Step 7: Verification Completed
Congratulations! You're now verified. All eligible roles and rewards have been automatically assigned on discord. Head back to the Discord server to see your new roles.

![Success Screen](/cdn/guide/img/success-screen.avif)

![verified msg](/cdn/guide/img/verified-msg.avif)