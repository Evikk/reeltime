import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory, type Router } from "vue-router";
import { createPinia, type Pinia } from "pinia";
import HomeView from "../../views/HomeView.vue";
import { useMoviesStore } from "../../stores/movies";
import {
  createMockMovies,
  createMockMovieResponse,
  createMockGenreResponse,
  flushPromises,
} from "../test-utils";

// Mock the TMDB service
vi.mock("../../services/tmdb", () => ({
  default: {
    getGenres: vi.fn(),
    getPopularMovies: vi.fn(),
    searchMovies: vi.fn(),
    discoverMovies: vi.fn(),
    getTopRatedMovies: vi.fn(),
    getNowPlayingMovies: vi.fn(),
    getUpcomingMovies: vi.fn(),
    getTrendingMovies: vi.fn(),
    getMovieDetails: vi.fn(),
    getMovieCredits: vi.fn(),
    getPosterUrl: vi.fn((path: string | null, size?: string) =>
      path ? `https://image.tmdb.org/t/p/${size || "w500"}${path}` : null
    ),
    getBackdropUrl: vi.fn((path: string | null, size?: string) =>
      path ? `https://image.tmdb.org/t/p/${size || "w1280"}${path}` : null
    ),
    getProfileUrl: vi.fn((path: string | null, size?: string) =>
      path ? `https://image.tmdb.org/t/p/${size || "w185"}${path}` : null
    ),
    formatRuntime: vi.fn((minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`),
    formatCurrency: vi.fn((amount: number) => `$${amount.toLocaleString()}`),
    formatDate: vi.fn((date: string) => new Date(date).toLocaleDateString()),
    getYear: vi.fn((date: string) => new Date(date).getFullYear()),
  },
}));

describe("HomeView Integration Tests", () => {
  let router: Router;
  let pinia: Pinia;
  let mockTmdbService: typeof import("../../services/tmdb").default;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked service
    const tmdbModule = await import("../../services/tmdb");
    mockTmdbService = tmdbModule.default;

    // Create router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: HomeView },
        { path: "/movie/:id", component: { template: "<div>Movie Details</div>" } },
      ],
    });

    // Create fresh pinia instance
    pinia = createPinia();
  });

  it("renders the home page with all main components", async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [router, pinia],
      },
    });

    expect(wrapper.find(".page-container").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "AppHeader" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MoviesFilters" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MovieGrid" }).exists()).toBe(true);
  });

  it("initializes the movies store on mount", async () => {
    const mockMovies = createMockMovies(5);
    const mockGenres = [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
    ];

    // Mock successful API responses
    (mockTmdbService.getGenres as any).mockResolvedValue(createMockGenreResponse(mockGenres));
    (mockTmdbService.getPopularMovies as any).mockResolvedValue(
      createMockMovieResponse(mockMovies)
    );

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for async operations
    await wrapper.vm.$nextTick();
    await flushPromises();

    const moviesStore = useMoviesStore();

    expect(mockTmdbService.getGenres).toHaveBeenCalled();
    expect(mockTmdbService.getPopularMovies).toHaveBeenCalledWith(1);
    expect(moviesStore.movies).toEqual(mockMovies);
    expect(moviesStore.genres).toEqual(mockGenres);
  });

  it("handles API errors gracefully", async () => {
    // Mock API errors
    (mockTmdbService.getGenres as any).mockRejectedValue(new Error("Failed to fetch genres"));
    (mockTmdbService.getPopularMovies as any).mockRejectedValue(
      new Error("Failed to fetch movies")
    );

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for async operations
    await wrapper.vm.$nextTick();
    await flushPromises();

    const moviesStore = useMoviesStore();

    expect(moviesStore.error).toBeTruthy();
    expect(moviesStore.movies).toEqual([]);
  });

  it("supports navigation to movie details", async () => {
    const mockMovies = createMockMovies(2);
    const mockGenres = [{ id: 28, name: "Action" }];

    (mockTmdbService.getGenres as any).mockResolvedValue(createMockGenreResponse(mockGenres));
    (mockTmdbService.getPopularMovies as any).mockResolvedValue(
      createMockMovieResponse(mockMovies)
    );

    mount(HomeView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Navigate to movie details
    await router.push("/movie/1");
    expect(router.currentRoute.value.path).toBe("/movie/1");
    expect(router.currentRoute.value.params.id).toBe("1");
  });

  it("updates movie list when filters are applied", async () => {
    const mockMovies = createMockMovies(3);
    const filteredMovies = [mockMovies[0]];
    const mockGenres = [{ id: 28, name: "Action" }];

    (mockTmdbService.getGenres as any).mockResolvedValue(createMockGenreResponse(mockGenres));
    (mockTmdbService.getPopularMovies as any).mockResolvedValue(
      createMockMovieResponse(mockMovies)
    );
    (mockTmdbService.discoverMovies as any).mockResolvedValue(
      createMockMovieResponse(filteredMovies)
    );

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for initial load
    await wrapper.vm.$nextTick();
    await flushPromises();

    const moviesStore = useMoviesStore();

    // Apply genre filter
    moviesStore.updateFilters({ genre: "28" });
    await moviesStore.discoverMovies();

    expect(mockTmdbService.discoverMovies).toHaveBeenCalled();
    expect(moviesStore.movies).toEqual(filteredMovies);
  });

  it("supports movie search functionality", async () => {
    const mockMovies = createMockMovies(3);
    const searchResults = [mockMovies[1]];
    const mockGenres = [{ id: 28, name: "Action" }];

    (mockTmdbService.getGenres as any).mockResolvedValue(createMockGenreResponse(mockGenres));
    (mockTmdbService.getPopularMovies as any).mockResolvedValue(
      createMockMovieResponse(mockMovies)
    );
    (mockTmdbService.searchMovies as any).mockResolvedValue(createMockMovieResponse(searchResults));

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for initial load
    await wrapper.vm.$nextTick();
    await flushPromises();

    const moviesStore = useMoviesStore();

    // Perform search
    await moviesStore.searchMovies("Test Movie 2");

    expect(mockTmdbService.searchMovies).toHaveBeenCalledWith("Test Movie 2", 1);
    expect(moviesStore.isSearchMode).toBe(true);
    expect(moviesStore.searchResults).toEqual(searchResults);
    expect(moviesStore.currentMovies).toEqual(searchResults);
  });

  it("can clear search and return to normal mode", async () => {
    const mockMovies = createMockMovies(2);
    const mockGenres = [{ id: 28, name: "Action" }];

    (mockTmdbService.getGenres as any).mockResolvedValue(createMockGenreResponse(mockGenres));
    (mockTmdbService.getPopularMovies as any).mockResolvedValue(
      createMockMovieResponse(mockMovies)
    );
    (mockTmdbService.searchMovies as any).mockResolvedValue(
      createMockMovieResponse([mockMovies[0]])
    );

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router, pinia],
      },
    });

    await wrapper.vm.$nextTick();
    await flushPromises();

    const moviesStore = useMoviesStore();

    // Search first
    await moviesStore.searchMovies("test");
    expect(moviesStore.isSearchMode).toBe(true);

    // Clear search
    moviesStore.clearSearch();
    expect(moviesStore.isSearchMode).toBe(false);
    expect(moviesStore.searchQuery).toBe("");
    expect(moviesStore.currentMovies).toEqual(mockMovies);
  });
});
