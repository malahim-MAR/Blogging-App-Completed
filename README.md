# 📝 Malahim Blogging Platform

A full-stack blogging platform with a modern admin dashboard and a beautiful public-facing blog frontend.

## 🏗️ Project Structure

```
├── dashboard-blogging-app-nextjs-tailwind-daisyui-firebase-CRUD-main/   # Admin Dashboard
└── blogging-app-nextjs-firebase-dynamic-routing-main/                    # Blog Frontend
```

## ✨ Features

### Admin Dashboard
- 🔐 Firebase Authentication with protected routes
- 📝 Create, edit, and delete blog posts
- 👤 Automatic author attribution
- 📊 Analytics dashboard with visitor tracking
- 🎨 Modern glassmorphism UI with dark theme

### Blog Frontend  
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎯 Full-screen snap scroll blog browsing
- 💬 Public commenting system
- 👤 Author display with avatars
- 🔍 Category-based filtering
- 🚀 Real-time updates via Firebase

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/malahim-blogging-platform.git
cd malahim-blogging-platform
```

### 2. Setup Dashboard
```bash
cd dashboard-blogging-app-nextjs-tailwind-daisyui-firebase-CRUD-main
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
npm run dev
```
Dashboard runs on: http://localhost:3000

### 3. Setup Frontend
```bash
cd ../blogging-app-nextjs-firebase-dynamic-routing-main
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
npm run dev -- -p 3001
```
Frontend runs on: http://localhost:3001

## 🔐 Firebase Setup

Both apps share the same Firebase project. You need:
1. Firebase Authentication (Email/Password enabled)
2. Cloud Firestore database
3. (Optional) Firebase Analytics

Create a Firebase project at https://console.firebase.google.com and add your credentials to `.env.local` in both apps.

## 👥 Admin Accounts

| Name | Email | Password |
|------|-------|----------|
| Malahim Bin Haroon | malahim@admin.com | malahim |
| Aryan Farooq | aryan@admin.com | aryan123 |
| Yasir Ghani | yasir@admin.com | yasir123 |
| Muzammil Ali Hussain | muzammil@admin.com | muzammil |
| Khawaja Wasay Ali | wasay@admin.com | wasay123 |
| Zaviar Zarhan | zaviar@admin.com | zaviar |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, DaisyUI v5
- **Backend**: Firebase (Auth, Firestore, Analytics)
- **Language**: JavaScript (React)

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Contributors

- Malahim Bin Haroon
- Aryan Farooq
- Yasir Ghani
- Muzammil Ali Hussain
- Khawaja Wasay Ali
- Zaviar Zarhan
