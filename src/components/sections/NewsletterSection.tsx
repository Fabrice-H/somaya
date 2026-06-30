"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section style={{ background: "#511F29", color: "#fbf3ec" }}>
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "clamp(80px, 9vw, 120px) 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "11.5px",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#fcd3b4",
            marginBottom: "22px",
          }}
        >
          La communauté
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
            fontSize: "clamp(34px, 4.4vw, 60px)",
            lineHeight: 1.05,
            margin: "0 0 18px",
          }}
        >
          Rejoignez la SO&apos;FAMILY
        </h2>
        <p
          style={{
            color: "rgba(251,243,236,0.8)",
            fontSize: "16.5px",
            lineHeight: 1.7,
            fontWeight: 300,
            maxWidth: "480px",
            margin: "0 auto 36px",
          }}
        >
          Recevez nos nouveautés, offres privées et inspirations mode.
        </p>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "12px",
              maxWidth: "460px",
              margin: "0 auto",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              required
              style={{
                flex: 1,
                minWidth: "200px",
                background: "rgba(251,243,236,0.08)",
                border: "1px solid rgba(252,211,180,0.35)",
                color: "#fbf3ec",
                padding: "16px 20px",
                fontSize: "14px",
                borderRadius: "2px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#fcd3b4",
                color: "#511F29",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "16px 32px",
                borderRadius: "2px",
                transition: "all 0.3s",
              }}
            >
              S&apos;inscrire
            </button>
          </form>
        ) : (
          <div
            style={{
              background: "rgba(252,211,180,0.15)",
              border: "1px solid rgba(252,211,180,0.3)",
              padding: "20px 30px",
              borderRadius: "4px",
              maxWidth: "460px",
              margin: "0 auto",
            }}
          >
            <p style={{ margin: 0, fontSize: "15px" }}>
              Merci ! Vous êtes inscrit(e) à notre newsletter. 🎉
            </p>
          </div>
        )}

        <div
          style={{
            fontSize: "11.5px",
            color: "rgba(251,243,236,0.5)",
            marginTop: "16px",
          }}
        >
          En vous inscrivant, vous acceptez notre politique de confidentialité.
        </div>
      </div>
    </section>
  );
}
