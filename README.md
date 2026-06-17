# PBVM Purulia District Branch — Official Website

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)

Official website for **Paschim Banga Vigyan Mancha (West Bengal Vigyan Mancha), Purulia District Branch** — a modern, bilingual (Bengali/English), mobile-first web platform.

---

## 🏗️ Project Structure

```
PBVM/
├── frontend/     ← Next.js 15 + TypeScript + Tailwind CSS + Shadcn UI
└── backend/      ← Node.js + Express.js + MongoDB (Mongoose)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for file storage)

### Frontend
```bash
cd frontend
cp .env.local.example .env.local   # fill in your API URL
npm run dev                         # http://localhost:3000
```

### Backend
```bash
cd backend
cp .env.example .env               # fill in MongoDB URI, Cloudinary, SMTP
npm run dev                         # http://localhost:5000
```

---

## 🎨 Tech Stack

| Layer       | Technology                                           |
|-------------|------------------------------------------------------|
| Frontend    | Next.js 15, React 19, TypeScript, Tailwind CSS       |
| UI Library  | Shadcn UI, Framer Motion, Lucide React               |
| Forms       | React Hook Form + Zod                                |
| Rich Text   | Tiptap                                               |
| Gallery     | yet-another-react-lightbox                           |
| Backend     | Node.js, Express.js, TypeScript                      |
| Database    | MongoDB (Mongoose ODM)                               |
| Auth        | JWT (jsonwebtoken + bcryptjs)                        |
| File Storage| Cloudinary                                           |
| Email       | Nodemailer (Gmail SMTP)                              |
| Deployment  | Vercel (frontend) + Render (backend)                 |

---

## 🌐 Pages

| Page             | Route                        |
|------------------|------------------------------|
| Home             | `/`                          |
| About            | `/about`                     |
| Activities       | `/activities`                |
| Activity Detail  | `/activities/[slug]`         |
| Events           | `/events`                    |
| Event Detail     | `/events/[id]`               |
| Gallery          | `/gallery`                   |
| Publications     | `/publications`              |
| Policy Issues    | `/policy-issues`             |
| Downloads        | `/downloads`                 |
| Contact          | `/contact`                   |
| Join Us          | `/join-us`                   |
| Admin Login      | `/admin/login`               |
| Admin Dashboard  | `/admin/dashboard`           |

---

## 🎨 Brand

| Token         | Value     |
|---------------|-----------|
| Deep Blue     | `#0B3D91` |
| Science Teal  | `#00897B` |
| Orange        | `#FF9800` |
| Green         | `#43A047` |
| Heading Font  | Poppins   |
| Body Font     | Inter     |

---

## 📄 Documentation
- [SRS v1.0](./PBVM_Purulia_Website_SRS.docx)
- [PRD v1.0](./PBVM_Purulia_Website_PRD.docx)
