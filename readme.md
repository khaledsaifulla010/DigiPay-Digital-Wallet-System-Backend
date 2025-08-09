# 💰 DigiPay - Digital Wallet System Backend

Welcome to **DigiPay**, a secure, modular, and role-based backend API designed for a digital wallet system inspired by popular platforms like Bkash and Nagad. Built using Express.js and Mongoose, this backend empowers users, agents, and admins to perform wallet management, transactions, and role-based operations with ease and security.

---

## 🧭 Project Overview

DigiPay offers a comprehensive backend solution where:

- Users can register, top-up wallets, withdraw funds, send money, and view their transaction history.
- Agents can perform cash-in and cash-out operations on behalf of users and monitor their commission history.
- Admins have full control over users, agents, wallets, and transactions, including blocking wallets and managing agent statuses.

The system is built with JWT-based authentication, secure password hashing, and a modular architecture following best practices for scalability and maintainability.

---

## 📌 Key Features

### Authentication & Authorization

- JWT-based login system with three roles: **admin**, **user**, **agent**.
- Secure password hashing using bcrypt.
- Role-based route protection to restrict access.

### Wallet Management

- Automatic wallet creation for users and agents during registration.
- Initial wallet balance assigned (e.g., ৳50).
- Users can top-up, withdraw, and transfer money.
- Agents can cash-in and cash-out money for users.
- Admins can block/unblock wallets and approve/suspend agents.

### Transaction Management

- All transactions (top-up, withdrawal, transfer, cash-in/out) are recorded and traceable.
- Supports transaction history retrieval for users and agents.
- Admins can view all transactions.

### Modular Architecture

- Separate modules for authentication, users, wallets, and transactions.
- Clean folder structure for scalability and ease of development.

---

## 🧱 Suggested Project Structure

```plaintext
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── wallet/
│   └── transaction/
├── middlewares/
├── config/
├── utils/
├── app.ts
```

---

## ⚙️ Tech Stack

| Package                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `bcryptjs`              | Library for password hashing                       |
| `cookie-parser`         | Parse Cookie header and populate `req.cookies`     |
| `cors`                  | Middleware to enable CORS                          |
| `dotenv`                | Loads environment variables from `.env`            |
| `express`               | Web framework for Node.js                          |
| `http-status-codes`     | Constants for standard HTTP status codes           |
| `jsonwebtoken`          | JWT creation and verification                      |
| `mongodb`               | Official MongoDB driver for Node.js                |
| `mongoose`              | ODM (Object Data Modeling) library for MongoDB     |
| `passport`              | Authentication middleware                          |
| `passport-local`        | Strategy for username/password authentication      |
| `zod`                   | Schema validation library                          |
| `typescript`            | Typed JavaScript for safer coding                  |
| `ts-node-dev`           | Runs TypeScript files with auto-restart on changes |
| `eslint`                | Linter for maintaining code quality                |
| `typescript-eslint`     | ESLint parser and plugin for TypeScript            |
| `@types/bcryptjs`       | TypeScript types for `bcryptjs`                    |
| `@types/cookie-parser`  | TypeScript types for `cookie-parser`               |
| `@types/cors`           | TypeScript types for `cors`                        |
| `@types/express`        | TypeScript types for `express`                     |
| `@types/jsonwebtoken`   | TypeScript types for `jsonwebtoken`                |
| `@types/passport`       | TypeScript types for `passport`                    |
| `@types/passport-local` | TypeScript types for `passport-local`              |

---

## 📡 API Endpoints

Base URL: `/api/v1`

### 🔐 Auth

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | /auth/login         | Login with email & password |
| POST   | /auth/refresh-token | Refresh JWT token           |

### 👤 User

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | /user/register  | Register a new user or agent |
| GET    | /user/all-users | [Admin] Get all users        |
| GET    | /user/:id       | [Admin] Get user by ID       |
| PATCH  | /user/:id       | [Admin] Change agent status  |

### 🏦 Wallet

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | /wallet/all-wallets | [Admin] Get all wallets            |
| GET    | /wallet/:id         | [Admin] Get wallet by ID           |
| PATCH  | /wallet/:id         | [Admin] Update user wallet details |
| POST   | /wallet/withdraw    | Withdraw money from wallet         |
| POST   | /wallet/transfer    | Transfer money to another user     |
| POST   | /wallet/cashIn      | [Agent] Add money to user wallet   |

### 📜 Transactions

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | /user-transaction/userId      | [User] Get own transaction history |
| GET    | /transaction/all-transactions | [Admin] Get all transactions       |
| GET    | /transaction/:id              | [Admin] Get transaction by ID      |
| GET    | /agent-commission             | [Agent] Get own commission history |

---

## 🔐 Role-Based Access Control (RBAC)

- **Admin:** Full access to users, agents, wallets, and transactions management.
- **Agent:** Manage cash-in/cash-out operations and view commission history.
- **User:** Perform wallet top-up, withdrawal, transfers, and view personal transaction history.

---

## ⚙️ Configuration

Create a `.env` file in your project root and use the following structure. Make sure to **replace placeholder values** with your actual configuration.

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017
NODE_ENV=development
BCRYPT_SALT_ROUND=Give a round

# JWT Settings
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES=your_jwt_access_expires
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES=your_jwt_refresh_expires

# Frontend URL
FRONTEND_URL=your frontend url

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strongpassword
ADMIN_PHONE=+8801234567890
```

---

## 📥 Installation

Clone the project and install dependencies:

```bash
git clone https://github.com/khaledsaifulla010/DigiPay-Digital-Wallet-System-Backend.git
cd DigiPay-Digital-Wallet-System-Backend
npm install
```

---

<p align="center">
  🛠️ Developed by <strong>Khaled Saifulla</strong> with clean backend architecture ❤️.
</p>

---
