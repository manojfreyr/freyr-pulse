"use client";

import { useState } from "react";

export default function UnlockPage() {
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!pass.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passphrase: pass }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "Incorrect passphrase");
      }
      const next = new URLSearchParams(window.location.search).get("next") || "/";
      window.location.href = next;
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "12vh auto 0" }}>
      <div className="card card-pad-lg">
        <span className="eyebrow">Internal access</span>
        <h1 className="display" style={{ fontSize: 22, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Freyr Pulse</h1>
        <p className="small muted" style={{ marginTop: 0 }}>Enter the team access passphrase to continue.</p>
        <label className="field-label" htmlFor="pass">Passphrase</label>
        <input
          id="pass"
          className="input"
          type="password"
          value={pass}
          autoFocus
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {error && <p className="small" style={{ color: "var(--danger)", marginBottom: 0 }}>{error}</p>}
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={submit} disabled={busy}>
          {busy ? "Unlocking…" : "Unlock"}
        </button>
      </div>
    </div>
  );
}
