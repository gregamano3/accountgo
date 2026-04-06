/** Shown while lazy route chunks load */
export default function PageFallback() {
    return (
        <div
            className="d-flex align-items-center justify-content-center p-5 min-vh-50 app-main-content"
            role="status"
            aria-live="polite"
        >
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="presentation" aria-hidden="true" />
                <div className="small text-secondary fw-medium">Loading…</div>
            </div>
        </div>
    );
}
