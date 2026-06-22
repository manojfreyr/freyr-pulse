/**
 * Subtle, professional label used near the top of dashboards and in source
 * sections to make clear Phase 1 runs on mock data.
 */
export function DemoDataNotice({ style }: { style?: React.CSSProperties }) {
  return (
    <span className="demo-notice" style={style}>
      Demo intelligence — mock data. Live source integration planned for Phase 2.
    </span>
  );
}
