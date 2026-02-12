import * as echarts from "echarts/core";
import type { EChartsCoreOption, EChartsType } from "echarts/core";
import { EXAMPLE_ASSET_MAP } from "@/generated/asset-map";
import type { ExampleCatalogEntry } from "@/types/examples";

type EvaluationSuccess = {
  option: EChartsCoreOption;
  warnings: string[];
};

export type EvaluatorSize = {
  width: number;
  height: number;
};

export type EvaluationOptions = {
  size?: Partial<EvaluatorSize>;
};

export type RuntimeExecutionOptions = {
  chart: EChartsType;
  container: HTMLElement;
  size?: Partial<EvaluatorSize>;
  onSetOption?: (option: unknown, opts?: boolean | { notMerge?: boolean }) => void;
  signal?: AbortSignal;
};

export type RuntimeExecutionResult = {
  warnings: string[];
  dispose: () => void;
};

type PendingTask = Promise<void>;

const REMOTE_ROOT = "https://echarts.apache.org/examples";
const EMOJI_FLAGS_URL = "https://echarts.apache.org/en/js/vendors/emoji-flags@1.3.0/data.json";
const EMOJI_FLAGS_FALLBACK = [
  { name: "Australia", emoji: "🇦🇺" },
  { name: "Canada", emoji: "🇨🇦" },
  { name: "China", emoji: "🇨🇳" },
  { name: "Cuba", emoji: "🇨🇺" },
  { name: "Finland", emoji: "🇫🇮" },
  { name: "France", emoji: "🇫🇷" },
  { name: "Germany", emoji: "🇩🇪" },
  { name: "Iceland", emoji: "🇮🇸" },
  { name: "India", emoji: "🇮🇳" },
  { name: "Japan", emoji: "🇯🇵" },
  { name: "North Korea", emoji: "🇰🇵" },
  { name: "South Korea", emoji: "🇰🇷" },
  { name: "New Zealand", emoji: "🇳🇿" },
  { name: "Norway", emoji: "🇳🇴" },
  { name: "Poland", emoji: "🇵🇱" },
  { name: "Russia", emoji: "🇷🇺" },
  { name: "Turkey", emoji: "🇹🇷" },
  { name: "United Kingdom", emoji: "🇬🇧" },
  { name: "United States", emoji: "🇺🇸" },
] as const;

function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof window !== "undefined" && typeof window.fetch === "function") {
    return window.fetch(input, init);
  }
  const fetchFn = globalThis.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error("fetch is not available in this runtime");
  }
  return fetchFn(input, init);
}

function toAbsoluteAssetUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/data/asset/")) {
    return `${REMOTE_ROOT}${url}`;
  }

  return url;
}

function resolveLocalAssetUrl(url: string): string | null {
  const absolute = toAbsoluteAssetUrl(url);
  if (EXAMPLE_ASSET_MAP[absolute]) {
    return EXAMPLE_ASSET_MAP[absolute];
  }
  return null;
}

async function loadAsset(url: string): Promise<unknown> {
  const absoluteUrl = toAbsoluteAssetUrl(url);
  const localUrl = resolveLocalAssetUrl(absoluteUrl);
  if (!localUrl) {
    if (absoluteUrl === EMOJI_FLAGS_URL) {
      return EMOJI_FLAGS_FALLBACK;
    }
    throw new Error(`No local asset mapping for ${url}`);
  }

  const response = await safeFetch(encodeURI(localUrl));
  if (!response.ok) {
    throw new Error(`Asset request failed for ${url}: HTTP ${response.status}`);
  }

  if (localUrl.endsWith(".json") || localUrl.endsWith(".geojson")) {
    return response.json();
  }

  if (localUrl.endsWith(".bin")) {
    return response.arrayBuffer();
  }

  return response.text();
}

type DeferredLike<T = unknown> = Promise<T> & {
  done: (callback: (...args: unknown[]) => void) => DeferredLike<T>;
  fail: (callback: (error: unknown) => void) => DeferredLike<T>;
  always: (callback: () => void) => DeferredLike<T>;
  promise: () => Promise<T>;
};

let ecStatCache: unknown | undefined;
let d3BundleCache: Record<string, unknown> | undefined;
let ecSimpleTransformCache: Record<string, unknown> | undefined;

