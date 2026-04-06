/** Base URL for API paths (e.g. `/api/`). Prefer `apiClient` from `src/api/client.ts` for requests. */
const Config = {
    API_URL: import.meta.env.VITE_API_URL ?? "/api/",
};

export default Config;