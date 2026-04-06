import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type VendorRow = {
    id: number;
    no?: string;
    name?: string;
    email?: string;
    phone?: string;
    balance?: number;
    taxGroup?: string;
    contact?: string;
};

export default function VendorsPage() {
    const [rows, setRows] = useState<VendorRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<VendorRow[]>("purchasing/vendors")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load vendors.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Vendors</h1>
            <p className="text-muted small">
                AP balances in PHP; align expanded withholding and 2307 handling with your tax rules.
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
                        {rows.map((v) => (
                            <tr key={v.id}>
                                <td>{v.no}</td>
                                <td>{v.name}</td>
                                <td>{v.contact}</td>
                                <td>{v.taxGroup}</td>
                                <td className="text-end">{formatMoneyPhp(v.balance)}</td>
                                <td>
                                    <Link className="small" to={`/vendors/${v.id}`}>
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No vendors or still loading.</p>}
            </div>
        </div>
    );
}