function normalizeEvaluatorSize(size?: Partial<EvaluatorSize>): EvaluatorSize {
  const width = Number.isFinite(size?.width) ? Math.max(320, Math.round(Number(size?.width))) : 1200;
  const height = Number.isFinite(size?.height) ? Math.max(240, Math.round(Number(size?.height))) : 680;
  return { width, height };
}

async function ensureEcStat(): Promise<unknown> {
  if (ecStatCache !== undefined) {
    return ecStatCache;
  }

  const mod = await import("echarts-stat");
  const value = (mod as { default?: unknown }).default ?? mod;
  ecStatCache = value;

  if (typeof window !== "undefined") {
    (window as unknown as { ecStat?: unknown }).ecStat = value;
  }

  return value;
}

async function ensureD3Bundle(): Promise<Record<string, unknown>> {
  if (d3BundleCache) {
    return d3BundleCache;
  }

  const [d3ArrayModule, d3GeoModule] = await Promise.all([import("d3-array"), import("d3-geo")]);
  const bundle = {
    ...(d3ArrayModule as Record<string, unknown>),
    ...(d3GeoModule as Record<string, unknown>),
  };
  d3BundleCache = bundle;

  if (typeof window !== "undefined") {
    (window as unknown as { d3?: Record<string, unknown> }).d3 = bundle;
  }

  return bundle;
}

async function ensureEcSimpleTransform(): Promise<Record<string, unknown>> {
  if (ecSimpleTransformCache) {
    return ecSimpleTransformCache;
  }

  const module = await import("echarts-simple-transform");
  const moduleRecord = module as Record<string, unknown>;
  const candidate =
    (moduleRecord.ecSimpleTransform as Record<string, unknown> | undefined) ??
    (moduleRecord.default as Record<string, unknown> | undefined) ??
    moduleRecord;

  if (!candidate || typeof candidate !== "object") {
    throw new Error("Failed to load echarts-simple-transform module.");
  }

  ecSimpleTransformCache = candidate;

  if (typeof window !== "undefined") {
    (window as unknown as { ecSimpleTransform?: Record<string, unknown> }).ecSimpleTransform = candidate;
  }

  return candidate;
}

function createDeferred<T>(promise: Promise<T>, spreadDoneArgs = false): DeferredLike<T> {
  const deferred = promise as DeferredLike<T>;

  deferred.done = (callback) => {
    promise.then((value) => {
      if (spreadDoneArgs && Array.isArray(value)) {
        callback(...value);
        return;
      }
      callback(value);
    });
    return deferred;
  };

  deferred.fail = (callback) => {
    promise.catch((error) => callback(error));
    return deferred;
  };

  deferred.always = (callback) => {
    promise.finally(() => callback());
    return deferred;
  };

  deferred.promise = () => promise;
  return deferred;
}

function trackTask<T>(tasks: PendingTask[], promise: Promise<T>): Promise<T> {
  tasks.push(promise.then(() => undefined));
  return promise;
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  const value = String(error ?? "");
  return value.trim().length > 0 ? value : fallback;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }
  if (isPlainObject(value)) {
    const cloned: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      cloned[key] = cloneValue(item);
    }
    return cloned as T;
  }
  return value;
}

function mergeOptionValue(base: unknown, patch: unknown): unknown {
  if (Array.isArray(base) && Array.isArray(patch)) {
    const merged: unknown[] = [];
    const maxLength = Math.max(base.length, patch.length);
    for (let index = 0; index < maxLength; index += 1) {
      if (index in patch) {
        merged[index] = mergeOptionValue(base[index], patch[index]);
      } else {
        merged[index] = cloneValue(base[index]);
      }
    }
    return merged;
  }

  if (isPlainObject(base) && isPlainObject(patch)) {
    const merged: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(base)) {
      merged[key] = cloneValue(value);
    }
    for (const [key, value] of Object.entries(patch)) {
      merged[key] = key in merged ? mergeOptionValue(merged[key], value) : cloneValue(value);
    }
    return merged;
  }

  return cloneValue(patch);
}

