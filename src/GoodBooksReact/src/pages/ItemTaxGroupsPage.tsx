import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Row = { id?: number; name?: string; isFullyExempt?: boolean };

export default function ItemTaxGroupsPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("tax/itemtaxgroups")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load item tax groups.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Item tax groups</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Fully exempt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.name}</td>
                                <td>{r.isFullyExempt ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No item tax groups.</p>}
            </div>
        </div>
    );
}
