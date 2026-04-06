import React, { useCallback, useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type GlNode = {
    accountCode?: string;
    accountName?: string;
    date?: string;
    documentType?: string;
    transactionNo?: number;
    debit?: number | null;
    credit?: number | null;
    childMasterGeneralLedger?: GlNode[];
};

function GlRows({ nodes, depth }: { nodes: GlNode[]; depth: number }) {
    return (
        <>
            {nodes.map((n, i) => (
                <React.Fragment key={`${n.accountCode}-${n.transactionNo}-${depth}-${i}`}>
                    <tr className={depth > 0 ? "table-light" : undefined}>
                        <td>{n.accountCode}</td>
                        <td style={{ paddingLeft: 8 + depth * 12 }}>{n.accountName}</td>
                        <td>{n.documentType}</td>
                        <td>{n.transactionNo}</td>
                        <td>{n.date ? String(n.date).substring(0, 10) : ""}</td>
                        <td className="text-end">{formatMoneyPhp(n.debit ?? 0)}</td>
                        <td className="text-end">{formatMoneyPhp(n.credit ?? 0)}</td>
                    </tr>
                    <GlRows nodes={n.childMasterGeneralLedger ?? []} depth={depth + 1} />
                </React.Fragment>
            ))}
        </>
    );
}

export default function GeneralLedgerPage() {
    const [rows, setRows] = useState<GlNode[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [from, setFrom] = useState(() => new Date(new Date().getFullYear(), 0, 1).toISOString().substring(0, 10));
    const [to, setTo] = useState(() => new Date().toISOString().substring(0, 10));

    const load = useCallback(() => {
        setError(null);
        apiClient
            .get<GlNode[]>(`financials/generalledger?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
            .then((res) => {
                setRows(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => {
                setError("Could not load general ledger.");
            });
    }, [from, to]);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">General ledger</h1>
            <div className="row g-2 align-items-end mb-3">
                <div className="col-auto">
                    <label className="form-label small mb-0">From</label>
                    <input type="date" className="form-control form-control-sm" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="col-auto">
                    <label className="form-label small mb-0">To</label>
                    <input type="date" className="form-control form-control-sm" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-primary" onClick={load}>
                        Refresh
                    </button>
                </div>
            </div>
            {error && <div className="alert alert-warning py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Account / description</th>
                            <th>Doc</th>
                            <th>Txn</th>
                            <th>Date</th>
                            <th className="text-end">Debit</th>
                            <th className="text-end">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <GlRows nodes={rows} depth={0} />
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No GL rows.</p>}
            </div>
        </div>
    );
}