function createMockChart(setOptionRef: { current: unknown | null }, size: EvaluatorSize) {
  let currentOption: unknown | null = null;

  return {
    setOption(option: unknown, opts?: boolean | { notMerge?: boolean }) {
      const notMerge = typeof opts === "boolean" ? opts : Boolean(opts?.notMerge);

      if (notMerge || currentOption === null) {
        currentOption = cloneValue(option);
      } else {
        currentOption = mergeOptionValue(currentOption, option);
      }

      setOptionRef.current = currentOption;
    },
    showLoading() {},
    hideLoading() {},
    dispose() {},
    resize() {},
    clear() {},
    appendData() {},
    on() {},
    off() {},
    dispatchAction() {},
    containPixel() {
      return true;
    },
    getWidth() {
      return size.width;
    },
    getHeight() {
      return size.height;
    },
    getDom() {
      return {};
    },
    getOption() {
      return currentOption;
    },
    convertFromPixel() {
      return [0, 0];
    },
    convertToPixel() {
      return [0, 0];
    },
    getZr() {
      return {
        on() {},
        off() {},
        configLayer() {},
        storage: {},
        painter: {},
      };
    },
  };
}

function createDocumentShim(): {
  getElementById: () => unknown;
  createElement: (tag: string) => unknown;
  querySelector: (selector: string) => Element | null;
  body: unknown;
} {
  const realDocument = typeof document !== "undefined" ? document : null;

  return {
    getElementById() {
      return {};
    },
    createElement(tag: string) {
      if (realDocument) {
        return realDocument.createElement(tag);
      }
      return {
        style: {},
        getContext() {
          return null;
        },
      };
    },
    querySelector(selector: string) {
      return realDocument ? realDocument.querySelector(selector) : null;
    },
    body:
      realDocument?.body ??
      ({
        appendChild() {},
        removeChild() {},
      } as const),
  };
}

type TrackedDomListener = {
  target: Window | Document;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
};

function removeTrackedListener(
  trackedListeners: TrackedDomListener[],
  target: Window | Document,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions,
) {
  const index = trackedListeners.findIndex(
    (tracked) =>
      tracked.target === target &&
      tracked.type === type &&
      tracked.listener === listener &&
      tracked.options === options,
  );

  if (index >= 0) {
    trackedListeners.splice(index, 1);
  }
}

function createRuntimeDocumentShim(
  container: HTMLElement,
  trackedListeners: TrackedDomListener[],
): Record<string, unknown> {
  const realDocument = typeof document !== "undefined" ? document : null;
  if (!realDocument) {
    return createDocumentShim() as unknown as Record<string, unknown>;
  }

  const overrides: Record<string, unknown> = {
    getElementById(id: string) {
      if (id === "main") {
        return container;
      }
      return realDocument.getElementById(id);
    },
    querySelector(selector: string) {
      if (selector === "#main") {
        return container;
      }
      return realDocument.querySelector(selector);
    },
    createElement(tag: string) {
      return realDocument.createElement(tag);
    },
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) {
      realDocument.addEventListener(type, listener, options);
      trackedListeners.push({
        target: realDocument,
        type,
        listener,
        options,
      });
    },
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ) {
      realDocument.removeEventListener(type, listener, options);
      removeTrackedListener(trackedListeners, realDocument, type, listener, options);
    },
    body: realDocument.body,
  };

  return new Proxy(overrides, {
    get(target, prop) {
      const key = String(prop);
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        return target[key];
      }

      const value = (realDocument as unknown as Record<string, unknown>)[key];
      if (typeof value === "function") {
        return (value as (...args: unknown[]) => unknown).bind(realDocument);
      }
      return value;
    },
    set(target, prop, value) {
      target[String(prop)] = value;
      return true;
    },
  });
}

