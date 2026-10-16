# DevOpsForge — Visual Docker & Server Config Generator

🚀 **DevOpsForge** is a free, interactive, **100% client-side developer utility** that allows you to visually build error-free Docker Compose environments, multi-stage Dockerfiles, reverse-proxy configurations, and database backup scripts in real-time.

🔗 **Live Link:** [https://devops-config-generator.vercel.app](https://devops-config-generator.vercel.app/)

[![Release: v1.5.0](https://img.shields.io/badge/Release-v1.5.0-blue?style=for-the-badge&logo=github)](https://github.com/Gohar01/devops-config-generator/releases/tag/v1.5.0)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-devops--config--generator.vercel.app-2f9e5b?style=for-the-badge&logo=vercel)](https://devops-config-generator.vercel.app)
[![Privacy: 100% In-Browser](https://img.shields.io/badge/Privacy-100%25%20In--Browser%20(Zero%20Telemetry)-success?style=for-the-badge)](https://devops-config-generator.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## ⚡ Looking for a Turnkey Production Stack?

Skip manual server configuration entirely with our pre-built, battle-tested production kits on Gumroad:

| Feature | Free Web Generator | [Indie Pack ($19)](https://goharista17.gumroad.com/l/docker-starter-pack) | [Agency Commercial Kit ($49)](https://goharista17.gumroad.com/l/agency-commercial-kit) |
| :--- | :---: | :---: | :---: |
| **Visual In-Browser Builder** | ✅ | ✅ | ✅ |
| **All 5 Framework Stacks** (Next.js, FastAPI, Laravel, Django, Spring Boot) | Manual | Pre-Built | Pre-Built |
| **Caddy Auto-SSL & Hardened Nginx** | ✅ | ✅ | ✅ |
| **Automated S3/R2 Cloud Backup Scripts** | Basic | Advanced | Advanced |
| **Terraform 1-Click Provisioning** (AWS EC2 & DigitalOcean) | ❌ | ❌ | ✅ |
| **Ansible 60s VPS Bootstrap** (Docker CE + UFW + Fail2ban) | ❌ | ❌ | ✅ |
| **Commercial Client White-Labeling License** | ❌ | Single Dev | Unlimited Client Projects |

* 👉 **[Get the Indie Developer Pack ($19)](https://goharista17.gumroad.com/l/docker-starter-pack)** — Perfect for solo developers & side projects.
* 🏢 **[Get the Agency Commercial Kit ($49)](https://goharista17.gumroad.com/l/agency-commercial-kit)** — Full infrastructure-as-code automation with unlimited client deployment rights.

---

## 📦 Free Production Starter Repositories

Prefer starting directly from a ready-to-clone repository? Check out our official GitHub starters:
* 🚀 **[Next.js 14 + Caddy + PostgreSQL Starter](https://github.com/Gohar01/nextjs-docker-caddy-production)** — Production Next.js (standalone output) with automated Let's Encrypt SSL/TLS, HTTP/3 QUIC, and PostgreSQL 16.
* ⚡ **[FastAPI + Caddy + PostgreSQL Starter](https://github.com/Gohar01/fastapi-docker-caddy-starter)** — Hardened Python 3.11-slim FastAPI boilerplate with non-root security isolation and Caddy reverse proxy.

---

## Why DevOpsForge?

Setting up infrastructure files (Nginx routing, Caddy Auto-SSL, Docker networks, and volume permissions) is error-prone. Most online generators require sending your variables and database passwords to a remote backend.

Because infrastructure configurations contain sensitive environment variables, secrets, and database credentials, **DevOpsForge runs 100% in your browser**. All parsing and file generation happen locally via client-side JavaScript. Zero telemetry, no credentials ever leave your machine.

---

## Key Features

* 🐳 **Dynamic Docker Compose Builder:** Visually configure frontends (React, Next.js standalone, static) and backends with healthchecks and restart policies.
* 💻 **Multi-Framework Production Stacks:** Pre-configured environments for:
  * **Node.js** (Express / REST)
  * **Python / FastAPI** (Uvicorn / non-root)
  * **PHP / Laravel** (PHP-FPM + Octane support)
  * **Python / Django** (Gunicorn Server)
  * **Java / Spring Boot** (Maven Build Runner)
  * **Go** (Gin Server)
* 💾 **Database Integrations:** Instantly configure PostgreSQL, MySQL, Redis, MongoDB, or standalone setups with persistent named volumes.
* ⚡ **Auto-SSL Reverse Proxies:** Production-ready configs for **Caddy** (automated Let's Encrypt certificates + HTTP/3) and hardened **Nginx** (security headers, HSTS, rate limiting).
* 🔒 **Custom `.env` Generator:** Visually configure custom environment variables with 1-click in-browser export and zero secret leakage.
* 💾 **Automated Cloud Backup Scripts:** Generates automated `backup-s3.sh` scripts for database dumps, gzip compression, S3/Cloudflare R2 uploads, and Slack/Discord webhook alerts.
* 📦 **One-Click Export:** Download the entire configured file bundle sequentially in a single click without browser popup blocks.

---

## Local Development

Since DevOpsForge is a static web application, you can run it locally with zero dependencies:

```bash
git clone https://github.com/Gohar01/devops-config-generator.git
cd devops-config-generator
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.