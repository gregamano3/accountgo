import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type Row = {
    id: number;
    no?: string;
    customerName?: string;
    invoiceDate?: string;
    referenceNo?: string;
    posted?: boolean;
    salesInvoiceLines?: { quantity?: number; amount?: number; discount?: number }[];
};

export default function SalesInvoicesListPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("sales/salesinvoices")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load sales invoices.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    function lineTotal(r: Row): number {
        if (!r.salesInvoiceLines?.length) {
            return 0;
        }
        return r.salesInvoiceLines.reduce((sum, l) => sum + (l.quantity ?? 0) * (l.amount ?? 0) - (l.discount ?? 0), 0);
    }

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Sales invoices</h1>
            <p className="text-muted small">BIR sales invoices / official receipts — use posted status for GL alignment.</p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Reference</th>
                            <th className="text-end">Line total (approx)</th>
                            <th>Posted</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.no}</td>
                                <td>{r.customerName}</td>
                                <td>{r.invoiceDate ? String(r.invoiceDate).substring(0, 10) : ""}</td>
                                <td>{r.referenceNo}</td>
                                <td className="text-end">{formatMoneyPhp(lineTotal(r))}</td>
                                <td>{r.posted ? "Yes" : "No"}</td>
                                <td>
                                    <Link className="small" to={`/sales-invoice?invoiceId=${r.id}`}>
                                        Open
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No invoices.</p>}
            </div>
        </div>
    );
}
