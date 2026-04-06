import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

type OrderRow = {
    id: number;
    no?: string;
    customerName?: string;
    orderDate?: string;
    referenceNo?: string;
};

export default function SalesOrdersListPage() {
    const [rows, setRows] = useState<OrderRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<OrderRow[]>("sales/salesorders")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load sales orders.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Sales orders</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Reference</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((o) => (
                            <tr key={o.id}>
                                <td>{o.no}</td>
                                <td>{o.customerName}</td>
                                <td>{o.orderDate ? String(o.orderDate).substring(0, 10) : ""}</td>
                                <td>{o.referenceNo}</td>
                                <td>
                                    <Link className="small" to={`/sales-order?orderId=${o.id}`}>
                                        Open
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No orders or still loading.</p>}
            </div>
        </div>
    );
}
