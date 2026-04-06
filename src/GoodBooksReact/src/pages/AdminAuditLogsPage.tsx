import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Log = {
    id?: number;
    userName?: string;
    auditEventDateUTC?: string;
    auditEventType?: string;
    tableName?: string;
    recordId?: number;
    fieldName?: string;
    originalValue?: string;
    newValue?: string;
};

export default function AdminAuditLogsPage() {
    const [rows, setRows] = useState<Log[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<Log[]>("administration/auditlogs")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load audit logs.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Audit logs</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>When (UTC)</th>
                            <th>User</th>
                            <th>Event</th>
                            <th>Table</th>
                            <th>Record</th>
                            <th>Field</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.id ?? i}>
                                <td>{r.auditEventDateUTC}</td>
                                <td>{r.userName}</td>
                                <td>{r.auditEventType}</td>
                                <td>{r.tableName}</td>
                                <td>{r.recordId}</td>
                                <td>{r.fieldName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No audit entries.</p>}
            </div>
        </div>
    );
}
