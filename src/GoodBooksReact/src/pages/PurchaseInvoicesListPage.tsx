import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type Row = {
    id: number;
    no?: string;
    vendorName?: string;
    invoiceDate?: string;
    referenceNo?: string;
    vendorInvoiceNo?: string;
    posted?: boolean;
    isPaid?: boolean;
    amountPaid?: number;
};

export default function PurchaseInvoicesListPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("purchasing/purchaseinvoices")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load purchase invoices.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Purchase invoices</h1>
            <p className="text-muted small">Align with vendor bills and 2307 / EWT documentation.</p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Vendor</th>
                            <th>Date</th>
                            <th>Vendor inv #</th>
                            <th className="text-end">Paid</th>
                            <th>Posted</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.no}</td>
                                <td>{r.vendorName}</td>
                                <td>{r.invoiceDate ? String(r.invoiceDate).substring(0, 10) : ""}</td>
                                <td>{r.vendorInvoiceNo}</td>
                                <td className="text-end">{formatMoneyPhp(r.amountPaid)}</td>
                                <td>{r.posted ? "Yes" : "No"}</td>
                                <td>
                                    <Link className="small" to={`/purchasing-invoice?invoiceId=${r.id}`}>
                                        Open
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No purchase invoices.</p>}
            </div>
        </div>
    );
}
