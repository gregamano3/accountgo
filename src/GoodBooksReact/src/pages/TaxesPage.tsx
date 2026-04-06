import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { PH_STANDARD_VAT_PERCENT } from "../lib/phCompliance";

type TaxRow = {
    id?: number;
    taxCode?: string;
    taxName?: string;
    rate?: number;
    isActive?: boolean;
};

export default function TaxesPage() {
    const [rows, setRows] = useState<TaxRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<TaxRow[]>("tax/taxes")
            .then((res) => {
                if (!cancelled) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load taxes.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Tax codes &amp; rates</h1>
            <p className="text-muted small">
                Map these to BIR VAT / percentage-tax rules. Typical VAT rate is {PH_STANDARD_VAT_PERCENT}% for VAT-registered
                sellers—confirm category with your RDO.
            </p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th className="text-end">Rate %</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((t) => (
                            <tr key={t.id ?? t.taxCode}>
                                <td>{t.taxCode}</td>
                                <td>{t.taxName}</td>
                                <td className="text-end">{t.rate}</td>
                                <td>{t.isActive ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No taxes or still loading.</p>}
            </div>
        </div>
    );
}
