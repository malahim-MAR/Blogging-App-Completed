# BlogAdmin Pro - Dashboard

A modern, feature-rich blog management dashboard built with Next.js 15, Tailwind CSS, DaisyUI, and Firebase.

![Dashboard Preview](https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800)

## ✨ Features

- 🔐 **Firebase Authentication** - Secure login/signup with email & password
- 📝 **Blog Management** - Create, edit, and delete blog posts
- 👤 **Author Attribution** - Automatic author name assignment to posts
- 📊 **Analytics Dashboard** - Track views, visitors, and content performance
- 🎨 **Modern UI** - Beautiful glassmorphism design with dark theme
- 📱 **Responsive Design** - Works on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
src/app/
├── Components/         # Reusable UI components
│   ├── AdminDashboard.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── ClientLayout.jsx
├── context/           # React Context providers
│   └── AuthContext.jsx
├── lib/               # Utilities and Firebase config
│   └── firebase.js
├── login/             # Login/Signup page
├── NewBlog/           # Create new blog post
├── EditBlog/          # Edit existing blog
├── AllBlogs/          # View all blogs
├── Analytics/         # Analytics dashboard
└── Settings/          # App settings
```

## 👥 Admin Accounts

The following admin accounts are pre-configured:

| Name | Email | Password |
|------|-------|----------|
| Malahim Bin Haroon | malahim@admin.com | malahim |
| Aryan Farooq | aryan@admin.com | aryan123 |
| Yasir Ghani | yasir@admin.com | yasir123 |
| Muzammil Ali Hussain | muzammil@admin.com | muzammil |
| Khawaja Wasay Ali | wasay@admin.com | wasay123 |
| Zaviar Zarhan | zaviar@admin.com | zaviar |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, DaisyUI v5
- **Backend**: Firebase (Auth, Firestore)
- **Fonts**: Inter, Poppins (Google Fonts)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
