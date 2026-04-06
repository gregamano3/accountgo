import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import PhComplianceCard from "../components/Compliance/PhComplianceCard";

type CompanyDto = {
    id?: number;
    companyCode?: string;
    name?: string;
    shortName?: string;
};

export default function CompanyPage() {
    const [company, setCompany] = useState<CompanyDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<CompanyDto | null>("administration/company")
            .then((res) => {
                if (!cancelled) {
                    setCompany(res.data && typeof res.data === "object" ? res.data : null);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("Could not load company. Run API setup (e.g. GET /api/administration/setup) if the database is empty.");
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="h4 mb-3">Company</h1>
            <p className="text-muted small">
                Registered name and TIN on printed invoices/receipts should match your BIR registration. Store TIN and address on
                printed forms outside this screen if your process requires it.
            </p>

            {error && <div className="alert alert-warning">{error}</div>}

            {company && (
                <div className="card mb-4" style={{ maxWidth: 520 }}>
                    <div className="card-body">
                        <dl className="row mb-0 small">
                            <dt className="col-sm-4">Code</dt>
                            <dd className="col-sm-8">{company.companyCode ?? "—"}</dd>
                            <dt className="col-sm-4">Name</dt>
                            <dd className="col-sm-8">{company.name ?? "—"}</dd>
                            <dt className="col-sm-4">Short name</dt>
                            <dd className="col-sm-8">{company.shortName ?? "—"}</dd>
                            <dt className="col-sm-4">Reporting currency</dt>
                            <dd className="col-sm-8">PHP (₱)</dd>
                        </dl>
                    </div>
                </div>
            )}

            <PhComplianceCard />
        </div>
    );
}
