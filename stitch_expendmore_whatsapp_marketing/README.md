# ExpendMore - SaaS WhatsApp Marketing Platform

This repository houses the core authentication, workspace switching, multi-tenant RBAC permissions, and email relays infrastructure for **ExpendMore**.

---

## 🛠️ Server Environment Requirements
* **Operating System:** Linux Ubuntu / Windows Server
* **Web Server:** Apache 2.4 / Nginx
* **PHP Engine:** PHP 8.1+
* **Required PHP Extensions:** `pdo`, `pdo_mysql`, `curl`, `openssl`, `session`
* **Database Engine:** MySQL 8.0+

---

## 🐳 Quickstart Docker Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/expendmore/auth.git
   cd auth
   ```

2. **Setup environment settings:**
   Copy the example template and fill in your database/email configuration properties:
   ```bash
   cp .env.example .env.local
   ```

3. **Orchestrate container volumes:**
   ```bash
   docker-compose up -d --build
   ```
   This command starts the PHP Apache web server mapped to port `8080` (accessible at `http://localhost:8080/expendmore_login/code.php`) and initializes the MySQL database with all schema tables automatically.

---

## 🏗️ Manual Server Setup

1. **Database Import:**
   Execute migrations scripts in order:
   ```bash
   mysql -u root -p expendmore < auth_core/schema.sql
   mysql -u root -p expendmore < auth_core/schema_v3.sql
   mysql -u root -p expendmore < auth_core/schema_v4.sql
   mysql -u root -p expendmore < auth_core/schema_v5.sql
   ```

2. **Seeding Matrix:**
   Seed default roles and plans:
   ```bash
   php auth_core/saas_seeder.php
   ```

3. **Apache Directives Configuration:**
   Import virtual host settings inside `/etc/apache2/sites-available/000-default.conf` from the template configuration file `expendmore.conf`.

---

## 🔒 Security Compliance Checklist
* **Prepared Queries:** Used PDO statement binds to eliminate SQL injection vectors.
* **CSRF tokens:** Checked on all POST routes.
* **Clickjacking mitigation:** Emitted `X-Frame-Options: DENY` on header files.
* **XSS filtering:** Cleaned inputs with `htmlspecialchars()`.
* **Lockout Brute Force protection:** Limits attempts per IP to 5 max per 15 minutes.
