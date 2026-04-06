import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";

type Row = {
    id: number;
    no?: string;
    vendorName?: string;
    orderDate?: string;
    referenceNo?: string;
};

export default function PurchaseOrdersListPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("purchasing/purchaseorders")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load purchase orders.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Purchase orders</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Vendor</th>
                            <th>Date</th>
                            <th>Reference</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.no}</td>
                                <td>{r.vendorName}</td>
                                <td>{r.orderDate ? String(r.orderDate).substring(0, 10) : ""}</td>
                                <td>{r.referenceNo}</td>
                                <td>
                                    <Link className="small" to={`/purchase-order?purchId=${r.id}`}>
                                        Open
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No purchase orders.</p>}
            </div>
        </div>
    );
}
