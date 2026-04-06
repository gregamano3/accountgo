import { Suspense } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import PageFallback from "./PageFallback";

function sidebarNavClass({ isActive }: { isActive: boolean }) {
    return [
        "nav-link py-2 px-3 rounded-3 text-decoration-none d-flex align-items-center",
        isActive ? "active fw-semibold bg-primary-subtle text-primary" : "text-body-secondary",
    ].join(" ");
}

function NavIcon({ name }: { name: string }) {
    return <i className={`fa ${name} fa-fw me-2 opacity-75`} aria-hidden />;
}

function navSectionLabel(text: string) {
    return (
        <div
            className="text-uppercase fw-semibold mb-2 mt-3 px-3 small text-muted"
            style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}
        >
            {text}
        </div>
    );
}

export default function AppShell() {
    const { email, clearSession } = useAuth();
    const navigate = useNavigate();

    function logout() {
        clearSession();
        navigate("/login", { replace: true });
    }

    return (
        <div className="h-100 d-flex flex-column bg-body overflow-hidden">
            <header className="app-top-header flex-shrink-0 bg-white border-bottom shadow-sm px-3 px-md-4 py-3 d-flex align-items-center position-sticky top-0">
                <div className="d-flex align-items-center gap-2 gap-md-3 min-w-0">
                    <Link to="/" className="text-decoration-none text-body">
                        <span className="fw-semibold fs-5">GoodBooks</span>
                    </Link>
                    <span className="text-muted small d-none d-md-inline border-start ps-3">
                        AccountGo · Philippines (PHP)
                    </span>
                </div>
                <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
                    {email && (
                        <span className="small text-secondary text-truncate" style={{ maxWidth: "12rem" }} title={email}>
                            {email}
                        </span>
                    )}
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={logout}>
                        Sign out
                    </button>
                </div>
            </header>
            <div className="d-flex flex-grow-1 min-vh-0 overflow-hidden">
                <aside
                    className="app-sidebar border-end bg-body-tertiary flex-shrink-0 py-2 px-2 overflow-y-auto min-vh-0"
                    style={{ width: 280 }}
                >
                    <nav className="nav flex-column small pb-3">
                        <NavLink end className={sidebarNavClass} to="/">
                            <NavIcon name="fa-dashboard" />
                            Dashboard
                        </NavLink>
                        <Link
                            className="nav-link py-2 px-3 rounded-3 text-decoration-none text-body-secondary d-flex align-items-center"
                            to="/system/setup"
                        >
                            <NavIcon name="fa-database" />
                            DB setup
                        </Link>
                        {navSectionLabel("Accounts receivable")}
                        <NavLink className={sidebarNavClass} to="/quotations">
                            <NavIcon name="fa-file-text-o" />
                            Quotations
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/sales-orders">
                            <NavIcon name="fa-shopping-cart" />
                            Sales orders
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/sales-invoices">
                            <NavIcon name="fa-files-o" />
                            Sales invoices
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/sales-invoice">
                            <NavIcon name="fa-pencil-square-o" />
                            New / edit sales invoice
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/sales-receipts">
                            <NavIcon name="fa-credit-card" />
                            Sales receipts
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/customers">
                            <NavIcon name="fa-users" />
                            Customers
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/donation-invoices">
                            <NavIcon name="fa-heart" />
                            Donation invoices (MVC)
                        </NavLink>
                        {navSectionLabel("Accounts payable")}
                        <NavLink className={sidebarNavClass} to="/purchase-orders">
                            <NavIcon name="fa-clipboard" />
                            Purchase orders
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/purchase-invoices">
                            <NavIcon name="fa-file-o" />
                            Purchase invoices
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/purchasing-invoice">
                            <NavIcon name="fa-plus-square" />
                            New / edit purchase invoice
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/vendors">
                            <NavIcon name="fa-truck" />
                            Vendors
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/vendor-payment">
                            <NavIcon name="fa-money" />
                            Vendor payment
                        </NavLink>
                        {navSectionLabel("Inventory")}
                        <NavLink className={sidebarNavClass} to="/inventory">
                            <NavIcon name="fa-cubes" />
                            Items
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/inventory/icj">
                            <NavIcon name="fa-book" />
                            Inventory control journal
                        </NavLink>
                        {navSectionLabel("Financials")}
                        <NavLink className={sidebarNavClass} to="/journal-entries">
                            <NavIcon name="fa-list-ul" />
                            Journal entries
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/journal-entry">
                            <NavIcon name="fa-plus-circle" />
                            New / edit journal entry
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/general-ledger">
                            <NavIcon name="fa-sitemap" />
                            General ledger
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/accounts">
                            <NavIcon name="fa-table" />
                            Chart of accounts
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/banks">
                            <NavIcon name="fa-university" />
                            Banks
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/taxes">
                            <NavIcon name="fa-percent" />
                            Taxes
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/tax/tax-groups">
                            <NavIcon name="fa-tags" />
                            Tax groups
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/tax/item-tax-groups">
                            <NavIcon name="fa-tag" />
                            Item tax groups
                        </NavLink>
                        {navSectionLabel("Reports")}
                        <NavLink className={sidebarNavClass} to="/trial-balance">
                            <NavIcon name="fa-columns" />
                            Trial balance
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/balance-sheet">
                            <NavIcon name="fa-pie-chart" />
                            Balance sheet
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/income-statement">
                            <NavIcon name="fa-line-chart" />
                            Income statement
                        </NavLink>
                        {navSectionLabel("Organization")}
                        <NavLink className={sidebarNavClass} to="/company">
                            <NavIcon name="fa-building" />
                            Company
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/mvc/settings">
                            <NavIcon name="fa-cogs" />
                            GL settings (MVC)
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/contacts">
                            <NavIcon name="fa-address-book" />
                            Contacts
                        </NavLink>
                        {navSectionLabel("Administration")}
                        <NavLink className={sidebarNavClass} to="/admin/users">
                            <NavIcon name="fa-user" />
                            Users
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/admin/roles">
                            <NavIcon name="fa-shield" />
                            Roles
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/admin/groups">
                            <NavIcon name="fa-users" />
                            Groups
                        </NavLink>
                        <NavLink className={sidebarNavClass} to="/admin/audit-logs">
                            <NavIcon name="fa-history" />
                            Audit logs
                        </NavLink>
                    </nav>
                </aside>
                <main className="flex-grow-1 min-vh-0 min-w-0 overflow-y-auto app-main-content">
                    <Suspense fallback={<PageFallback />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
