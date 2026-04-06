import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type AccountRow = {
    id: number;
    accountCode?: string;
    accountName?: string;
    balance?: number;
    debitBalance?: number;
    creditBalance?: number;
};

export default function ChartOfAccountsPage() {
    const [rows, setRows] = useState<AccountRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<AccountRow[]>("financials/accounts")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load chart of accounts.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Chart of accounts</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th className="text-end">Balance</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.accountCode}</td>
                                <td>{r.accountName}</td>
                                <td className="text-end">{formatMoneyPhp(r.balance)}</td>
                                <td className="text-end">{formatMoneyPhp(r.debitBalance)}</td>
                                <td className="text-end">{formatMoneyPhp(r.creditBalance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No accounts.</p>}
            </div>
        </div>
    );
}
