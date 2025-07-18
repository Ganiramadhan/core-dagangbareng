# 🛒 Dagang Bareng Backend - NestJS E-Commerce Starter

A clean, scalable, and modular **NestJS backend** boilerplate designed specifically for **Dagang Bareng**, a modern e-commerce platform. This starter includes **TypeORM**, **PostgreSQL**, **JWT Auth**, Swagger API documentation, and built-in microservices support.

---

## ✨ Features

- ⚙️ Environment configuration with `.env`
- 📄 Auto-generated Swagger documentation
- 🛣️ Alias import paths (e.g., `@/shared`)
- 🔐 JWT-based authentication
- 🧱 Scalable, modular structure for microservices
- 🧩 Ready for multi-service architecture (auth, product, order)
- 🛢️ ORM support using **TypeORM**
- 🧹 Pre-commit linting and formatting (Husky + Lint-Staged)
- 📝 Commit enforcement with **Conventional Commits**

---

## 🛠 Tech Stack

- **NestJS** - Scalable Node.js backend framework
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL** - Main database
- **JWT** - Authentication
- **Swagger** - API docs
- **Husky & Lint-Staged** - Git hook tools
- **Dotenv** - Config management

---

## 📁 Folder Structure

```
apps/
├── auth-api/
├── product-api/
├── order-api/
└── shop-api/
```

Each API is its own microservice and includes its own controllers, services, entities, and DTOs.

---

## ⚙️ Environment Setup

### Example `.env`

```env
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=dagangbareng_db
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/Ganiramadhan/dagangbareng-backend.git
cd dagangbareng-backend

yarn install
yarn prepare
```

Run services in development:

```bash
yarn start:auth-api:dev
yarn start:product-api:dev
yarn start:order-api:dev
yarn start:shop-api:dev
```

Visit Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## ✅ Scripts

| Command                      | Description                        |
|------------------------------|------------------------------------|
| `yarn start:<service>:dev`   | Run specified service (e.g. `auth-api`) in dev |
| `yarn build`                 | Compile all apps for production    |
| `yarn format`                | Format code                        |
| `yarn lint`                  | Run ESLint                         |
| `yarn prepare`               | Prepare Git hooks (Husky)          |

---

## 📦 Git Hooks

Powered by **Husky** and **Lint-Staged**:

```json
"lint-staged": {
  "**/*.ts": ["eslint --fix"]
}
```

---

## 📝 Commit Style (Conventional Commits)

Examples:

- `feat(product): create product listing endpoint`
- `fix(order): correct total calculation`
- `docs(readme): improve getting started guide`

For more, visit [Conventional Commits](https://www.conventionalcommits.org/).

---

## 📄 License

MIT © 2025 Dagang Bareng
