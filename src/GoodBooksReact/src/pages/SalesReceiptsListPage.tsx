import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type ReceiptRow = {
    id: number;
    receiptNo?: string;
    customerName?: string;
    receiptDate?: string;
    amount?: number;
    remainingAmountToAllocate?: number;
};

export default function SalesReceiptsListPage() {
    const [rows, setRows] = useState<ReceiptRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<ReceiptRow[]>("sales/salesreceipts")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load sales receipts.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Sales receipts (collections)</h1>
            <p className="text-muted small">
                Customer payments in PHP; tie out to official receipts and BIR sales reporting as required.
            </p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Receipt</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th className="text-end">Amount</th>
                            <th className="text-end">Unallocated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.receiptNo}</td>
                                <td>{r.customerName}</td>
                                <td>{r.receiptDate ? String(r.receiptDate).substring(0, 10) : ""}</td>
                                <td className="text-end">{formatMoneyPhp(r.amount)}</td>
                                <td className="text-end">{formatMoneyPhp(r.remainingAmountToAllocate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No receipts or still loading.</p>}
            </div>
        </div>
    );
}
