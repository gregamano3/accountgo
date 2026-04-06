import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import AppShell from "../components/Layout/AppShell";
import PageFallback from "../components/Layout/PageFallback";

const Login = lazy(() => import("../pages/Login"));
const DashboardHome = lazy(() => import("../pages/DashboardHome"));
const JournalEntry = lazy(() => import("../components/Financials/JournalEntry"));
const PurchaseInvoicePage = lazy(() => import("../components/Purchasing/PurchaseInvoicePage"));
const ObservedAddPurchaseOrder = lazy(() => import("../components/Purchasing/PurchaseOrder"));
const ObservedSalesInvoice = lazy(() => import("../components/Sales/SalesInvoice"));
const ObservedSalesOrder = lazy(() => import("../components/Sales/SalesOrder"));
const AdminAuditLogsPage = lazy(() => import("../pages/AdminAuditLogsPage"));
const AdminGroupsPage = lazy(() => import("../pages/AdminGroupsPage"));
const AdminRolesPage = lazy(() => import("../pages/AdminRolesPage"));
const AdminUsersPage = lazy(() => import("../pages/AdminUsersPage"));
const BalanceSheetPage = lazy(() => import("../pages/BalanceSheetPage"));
const BanksPage = lazy(() => import("../pages/BanksPage"));
const ChartOfAccountsPage = lazy(() => import("../pages/ChartOfAccountsPage"));
const CompanyPage = lazy(() => import("../pages/CompanyPage"));
const ContactsPage = lazy(() => import("../pages/ContactsPage"));
const CustomerDetailPage = lazy(() => import("../pages/CustomerDetailPage"));
const CustomersPage = lazy(() => import("../pages/CustomersPage"));
const GeneralLedgerPage = lazy(() => import("../pages/GeneralLedgerPage"));
const IncomeStatementPage = lazy(() => import("../pages/IncomeStatementPage"));
const InventoryIcjPage = lazy(() => import("../pages/InventoryIcjPage"));
const InventoryItemsPage = lazy(() => import("../pages/InventoryItemsPage"));
const ItemDetailPage = lazy(() => import("../pages/ItemDetailPage"));
const ItemTaxGroupsPage = lazy(() => import("../pages/ItemTaxGroupsPage"));
const JournalEntriesListPage = lazy(() => import("../pages/JournalEntriesListPage"));
const MvcPlaceholderPage = lazy(() => import("../pages/MvcPlaceholderPage"));
const PurchaseInvoicesListPage = lazy(() => import("../pages/PurchaseInvoicesListPage"));
const PurchaseOrdersListPage = lazy(() => import("../pages/PurchaseOrdersListPage"));
const QuotationsListPage = lazy(() => import("../pages/QuotationsListPage"));
const SalesInvoicesListPage = lazy(() => import("../pages/SalesInvoicesListPage"));
const SalesOrdersListPage = lazy(() => import("../pages/SalesOrdersListPage"));
const SalesReceiptsListPage = lazy(() => import("../pages/SalesReceiptsListPage"));
const SystemSetupPage = lazy(() => import("../pages/SystemSetupPage"));
const TaxesPage = lazy(() => import("../pages/TaxesPage"));
const TaxGroupsPage = lazy(() => import("../pages/TaxGroupsPage"));
const TrialBalancePage = lazy(() => import("../pages/TrialBalancePage"));
const VendorDetailPage = lazy(() => import("../pages/VendorDetailPage"));
const VendorPaymentPage = lazy(() => import("../pages/VendorPaymentPage"));
const VendorsPage = lazy(() => import("../pages/VendorsPage"));

export const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <Suspense fallback={<PageFallback />}>
                <Login />
            </Suspense>
        ),
    },
    {
        path: "/",
        element: (
            <RequireAuth>
                <AppShell />
            </RequireAuth>
        ),
        children: [
            { index: true, element: <DashboardHome /> },

            { path: "journal-entry", element: <JournalEntry /> },
            { path: "journal-entries", element: <JournalEntriesListPage /> },
            { path: "accounts", element: <ChartOfAccountsPage /> },
            { path: "general-ledger", element: <GeneralLedgerPage /> },
            { path: "banks", element: <BanksPage /> },
            { path: "trial-balance", element: <TrialBalancePage /> },
            { path: "balance-sheet", element: <BalanceSheetPage /> },
            { path: "income-statement", element: <IncomeStatementPage /> },

            { path: "sales-invoices", element: <SalesInvoicesListPage /> },
            { path: "sales-invoice", element: <ObservedSalesInvoice /> },
            { path: "sales-order", element: <ObservedSalesOrder /> },
            { path: "sales-orders", element: <SalesOrdersListPage /> },
            { path: "sales-receipts", element: <SalesReceiptsListPage /> },
            { path: "quotations", element: <QuotationsListPage /> },
            { path: "customers", element: <CustomersPage /> },
            { path: "customers/:customerId", element: <CustomerDetailPage /> },

            { path: "purchase-order", element: <ObservedAddPurchaseOrder /> },
            { path: "purchase-orders", element: <PurchaseOrdersListPage /> },
            { path: "purchasing-invoice", element: <PurchaseInvoicePage /> },
            { path: "purchase-invoices", element: <PurchaseInvoicesListPage /> },
            { path: "vendors", element: <VendorsPage /> },
            { path: "vendors/:vendorId", element: <VendorDetailPage /> },
            { path: "vendor-payment", element: <VendorPaymentPage /> },
            { path: "mvc/payment", element: <Navigate to="/vendor-payment" replace /> },

            { path: "inventory", element: <InventoryItemsPage /> },
            { path: "inventory/icj", element: <InventoryIcjPage /> },
            { path: "inventory/item/:itemId", element: <ItemDetailPage /> },

            { path: "contacts", element: <ContactsPage /> },

            { path: "taxes", element: <TaxesPage /> },
            { path: "tax/tax-groups", element: <TaxGroupsPage /> },
            { path: "tax/item-tax-groups", element: <ItemTaxGroupsPage /> },

            { path: "company", element: <CompanyPage /> },

            { path: "admin/users", element: <AdminUsersPage /> },
            { path: "admin/roles", element: <AdminRolesPage /> },
            { path: "admin/groups", element: <AdminGroupsPage /> },
            { path: "admin/audit-logs", element: <AdminAuditLogsPage /> },

            { path: "system/setup", element: <SystemSetupPage /> },

            {
                path: "donation-invoices",
                element: (
                    <MvcPlaceholderPage title="Donation invoices" mvcPath="/Sales/DonationInvoices">
                        <p className="small text-muted mb-0">
                            No separate donation API module in this repo; use sales invoices or extend the API.
                        </p>
                    </MvcPlaceholderPage>
                ),
            },
            {
                path: "mvc/settings",
                element: (
                    <MvcPlaceholderPage title="GL / company settings" mvcPath="/Administration/Settings">
                        <p className="small text-muted mb-0">
                            Use Company in this app for basic profile; full GL settings remain in MVC until exposed via
                            API.
                        </p>
                    </MvcPlaceholderPage>
                ),
            },
        ],
    },
]);
