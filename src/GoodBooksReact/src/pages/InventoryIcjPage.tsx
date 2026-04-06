import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Row = {
    id?: number;
    item?: string;
    measurement?: string;
    date?: string;
    in?: number;
    out?: number;
};

export default function InventoryIcjPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Row[]>("inventory/icj")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load inventory control journal.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Inventory control journal</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Item</th>
                            <th>UoM</th>
                            <th className="text-end">In</th>
                            <th className="text-end">Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.id ?? i}>
                                <td>{r.date ? String(r.date).substring(0, 10) : ""}</td>
                                <td>{r.item}</td>
                                <td>{r.measurement}</td>
                                <td className="text-end">{r.in}</td>
                                <td className="text-end">{r.out}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No ICJ rows.</p>}
            </div>
        </div>
    );
}
