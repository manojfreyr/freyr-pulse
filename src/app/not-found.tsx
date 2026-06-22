import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card card-pad-lg" style={{ textAlign: "center", maxWidth: 520, margin: "40px auto" }}>
      <span className="eyebrow">404</span>
      <h1 className="display" style={{ fontSize: 26, margin: "10px 0 8px" }}>Nothing to brief here</h1>
      <p className="soft" style={{ margin: "0 auto 20px" }}>
        That page doesn&rsquo;t exist. Phase 1 covers five mock companies — start from search.
      </p>
      <Link href="/" className="btn btn-primary">Back to search</Link>
    </div>
  );
}