function createRuntimeWindowShim(
  size: EvaluatorSize,
  trackedListeners: TrackedDomListener[],
  timeoutIds: Set<ReturnType<typeof setTimeout>>,
  intervalIds: Set<ReturnType<typeof setInterval>>,
  animationFrameIds: Set<number>,
): Record<string, unknown> {
  const realWindow = typeof window !== "undefined" ? window : undefined;
  if (!realWindow) {
    return {
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      innerWidth: Math.max(size.width, 360),
      innerHeight: Math.max(size.height, 320),
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      requestAnimationFrame:
        typeof requestAnimationFrame === "function"
          ? requestAnimationFrame
          : ((callback: FrameRequestCallback) => setTimeout(() => callback(performance.now()), 16)),
      cancelAnimationFrame:
        typeof cancelAnimationFrame === "function"
          ? cancelAnimationFrame
          : ((handle: number) => clearTimeout(handle)),
    };
  }

  const localValues: Record<string, unknown> = {};

  const runtimeSetTimeout = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const handle = realWindow.setTimeout(handler, timeout, ...args);
    timeoutIds.add(handle);
    return handle;
  };
  const runtimeClearTimeout = (handle?: ReturnType<typeof setTimeout>) => {
    if (handle !== undefined) {
      timeoutIds.delete(handle);
      realWindow.clearTimeout(handle);
    }
  };
  const runtimeSetInterval = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const handle = realWindow.setInterval(handler, timeout, ...args);
    intervalIds.add(handle);
    return handle;
  };
  const runtimeClearInterval = (handle?: ReturnType<typeof setInterval>) => {
    if (handle !== undefined) {
      intervalIds.delete(handle);
      realWindow.clearInterval(handle);
    }
  };
  const runtimeRequestAnimationFrame = (callback: FrameRequestCallback) => {
    const handle = realWindow.requestAnimationFrame(callback);
    animationFrameIds.add(handle);
    return handle;
  };
  const runtimeCancelAnimationFrame = (handle: number) => {
    animationFrameIds.delete(handle);
    realWindow.cancelAnimationFrame(handle);
  };

  const overrides: Record<string, unknown> = {
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) {
      realWindow.addEventListener(type, listener, options);
      trackedListeners.push({
        target: realWindow,
        type,
        listener,
        options,
      });
    },
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ) {
      realWindow.removeEventListener(type, listener, options);
      removeTrackedListener(trackedListeners, realWindow, type, listener, options);
    },
    innerWidth: Math.max(size.width, 360),
    innerHeight: Math.max(size.height, 320),
    setTimeout: runtimeSetTimeout,
    clearTimeout: runtimeClearTimeout,
    setInterval: runtimeSetInterval,
    clearInterval: runtimeClearInterval,
    requestAnimationFrame: runtimeRequestAnimationFrame,
    cancelAnimationFrame: runtimeCancelAnimationFrame,
  };

  return new Proxy(localValues, {
    get(target, prop) {
      const key = String(prop);
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        return overrides[key];
      }
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        return target[key];
      }

      const value = (realWindow as unknown as Record<string, unknown>)[key];
      if (typeof value === "function") {
        return (value as (...args: unknown[]) => unknown).bind(realWindow);
      }
      return value;
    },
    set(target, prop, value) {
      target[String(prop)] = value;
      return true;
    },
  });
}

function createJQueryShim(
  tasks: PendingTask[],
  warnings: string[],
  runScript: (url: string) => Promise<void>,
) {
  const queue = (url: string, callback?: (data: unknown) => void): DeferredLike<unknown[]> => {
    const task = trackTask(
      tasks,
      loadAsset(url)
        .then((data) => {
          callback?.(data);
          return [data, "success", null] as unknown[];
        })
        .catch((error: unknown) => {
          const message = toErrorMessage(error, "Unknown asset load error");
          warnings.push(message);
          throw error;
        }),
    );

    return createDeferred(task, true);
  };

  const getScript = (url: string, callback?: () => void): DeferredLike<unknown[]> => {
    const task = trackTask(
      tasks,
      runScript(url)
        .then(() => {
          callback?.();
          return [void 0, "success", null] as unknown[];
        })
        .catch((error: unknown) => {
          const message = toErrorMessage(error, "Unknown script load error");
          warnings.push(message);
          throw error;
        }),
    );

    return createDeferred(task, true);
  };

  const when = (...values: unknown[]): DeferredLike<unknown[]> => {
    const merged = trackTask(
      tasks,
      Promise.all(
        values.map((value) => {
          if (value && typeof value === "object" && typeof (value as { then?: unknown }).then === "function") {
            return value as Promise<unknown>;
          }
          return Promise.resolve(value);
        }),
      ),
    );
    return createDeferred(merged, true);
  };

  return {
    get(url: string, callback?: (data: unknown) => void) {
      return queue(url, callback);
    },
    getJSON(url: string, callback?: (data: unknown) => void) {
      return queue(url, callback);
    },
    getScript(url: string, callback?: () => void) {
      return getScript(url, callback);
    },
    when(...values: unknown[]) {
      return when(...values);
    },
  };
}

