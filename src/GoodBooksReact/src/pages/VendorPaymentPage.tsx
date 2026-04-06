import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { formatMoneyPhp } from "../lib/phCompliance";

type VendorRow = { id: number; name?: string; no?: string };
type BankRow = { id: number; name?: string; bankName?: string; accountNo?: string };
type InvoiceRow = {
    id: number;
    vendorId?: number;
    no?: string;
    vendorName?: string;
    invoiceDate?: string;
    posted?: boolean;
    isPaid?: boolean;
    amount?: number;
    amountPaid?: number;
};

function parseErrors(data: unknown): string {
    if (typeof data === "string") {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(String).join(" ");
    }
    if (data && typeof data === "object" && "message" in data) {
        return String((data as { message: unknown }).message);
    }
    return "Payment could not be saved.";
}

export default function VendorPaymentPage() {
    const [vendors, setVendors] = useState<VendorRow[]>([]);
    const [banks, setBanks] = useState<BankRow[]>([]);
    const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
    const [loadErr, setLoadErr] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState<string | null>(null);
    const [saveOk, setSaveOk] = useState(false);

    const [vendorId, setVendorId] = useState<number | "">("");
    const [invoiceId, setInvoiceId] = useState<number | "">("");
    const [accountId, setAccountId] = useState<number | "">("");
    const [amountToPay, setAmountToPay] = useState("");
    const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));

    useEffect(() => {
        let c = false;
        setLoadErr(null);
        Promise.all([
            apiClient.get<VendorRow[]>("purchasing/vendors"),
            apiClient.get<BankRow[]>("financials/cashbanks"),
            apiClient.get<InvoiceRow[]>("purchasing/purchaseinvoices"),
        ])
            .then(([v, b, inv]) => {
                if (c) {
                    return;
                }
                setVendors(Array.isArray(v.data) ? v.data : []);
                setBanks(Array.isArray(b.data) ? b.data : []);
                setInvoices(Array.isArray(inv.data) ? inv.data : []);
            })
            .catch(() => {
                if (!c) {
                    setLoadErr("Could not load vendors, banks, or purchase invoices.");
                }
            });
        return () => {
            c = true;
        };
    }, []);

    const payableForVendor = useMemo(() => {
        if (vendorId === "") {
            return [];
        }
        return invoices.filter(
            (inv) =>
                inv.vendorId === vendorId &&
                inv.posted === true &&
                inv.isPaid !== true &&
                (inv.amount ?? 0) - (inv.amountPaid ?? 0) > 0.0001
        );
    }, [invoices, vendorId]);

    const selectedInvoice = useMemo(() => {
        if (invoiceId === "") {
            return undefined;
        }
        return invoices.find((i) => i.id === invoiceId);
    }, [invoices, invoiceId]);

    useEffect(() => {
        if (invoiceId === "" || !selectedInvoice) {
            return;
        }
        const remaining =
            (selectedInvoice.amount ?? 0) - (selectedInvoice.amountPaid ?? 0);
        setAmountToPay(remaining > 0 ? remaining.toFixed(2) : "");
    }, [invoiceId, selectedInvoice]);

    function onVendorChange(id: string) {
        setSaveOk(false);
        setSaveErr(null);
        setInvoiceId("");
        setVendorId(id === "" ? "" : Number(id));
    }

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        setSaveErr(null);
        setSaveOk(false);
        if (vendorId === "" || invoiceId === "" || accountId === "") {
            setSaveErr("Choose vendor, invoice, and bank account.");
            return;
        }
        const amt = Number.parseFloat(amountToPay);
        if (!Number.isFinite(amt) || amt <= 0) {
            setSaveErr("Enter a positive amount.");
            return;
        }
        setSaving(true);
        apiClient
            .post("purchasing/savepayment", {
                invoiceId,
                vendorId,
                accountId,
                amountToPay: amt,
                date: new Date(payDate + "T12:00:00").toISOString(),
            })
            .then(() => {
                setSaveOk(true);
                return apiClient.get<InvoiceRow[]>("purchasing/purchaseinvoices");
            })
            .then((res) => {
                setInvoices(Array.isArray(res.data) ? res.data : []);
                setInvoiceId("");
                setAmountToPay("");
            })
            .catch((err: { response?: { data?: unknown } }) => {
                const data = err.response?.data;
                setSaveErr(parseErrors(data));
            })
            .finally(() => {
                setSaving(false);
            });
    }

    return (
        <div className="p-4">
            <h1 className="h4 mb-2">Vendor payment</h1>
            <p className="text-muted small mb-3">
                Record a payment against a posted purchase invoice using a cash or bank account. Amounts in PHP (₱).
            </p>

            {loadErr && <div className="alert alert-danger py-2">{loadErr}</div>}
            {saveOk && (
                <div className="alert alert-success py-2">
                    Payment saved. Invoice list was refreshed.
                </div>
            )}
            {saveErr && <div className="alert alert-danger py-2">{saveErr}</div>}

            <form className="card shadow-sm" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label" htmlFor="vp-vendor">
                            Vendor
                        </label>
                        <select
                            id="vp-vendor"
                            className="form-select form-select-sm"
                            value={vendorId === "" ? "" : String(vendorId)}
                            onChange={(e) => onVendorChange(e.target.value)}
                            disabled={!!loadErr}
                        >
                            <option value="">Select vendor…</option>
                            {vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.no ? `${v.no} — ` : ""}
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="vp-inv">
                            Purchase invoice (posted, balance due)
                        </label>
                        <select
                            id="vp-inv"
                            className="form-select form-select-sm"
                            value={invoiceId === "" ? "" : String(invoiceId)}
                            onChange={(e) => {
                                setSaveOk(false);
                                setSaveErr(null);
                                setInvoiceId(e.target.value === "" ? "" : Number(e.target.value));
                            }}
                            disabled={vendorId === "" || payableForVendor.length === 0}
                        >
                            <option value="">
                                {vendorId === ""
                                    ? "Select a vendor first…"
                                    : payableForVendor.length === 0
                                      ? "No open invoices"
                                      : "Select invoice…"}
                            </option>
                            {payableForVendor.map((inv) => {
                                const rem = (inv.amount ?? 0) - (inv.amountPaid ?? 0);
                                return (
                                    <option key={inv.id} value={inv.id}>
                                        {inv.no} — {inv.invoiceDate ? String(inv.invoiceDate).slice(0, 10) : ""}{" "}
                                        (due {formatMoneyPhp(rem)})
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {selectedInvoice && (
                        <p className="small text-muted mb-3">
                            Invoice total {formatMoneyPhp(selectedInvoice.amount)} · Paid{" "}
                            {formatMoneyPhp(selectedInvoice.amountPaid)} · Remaining{" "}
                            <strong>
                                {formatMoneyPhp(
                                    (selectedInvoice.amount ?? 0) - (selectedInvoice.amountPaid ?? 0)
                                )}
                            </strong>
                        </p>
                    )}

                    <div className="mb-3">
                        <label className="form-label" htmlFor="vp-bank">
                            Pay from (bank / cash)
                        </label>
                        <select
                            id="vp-bank"
                            className="form-select form-select-sm"
                            value={accountId === "" ? "" : String(accountId)}
                            onChange={(e) =>
                                setAccountId(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            disabled={!!loadErr}
                        >
                            <option value="">Select account…</option>
                            {banks.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                    {b.bankName ? ` (${b.bankName})` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <label className="form-label" htmlFor="vp-amt">
                                Amount to pay
                            </label>
                            <input
                                id="vp-amt"
                                type="text"
                                inputMode="decimal"
                                className="form-control form-control-sm"
                                value={amountToPay}
                                onChange={(e) => setAmountToPay(e.target.value)}
                                disabled={invoiceId === ""}
                            />
                        </div>
                        <div className="col-6">
                            <label className="form-label" htmlFor="vp-date">
                                Date
                            </label>
                            <input
                                id="vp-date"
                                type="date"
                                className="form-control form-control-sm"
                                value={payDate}
                                onChange={(e) => setPayDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={saving || !!loadErr}
                    >
                        {saving ? "Saving…" : "Save payment"}
                    </button>
                </div>
            </form>

            <p className="small text-muted mt-3 mb-0">
                <Link to="/purchase-invoices">Purchase invoices</Link>
                {" · "}
                <Link to="/vendors">Vendors</Link>
                {" · "}
                <a href="/Purchasing/Payment" target="_blank" rel="noreferrer">
                    Legacy MVC screen
                </a>{" "}
                (optional)
            </p>
        </div>
    );
}
