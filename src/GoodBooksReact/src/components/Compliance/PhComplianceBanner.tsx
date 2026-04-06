import { PH_STANDARD_VAT_PERCENT } from "../../lib/phCompliance";

/** One-line reminder for transactional screens (invoices, POs). */
export default function PhComplianceBanner() {
    return (
        <div className="alert alert-info py-2 small mb-3" role="status">
            Philippines: amounts in <strong>PHP (₱)</strong>. VAT often shown at <strong>{PH_STANDARD_VAT_PERCENT}%</strong> for
            VAT-registered sellers—confirm with your RDO and CPA; use BIR-compliant invoices/OR for customers.
        </div>
    );
}
