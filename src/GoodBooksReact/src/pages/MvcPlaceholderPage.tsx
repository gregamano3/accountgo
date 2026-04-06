import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
    title: string;
    mvcPath: string;
    children?: ReactNode;
};

/**
 * Screens that exist in AccountGoWeb (Razor) but have no dedicated SPA editor yet,
 * or rely on server views (e.g. donation invoices).
 */
export default function MvcPlaceholderPage({ title, mvcPath, children }: Props) {
    return (
        <div className="p-4">
            <h1 className="h4 mb-3">{title}</h1>
            <div className="alert alert-secondary small">
                <p className="mb-2">
                    This workflow is available in the <strong>AccountGoWeb</strong> MVC app at{" "}
                    <code className="user-select-all">{mvcPath}</code> (same API backend).
                </p>
                <p className="mb-0">
                    The React app lists and opens core transactions; full parity for every Razor form will be migrated incrementally.
                </p>
            </div>
            {children}
            <p className="mt-3 mb-0">
                <Link to="/">← Dashboard</Link>
            </p>
        </div>
    );
}
