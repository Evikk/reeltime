# 🎬 ReelTime

A modern, responsive movie discovery application built with Vue 3 and TypeScript. Explore movies from The Movie Database (TMDb) with advanced filtering, detailed information, and a beautiful user interface.

![ReelTime Demo](https://via.placeholder.com/800x400/1e293b/ffffff?text=ReelTime+Movie+Discovery)

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
   git clone <repository-url>
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

### Getting a TMDb API Key

1. Sign up for a free account at [TMDb](https://www.themoviedb.org/signup)
2. Go to your [API settings](https://www.themoviedb.org/settings/api)
3. Request an API key (choose "Developer" for personal use)
4. Copy your API key and add it to your `.env` file

## 📝 Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run preview      # Preview production build locally
```

### Building

```bash
npm run build        # Build for production
npm run build-only   # Build without type checking
npm run type-check   # Run TypeScript compiler
```

### Testing

```bash
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

### Code Quality

```bash
npm run lint         # Lint and fix code issues
```

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

## 🎛️ Configuration

### Environment Variables

| Variable            | Description       | Required |
| ------------------- | ----------------- | -------- |
| `VITE_TMDB_API_KEY` | Your TMDb API key | Yes      |

### Tailwind Configuration

The application uses a custom Tailwind configuration with:

- Dark mode support (`class` strategy)
- Custom color palette with dark theme colors
- Poppins and Inter font families
- Responsive breakpoints

### TypeScript Configuration

Multiple TypeScript configurations for different environments:

- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application code
- `tsconfig.node.json` - Node.js environment
- `tsconfig.vitest.json` - Testing environment

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

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

## 🎨 Theming

ReelTime supports both light and dark themes with:

- **System preference detection** on first visit
- **Persistent theme selection** stored in localStorage
- **Smooth transitions** between themes
- **Consistent color palette** across all components

### Theme Colors

The application uses a carefully crafted color system:

- **Primary colors**: Blue tones for accents and interactive elements
- **Dark mode palette**: Custom dark grays for better readability
- **Semantic colors**: Success, warning, and error states

## 🔧 API Integration

### TMDb Service

The `TMDbService` class provides a clean interface to The Movie Database API:

```typescript
// Get popular movies
const movies = await tmdbService.getPopularMovies(1);

// Search movies
const searchResults = await tmdbService.searchMovies("Inception");

// Get movie details
const movieDetails = await tmdbService.getMovieDetails(123);

// Discover movies with filters
const filteredMovies = await tmdbService.discoverMovies({
  genre: "28", // Action
  year: 2023,
  sort_by: "vote_average.desc",
});
```

### Error Handling

- **Network errors**: Graceful handling with retry mechanisms
- **API errors**: Proper error messages from TMDb responses
- **Loading states**: Consistent loading indicators across the app
- **Fallback data**: Default values for missing or invalid data

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deployment Options

The application can be deployed to:

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting for public repositories
- **AWS S3**: Static website hosting
- **Any static file server**

### Environment Variables in Production

Make sure to set your `VITE_TMDB_API_KEY` in your deployment platform's environment settings.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Write tests for new components and features
- Follow the existing code style and conventions
- Update documentation for significant changes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **The Movie Database (TMDb)** for providing the movie data API
- **Vue.js team** for the amazing framework
- **Tailwind CSS** for the utility-first styling approach
- **Lucide** for the beautiful icon set

## 📞 Support

If you have any questions or issues, please:

1. Check the [documentation](#) above
2. Search existing [GitHub issues](https://github.com/your-username/reeltime/issues)
3. Create a new issue if needed

---

<div align="center">

**Built with ❤️ using Vue 3 and TypeScript**

[Live Demo](https://your-demo-url.com) • [Documentation](https://your-docs-url.com) • [Report Bug](https://github.com/your-username/reeltime/issues)

</div>
