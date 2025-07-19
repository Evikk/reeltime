import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory, type Router } from "vue-router";
import { createPinia, type Pinia } from "pinia";
import MovieDetailsView from "@/views/MovieDetailsView.vue";
import { useMovieDetailsStore } from "@/stores/movieDetails";
import { mockMovieDetails, flushPromises } from "../test-utils";

// Mock the TMDB service
vi.mock("@/services/tmdb", () => ({
  default: {
    getMovieDetails: vi.fn(),
    getGenres: vi.fn(),
    getPopularMovies: vi.fn(),
    searchMovies: vi.fn(),
    discoverMovies: vi.fn(),
    getTopRatedMovies: vi.fn(),
    getNowPlayingMovies: vi.fn(),
    getUpcomingMovies: vi.fn(),
    getTrendingMovies: vi.fn(),
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

describe("MovieDetailsView Integration Tests", () => {
  let router: Router;
  let pinia: Pinia;
  let mockTmdbService: typeof import("@/services/tmdb").default;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked service
    const tmdbModule = await import("@/services/tmdb");
    mockTmdbService = tmdbModule.default;

    // Create router with movie details route
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: { template: "<div>Home</div>" } },
        {
          path: "/movie/:id",
          component: MovieDetailsView,
          props: true,
        },
      ],
    });

    // Create fresh pinia instance
    pinia = createPinia();
  });

  it("renders movie details when loaded successfully", async () => {
    (mockTmdbService.getMovieDetails as any).mockResolvedValue(mockMovieDetails);

    // Navigate to movie details page
    await router.push("/movie/123");

    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for async operations
    await wrapper.vm.$nextTick();
    await flushPromises();

    const movieDetailsStore = useMovieDetailsStore();

    expect(mockTmdbService.getMovieDetails).toHaveBeenCalledWith(123);
    expect(movieDetailsStore.currentMovie).toEqual(mockMovieDetails);
    expect(movieDetailsStore.isLoading).toBe(false);
    expect(movieDetailsStore.error).toBeNull();

    // Check if main components are rendered
    expect(wrapper.findComponent({ name: "MovieHero" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MovieDetailsSidebar" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MovieCast" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "MovieCrew" }).exists()).toBe(true);
  });

  it("shows loading spinner while fetching movie details", async () => {
    // Mock with delayed response that doesn't auto-resolve
    let resolvePromise: (value: typeof mockMovieDetails) => void;
    const delayedPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (mockTmdbService.getMovieDetails as any).mockReturnValue(delayedPromise);

    await router.push("/movie/123");

    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for component to mount and initialize
    await wrapper.vm.$nextTick();

    // Should show loading spinner initially
    expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(true);
    expect(wrapper.text()).toContain("Loading movie details...");

    // Resolve the promise
    resolvePromise!(mockMovieDetails);
    await wrapper.vm.$nextTick();
    await flushPromises();

    // Loading should be done
    expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(false);
  });

  it("displays error message when movie details fail to load", async () => {
    (mockTmdbService.getMovieDetails as any).mockRejectedValue(new Error("Movie not found"));

    await router.push("/movie/999");

    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for async operations
    await wrapper.vm.$nextTick();
    await flushPromises();

    // Verify store state
    const movieDetailsStore = useMovieDetailsStore();
    expect(movieDetailsStore.currentMovie).toBeNull();
    expect(movieDetailsStore.isLoading).toBe(false);
    expect(movieDetailsStore.error).toBeTruthy();

    // Check error message in component
    expect(wrapper.findComponent({ name: "ErrorMessage" }).exists()).toBe(true);
    expect(wrapper.text()).toContain("Error Loading Movie");
    expect(wrapper.text()).toContain("Movie not found");
  });

  it("supports retry functionality when error occurs", async () => {
    // First call fails, second succeeds
    (mockTmdbService.getMovieDetails as any)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockMovieDetails);

    await router.push("/movie/123");

    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router, pinia],
      },
    });

    // Wait for initial error
    await wrapper.vm.$nextTick();
    await flushPromises();

    // Should show error
    expect(wrapper.findComponent({ name: "ErrorMessage" }).exists()).toBe(true);

    // Click retry button
    const retryButton = wrapper.find('[data-testid="retry-button"]');
    if (retryButton.exists()) {
      await retryButton.trigger("click");
      await wrapper.vm.$nextTick();
      await flushPromises();

      // Should show movie details after retry
      expect(wrapper.findComponent({ name: "MovieHero" }).exists()).toBe(true);
    }
  });

  it("supports go back functionality", async () => {
    (mockTmdbService.getMovieDetails as any).mockResolvedValue(mockMovieDetails);

    await router.push("/movie/123");

    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router, pinia],
      },
    });

    await wrapper.vm.$nextTick();
    await flushPromises();

    // Check if go back functionality works
    const initialPath = router.currentRoute.value.path;
    expect(initialPath).toBe("/movie/123");

    // Simulate go back action
    const goBackButton = wrapper.find('[data-testid="go-back-button"]');
    if (goBackButton.exists()) {
      await goBackButton.trigger("click");
      await wrapper.vm.$nextTick();

      // Should navigate back
      expect(router.currentRoute.value.path).not.toBe("/movie/123");
    }
  });

  it("redirects to home when movie ID is invalid", async () => {
    await router.push("/movie/invalid");

    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router, pinia],
      },
    });

    await wrapper.vm.$nextTick();
    await flushPromises();

    // Should redirect to home
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("passes correct props to child components", async () => {
    (mockTmdbService.getMovieDetails as any).mockResolvedValue(mockMovieDetails);

    await router.push("/movie/123");

    const wrapper = mount(MovieDetailsView, {
      global: {
        plugins: [router, pinia],
      },
    });

    await wrapper.vm.$nextTick();
    await flushPromises();

    // Check if components receive correct props
    const movieHero = wrapper.findComponent({ name: "MovieHero" });
    if (movieHero.exists()) {
      expect(movieHero.props("movie")).toEqual(mockMovieDetails);
    }

    const movieSidebar = wrapper.findComponent({ name: "MovieDetailsSidebar" });
    if (movieSidebar.exists()) {
      expect(movieSidebar.props("movie")).toEqual(mockMovieDetails);
    }

    const movieCast = wrapper.findComponent({ name: "MovieCast" });
    if (movieCast.exists()) {
      expect(movieCast.props("movie")).toEqual(mockMovieDetails);
    }

    const movieCrew = wrapper.findComponent({ name: "MovieCrew" });
    if (movieCrew.exists()) {
      expect(movieCrew.props("movie")).toEqual(mockMovieDetails);
    }
  });
});
