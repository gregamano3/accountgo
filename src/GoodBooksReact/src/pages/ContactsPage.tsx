import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";

type Party = { id: number; name?: string };
type ContactRow = { id?: number; firstName?: string; lastName?: string; holdingPartyId?: number; holdingPartyType?: number };

export default function ContactsPage() {
    const [searchParams] = useSearchParams();
    const [customers, setCustomers] = useState<Party[]>([]);
    const [vendors, setVendors] = useState<Party[]>([]);
    const [partyType, setPartyType] = useState<1 | 2>(1);
    const [partyId, setPartyId] = useState<number>(0);
    const [rows, setRows] = useState<ContactRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const pt = Number(searchParams.get("partyType"));
        const pid = Number(searchParams.get("partyId"));
        if (pid > 0 && (pt === 1 || pt === 2)) {
            setPartyType(pt as 1 | 2);
            setPartyId(pid);
        }
    }, [searchParams]);

    useEffect(() => {
        let c = false;
        Promise.all([apiClient.get<Party[]>("sales/customers"), apiClient.get<Party[]>("purchasing/vendors")])
            .then(([cust, vend]) => {
                if (!c) {
                    setCustomers(Array.isArray(cust.data) ? cust.data : []);
                    setVendors(Array.isArray(vend.data) ? vend.data : []);
                }
            })
            .catch(() => {
                if (!c) {
                    setError("Could not load customers/vendors for picker.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    function loadContacts() {
        if (!partyId) {
            setRows([]);
            return;
        }
        setError(null);
        apiClient
            .get<ContactRow[]>(`contact/contacts?partyId=${partyId}&partyType=${partyType}`)
            .then((res) => {
                setRows(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => {
                setError("Could not load contacts for this party.");
            });
    }

    useEffect(() => {
        if (partyId) {
            loadContacts();
        } else {
            setRows([]);
        }
    }, [partyId, partyType]);

    const list = partyType === 1 ? customers : vendors;

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Contacts</h1>
            <p className="text-muted small">Matches AccountGoWeb: contacts are loaded per customer or vendor.</p>
            {error && <div className="alert alert-warning py-2">{error}</div>}
            <div className="row g-2 align-items-end mb-3">
                <div className="col-md-3">
                    <label className="form-label small">Party type</label>
                    <select
                        className="form-select form-select-sm"
                        value={partyType}
                        onChange={(e) => {
                            setPartyType(Number(e.target.value) as 1 | 2);
                            setPartyId(0);
                        }}
                    >
                        <option value={1}>Customer</option>
                        <option value={2}>Vendor</option>
                    </select>
                </div>
                <div className="col-md-5">
                    <label className="form-label small">{partyType === 1 ? "Customer" : "Vendor"}</label>
                    <select className="form-select form-select-sm" value={partyId || ""} onChange={(e) => setPartyId(Number(e.target.value))}>
                        <option value="">Select…</option>
                        {list.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={loadContacts}>
                        Reload
                    </button>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.id ?? i}>
                                <td>
                                    {(r.firstName ?? "") + " " + (r.lastName ?? "")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {partyId > 0 && rows.length === 0 && !error && <p className="text-muted small">No contacts.</p>}
            </div>
        </div>
    );
}
