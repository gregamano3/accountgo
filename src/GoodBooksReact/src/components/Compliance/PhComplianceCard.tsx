import { phComplianceSummary } from "../../lib/phCompliance";

/** Static PH context for operators (not legal/tax advice). */
export default function PhComplianceCard() {
    return (
        <div className="card border-info mb-4">
            <div className="card-header bg-info bg-opacity-10 small fw-semibold">Philippines compliance — quick reference</div>
            <div className="card-body small text-muted">
                <ul className="mb-0 ps-3">
                    <li>{phComplianceSummary.currency}</li>
                    <li>{phComplianceSummary.vat}</li>
                    <li>{phComplianceSummary.documents}</li>
                    <li>{phComplianceSummary.withholding}</li>
                    <li>{phComplianceSummary.bir}</li>
                </ul>
            </div>
        </div>
    );
}
