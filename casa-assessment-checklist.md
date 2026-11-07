***

### **Pre-CASA AL1 Security Checklist for Dev Team**

Please review and implement the following security requirements across our staging environment (`dev.dealercore.com.au`) prior to initiating the App Defense Alliance (ADA) CASA AL1 assessment. This will minimize remediation cycles and speed up audit completion.

#### **1. HTTP Security Headers**
Ensure the web server or application framework injects the following headers into all HTTP responses:
* [ ] **Strict-Transport-Security (HSTS):** Enabled (e.g., `max-age=31536000; includeSubDomains`).
* [ ] **X-Content-Type-Options:** Set to `nosniff`.
* [ ] **X-Frame-Options:** Set to `DENY` or `SAMEORIGIN`.
* [ ] **Content-Security-Policy (CSP):** Implemented to restrict unauthorized script execution/XSS.
* [ ] **X-XSS-Protection:** Set to `0` or `1; mode=block` (depending on modern CSP standards).
* [ ] **Referrer-Policy:** Set to `strict-origin-when-cross-origin` or similar secure policy.

#### **2. Transport Layer Security (TLS / HTTPS)**
* [ ] **Force HTTPS:** All HTTP traffic must redirect to HTTPS. No plaintext HTTP allowed.
* [ ] **SSL/TLS Configuration:** Ensure weak ciphers and outdated protocols (TLS 1.0, TLS 1.1) are disabled. Only TLS 1.2 and 1.3 should be supported.

#### **3. Dependency & Vulnerability Management**
* [ ] **Package Audit:** Run a full vulnerability audit on all project dependencies (e.g., `npm audit`, `composer audit`, `pip-audit`, etc.).
* [ ] **Patch High/Criticals:** Update all third-party libraries, plugins, and framework components with known High or Critical vulnerabilities.

#### **4. Error Handling & Information Disclosure**
* [ ] **Disable Debug Mode:** Ensure `APP_DEBUG` (or equivalent) is set to `false` on staging/production.
* [ ] **Generic Error Pages:** Unhandled exceptions or 500 errors must display a generic error page. Stack traces, database queries, framework versions, and file paths must **never** be exposed in responses.
* [ ] **Server Banner Grabbing:** Hide server version headers (e.g., Apache/Nginx/PHP versions) in the `Server` and `X-Powered-By` headers.

#### **5. Session Management & Cookies**
* [ ] **Secure Flag:** All authentication and session cookies must have the `Secure` flag set (transmitted over HTTPS only).
* [ ] **HttpOnly Flag:** Session cookies must have the `HttpOnly` flag set to prevent XSS-based cookie theft.
* [ ] **SameSite Flag:** Set to `Lax` or `Strict` to mitigate CSRF attacks.
* [ ] **Session Invalidation:** Ensure sessions are properly destroyed upon user logout.

#### **6. Authentication & Rate Limiting**
* [ ] **Brute-Force Protection:** Implement rate limiting on sensitive endpoints (Login, Password Reset, OTP verification, Registration).
* [ ] **Password Complexity:** Enforce a minimum password length (e.g., 8+ characters) for local accounts.

#### **7. Authorization & Access Control (BOLA / IDOR)**
* [ ] **Resource Isolation:** Verify that API endpoints and web routes enforce strict tenant/dealership isolation. A user from Dealership A must not be able to read, update, or delete data belonging to Dealership B by manipulating IDs in requests (Broken Object Level Authorization).

#### **8. Input Validation & Output Encoding**
* [ ] **SQL Injection Prevention:** Ensure all database queries utilize parameterized statements or ORM bindings (no raw, concatenated SQL strings).
* [ ] **XSS Prevention:** Ensure user-supplied input rendered in the UI is properly escaped/encoded.

*** 

**Note for the Team:** Once these items are verified and patched in staging, please let me know so we can officially kick off the CASA audit with the lab.


### **Laravel-Specific CASA Hardening Checklist**

#### **1. Environment Configuration (`.env`)**
* [ ] **`APP_DEBUG=false`**: This is the #1 reason Laravel apps fail security scans. When `true`, any exception dumps the entire database configuration, environment variables, and stack trace onto the screen. It **must** be `false` on staging and production.
* [ ] **`APP_ENV=production`** (or configured securely): Ensure the environment isn’t leaking local dev credentials.

#### **2. Security Headers (Middleware)**
Laravel doesn't add security headers (like HSTS or CSP) out of the box. Your developer should use a package like **`spatie/laravel-security-headers`** or write a custom middleware to inject headers like:
* `Strict-Transport-Security`
* `X-Frame-Options` (Laravel's `FrameGuard` middleware handles this, ensure it's active)
* `X-Content-Type-Options`
* `Content-Security-Policy`

#### **3. Session & Cookie Security (`config/session.php`)**
Open `config/session.php` and verify these settings are explicitly turned on:
* [ ] `'encrypt' => true;` (Encrypts session data stored in cookies/database).
* [ ] `'secure' => env('SESSION_SECURE_COOKIE', true);` (Forces cookies over HTTPS).
* [ ] `'http_only' => true;` (Prevents JavaScript access to session cookies).
* [ ] `'same_site' => 'lax';` (Or `'strict'`).

#### **4. Dependency & Package Audit (`composer`)**
* [ ] Run **`composer audit`** in the terminal. This checks all installed PHP packages against the PHP Security Advisories Database. Fix any flagged packages immediately.
* [ ] Ensure `composer.lock` is up to date.

#### **5. Laravel Debugbar & Telescope**
* [ ] **Remove or restrict Laravel Debugbar and Laravel Telescope**. If these tools are accessible on staging without strict authentication, automated scanners will flag them immediately as severe data leaks because they expose database queries, request payloads, and environment variables.

#### **6. Mass Assignment Protection (Eloquent)**
* [ ] Ensure all Eloquent models properly define **`$fillable`** or **`$guarded`** properties. If models rely on `$guarded = []` carelessly in controllers with `$request->all()`, scanners will flag potential mass-assignment vulnerabilities.

#### **7. Rate Limiting (`Route::middleware('throttle:...')`)**
* [ ] Ensure rate limiting is applied to the login route, OTP verification route, and password reset endpoints to prevent brute-force attacks. Laravel's default `api` and `web` throttles should be actively protecting sensitive auth routes.