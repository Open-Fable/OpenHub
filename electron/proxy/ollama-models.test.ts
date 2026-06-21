import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — declared before any SUT import so vi.mock hoisting works
// ---------------------------------------------------------------------------

vi.mock("express", () => {
  const app = {
    use: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    listen: vi.fn(),
    options: vi.fn(),
  };
  const fn = vi.fn(() => app);
  (fn as Record<string, unknown>).json = vi.fn();
  (fn as Record<string, unknown>).urlencoded = vi.fn();
  (fn as Record<string, unknown>).raw = vi.fn();
  return { default: fn };
});

vi.mock("../project-store.js", () => ({
  getActiveProject: vi.fn(() => null),
  getProjectById: vi.fn(() => null),
}));

vi.mock("../memory-store.js", () => ({
  buildMemoryBlock: vi.fn(() => ""),
  addFact: vi.fn(),
  getMemory: vi.fn(() => ({ facts: [], createdAt: "" })),
  parseFactsFromJson: vi.fn(() => []),
}));

vi.mock("../cache-metrics.js", () => ({
  getCacheMetrics: vi.fn(() => ({ hits: 0, misses: 0 })),
  recordCacheMetric: vi.fn(),
  resetCacheMetrics: vi.fn(),
}));

vi.mock("./vision.js", () => ({
  getVisionConfig: vi.fn(() => Promise.resolve({ visionProxyEnabled: false })),
  shouldBypassVisionProxy: vi.fn(() => true),
  describeImage: vi.fn(),
  formatDescriptionForDeepSeek: vi.fn(),
  checkOllamaHealth: vi.fn(() => Promise.resolve(false)),
}));

// Real isSafeOllamaUrl for faithful SSRF testing
import { isSafeOllamaUrl } from "../keychain.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const OLLAMA_TAGS_OK = (names: string[]) => ({
  ok: true,
  json: async () => ({
    models: names.map((n) => ({ name: n })),
  }),
});

const OLLAMA_TAGS_FAIL = () => ({
  ok: false,
  json: async () => ({}),
});

function makeKeys(overrides: Record<string, unknown> = {}) {
  return {
    anthropic: null as string | null,
    openai: null as string | null,
    openrouterKey: null as string | null,
    googleAiKey: null as string | null,
    githubToken: null as string | null,
    braveSearchKey: null as string | null,
    ollamaUrl: "http://127.0.0.1:11434",
    deepseek: null as string | null,
    customKeys: {} as Record<string, string>,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("fetchOllamaModels", () => {
  let fetchOllamaModels: typeof import("./index.js").fetchOllamaModels;
  let discoveredLocalModels: typeof import("./index.js").discoveredLocalModels;
  const fetchMock = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    const mod = await import("./index.js");
    fetchOllamaModels = mod.fetchOllamaModels;
    discoveredLocalModels = mod.discoveredLocalModels;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns installed models on success", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["llama3:latest", "qwen2.5:7b"]));

    const result = await fetchOllamaModels("http://127.0.0.1:11434");

    expect(result).toEqual([
      { id: "llama3:latest", object: "model" },
      { id: "qwen2.5:7b", object: "model" },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:11434/api/tags",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("returns empty array when Ollama is down", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await fetchOllamaModels("http://127.0.0.1:11434");

    expect(result).toEqual([]);
  });

  it("returns empty array on non-200 response", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_FAIL());

    const result = await fetchOllamaModels("http://127.0.0.1:11434");

    expect(result).toEqual([]);
  });

  it("returns empty array on timeout", async () => {
    const err = new Error("timeout");
    err.name = "TimeoutError";
    fetchMock.mockRejectedValue(err);

    const result = await fetchOllamaModels("http://127.0.0.1:11434");

    expect(result).toEqual([]);
  });

  it("caches results for subsequent calls within TTL", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["mistral:latest"]));

    const r1 = await fetchOllamaModels("http://127.0.0.1:11434");
    const r2 = await fetchOllamaModels("http://127.0.0.1:11434");

    expect(r1).toEqual(r2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to loopback for SSRF-unsafe URLs", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["test:latest"]));

    await fetchOllamaModels("http://169.254.169.254");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:11434/api/tags",
      expect.anything(),
    );
  });

  it("filters out invalid model ids", async () => {
    fetchMock.mockResolvedValue(
      OLLAMA_TAGS_OK([
        "valid-model:7b",
        "",
        "<script>alert(1)</script>",
        "a".repeat(201),
      ]),
    );

    const result = await fetchOllamaModels("http://127.0.0.1:11434");

    expect(result).toEqual([{ id: "valid-model:7b", object: "model" }]);
  });

  it("filters malformed payload (missing models field)", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const result = await fetchOllamaModels("http://127.0.0.1:11434");

    expect(result).toEqual([]);
  });

  it("excludes cloud catalog ids from discoveredLocalModels set", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["gpt-4o", "openbmb/minicpm-v4.6"]));

    await fetchOllamaModels("http://127.0.0.1:11434");

    expect(discoveredLocalModels.has("gpt-4o")).toBe(false);
    expect(discoveredLocalModels.has("openbmb/minicpm-v4.6")).toBe(true);
  });

  it("populates discoveredLocalModels for namespaced models", async () => {
    fetchMock.mockResolvedValue(
      OLLAMA_TAGS_OK(["openbmb/minicpm-v4.6", "hf.co/some/model:q4"]),
    );

    await fetchOllamaModels("http://127.0.0.1:11434");

    expect(discoveredLocalModels.has("openbmb/minicpm-v4.6")).toBe(true);
    expect(discoveredLocalModels.has("hf.co/some/model:q4")).toBe(true);
  });
});

