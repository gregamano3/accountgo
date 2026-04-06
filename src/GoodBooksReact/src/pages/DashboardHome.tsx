import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import PhComplianceCard from "../components/Compliance/PhComplianceCard";
import { formatMoneyPhp, phComplianceSummary } from "../lib/phCompliance";

type MonthlySales = {
    month?: string;
    amount?: number;
};

export default function DashboardHome() {
    const [monthly, setMonthly] = useState<MonthlySales[]>([]);
    const [salesErr, setSalesErr] = useState(false);

    useEffect(() => {
        let cancelled = false;
        apiClient
            .get<MonthlySales[]>("sales/getmonthlysales")
            .then((res) => {
                if (!cancelled) {
                    setMonthly(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setSalesErr(true);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="p-4 p-lg-5">
            <header className="mb-4 pb-3 border-bottom border-light">
                <h1 className="h3 fw-semibold text-dark mb-2">Dashboard</h1>
                <p className="lead text-secondary small mb-0">
                    Philippine Peso (PHP) books — {phComplianceSummary.currency}
                </p>
            </header>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <h2 className="h6 text-uppercase fw-semibold text-secondary mb-3 small letter-spacing">
                                Sales &amp; AR
                            </h2>
                            <ul className="list-unstyled small mb-0">
                                <li className="mb-1">
                                    <Link to="/quotations">Quotations</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/sales-orders">Sales orders</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/sales-invoices">Sales invoices</Link>{" "}
                                    <span className="text-muted">(</span>
                                    <Link to="/sales-invoice" className="text-muted">
                                        new
                                    </Link>
                                    <span className="text-muted">)</span>
                                </li>
                                <li className="mb-1">
                                    <Link to="/sales-receipts">Sales receipts</Link>
                                </li>
                                <li className="mb-0">
                                    <Link to="/customers">Customers</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <h2 className="h6 text-uppercase fw-semibold text-secondary mb-3 small letter-spacing">
                                Purchasing &amp; AP
                            </h2>
                            <ul className="list-unstyled small mb-0">
                                <li className="mb-1">
                                    <Link to="/purchase-orders">Purchase orders</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/purchase-invoices">Purchase invoices</Link>{" "}
                                    <span className="text-muted">(</span>
                                    <Link to="/purchasing-invoice" className="text-muted">
                                        new
                                    </Link>
                                    <span className="text-muted">)</span>
                                </li>
                                <li className="mb-1">
                                    <Link to="/vendors">Vendors</Link>
                                </li>
                                <li className="mb-0">
                                    <Link to="/vendor-payment">Vendor payment</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <h2 className="h6 text-uppercase fw-semibold text-secondary mb-3 small letter-spacing">
                                Financials &amp; tax
                            </h2>
                            <ul className="list-unstyled small mb-0">
                                <li className="mb-1">
                                    <Link to="/journal-entry">Journal entry</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/trial-balance">Trial balance</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/balance-sheet">Balance sheet</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/income-statement">Income statement</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/taxes">Tax codes</Link>
                                </li>
                                <li className="mb-1">
                                    <Link to="/tax/tax-groups">Tax groups</Link>
                                </li>
                                <li className="mb-0">
                                    <Link to="/company">Company</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h2 className="h6 text-uppercase fw-semibold text-secondary mb-3 small letter-spacing">
                                Quick links
                            </h2>
                            <ul className="list-unstyled small mb-0 row g-2">
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/accounts">Chart of accounts</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/general-ledger">General ledger</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/journal-entries">Journal entries</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/banks">Banks &amp; cash</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/vendor-payment">Vendor payment</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/inventory">Inventory items</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/inventory/icj">Inventory ICJ</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/contacts">Contacts</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/tax/item-tax-groups">Item tax groups</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/admin/users">Administration</Link>
                                </li>
                                <li className="col-md-4 col-lg-3">
                                    <Link to="/system/setup">Database setup</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header border-0 bg-transparent small fw-semibold py-3">
                    Monthly sales (invoiced lines, YTD months)
                </div>
                <div className="card-body pt-0">
                    {salesErr && (
                        <p className="text-secondary small mb-0">
                            Monthly sales could not be loaded (needs posted sales data).
                        </p>
                    )}
                    {!salesErr && monthly.length === 0 && <p className="text-secondary small mb-0">No data yet.</p>}
                    {monthly.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-sm table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th className="text-secondary fw-semibold small">Month</th>
                                        <th className="text-end text-secondary fw-semibold small">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthly.map((m, i) => (
                                        <tr key={`${m.month}-${i}`}>
                                            <td>{m.month}</td>
                                            <td className="text-end">{formatMoneyPhp(m.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <PhComplianceCard />
        </div>
    );
}