function createXMLHttpRequestShim(tasks: PendingTask[], warnings: string[]) {
  type Listener = ((event?: unknown) => void) | null;

  return class MockXMLHttpRequest {
    responseType = "";
    response: unknown = null;
    status = 0;
    onload: Listener = null;
    onerror: Listener = null;
    private requestUrl = "";

    open(_method: string, url: string) {
      this.requestUrl = url;
    }

    send() {
      const task = (async () => {
        const mapped =
          resolveLocalAssetUrl(this.requestUrl) ??
          resolveLocalAssetUrl(toAbsoluteAssetUrl(this.requestUrl)) ??
          toAbsoluteAssetUrl(this.requestUrl);
        const response = await safeFetch(encodeURI(mapped));
        if (!response.ok) {
          throw new Error(`XHR request failed for ${this.requestUrl}: HTTP ${response.status}`);
        }

        this.status = response.status;
        if (this.responseType === "arraybuffer") {
          this.response = await response.arrayBuffer();
        } else {
          this.response = await response.text();
        }

        this.onload?.call(this, {});
      })().catch((error: unknown) => {
        const message = toErrorMessage(error, "Unknown XHR error");
        warnings.push(message);
        this.onerror?.call(this, {});
        throw error;
      });

      trackTask(tasks, task);
    }
  };
}

