import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Perm = { name?: string; displayName?: string };
type Group = {
    id?: number;
    name?: string;
    displayName?: string;
    permissions?: Perm[];
};

export default function AdminGroupsPage() {
    const [rows, setRows] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Group[]>("administration/groups")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load groups (API may throw — see server logs).");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Permission groups</h1>
            {error && <div className="alert alert-warning py-2">{error}</div>}
            {rows.map((g) => (
                <div key={g.id} className="card mb-3">
                    <div className="card-header small py-2">
                        <strong>{g.displayName ?? g.name}</strong>
                    </div>
                    <div className="card-body py-2">
                        <ul className="small mb-0">
                            {g.permissions?.map((p) => (
                                <li key={p.name}>{p.displayName ?? p.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
            {rows.length === 0 && !error && <p className="text-muted small">No groups.</p>}
        </div>
    );
}
