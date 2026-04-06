import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

type QuoteRow = {
    id: number;
    no?: string;
    customerName?: string;
    quotationDate?: string;
    referenceNo?: string;
    salesQuoteStatus?: string;
};

export default function QuotationsListPage() {
    const [rows, setRows] = useState<QuoteRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<QuoteRow[]>("sales/quotations")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load quotations.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Sales quotations</h1>
            <p className="text-muted small">
                Quotations are non-binding until invoiced; VAT treatment follows the final sales invoice.
            </p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((q) => (
                            <tr key={q.id}>
                                <td>{q.no}</td>
                                <td>{q.customerName}</td>
                                <td>{q.quotationDate ? String(q.quotationDate).substring(0, 10) : ""}</td>
                                <td>{q.referenceNo}</td>
                                <td>{q.salesQuoteStatus}</td>
                                <td>
                                    <Link className="small" to={`/sales-order?quotationId=${q.id}`}>
                                        Create order
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No quotations or still loading.</p>}
            </div>
        </div>
    );
}