export async function evaluateExampleOption(
  entry: ExampleCatalogEntry,
  options: EvaluationOptions = {},
): Promise<EvaluationSuccess> {
  const warnings: string[] = [];
  const pendingTasks: PendingTask[] = [];
  const setOptionRef: { current: unknown | null } = { current: null };
  const size = normalizeEvaluatorSize(options.size);
  const mockChart = createMockChart(setOptionRef, size);
  const globalObject = globalThis as Record<string, unknown>;
  const hadD3 = Object.prototype.hasOwnProperty.call(globalObject, "d3");
  const previousD3 = globalObject.d3;
  const hadEcSimpleTransform = Object.prototype.hasOwnProperty.call(globalObject, "ecSimpleTransform");
  const previousEcSimpleTransform = globalObject.ecSimpleTransform;

  try {
  let scriptResponse: Response;
  try {
    scriptResponse = await safeFetch(encodeURI(entry.scriptPath));
  } catch (error) {
    const message = toErrorMessage(error, "Unknown script request failure");
    throw new Error(`Failed to request script for ${entry.id}: ${message}`);
  }
  if (!scriptResponse.ok) {
    throw new Error(`Script missing for ${entry.id}: HTTP ${scriptResponse.status}`);
  }

  const scriptSource = await scriptResponse.text();
  const echartsProxy = Object.assign(Object.create(echarts), {
    init: () => mockChart,
  }) as typeof echarts;
  const documentStub = createDocumentShim();
  const windowStub: Record<string, unknown> = {
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    innerWidth: Math.max(size.width, 360),
    innerHeight: Math.max(size.height, 320),
  };
  const setTimeoutSafe = setTimeout;
  const clearTimeoutSafe = clearTimeout;
  const setIntervalSafe = setInterval;
  const clearIntervalSafe = clearInterval;
  const requestAnimationFrameSafe =
    typeof requestAnimationFrame === "function"
      ? requestAnimationFrame
      : ((callback: FrameRequestCallback) => setTimeout(() => callback(performance.now()), 16));
  const cancelAnimationFrameSafe =
    typeof cancelAnimationFrame === "function"
      ? cancelAnimationFrame
      : ((handle: number) => {
          clearTimeout(handle);
        });
  windowStub.setTimeout = setTimeoutSafe;
  windowStub.clearTimeout = clearTimeoutSafe;
  windowStub.setInterval = setIntervalSafe;
  windowStub.clearInterval = clearIntervalSafe;
  windowStub.requestAnimationFrame = requestAnimationFrameSafe;
  windowStub.cancelAnimationFrame = cancelAnimationFrameSafe;

  const runScript = async (url: string): Promise<void> => {
    const absoluteUrl = toAbsoluteAssetUrl(url);

    if (/ecstat/i.test(absoluteUrl)) {
      windowStub.ecStat = await ensureEcStat();
      return;
    }

    if (/usa(?:\.min)?\.js(?:\?|$)/i.test(absoluteUrl)) {
      const usaGeo = await loadAsset("/data/asset/geo/USA.json");
      if (usaGeo && typeof usaGeo === "object") {
        const usaMap = usaGeo as Parameters<typeof echartsProxy.registerMap>[1];
        echartsProxy.registerMap("USA", usaMap);
        echartsProxy.registerMap("usa", usaMap);
        return;
      }
    }

    if (/d3-array@[\d.]+\/dist\/d3-array\.js(?:\?|$)/i.test(absoluteUrl) || /d3-geo@[\d.]+\/dist\/d3-geo\.js(?:\?|$)/i.test(absoluteUrl)) {
      globalObject.d3 = await ensureD3Bundle();
      return;
    }

    if (/echarts-simple-transform\/dist\/ecSimpleTransform(?:\.min)?\.js(?:\?|$)/i.test(absoluteUrl)) {
      globalObject.ecSimpleTransform = await ensureEcSimpleTransform();
      return;
    }

    const localUrl = resolveLocalAssetUrl(absoluteUrl);
    const fetchTarget = localUrl ?? absoluteUrl;
    const response = await safeFetch(encodeURI(fetchTarget));
    if (!response.ok) {
      throw new Error(`Script request failed for ${url}: HTTP ${response.status}`);
    }

    const source = await response.text();
    const previousEcharts = globalObject.echarts;
    globalObject.echarts = echartsProxy as unknown;

    try {
      new Function(source)();
    } finally {
      if (previousEcharts === undefined) {
        delete globalObject.echarts;
      } else {
        globalObject.echarts = previousEcharts;
      }
    }
  };
  const jquery = createJQueryShim(pendingTasks, warnings, runScript);
  const XMLHttpRequestShim = createXMLHttpRequestShim(pendingTasks, warnings);

  if (/\becStat\b/.test(scriptSource)) {
    windowStub.ecStat = await ensureEcStat();
  }

  const fetchShim = (input: string | URL | Request) => {
    const value =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const local = resolveLocalAssetUrl(value) ?? resolveLocalAssetUrl(toAbsoluteAssetUrl(value));
    if (!local) {
      throw new Error(`No local fetch mapping for ${value}`);
    }
    return trackTask(pendingTasks, safeFetch(encodeURI(local)));
  };

  const scriptRunner = new Function(
    "echarts",
    "document",
    "window",
    "$",
    "fetch",
    "console",
    "ecStat",
    "XMLHttpRequest",
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    "requestAnimationFrame",
    "cancelAnimationFrame",
    `${scriptSource}\n; return typeof option !== "undefined" ? option : undefined;`,
  );

  let explicitOption: unknown;
  try {
    explicitOption = scriptRunner(
      echartsProxy,
      documentStub,
      windowStub,
      jquery,
      fetchShim,
      console,
      windowStub.ecStat,
      XMLHttpRequestShim,
      setTimeoutSafe,
      clearTimeoutSafe,
      setIntervalSafe,
      clearIntervalSafe,
      requestAnimationFrameSafe,
      cancelAnimationFrameSafe,
    );
  } catch (error) {
    const message = toErrorMessage(error, "Unknown script evaluation error");
    const stackSuffix = error instanceof Error && error.stack ? `\n${error.stack}` : "";
    throw new Error(`Failed to evaluate ${entry.id}: ${message}${stackSuffix}`);
  }

  if (pendingTasks.length > 0) {
    const settled = await Promise.allSettled(pendingTasks);
    for (const result of settled) {
      if (result.status === "rejected") {
        const reason = toErrorMessage(result.reason, "Asset task failed");
        warnings.push(reason);
      }
    }
  }

  try {
    await new Promise<void>((resolve) => {
      setTimeoutSafe(() => resolve(), 0);
    });
  } catch (error) {
    const message = toErrorMessage(error, "Unknown post-evaluation wait error");
    throw new Error(`Failed post-evaluation wait for ${entry.id}: ${message}`);
  }

  const option = setOptionRef.current ?? explicitOption;
  if (!option || typeof option !== "object") {
    throw new Error(`Example ${entry.id} did not produce a usable ECharts option object.`);
  }

  return {
    option: option as EChartsCoreOption,
    warnings,
  };
  } catch (error) {
    const message = toErrorMessage(error, "Unknown evaluator failure");
    const stackSuffix = error instanceof Error && error.stack ? `\n${error.stack}` : "";
    throw new Error(`Evaluator failure for ${entry.id}: ${message}${stackSuffix}`);
  } finally {
    if (hadD3) {
      globalObject.d3 = previousD3;
    } else {
      delete globalObject.d3;
    }

    if (hadEcSimpleTransform) {
      globalObject.ecSimpleTransform = previousEcSimpleTransform;
    } else {
      delete globalObject.ecSimpleTransform;
    }
  }
}

