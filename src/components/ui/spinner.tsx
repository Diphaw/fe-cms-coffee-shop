// ─── Spinner ──────────────────────────────────────────────────────────────────

type SpinnerProps = {
  size?: number;
  color?: string;
};

export function Spinner({ size = 32, color = "#c8a96e" }: SpinnerProps) {
  return (
    <>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `3px solid ${color}33`,
          borderTopColor: color,
          animation: "cms-spin 0.75s linear infinite",
          flexShrink: 0,
        }}
      />
      <style>{`@keyframes cms-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ─── Full-page loading screen ─────────────────────────────────────────────────

export function PageLoader({ label = "Memuat…" }: { label?: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        minHeight: 300,
      }}
    >
      <Spinner size={40} />
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#c8a96e",
        }}
      >
        {label}
      </p>
    </div>
  );
}
