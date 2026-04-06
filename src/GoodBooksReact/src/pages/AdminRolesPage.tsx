import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Perm = { name?: string; displayName?: string };
type Role = {
    id?: number;
    name?: string;
    displayName?: string;
    permissions?: Perm[];
};

export default function AdminRolesPage() {
    const [rows, setRows] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Role[]>("administration/roles")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load roles.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Security roles</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {rows.map((r) => (
                <div key={r.id} className="card mb-3">
                    <div className="card-header small py-2">
                        <strong>{r.displayName ?? r.name}</strong> <span className="text-muted">({r.name})</span>
                    </div>
                    <div className="card-body py-2">
                        <ul className="small mb-0">
                            {r.permissions?.map((p) => (
                                <li key={p.name}>{p.displayName ?? p.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
            {rows.length === 0 && !error && <p className="text-muted small">No roles.</p>}
        </div>
    );
}
