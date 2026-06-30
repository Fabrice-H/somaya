"use client";

export default function AnnouncementBar() {
  return (
    <div style={{ background: "#511F29", color: "#f6e7dc", overflow: "hidden", whiteSpace: "nowrap" }}>
      <div
        className="animate-marquee"
        style={{
          display: "inline-flex",
          alignItems: "center",
          willChange: "transform",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "11.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "9px 0",
          }}
        >
          <span style={{ padding: "0 30px" }}>Livraison Abidjan en 24h</span>
          <span style={{ opacity: 0.45 }}>✦</span>
          <span style={{ padding: "0 30px" }}>Expédition internationale</span>
          <span style={{ opacity: 0.45 }}>✦</span>
          <span style={{ padding: "0 30px" }}>La qualité, notre référence</span>
          <span style={{ opacity: 0.45 }}>✦</span>
          <span style={{ padding: "0 30px" }}>Paiement à la livraison &amp; Mobile Money</span>
          <span style={{ opacity: 0.45 }}>✦</span>
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "11.5px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "9px 0",
          }}
        >
          <span style={{ padding: "0 30px" }}>Livraison Abidjan en 24h</span>
          <span style={{ opacity: 0.45 }}>✦</span>
          <span style={{ padding: "0 30px" }}>Expédition internationale</span>
          <span style={{ opacity: 0.45 }}>✦</span>
          <span style={{ padding: "0 30px" }}>La qualité, notre référence</span>
          <span style={{ opacity: 0.45 }}>✦</span>
          <span style={{ padding: "0 30px" }}>Paiement à la livraison &amp; Mobile Money</span>
          <span style={{ opacity: 0.45 }}>✦</span>
        </span>
      </div>
    </div>
  );
}
