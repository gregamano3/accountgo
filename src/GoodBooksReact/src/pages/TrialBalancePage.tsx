import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type TrialBalanceRow = {
    accountCode?: string;
    accountName?: string;
    debit?: number;
    credit?: number;
};

export default function TrialBalancePage() {
    const [rows, setRows] = useState<TrialBalanceRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<TrialBalanceRow[]>("financials/trialbalance")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load trial balance (ensure GL is initialized).");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Trial balance</h1>
            <p className="text-muted small">PHP; use for BIR mapping and year-end working papers with your accountant.</p>
            {error && <div className="alert alert-warning py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Account</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={`${r.accountCode}-${i}`}>
                                <td>{r.accountCode}</td>
                                <td>{r.accountName}</td>
                                <td className="text-end">{formatMoneyPhp(r.debit)}</td>
                                <td className="text-end">{formatMoneyPhp(r.credit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No rows or still loading.</p>}
            </div>
        </div>
    );
}
