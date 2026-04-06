import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type CustomerRow = {
    id: number;
    no?: string;
    name?: string;
    email?: string;
    phone?: string;
    balance?: number;
    taxGroup?: string;
    contact?: string;
};

export default function CustomersPage() {
    const [rows, setRows] = useState<CustomerRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<CustomerRow[]>("sales/customers")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load customers.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Customers</h1>
            <p className="text-muted small">
                AR balances in PHP; VAT treatment follows the customer tax group and your BIR registration.
            </p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Tax group</th>
                            <th className="text-end">Balance</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((c) => (
                            <tr key={c.id}>
                                <td>{c.no}</td>
                                <td>{c.name}</td>
                                <td>{c.contact}</td>
                                <td>{c.taxGroup}</td>
                                <td className="text-end">{formatMoneyPhp(c.balance)}</td>
                                <td>
                                    <Link className="small" to={`/customers/${c.id}`}>
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No customers or still loading.</p>}
            </div>
        </div>
    );
}
