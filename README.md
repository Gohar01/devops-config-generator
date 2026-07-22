# DevOpsForge — Visual Docker & Server Config Generator

🚀 **DevOpsForge** is a free, interactive, **100% client-side developer utility** that allows you to visually build error-free Docker Compose environments, multi-stage Dockerfiles, reverse-proxy configurations, and database backup scripts in real-time.

🔗 **Live Link:** [devops-config-generator.vercel.app](https://devops-config-generator.vercel.app/)

---

## Why DevOpsForge?

For developers, setting up infrastructure files (like Nginx rules, Caddy routing, and Docker volumes) is a recurring chore. Most online generators require uploading configuration variables to a database server. 

Because infrastructure files contain highly sensitive variables, database passwords, and domain details, **DevOpsForge runs entirely in your browser**. All inputs are processed locally using JavaScript—ensuring complete privacy and absolute protection against data leaks.

---

## Key Features

- 🐳 **Dynamic Docker Compose Builder:** Configure frontends (React, Next.js), backends (Node.js, FastAPI, Gin), caching layers (Redis), and databases (PostgreSQL, MongoDB, MySQL) visually.
- ⚡ **Auto-SSL Reverse Proxies:** Generate production-ready configuration templates for **Caddy** (with automatic Let's Encrypt SSL management) or standard secure **Nginx** settings.
- 🔒 **Hardened Container Security:** Inject automated container healthchecks and multi-stage production Dockerfiles running as secure non-root users.
- 💾 **S3 Automated Cloud Backups:** Generates a custom `backup-s3.sh` shell script to automate database dumps, gzip compression, cloud uploads (AWS S3/Cloudflare R2), and notify you of success/failure status via Discord or Slack webhooks.
- 📦 **One-Click Export:** Download the entire configured file bundle sequentially in a single click without browser popup blocks.

---

## Local Development

Since the project is a static website, you can run it locally with zero dependencies.

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/devops-config-generator.git
   cd devops-config-generator
   ```
2. Open `index.html` in your web browser, or serve it using a lightweight dev server:
   ```bash
   npx serve .
   ```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.