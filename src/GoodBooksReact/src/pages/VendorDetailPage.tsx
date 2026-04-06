import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type Vendor = {
    id?: number;
    no?: string;
    name?: string;
    email?: string;
    phone?: string;
    balance?: number;
    taxGroup?: string;
};

export default function VendorDetailPage() {
    const { vendorId } = useParams();
    const [row, setRow] = useState<Vendor | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!vendorId) {
            return;
        }
        let c = false;
        apiClient
            .get<Vendor>(`purchasing/vendor?id=${vendorId}`)
            .then((res) => {
                if (!c) {
                    setRow(res.data);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load vendor.");
                }
            });
        return () => {
            c = true;
        };
    }, [vendorId]);

    if (!vendorId) {
        return <div className="p-4 text-muted">Missing vendor id.</div>;
    }

    return (
        <div className="p-4">
            <p>
                <Link to="/vendors">← Vendors</Link>
            </p>
            <h1 className="h4 mb-3">Vendor</h1>
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
        </div>
    );
}
