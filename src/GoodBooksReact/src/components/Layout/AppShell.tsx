import { Suspense, useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import PageFallback from "./PageFallback";

const STORAGE_SIDEBAR = "gb_sidebar_collapsed";
const STORAGE_SECTIONS = "gb_nav_sections";

type NavItem = {
    to: string;
    icon: string;
    label: string;
    end?: boolean;
    link?: "a"; // use <Link> instead of NavLink (no active match)
};

const TOP_ITEMS: NavItem[] = [
    { to: "/", icon: "fa-dashboard", label: "Dashboard", end: true },
    { to: "/system/setup", icon: "fa-database", label: "DB setup", link: "a" },
];

const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
    {
        id: "ar",
        title: "Accounts receivable",
        items: [
            { to: "/quotations", icon: "fa-file-text-o", label: "Quotations" },
            { to: "/sales-orders", icon: "fa-shopping-cart", label: "Sales orders" },
            { to: "/sales-invoices", icon: "fa-files-o", label: "Sales invoices" },
            { to: "/sales-invoice", icon: "fa-pencil-square-o", label: "New / edit sales invoice" },
            { to: "/sales-receipts", icon: "fa-credit-card", label: "Sales receipts" },
            { to: "/customers", icon: "fa-users", label: "Customers" },
            { to: "/donation-invoices", icon: "fa-heart", label: "Donation invoices (MVC)" },
        ],
    },
    {
        id: "ap",
        title: "Accounts payable",
        items: [
            { to: "/purchase-orders", icon: "fa-clipboard", label: "Purchase orders" },
            { to: "/purchase-invoices", icon: "fa-file-o", label: "Purchase invoices" },
            { to: "/purchasing-invoice", icon: "fa-plus-square", label: "New / edit purchase invoice" },
            { to: "/vendors", icon: "fa-truck", label: "Vendors" },
            { to: "/vendor-payment", icon: "fa-money", label: "Vendor payment" },
        ],
    },
    {
        id: "inv",
        title: "Inventory",
        items: [
            { to: "/inventory", icon: "fa-cubes", label: "Items" },
            { to: "/inventory/icj", icon: "fa-book", label: "Inventory control journal" },
        ],
    },
    {
        id: "fin",
        title: "Financials",
        items: [
            { to: "/journal-entries", icon: "fa-list-ul", label: "Journal entries" },
            { to: "/journal-entry", icon: "fa-plus-circle", label: "New / edit journal entry" },
            { to: "/general-ledger", icon: "fa-sitemap", label: "General ledger" },
            { to: "/accounts", icon: "fa-table", label: "Chart of accounts" },
            { to: "/banks", icon: "fa-university", label: "Banks" },
            { to: "/taxes", icon: "fa-percent", label: "Taxes" },
            { to: "/tax/tax-groups", icon: "fa-tags", label: "Tax groups" },
            { to: "/tax/item-tax-groups", icon: "fa-tag", label: "Item tax groups" },
        ],
    },
    {
        id: "rep",
        title: "Reports",
        items: [
            { to: "/trial-balance", icon: "fa-columns", label: "Trial balance" },
            { to: "/balance-sheet", icon: "fa-pie-chart", label: "Balance sheet" },
            { to: "/income-statement", icon: "fa-line-chart", label: "Income statement" },
        ],
    },
    {
        id: "org",
        title: "Organization",
        items: [
            { to: "/company", icon: "fa-building", label: "Company" },
            { to: "/mvc/settings", icon: "fa-cogs", label: "GL settings (MVC)" },
            { to: "/contacts", icon: "fa-address-book", label: "Contacts" },
        ],
    },
    {
        id: "adm",
        title: "Administration",
        items: [
            { to: "/admin/users", icon: "fa-user", label: "Users" },
            { to: "/admin/roles", icon: "fa-shield", label: "Roles" },
            { to: "/admin/groups", icon: "fa-users", label: "Groups" },
            { to: "/admin/audit-logs", icon: "fa-history", label: "Audit logs" },
        ],
    },
];

const DEFAULT_SECTION_OPEN: Record<string, boolean> = Object.fromEntries(
    NAV_SECTIONS.map((s) => [s.id, true])
);

function loadSectionOpen(): Record<string, boolean> {
    try {
        const raw = sessionStorage.getItem(STORAGE_SECTIONS);
        if (raw) {
            const parsed = JSON.parse(raw) as Record<string, boolean>;
            return { ...DEFAULT_SECTION_OPEN, ...parsed };
        }
    } catch {
        /* ignore */
    }
    return { ...DEFAULT_SECTION_OPEN };
}

function NavIcon({ name, collapsed }: { name: string; collapsed: boolean }) {
    return <i className={`fa ${name} fa-fw ${collapsed ? "" : "me-2"} opacity-75`} aria-hidden />;
}

