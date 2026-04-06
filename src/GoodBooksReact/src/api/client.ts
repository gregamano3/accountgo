import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "/api/";

export const apiClient = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: false,
});

const TOKEN_KEY = "gb_access_token";
const EMAIL_KEY = "gb_user_email";

apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(EMAIL_KEY);
            const path = window.location.pathname;
            if (!path.startsWith("/login")) {
                window.location.replace("/login");
            }
        }
        return Promise.reject(error);
    }
);

export { TOKEN_KEY, EMAIL_KEY };
