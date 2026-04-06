import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type Row = {
    accountCode?: string;
    accountName?: string;
    amount?: number;
    isExpense?: boolean;
};

export default function IncomeStatementPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<Row[]>("financials/incomestatement")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Income statement could not be loaded. Check API logs if the endpoint errors on includes.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Income statement</h1>
            {error && <div className="alert alert-warning py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Account</th>
                            <th>Type</th>
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={`${r.accountCode}-${i}`}>
                                <td>{r.accountCode}</td>
                                <td>{r.accountName}</td>
                                <td>{r.isExpense ? "Expense" : "Revenue"}</td>
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
