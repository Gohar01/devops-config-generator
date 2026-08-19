# DevOpsForge — Visual Docker & Server Config Generator

🚀 **DevOpsForge** is a free, interactive, **100% client-side developer utility** that allows you to visually build error-free Docker Compose environments, multi-stage Dockerfiles, reverse-proxy configurations, and database backup scripts in real-time.

🔗 **Live Link:** [devops-config-generator.vercel.app](https://devops-config-generator.vercel.app/)

[![Product Hunt](https://img.shields.io/badge/Product%20Hunt-Featured-orange?style=for-the-badge&logo=producthunt)](https://www.producthunt.com/posts/devopsforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## ⚡ Looking for a Battle-Tested Production Stack?
If you want to skip manual configuration entirely, get the **[DevOpsForge Production Pack ($19)](https://goharista17.gumroad.com/l/docker-starter-pack)** on Gumroad! 

It includes pre-configured production files for all supported backend frameworks with:
*   **Automatic SSL/HTTPS** certificates renewal via Caddy.
*   **Hardened security settings** (HSTS, CSP, and X-Frame headers).
*   **Automatic S3/Cloudflare R2 database backups** with Slack/Discord webhooks.
*   **Resource limits & healthchecks** configured for production VPS servers.

👉 **[Get the Production Pack on Gumroad](https://goharista17.gumroad.com/l/docker-starter-pack)**

---

## Why DevOpsForge?

For developers, setting up infrastructure files (like Nginx rules, Caddy routing, and Docker volumes) is a recurring chore. Most online generators require uploading configuration variables to a database server. 

Because infrastructure files contain highly sensitive variables, database passwords, and domain details, **DevOpsForge runs entirely in your browser**. All inputs are processed locally using JavaScript—ensuring complete privacy and absolute protection against data leaks.

---

## Key Features

*   🐳 **Dynamic Docker Compose Builder:** Configure frontends (React, Next.js, static) and backends visually.
*   💻 **Backend Framework Support:** Pre-configured environments and ports for:
    *   **Node.js** (Express/REST)
    *   **Python / FastAPI**
    *   **Go** (Gin Server)
    *   **PHP / Laravel** (PHP-FPM Server)
    *   **Python / Django** (Gunicorn Server)
    *   **Java / Spring Boot** (Maven Build Runner)
*   💾 **Flexible Databases:** Instantly add PostgreSQL, MySQL, MongoDB, Redis, or None.
*   ⚡ **Auto-SSL Reverse Proxies:** Generate configuration templates for **Caddy** (with automatic Let's Encrypt SSL management) or standard secure **Nginx** settings.
*   🔒 **Hardened Container Security:** Inject automated container healthchecks and multi-stage production Dockerfiles running as secure non-root users.
*   💾 **S3 Automated Cloud Backups:** Generates a custom `backup-s3.sh` shell script to automate database dumps, gzip compression, cloud uploads (AWS S3/Cloudflare R2), and notify you of success/failure status via Discord or Slack webhooks.
*   📦 **One-Click Export:** Download the entire configured file bundle sequentially in a single click without browser popup blocks.

---

## Local Development

Since the project is a static website, you can run it locally with zero dependencies.

1. Clone the repository:
   ```bash
   git clone https://github.com/Gohar01/devops-config-generator.git
   cd devops-config-generator
   ```
2. Open `index.html` in your web browser, or serve it using a lightweight dev server:
   ```bash
   npx serve .
   ```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.