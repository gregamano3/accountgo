import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

type Role = { id?: number; name?: string; displayName?: string };
type User = {
    id?: number;
    userName?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles?: Role[];
};

export default function AdminUsersPage() {
    const [rows, setRows] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let c = false;
        apiClient
            .get<User[]>("administration/users")
            .then((res) => {
                if (!c) {
                    setRows(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load users.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Users</h1>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>User name</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((u) => (
                            <tr key={u.id}>
                                <td>{u.userName}</td>
                                <td>{u.email}</td>
                                <td>
                                    {(u.firstName ?? "") + " " + (u.lastName ?? "")}
                                </td>
                                <td>{u.roles?.map((r) => r.name).join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !error && <p className="text-muted small">No users.</p>}
            </div>
        </div>
    );
}
