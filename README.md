# Velora Creative House — Professional Hybrid

This version combines the original Velora Creative House visual identity/content with a cleaner professional responsive layout and a real server-side contact form.

## Contact email
The form sends enquiries to:
`pragadeeshwaran199@gmail.com`

## Setup
1. Install Node.js.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Create `.env` from `.env.example`.
5. Add your real SMTP credentials. For Gmail, use a Google App Password rather than your normal password.
6. Run `npm start`.
7. Open `http://127.0.0.1:8000`.

## Important
Do not upload `.env`, SMTP passwords, or `_mail_logs` to GitHub or a public host.
The custom thank-you page is part of the website, so users do not see a third-party "Thank you for using..." page.

## Pages
- `index.html` — home (hero, partners loop, services, process, why choose us)
- `about.html` — About page
- `thank-you.html` — shown after the contact card is submitted
- "Let's talk" (and every enquiry button) opens the contact card from `js/main.js`; there is no form on the page itself.

## Edit these
- Partner names in the loop: the `<ul class="marquee-group">` list in `index.html` (placeholders — use your real clients).
- Colours: the variables at the top of `css/style.css` (Deep Navy, Royal Blue, Sky Blue, Ice Blue, Soft Tint, White).