export async function executeExampleRuntime(
  entry: ExampleCatalogEntry,
  options: RuntimeExecutionOptions,
): Promise<RuntimeExecutionResult> {
  const warnings: string[] = [];
  const pendingTasks: PendingTask[] = [];
  const size = normalizeEvaluatorSize(options.size);
  const chart = options.chart;
  const globalObject = globalThis as Record<string, unknown>;
  const hadD3 = Object.prototype.hasOwnProperty.call(globalObject, "d3");
  const previousD3 = globalObject.d3;
  const hadEcSimpleTransform = Object.prototype.hasOwnProperty.call(globalObject, "ecSimpleTransform");
  const previousEcSimpleTransform = globalObject.ecSimpleTransform;
  const trackedListeners: TrackedDomListener[] = [];
  const timeoutIds = new Set<ReturnType<typeof setTimeout>>();
  const intervalIds = new Set<ReturnType<typeof setInterval>>();
  const animationFrameIds = new Set<number>();

  let disposed = false;
  const dispose = () => {
    if (disposed) {
      return;
    }
    disposed = true;

    for (const timerId of timeoutIds) {
      clearTimeout(timerId);
    }
    timeoutIds.clear();

    for (const timerId of intervalIds) {
      clearInterval(timerId);
    }
    intervalIds.clear();

    if (typeof cancelAnimationFrame === "function") {
      for (const frameId of animationFrameIds) {
        cancelAnimationFrame(frameId);
      }
    } else {
      for (const frameId of animationFrameIds) {
        clearTimeout(frameId);
      }
    }
    animationFrameIds.clear();

    for (const tracked of trackedListeners.splice(0)) {
      tracked.target.removeEventListener(tracked.type, tracked.listener, tracked.options);
    }

    try {
      chart.off();
    } catch {
      // ignore teardown-only event cleanup failures
    }

    try {
      chart.getZr()?.off?.();
    } catch {
      // ignore teardown-only event cleanup failures
    }

    if (hadD3) {
      globalObject.d3 = previousD3;
    } else {
      delete globalObject.d3;
    }

    if (hadEcSimpleTransform) {
      globalObject.ecSimpleTransform = previousEcSimpleTransform;
    } else {
      delete globalObject.ecSimpleTransform;
    }
  };

  try {
    if (options.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    try {
      chart.clear();
      chart.off();
      chart.getZr()?.off?.();
      chart.resize({
        width: size.width,
        height: size.height,
      });
    } catch {
      // ignore pre-run cleanup failures and continue best-effort
    }

    let scriptResponse: Response;
    try {
      scriptResponse = await safeFetch(encodeURI(entry.scriptPath));
    } catch (error) {
      const message = toErrorMessage(error, "Unknown script request failure");
      throw new Error(`Failed to request script for ${entry.id}: ${message}`);
    }
    if (!scriptResponse.ok) {
      throw new Error(`Script missing for ${entry.id}: HTTP ${scriptResponse.status}`);
    }

    const scriptSource = await scriptResponse.text();

    const disposedZrFallback = {
      on() {},
      off() {},
      add() {},
      remove() {},
      setCursorStyle() {},
      configLayer() {},
      storage: {},
      painter: {},
    };

    const chartProxy = new Proxy(chart as unknown as Record<string, unknown>, {
      get(target, prop) {
        if (prop === "setOption") {
          return (option: unknown, setOptionOpts?: boolean | { notMerge?: boolean }) => {
            if (chart.isDisposed()) {
              return;
            }
            options.onSetOption?.(option, setOptionOpts);
            if (typeof setOptionOpts === "boolean" || setOptionOpts === undefined) {
              return chart.setOption(option as EChartsCoreOption, setOptionOpts);
            }
            return chart.setOption(option as EChartsCoreOption, setOptionOpts);
          };
        }
        if (prop === "getZr") {
          return () => {
            if (chart.isDisposed()) {
              return disposedZrFallback;
            }
            return chart.getZr() ?? disposedZrFallback;
          };
        }
        if (prop === "dispose") {
          return () => undefined;
        }

        const value = target[String(prop)];
        if (typeof value === "function") {
          return (value as (...args: unknown[]) => unknown).bind(chart);
        }
        return value;
      },
    }) as unknown as EChartsType;

    const echartsProxy = Object.assign(Object.create(echarts), {
      init: () => chartProxy,
    }) as typeof echarts;
    const documentStub = createRuntimeDocumentShim(options.container, trackedListeners);
    const windowStub = createRuntimeWindowShim(
      size,
      trackedListeners,
      timeoutIds,
      intervalIds,
      animationFrameIds,
    );
    const windowRecord = windowStub as Record<string, unknown>;

    const runScript = async (url: string): Promise<void> => {
      const absoluteUrl = toAbsoluteAssetUrl(url);

      if (/ecstat/i.test(absoluteUrl)) {
        windowRecord.ecStat = await ensureEcStat();
        return;
      }

      if (/usa(?:\.min)?\.js(?:\?|$)/i.test(absoluteUrl)) {
        const usaGeo = await loadAsset("/data/asset/geo/USA.json");
        if (usaGeo && typeof usaGeo === "object") {
          const usaMap = usaGeo as Parameters<typeof echartsProxy.registerMap>[1];
          echartsProxy.registerMap("USA", usaMap);
          echartsProxy.registerMap("usa", usaMap);
          return;
        }
      }

      if (
        /d3-array@[\d.]+\/dist\/d3-array\.js(?:\?|$)/i.test(absoluteUrl) ||
        /d3-geo@[\d.]+\/dist\/d3-geo\.js(?:\?|$)/i.test(absoluteUrl)
      ) {
        globalObject.d3 = await ensureD3Bundle();
        return;
      }

      if (/echarts-simple-transform\/dist\/ecSimpleTransform(?:\.min)?\.js(?:\?|$)/i.test(absoluteUrl)) {
        globalObject.ecSimpleTransform = await ensureEcSimpleTransform();
        return;
      }

      const localUrl = resolveLocalAssetUrl(absoluteUrl);
      const fetchTarget = localUrl ?? absoluteUrl;
      const response = await safeFetch(encodeURI(fetchTarget));
      if (!response.ok) {
        throw new Error(`Script request failed for ${url}: HTTP ${response.status}`);
      }

      const source = await response.text();
      const previousEcharts = globalObject.echarts;
      globalObject.echarts = echartsProxy as unknown;

      try {
        new Function(source)();
      } finally {
        if (previousEcharts === undefined) {
          delete globalObject.echarts;
        } else {
          globalObject.echarts = previousEcharts;
        }
      }
    };

    const jquery = createJQueryShim(pendingTasks, warnings, runScript);
    const XMLHttpRequestShim = createXMLHttpRequestShim(pendingTasks, warnings);

    if (/\becStat\b/.test(scriptSource)) {
      windowRecord.ecStat = await ensureEcStat();
    }

    const fetchShim = (input: string | URL | Request) => {
      const value =
        typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const local = resolveLocalAssetUrl(value) ?? resolveLocalAssetUrl(toAbsoluteAssetUrl(value));
      if (!local) {
        throw new Error(`No local fetch mapping for ${value}`);
      }
      return trackTask(pendingTasks, safeFetch(encodeURI(local)));
    };

    const scriptRunner = new Function(
      "echarts",
      "document",
      "window",
      "$",
      "fetch",
      "console",
      "ecStat",
      "XMLHttpRequest",
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      `${scriptSource}\n; return typeof option !== "undefined" ? option : undefined;`,
    );

    try {
      scriptRunner(
        echartsProxy,
        documentStub,
        windowStub,
        jquery,
        fetchShim,
        console,
        windowRecord.ecStat,
        XMLHttpRequestShim,
        windowRecord.setTimeout,
        windowRecord.clearTimeout,
        windowRecord.setInterval,
        windowRecord.clearInterval,
        windowRecord.requestAnimationFrame,
        windowRecord.cancelAnimationFrame,
      );
    } catch (error) {
      const message = toErrorMessage(error, "Unknown script execution error");
      const stackSuffix = error instanceof Error && error.stack ? `\n${error.stack}` : "";
      throw new Error(`Failed to execute ${entry.id}: ${message}${stackSuffix}`);
    }

    if (pendingTasks.length > 0) {
      const settled = await Promise.allSettled(pendingTasks);
      for (const result of settled) {
        if (result.status === "rejected") {
          const reason = toErrorMessage(result.reason, "Asset task failed");
          warnings.push(reason);
        }
      }
    }

    await new Promise<void>((resolve) => {
      const setTimeoutFn = windowRecord.setTimeout as typeof setTimeout;
      setTimeoutFn(() => resolve(), 0);
    });

    if (options.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    return {
      warnings,
      dispose,
    };
  } catch (error) {
    dispose();
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    const message = toErrorMessage(error, "Unknown runtime execution failure");
    const stackSuffix = error instanceof Error && error.stack ? `\n${error.stack}` : "";
    throw new Error(`Runtime execution failure for ${entry.id}: ${message}${stackSuffix}`);
  }
}
