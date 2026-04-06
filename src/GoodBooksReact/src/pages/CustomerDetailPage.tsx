import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type Customer = {
    id?: number;
    no?: string;
    name?: string;
    email?: string;
    phone?: string;
    balance?: number;
    taxGroup?: string;
};

export default function CustomerDetailPage() {
    const { customerId } = useParams();
    const [row, setRow] = useState<Customer | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!customerId) {
            return;
        }
        let c = false;
        apiClient
            .get<Customer>(`sales/customer?id=${customerId}`)
            .then((res) => {
                if (!c) {
                    setRow(res.data);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load customer.");
                }
            });
        return () => {
            c = true;
        };
    }, [customerId]);

    if (!customerId) {
        return <div className="p-4 text-muted">Missing customer id.</div>;
    }

    return (
        <div className="p-4">
            <p>
                <Link to="/customers">← Customers</Link>
            </p>
            <h1 className="h4 mb-3">Customer</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {row && (
                <dl className="row small">
                    <dt className="col-sm-3">No</dt>
                    <dd className="col-sm-9">{row.no}</dd>
                    <dt className="col-sm-3">Name</dt>
                    <dd className="col-sm-9">{row.name}</dd>
                    <dt className="col-sm-3">Email</dt>
                    <dd className="col-sm-9">{row.email}</dd>
                    <dt className="col-sm-3">Phone</dt>
                    <dd className="col-sm-9">{row.phone}</dd>
                    <dt className="col-sm-3">Tax group</dt>
                    <dd className="col-sm-9">{row.taxGroup}</dd>
                    <dt className="col-sm-3">Balance</dt>
                    <dd className="col-sm-9">{formatMoneyPhp(row.balance)}</dd>
                </dl>
            )}
            <Link className="btn btn-sm btn-outline-primary" to={`/contacts?partyType=1&partyId=${customerId}`}>
                Contacts for this customer
            </Link>
        </div>
    );
}
