import { HomeSearch } from "@/components/search/HomeSearch";

export default function HomePage() {
  return (
    <div>
      <section style={{ marginBottom: 28, maxWidth: 720 }}>
        <span className="eyebrow">Account intelligence</span>
        <h1 className="display" style={{ fontSize: 34, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "10px 0 12px" }}>
          Know why Freyr should care — before the first call.
        </h1>
        <p className="soft" style={{ fontSize: 16, margin: 0 }}>
          Search a life-sciences company to get an opportunity verdict, service fit, persona-ready talking points, and outreach — every claim rated for confidence.
        </p>
      </section>
      <HomeSearch />
    </div>
  );
}
