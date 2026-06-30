"use client";

import Link from "next/link";

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/2250508905666"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="group"
      style={{
        position: "fixed",
        bottom: "26px",
        right: "26px",
        zIndex: 70,
        width: "56px",
        height: "56px",
        borderRadius: "999px",
        background: "#511F29",
        color: "#fcd3b4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(42,24,29,0.32)",
        textDecoration: "none",
        transition: "all 0.3s",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6a8.5 8.5 0 1 1 16.1-3.9z" />
      </svg>
    </Link>
  );
}
