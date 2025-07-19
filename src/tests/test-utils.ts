import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import type { VueWrapper } from "@vue/test-utils";
import type { Movie, MovieDetails, Genre } from "@/types/movie";

/**
 * Creates a test router instance with basic routes
 */
export function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", component: { template: "<div>Home</div>" } },
      { path: "/movie/:id", component: { template: "<div>Movie Details</div>" }, props: true },
    ],
  });
}

/**
 * Creates a fresh Pinia instance for testing
 */
export function createTestPinia() {
  return createPinia();
}

/**
 * Mock movie data for testing
 */
export const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  original_title: "Test Movie",
  overview: "A test movie for unit testing",
  poster_path: "/test.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2023-01-01",
  genre_ids: [28, 12],
  adult: false,
  original_language: "en",
  popularity: 100.5,
  vote_count: 1000,
  vote_average: 8.5,
  video: false,
};

/**
 * Mock movie details data for testing
 */
export const mockMovieDetails: MovieDetails = {
  ...mockMovie,
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
  ],
  runtime: 120,
  budget: 100000000,
  revenue: 500000000,
  homepage: "https://testmovie.com",
  imdb_id: "tt1234567",
  production_companies: [
    {
      id: 1,
      logo_path: "/logo.png",
      name: "Test Studios",
      origin_country: "US",
    },
  ],
  production_countries: [
    {
      iso_3166_1: "US",
      name: "United States of America",
    },
  ],
  spoken_languages: [
    {
      english_name: "English",
      iso_639_1: "en",
      name: "English",
    },
  ],
  status: "Released",
  tagline: "The ultimate test",
  belongs_to_collection: null,
  credits: {
    cast: [
      {
        id: 1,
        name: "Test Actor",
        character: "Hero",
        credit_id: "credit1",
        order: 0,
        profile_path: "/actor.jpg",
        adult: false,
        gender: 2,
        known_for_department: "Acting",
        original_name: "Test Actor",
        popularity: 50.0,
      },
    ],
    crew: [
      {
        id: 2,
        name: "Test Director",
        job: "Director",
        department: "Directing",
        credit_id: "credit2",
        profile_path: "/director.jpg",
        adult: false,
        gender: 2,
        known_for_department: "Directing",
        original_name: "Test Director",
        popularity: 40.0,
      },
    ],
  },
};

/**
 * Mock genres for testing
 */
export const mockGenres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

/**
 * Creates multiple mock movies for testing lists
 */
export function createMockMovies(count: number): Movie[] {
  return Array.from({ length: count }, (_, index) => ({
    ...mockMovie,
    id: index + 1,
    title: `Test Movie ${index + 1}`,
    original_title: `Test Movie ${index + 1}`,
    overview: `Test movie ${index + 1} overview`,
    vote_average: 8.5 - index * 0.1,
    popularity: 100 - index * 5,
  }));
}

/**
 * Mock API response for movie lists
 */
export function createMockMovieResponse(movies: Movie[], page = 1, totalPages = 1) {
  return {
    page,
    results: movies,
    total_pages: totalPages,
    total_results: movies.length * totalPages,
  };
}

/**
 * Mock API response for genres
 */
export function createMockGenreResponse(genres: Genre[] = mockGenres) {
  return {
    genres,
  };
}

/**
 * Utility to wait for async operations in tests
 */
export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Utility to wait for Vue's next tick and promise resolution
 */
export async function waitForAsyncOperations(wrapper: VueWrapper) {
  await wrapper.vm.$nextTick();
  await flushPromises();
}
