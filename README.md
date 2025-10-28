# XSS-Demo

Simple, intentionally vulnerable XSS chat demo (client-side JS + PHP + MySQL).

Quick start

1. Install a local PHP + MySQL stack (recommended: XAMPP, WAMP, MAMP).
2. Place this repository inside your web server's webroot (for XAMPP on Windows that's typically `C:\\xampp\\htdocs\\`).
3. Create the database and tables by importing `db.sql`:

```powershell
mysql -u root -p < db.sql
```

4. Start Apache + MySQL (or start XAMPP/WAMP control panel).
5. Open the demo in your browser via HTTP, e.g.: `http://localhost/XSS-Demo/index.html` (do not open via file://).

Notes
- This project is intentionally vulnerable to XSS for demonstration and learning purposes. The client injects message text into the DOM without escaping (see `chat.js`).
- If you want to test or fix the vulnerability, consider adding HTML-escaping in `chat.js` where messages are appended, or do server-side escaping in `apiChat.php`.

Files of interest
- `index.html` — static page and layout
- `chat.js` — frontend logic, login flow, polling, and DOM rendering (vulnerable insertion)
- `apiChat.php` — PHP backend API and session handling
- `db.sql` — database schema (creates `Chat` DB)
- `xss-live-demo.txt` — example XSS payloads used for testing

License
This repo is an educational demo. Use locally and safely.

Credits
- Diogo Carvalho Fernandes - BCYB24

