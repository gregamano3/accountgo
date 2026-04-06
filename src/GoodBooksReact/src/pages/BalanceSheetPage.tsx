import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type Row = {
    accountCode?: string;
    accountName?: string;
    amount?: number;
};

export default function BalanceSheetPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<Row[]>("financials/balancesheet")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError(
                        "Balance sheet could not be loaded. The API may need data fixes (see server logs). Try trial balance first."
                    );
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Balance sheet</h1>
            {error && <div className="alert alert-warning py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Account</th>
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={`${r.accountCode}-${i}`}>
                                <td>{r.accountCode}</td>
                                <td>{r.accountName}</td>
                                <td className="text-end">{formatMoneyPhp(r.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No rows or still loading.</p>}
            </div>
        </div>
    );
}
