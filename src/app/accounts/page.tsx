import { AccountsList } from "@/components/accounts/AccountsList";

export default function AccountsPage() {
  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <span className="eyebrow">Pipeline</span>
        <h1 className="display" style={{ fontSize: 28, letterSpacing: "-0.02em", margin: "8px 0 6px" }}>Saved accounts</h1>
        <p className="soft" style={{ margin: 0 }}>Accounts you&rsquo;re tracking, with owner, priority, relationship status, and notes. Stored in your browser.</p>
      </section>
      <AccountsList />
    </div>
  );
}
