import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type Item = {
    id?: number;
    code?: string;
    description?: string;
    cost?: number;
    price?: number;
    quantityOnHand?: number;
    sellDescription?: string;
    purchaseDescription?: string;
};

export default function ItemDetailPage() {
    const { itemId } = useParams();
    const [row, setRow] = useState<Item | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!itemId) {
            return;
        }
        let c = false;
        apiClient
            .get<Item>(`inventory/item?id=${itemId}`)
            .then((res) => {
                if (!c) {
                    setRow(res.data);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load item.");
                }
            });
        return () => {
            c = true;
        };
    }, [itemId]);

    if (!itemId) {
        return <div className="p-4 text-muted">Missing item id.</div>;
    }

    return (
        <div className="p-4">
            <p>
                <Link to="/inventory">← Items</Link>
            </p>
            <h1 className="h4 mb-3">Item</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {row && (
                <dl className="row small">
                    <dt className="col-sm-3">Code</dt>
                    <dd className="col-sm-9">{row.code}</dd>
                    <dt className="col-sm-3">Description</dt>
                    <dd className="col-sm-9">{row.description}</dd>
                    <dt className="col-sm-3">Sell</dt>
                    <dd className="col-sm-9">{row.sellDescription}</dd>
                    <dt className="col-sm-3">Purchase</dt>
                    <dd className="col-sm-9">{row.purchaseDescription}</dd>
                    <dt className="col-sm-3">Qty on hand</dt>
                    <dd className="col-sm-9">{row.quantityOnHand}</dd>
                    <dt className="col-sm-3">Cost</dt>
                    <dd className="col-sm-9">{formatMoneyPhp(row.cost)}</dd>
                    <dt className="col-sm-3">Price</dt>
                    <dd className="col-sm-9">{formatMoneyPhp(row.price)}</dd>
                </dl>
            )}
        </div>
    );
}