function sidebarNavClass(isActive: boolean, collapsed: boolean) {
    return [
        "nav-link py-2 rounded-3 text-decoration-none d-flex align-items-center fw-normal",
        collapsed ? "px-2 justify-content-center" : "px-3",
        isActive ? "active bg-primary-subtle text-primary" : "text-body-secondary",
    ].join(" ");
}

export default function AppShell() {
    const { email, clearSession } = useAuth();
    const navigate = useNavigate();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return sessionStorage.getItem(STORAGE_SIDEBAR) === "1";
        } catch {
            return false;
        }
    });

    const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>(loadSectionOpen);

    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_SIDEBAR, sidebarCollapsed ? "1" : "0");
        } catch {
            /* ignore */
        }
    }, [sidebarCollapsed]);

    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_SECTIONS, JSON.stringify(sectionOpen));
        } catch {
            /* ignore */
        }
    }, [sectionOpen]);

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed((c) => !c);
    }, []);

    const toggleSection = useCallback((id: string) => {
        setSectionOpen((prev) => {
            const isOpen = prev[id] !== false;
            return { ...prev, [id]: !isOpen };
        });
    }, []);

    function logout() {
        clearSession();
        navigate("/login", { replace: true });
    }

    function renderNavItem(item: NavItem) {
        const { to, icon, label, end, link } = item;
        const title = sidebarCollapsed ? label : undefined;
        const inner = (
            <>
                <NavIcon name={icon} collapsed={sidebarCollapsed} />
                <span className={sidebarCollapsed ? "visually-hidden" : undefined}>{label}</span>
            </>
        );
        if (link === "a") {
            return (
                <Link to={to} className={sidebarNavClass(false, sidebarCollapsed)} title={title}>
                    {inner}
                </Link>
            );
        }
        return (
            <NavLink
                end={end}
                to={to}
                title={title}
                className={({ isActive }) => sidebarNavClass(isActive, sidebarCollapsed)}
            >
                {inner}
            </NavLink>
        );
    }

    return (
        <div className="h-100 d-flex flex-column bg-body overflow-hidden">
            <header className="app-top-header flex-shrink-0 bg-white border-bottom shadow-sm px-2 px-md-3 py-3 d-flex align-items-center position-sticky top-0">
                <button
                    type="button"
                    className="btn btn-light border-0 rounded-3 p-2 me-1 me-md-2"
                    onClick={toggleSidebar}
                    aria-expanded={!sidebarCollapsed}
                    aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <i className={`fa fa-${sidebarCollapsed ? "angle-double-right" : "angle-double-left"} text-secondary`} aria-hidden />
                </button>
                <div className="d-flex align-items-center gap-2 gap-md-3 min-w-0 flex-grow-1">
                    <Link to="/" className="text-decoration-none text-body text-truncate">
                        <span className="fw-semibold fs-5">GoodBooks</span>
                    </Link>
                    <span className="text-muted small d-none d-lg-inline border-start ps-3 flex-shrink-0">
                        AccountGo · Philippines (PHP)
                    </span>
                </div>
                <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto flex-shrink-0">
                    {email && (
                        <span className="small text-secondary text-truncate d-none d-sm-inline" style={{ maxWidth: "12rem" }} title={email}>
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
                    className={`app-sidebar border-end bg-body-tertiary flex-shrink-0 py-2 overflow-y-auto min-vh-0 ${sidebarCollapsed ? "app-sidebar-collapsed" : ""}`}
                    style={{
                        width: sidebarCollapsed ? 56 : 280,
                        transition: "width 0.2s ease",
                    }}
                >
                    <nav className="nav flex-column small pb-3">
                        {TOP_ITEMS.map((item) => (
                            <div key={item.to}>{renderNavItem(item)}</div>
                        ))}
                        {NAV_SECTIONS.map((section) => (
                            <div key={section.id}>
                                {!sidebarCollapsed && (
                                    <button
                                        type="button"
                                        className="nav-section-heading w-100 text-start border-0 bg-transparent text-uppercase fw-bold mb-1 mt-3 px-3 py-1 small text-dark d-flex align-items-center justify-content-between gap-1"
                                        style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}
                                        onClick={() => toggleSection(section.id)}
                                        aria-expanded={sectionOpen[section.id] !== false}
                                    >
                                        <span>{section.title}</span>
                                        <i
                                            className={`fa fa-chevron-${sectionOpen[section.id] !== false ? "down" : "right"} opacity-50`}
                                            style={{ fontSize: "0.6rem" }}
                                            aria-hidden
                                        />
                                    </button>
                                )}
                                {(sidebarCollapsed || sectionOpen[section.id] !== false) && (
                                    <div className={sidebarCollapsed ? "d-flex flex-column" : undefined}>
                                        {section.items.map((item) => (
                                            <div key={item.to}>{renderNavItem(item)}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
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
