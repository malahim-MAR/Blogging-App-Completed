# BlogHub Insights - Frontend

A modern, responsive blog frontend built with Next.js 15, featuring a beautiful snap-scroll interface, real-time comments, and author attribution.

![Blog Preview](https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800)

## ✨ Features

- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎯 **Snap Scroll UI** - Smooth, full-screen blog browsing experience
- 💬 **Public Comments** - Simple title + message commenting system
- 👤 **Author Display** - Shows author name and avatar on each post
- 🔍 **Category Filtering** - Browse blogs by category (Tech, Sports, etc.)
- 🚀 **Real-time Updates** - Powered by Firebase Firestore
- 🎨 **Modern Design** - Glassmorphism effects, gradients, and animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project (same as dashboard)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd frontend
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
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📂 Project Structure

```
src/app/
├── Components/         # Reusable UI components
│   ├── AllBlogs.jsx   # Fetches and renders all blogs
│   ├── BlogCard.jsx   # Individual blog card with snap scroll
│   ├── DynamicBlog.jsx # Blog detail page with comments
│   └── Navbar.jsx     # Navigation bar
├── lib/               # Utilities and Firebase config
│   └── firebase.js
├── Blog/[id]/         # Dynamic blog detail route
├── PoliticalBlogs/    # Politics category
├── TechBlogs/         # Technology category
├── SportsBlogs/       # Sports category
├── TravelBlogs/       # Travel category
├── BuisnessBlogs/     # Business category
├── LifestyleBlogs/    # Lifestyle category
└── HealthBlogs/       # Health category
```

## 🎨 UI Components

### BlogCard
- Full-screen snap scroll sections
- Responsive image with gradient overlay
- Author avatar and metadata
- Share functionality

### DynamicBlog (Detail Page)
- Hero image with title overlay
- Author signature card
- Simplified commenting (Title + Message only)
- "Read Next" recommendations

### Navbar
- Responsive navigation
- Search functionality
- Category links
- Profile access

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, DaisyUI v5
- **Backend**: Firebase Firestore
- **Analytics**: Firebase Analytics
- **Fonts**: Inter (Google Fonts)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
