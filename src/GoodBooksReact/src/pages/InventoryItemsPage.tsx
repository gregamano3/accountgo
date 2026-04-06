import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type ItemRow = {
    id: number;
    code?: string;
    description?: string;
    itemTaxGroupName?: string;
    measurement?: string;
    cost?: number;
    price?: number;
    quantityOnHand?: number;
};

export default function InventoryItemsPage() {
    const [rows, setRows] = useState<ItemRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<ItemRow[]>("inventory/items")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load items.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Items</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Tax group</th>
                            <th>UoM</th>
                            <th className="text-end">Qty</th>
                            <th className="text-end">Cost</th>
                            <th className="text-end">Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.id}>
                                <td>{r.code}</td>
                                <td>{r.description}</td>
                                <td>{r.itemTaxGroupName}</td>
                                <td>{r.measurement}</td>
                                <td className="text-end">{r.quantityOnHand}</td>
                                <td className="text-end">{formatMoneyPhp(r.cost)}</td>
                                <td className="text-end">{formatMoneyPhp(r.price)}</td>
                                <td>
                                    <Link className="small" to={`/inventory/item/${r.id}`}>
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No items.</p>}
            </div>
        </div>
    );
}
