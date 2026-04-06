import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Row = {
    id?: number;
    name?: string;
    bankName?: string;
    number?: string;
    isDefault?: boolean;
    isActive?: boolean;
};

export default function BanksPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("financials/cashbanks")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load banks / cash accounts.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Banks &amp; cash accounts</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Bank</th>
                            <th>Account #</th>
                            <th>Default</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.id ?? i}>
                                <td>{r.name}</td>
                                <td>{r.bankName}</td>
                                <td>{r.number}</td>
                                <td>{r.isDefault ? "Yes" : "No"}</td>
                                <td>{r.isActive ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No bank accounts.</p>}
            </div>
            <p className="text-muted small mt-2">Cash book reporting in PHP (₱).</p>
        </div>
    );
}
