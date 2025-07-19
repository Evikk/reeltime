# 🎬 ReelTime

A modern, responsive movie discovery application built with Vue 3 and TypeScript. Explore movies from The Movie Database (TMDb) with advanced filtering, detailed information, and a beautiful user interface.

Demo Link: https://reeltime-sigma.vercel.app

## ✨ Features

### 🎭 Movie Discovery

- **Browse by Categories**: Popular, Top Rated, Now Playing, Upcoming, and Trending movies
- **Advanced Search**: Find movies by title with real-time results
- **Smart Filtering**: Filter by genre, release year, and rating range
- **Infinite Scrolling**: Seamless browsing experience with pagination

### 🎯 Movie Details

- **Comprehensive Information**: Plot, runtime, budget, revenue, and more
- **Cast & Crew**: Complete filmography with character details
- **High-Quality Images**: Posters, backdrops, and profile photos
- **Release Information**: Dates, countries, and production companies

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Error Handling**: Graceful error states with retry functionality
- **Loading States**: Elegant loading indicators for better UX

## 🚀 Tech Stack

### Frontend Framework

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vue Router** for navigation
- **Pinia** for state management

### Styling & UI

- **Tailwind CSS** for utility-first styling
- **Custom Design System** with consistent colors and typography
- **Lucide Vue** icons for modern iconography
- **VueUse** for composition utilities

### Development Tools

- **Vite** for fast development and building
- **Vitest** for unit testing
- **ESLint** for code linting
- **TypeScript** compiler for type checking

### API Integration

- **The Movie Database (TMDb) API** for movie data
- **Custom service layer** with error handling
- **Type-safe API responses** with TypeScript interfaces

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **TMDb API Key** - [Get one here](https://www.themoviedb.org/settings/api)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Evikk/reeltime
   cd reeltime
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader/      # Header with navigation and theme toggle
│   ├── MovieDetails/   # Movie detail page components
│   ├── MovieGrid/      # Movie listing and grid components
│   ├── MoviesFilters/  # Search and filter components
│   └── icons/          # Icon components
├── router/             # Vue Router configuration
├── services/           # API service layer
│   └── tmdb.ts        # TMDb API service
├── stores/             # Pinia state management
│   ├── movies.ts      # Movies data and filtering
│   ├── movieDetails.ts # Individual movie details
│   └── theme.ts       # Theme management
├── types/              # TypeScript type definitions
│   └── movie.ts       # Movie-related interfaces
├── views/              # Page components
│   ├── HomeView.vue   # Main movie browsing page
│   └── MovieDetailsView.vue # Movie details page
├── assets/             # Static assets and styles
└── tests/              # Test files and utilities
```

## 🧪 Testing

The project includes comprehensive testing setup with:

- **Vitest** for unit testing
- **Vue Test Utils** for component testing
- **JSDOM** for browser environment simulation
- **Coverage reporting** with detailed metrics

### Running Tests

```bash
# Run all tests
npm run test

```

---

<div align="center">

**Built with ❤️ using Vue 3 and TypeScript**

</div>
