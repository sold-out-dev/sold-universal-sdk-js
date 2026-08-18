/**
 * Compression types supported by the SDK
 */
export enum CompressionType {
    Gzip = "gzip",
}

/**
 * An invalid API key was passed into {@link Session}.
 */
export class InvalidApiKeyError extends Error {
}

/**
 * The default API base url used when none is configured.
 */
export const DEFAULT_BASE_URL = "https://sold-out.dev";

/**
 * Session options for configuring the SDK behavior
 */
export interface SessionOptions {
    /**
     * API base url. Defaults to {@link DEFAULT_BASE_URL}.
     * Trailing slashes are stripped.
     */
    baseUrl?: string;

    /**
     * Compression type for requests. Defaults to Gzip for best performance.
     * When enabled, requests larger than compressionThreshold bytes will be compressed.
     */
    compression?: CompressionType;

    /**
     * Request timeout in milliseconds. Defaults to 30000 (30 seconds).
     */
    timeout?: number;

    /**
     * HTTP proxy URL. Supports HTTP and HTTPS proxies.
     * Format: http://[username:password@]host:port
     * Example: http://proxy.example.com:8080 or http://user:pass@proxy.example.com:8080
     *
     * WARNING: Proxy support adds significant latency and should only be used for debugging
     * network issues or when absolutely necessary. Direct connections are much faster.
     */
    proxy?: string;

    /**
     * Whether to reject unauthorized certificates (self-signed, expired, etc.).
     * Set to false to allow self-signed certificates. Defaults to true for security.
     * WARNING: Setting this to false makes connections vulnerable to man-in-the-middle attacks.
     */
    rejectUnauthorized?: boolean;
}

/**
 * A session that can be used to interact with the Akamai API services.
 */
export class Session {
    /**
     * The API key.
     */
    public readonly apiKey: string;

    /**
     * The compression type for requests.
     */
    public readonly compression: CompressionType;

    /**
     * The API base url, without a trailing slash.
     */
    public readonly baseUrl: string;

    /**
     * Request timeout in milliseconds.
     */
    public readonly timeout: number;

    /**
     * Proxy used to make API requests.
     */
    public readonly proxy?: string;

    /**
     * Whether to reject unauthorized certificates.
     */
    public readonly rejectUnauthorized: boolean;

    /**
     * Creates a new session.
     *
     * Two call shapes are supported:
     *  - `new Session(apiKey, options?)` — the recommended form.
     *  - `new Session(apiKey, jwtKey?, appKey?, appSecret?, options?)` — kept for
     *    drop-in compatibility with the upstream SDK. The credential arguments are
     *    accepted and ignored: this API authenticates with the API key alone.
     *
     * @param apiKey Your API key
     * @param optionsOrJwtKey Session options, or the legacy (ignored) JWT key
     * @param appKey Legacy, ignored
     * @param appSecret Legacy, ignored
     * @param legacyOptions Session options when the legacy call shape is used
     */
    public constructor(
        apiKey: string,
        optionsOrJwtKey?: SessionOptions | string,
        appKey?: string,
        appSecret?: string,
        legacyOptions?: SessionOptions
    ) {
        if (apiKey.length == 0) {
            throw new InvalidApiKeyError();
        }

        const options: SessionOptions | undefined =
            typeof optionsOrJwtKey === "object" && optionsOrJwtKey !== null
                ? optionsOrJwtKey
                : legacyOptions;

        this.apiKey = apiKey;
        this.compression = options?.compression ?? CompressionType.Gzip;
        this.baseUrl = (options?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
        this.timeout = options?.timeout ?? 30000;
        this.proxy = options?.proxy;
        this.rejectUnauthorized = options?.rejectUnauthorized ?? true;
    }
}

export * from './akamai/index.js';