describe("appendDynamicModels", () => {
  let appendDynamicModels: typeof import("./index.js").appendDynamicModels;
  const fetchMock = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    const mod = await import("./index.js");
    appendDynamicModels = mod.appendDynamicModels;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("injects Ollama models with source local", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["phi4:latest", "qwen2.5:1.5b"]));

    const base: Array<{ id: string; object: string; source: string }> = [];
    const catalogIds = new Set<string>();
    const keys = makeKeys();

    const result = await appendDynamicModels(base, catalogIds, keys);

    const localModels = result.filter((m) => m.source === "local");
    expect(localModels).toEqual([
      { id: "phi4:latest", object: "model", source: "local" },
      { id: "qwen2.5:1.5b", object: "model", source: "local" },
    ]);
    expect(base).toEqual([]);
  });

  it("does not inject Ollama models already in the catalog", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["existing:latest"]));

    const base: Array<{ id: string; object: string; source: string }> = [];
    const catalogIds = new Set(["existing:latest"]);
    const keys = makeKeys();

    const result = await appendDynamicModels(base, catalogIds, keys);

    expect(result.filter((m) => m.source === "local")).toEqual([]);
  });

  it("leaves other providers intact when Ollama is down", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

    const base = [{ id: "claude-3-7-sonnet-latest", object: "model", source: "direct" }];
    const catalogIds = new Set(["claude-3-7-sonnet-latest"]);
    const keys = makeKeys();

    const result = await appendDynamicModels(base, catalogIds, keys);

    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("direct");
  });

  it("includes OpenRouter models alongside Ollama when key present", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url.includes("/api/tags")) {
        return Promise.resolve(OLLAMA_TAGS_OK(["llama3:latest"]));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: [{ id: "deepseek/deepseek-r2" }],
        }),
      });
    });

    const base: Array<{ id: string; object: string; source: string }> = [];
    const catalogIds = new Set<string>();
    const keys = makeKeys({ openrouterKey: "sk-or-test" });

    const result = await appendDynamicModels(base, catalogIds, keys);

    const sources = new Set(result.map((m) => m.source));
    expect(sources.has("local")).toBe(true);
    expect(sources.has("openrouter")).toBe(true);
  });
});

describe("resolveRoute", () => {
  let resolveRoute: typeof import("./index.js").resolveRoute;
  let fetchOllamaModels: typeof import("./index.js").fetchOllamaModels;
  const fetchMock = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    const mod = await import("./index.js");
    resolveRoute = mod.resolveRoute;
    fetchOllamaModels = mod.fetchOllamaModels;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("routes namespaced local model to Ollama, not OpenRouter", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["openbmb/minicpm-v4.6"]));
    await fetchOllamaModels("http://127.0.0.1:11434");

    const route = resolveRoute(
      "openbmb/minicpm-v4.6",
      makeKeys({ openrouterKey: "sk-or-test" }),
    );

    expect(route.provider).toBe("ollama");
    expect(route.targetUrl).toContain("127.0.0.1:11434/v1/chat/completions");
  });

  it("routes namespaced local model without OpenRouter key (no throw)", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["openbmb/minicpm-v4.6"]));
    await fetchOllamaModels("http://127.0.0.1:11434");

    const route = resolveRoute("openbmb/minicpm-v4.6", makeKeys());

    expect(route.provider).toBe("ollama");
  });

  it("does not hijack a cloud model id even if discovered locally", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["gpt-4o"]));
    await fetchOllamaModels("http://127.0.0.1:11434");

    const route = resolveRoute("gpt-4o", makeKeys({ openai: "sk-test" }));

    expect(route.provider).toBe("openai");
    expect(route.targetUrl).toContain("api.openai.com");
  });

  it("throws for namespaced model when cache is cold (unchanged behavior)", () => {
    expect(() => resolveRoute("deepseek/deepseek-chat", makeKeys())).toThrow(
      /nécessite une clé OpenRouter/,
    );
  });

  it("routes plain local model to Ollama via default fallback", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["llama3:latest"]));
    await fetchOllamaModels("http://127.0.0.1:11434");

    const route = resolveRoute("llama3:latest", makeKeys());

    expect(route.provider).toBe("ollama");
  });

  it("falls back to loopback for SSRF-unsafe ollama URL", async () => {
    fetchMock.mockResolvedValue(OLLAMA_TAGS_OK(["openbmb/minicpm-v4.6"]));
    await fetchOllamaModels("http://127.0.0.1:11434");

    const route = resolveRoute(
      "openbmb/minicpm-v4.6",
      makeKeys({ ollamaUrl: "http://169.254.169.254" }),
    );

    expect(route.provider).toBe("ollama");
    expect(route.targetUrl).toContain("127.0.0.1:11434");
  });

  it("routes unknown non-slashed model to Ollama (default fallback)", () => {
    const route = resolveRoute("some-local-model", makeKeys());

    expect(route.provider).toBe("ollama");
  });
});
