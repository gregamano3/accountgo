import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

type Row = {
    id: number;
    journalDate?: string;
    referenceNo?: string;
    memo?: string;
    posted?: boolean;
};

export default function JournalEntriesListPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("financials/journalentries")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load journal entries.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Journal entries</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Memo</th>
                            <th>Posted</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.journalDate ? String(r.journalDate).substring(0, 10) : ""}</td>
                                <td>{r.referenceNo}</td>
                                <td>{r.memo}</td>
                                <td>{r.posted ? "Yes" : "No"}</td>
                                <td>
                                    <Link className="small" to={`/journal-entry?id=${r.id}`}>
                                        Open
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No journal entries.</p>}
            </div>
        </div>
    );
}
