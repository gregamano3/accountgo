import axios from "axios";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../auth/AuthContext";

type TokenResponse = {
    access_token: string;
    email?: string;
};

export default function Login() {
    const { setSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? "/";

    /** Default demo user (same as AccountGoWeb login view). */
    const demoEmail = "admin@accountgo.ph";
    const demoPassword = "P@ssword1";

    const [email, setEmail] = useState(demoEmail);
    const [password, setPassword] = useState(demoPassword);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            const { data } = await apiClient.post<TokenResponse>("account/token", {
                email,
                password,
            });
            const displayEmail = data.email ?? email;
            setSession(data.access_token, displayEmail);
            navigate(from, { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError("Could not reach the API. Is it running (e.g. http://localhost:8001)?");
            }
        } finally {
            setBusy(false);
        }
    }

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5"
            style={{
                background: "linear-gradient(165deg, #f4f6f9 0%, #e8eef7 45%, #f8fafc 100%)",
            }}
        >
            <div className="w-100" style={{ maxWidth: 420 }}>
                <div className="text-center mb-4">
                    <h1 className="h3 fw-semibold text-dark mb-1">GoodBooks</h1>
                    <p className="text-secondary small mb-0">Sign in to continue</p>
                </div>
                <div className="card border-0 shadow">
                    <div className="card-body p-4">
                        <p className="small text-secondary mb-4">
                            Demo:{" "}
                            <span className="text-body fw-medium">{demoEmail}</span>
                            {" / "}
                            <span className="text-body fw-medium">{demoPassword}</span>
                        </p>
                        <form onSubmit={onSubmit}>
                            {error && (
                                <div className="alert alert-danger py-2 small mb-3" role="alert">
                                    {error}
                                </div>
                            )}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    className="form-control"
                                    type="email"
                                    autoComplete="username"
                                    value={email}
                                    onChange={(ev) => setEmail(ev.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-semibold" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    className="form-control"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(ev) => setPassword(ev.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={busy}>
                                {busy ? "Signing in…" : "Sign in"}
                            </button>
                        </form>
                    </div>
                </div>
                <p className="text-center small text-muted mt-4 mb-0">Philippine Peso (PHP) books · AccountGo</p>
            </div>
        </div>
    );
}
