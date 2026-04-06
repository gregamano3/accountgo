import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Row = { id?: number; description?: string; isActive?: boolean };

export default function TaxGroupsPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("tax/taxgroups")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load tax groups.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Tax groups</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <ul className="small">
                {rows.map((r) => (
                    <li key={r.id}>
                        {r.description} {r.isActive === false ? "(inactive)" : ""}
                    </li>
                ))}
            </ul>
            {rows.length === 0 && !error && <p className="text-muted small">No tax groups.</p>}
        </div>
    );
}
