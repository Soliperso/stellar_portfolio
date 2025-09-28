# ✨ Stellar Portfolio - Ahmed Chebli

A modern, interactive portfolio website built with React, Three.js, and TailwindCSS, featuring stunning 3D animations, smooth transitions, and a professional design.

![Portfolio Preview](https://via.placeholder.com/1200x600?text=Stellar+Portfolio+Preview)

## 🚀 Features

### ✨ Core Features
- **Interactive 3D Hero Section** - Stunning Three.js animations with floating geometric shapes
- **Dark/Light Mode** - Seamless theme switching with persistent user preference
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Responsive Design** - Mobile-first approach ensuring perfect display on all devices
- **Project Showcase** - Interactive project gallery with detailed modal views
- **Skills Visualization** - Animated progress bars and skill categorization
- **Contact Form** - Functional contact form with validation and status feedback

### 🎨 Design Features
- **Modern UI** - Clean, professional design with thoughtful spacing and typography
- **Custom Color Palette** - Carefully selected primary and accent colors
- **Typography** - Inter and Poppins fonts for excellent readability
- **Micro-interactions** - Subtle hover effects and loading animations
- **Accessible** - WCAG AA compliant with keyboard navigation support

### ⚡ Performance Features
- **Optimized Build** - Vite for lightning-fast development and builds
- **Lazy Loading** - Efficient loading of 3D components and images
- **SEO Optimized** - Complete meta tags, Open Graph, and structured data
- **Web Vitals** - Optimized for Core Web Vitals and Lighthouse scores

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Latest React with concurrent features
- **Vite** - Next-generation frontend tooling
- **JavaScript (ES2022+)** - Modern JavaScript features

### Styling & Animation
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Custom CSS** - Additional animations and utilities

### 3D Graphics
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber

### UI Components
- **Lucide React** - Beautiful, customizable icons
- **Custom Components** - Reusable, accessible components

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmedchebli/stellar-portfolio.git
   cd stellar-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5177` to view the portfolio

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 📁 Project Structure

```
stellar-portfolio/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── Footer.jsx     # Site footer
│   │   ├── Layout.jsx     # Main layout wrapper
│   │   └── Scene3D.jsx    # 3D scene component
│   ├── sections/          # Page sections
│   │   ├── Hero.jsx       # Hero section with 3D
│   │   ├── About.jsx      # About me section
│   │   ├── Projects.jsx   # Projects showcase
│   │   ├── Skills.jsx     # Skills visualization
│   │   └── Contact.jsx    # Contact form
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.jsx # Theme management
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── assets/           # Images and media
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # App entry point
│   └── index.css         # Global styles
├── tailwind.config.js    # TailwindCSS configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Customization

### Colors
Update the color palette in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    // ... your custom colors
    900: '#0c4a6e',
  },
}
```

### Content
1. **Personal Information** - Update name, bio, and contact details in respective components
2. **Projects** - Modify the projects array in `Projects.jsx`
3. **Skills** - Update skill categories and levels in `Skills.jsx`
4. **Social Links** - Change social media links in `Header.jsx` and `Footer.jsx`

### 3D Scene
Customize the 3D elements in `Scene3D.jsx`:
- Change geometric shapes
- Modify colors and materials
- Adjust animation speeds
- Add new 3D objects

## 📱 Responsive Design

The portfolio is built with a mobile-first approach and includes:
- **Mobile (320px+)** - Optimized for small screens
- **Tablet (768px+)** - Improved layout for medium screens
- **Desktop (1024px+)** - Full-featured experience
- **Large screens (1280px+)** - Enhanced spacing and typography

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

### Netlify
1. Connect your repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Configure custom domain if needed

### Manual Deployment
```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 👨‍💻 Author

**Ahmed Chebli**
- Website: [ahmedchebli.dev](https://ahmedchebli.dev)
- GitHub: [@ahmedchebli](https://github.com/ahmedchebli)
- LinkedIn: [ahmed-chebli](https://linkedin.com/in/ahmed-chebli)
- Email: ahmed@example.com

---

⭐ **Star this repository if you found it helpful!**
