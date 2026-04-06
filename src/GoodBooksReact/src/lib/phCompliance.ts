import * as accounting from "accounting";

/** ISO 4217 — Philippine Peso */
export const PH_CURRENCY_CODE = "PHP";

/** Typical BIR VAT rate for VAT-registered businesses (verify with your RDO). */
export const PH_STANDARD_VAT_PERCENT = 12;

/**
 * Non-exhaustive reminders for Philippine tax / BIR context.
 * This app does not provide tax or legal advice; keep records aligned with your CPA and RDO.
 */
export const phComplianceSummary = {
    currency: "Books and reports use Philippine Peso (PHP / ₱).",
    vat: `VAT-inclusive pricing often uses a ${PH_STANDARD_VAT_PERCENT}% VAT component; confirm registration category (VAT, non-VAT, zero-rated, exempt).`,
    documents:
        "Use BIR-registered invoices/official receipts and ATP-compliant printing where required; show TIN and registered business name/address on customer-facing documents.",
    withholding:
        "Expanded withholding (e.g. BIR Form 2307) and EWT must be supported by certificates and mapped to the correct accounts.",
    bir: "Reporting (e.g. QAP, SLSP, annual ITR) is outside this UI—export balances and work with your accountant.",
} as const;

export function formatMoneyPhp(amount: number | string | undefined | null): string {
    const n = typeof amount === "number" ? amount : parseFloat(String(amount ?? 0));
    const v = Number.isFinite(n) ? n : 0;
    return accounting.formatMoney(v, {
        symbol: "₱",
        format: "%s%v",
        thousand: ",",
        precision: 2,
    });
}
