import { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

/**
 * Calls the same initialization endpoint as the README / MVC (`GET /api/administration/setup`).
 * Destructive in the sense it creates sample company data — only use on a dev database.
 */
export default function SystemSetupPage() {
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function runSetup() {
        if (
            !window.confirm(
                "Run API database setup (demo company, COA, sample customers/vendors, etc.)? Use only on a disposable SQL database."
            )
        ) {
            return;
        }
        setBusy(true);
        setMsg(null);
        setErr(null);
        try {
            const res = await apiClient.get("administration/setup");
            setMsg(typeof res.data === "string" ? res.data : JSON.stringify(res.data));
        } catch {
            setErr("Setup failed — check API logs and connection string.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Database setup</h1>
            <p className="text-muted small">
                Same as documented <code>GET /api/administration/setup</code>. Not a substitute for production cutover planning.
            </p>
            <button type="button" className="btn btn-warning btn-sm" disabled={busy} onClick={runSetup}>
                {busy ? "Running…" : "Run setup"}
            </button>
            {msg && <pre className="mt-3 small bg-light p-2 border rounded">{msg}</pre>}
            {err && <div className="alert alert-danger mt-3 py-2">{err}</div>}
            <p className="mt-3 mb-0">
                <Link to="/">← Dashboard</Link>
            </p>
        </div>
    );
}
