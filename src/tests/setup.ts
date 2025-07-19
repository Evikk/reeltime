import { vi, beforeEach } from "vitest";
import { config } from "@vue/test-utils";

// Global test configuration
config.global = {
  ...config.global,
  stubs: {
    // Stub router-link to avoid router warnings in tests
    RouterLink: {
      template: '<a :href="to"><slot /></a>',
      props: ["to"],
    },
  },
};

// Mock IntersectionObserver for components that might use it
Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
    takeRecords: vi.fn().mockReturnValue([]),
    root: null,
    rootMargin: "",
    thresholds: [],
  })),
});

// Mock ResizeObserver for components that might use it
Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  })),
});

// Mock matchMedia for responsive components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo for navigation components
Object.defineProperty(global, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

// Mock fetch for API calls
Object.defineProperty(global, "fetch", {
  writable: true,
  value: vi.fn(),
});

// Setup default fetch mock implementation
beforeEach(() => {
  vi.mocked(fetch).mockClear();
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  } as Response);
});
