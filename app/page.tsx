"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from "react";

// ─────────────────────────────────────────────
// LANGUAGE CONTEXT
// ─────────────────────────────────────────────
type Lang = "de" | "en";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "de",
  setLang: () => {},
});
const useLang = () => useContext(LangContext);
function t(lang: Lang, de: string, en: string) { return lang === "de" ? de : en; }

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { de: "Geschichte", en: "Story",    href: "#story" },
  { de: "Speisekarte", en: "Menu",    href: "#menu" },
  { de: "Galerie",    en: "Gallery",  href: "#gallery" },
  { de: "Presse",     en: "Press",    href: "#press" },
  { de: "Kontakt",    en: "Contact",  href: "#contact" },
];

const MENU_CATS = {
  cat1: { de: "Vorspeisen",    en: "Starters"  },
  cat2: { de: "Hauptgerichte", en: "Mains"     },
  cat3: { de: "Desserts",      en: "Desserts"  },
};

const MENU_ITEMS: Record<string, { name: string; de: string; en: string; price: string; tag?: { de: string; en: string } }[]> = {
  cat1: [
    { name: "Hokkaido-Jakobsmuschel", de: "Blumenkohlvelouté, schwarzer Trüffel, Schnittlauchöl", en: "Cauliflower velouté, black truffle, chive oil", price: "€28", tag: { de: "Chef-Empfehlung", en: "Chef's Selection" } },
    { name: "Foie-Gras-Terrine",      de: "Brioche, Sauternes-Gelée, geräuchertes Meersalz",      en: "Brioche, Sauternes gelée, smoked sea salt",   price: "€32" },
    { name: "Erbstomaten",            de: "Burrata, Basilikumöl, gereifter Balsamico, Pinienkerne", en: "Burrata, basil oil, aged balsamic, pine nuts", price: "€22" },
  ],
  cat2: [
    { name: "Dry-Aged Côte de Bœuf",   de: "Knochenmarkjus, Pommes soufflées, Brunnenkresse",       en: "Bone marrow jus, pommes soufflées, watercress",   price: "€68", tag: { de: "Signature", en: "Signature" } },
    { name: "Wildgefangener Steinbutt", de: "Champagner-Beurre-blanc, Meeresgemüse, Kaviar",          en: "Champagne beurre blanc, sea vegetables, caviar",  price: "€58" },
    { name: "Anjou-Taube",             de: "Rote Bete, Kirsche, Foie-Gras-Sauce, Bitterschokolade",  en: "Beetroot, cherry, foie gras sauce, bitter chocolate", price: "€52" },
  ],
  cat3: [
    { name: "Valrhona-Schokoladensphäre", de: "Warmes Karamell, Kakaonibs, Salzbutter-Eis",              en: "Warm caramel, cocoa nib, salted butter ice cream", price: "€18", tag: { de: "Signature", en: "Signature" } },
    { name: "Tarte Tatin",                de: "Karamellisierter Apfel, Crème fraîche, Calvados",          en: "Caramelised apple, crème fraîche, calvados",       price: "€16" },
    { name: "Käseauswahl",               de: "Saisonale französische und österreichische Sorten, Honigwaben", en: "Seasonal French and Austrian varieties, honeycomb", price: "€22" },
  ],
};

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80&auto=format&fit=crop",
];

const PRESS_ITEMS = [
  { pub: "The World's 50 Best", de: "Ein Abend stiller Vollkommenheit — jeder Gang beeindruckender als der vorherige.", en: "An evening of quiet perfection — each course more arresting than the last.", year: "2024" },
  { pub: "Falstaff Magazin",    de: "Wiens überzeugendste Gastronomie-Erfahrung. Ein Raum, der Luxus flüstert.",      en: "Vienna's most compelling dining experience. A room that whispers luxury.",       year: "2024" },
  { pub: "Financial Times",     de: "Makellos inszeniert, mit der Sicherheit einer Küche auf dem absoluten Höhepunkt.", en: "Flawlessly orchestrated, with the confidence of a kitchen at the absolute top of its game.", year: "2023" },
];

const MENU_PDF_LINKS = [
  { de: "Frühstück",     en: "Breakfast",  href: "https://stradagarden.at/wp-content/uploads/2026/04/menu-strada-Fruhstuck.pdf",  icon: "☕" },
  { de: "Speisekarte",   en: "Food Menu",  href: "https://stradagarden.at/wp-content/uploads/2026/03/speisekarte-strada.pdf",     icon: "🍽" },
  { de: "Getränkekarte", en: "Drinks",     href: "https://stradagarden.at/wp-content/uploads/2026/03/getranke-strada.pdf",        icon: "🍷" },
  { de: "Hookah",        en: "Hookah",     href: "https://stradagarden.at/wp-content/uploads/2026/03/hookah-2.pdf",               icon: "💨" },
];

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function ss(inView: boolean, i: number, base = 0, step = 120): React.CSSProperties {
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${base + i * step}ms, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${base + i * step}ms`,
  };
}

// ─────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────
function Eyebrow({ de, en }: { de: string; en: string }) {
  const { lang } = useLang();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{ display: "block", width: 40, height: 1, background: "#9A8F6A", flexShrink: 0 }} />
      <span style={{ color: "#9A8F6A", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
        {t(lang, de, en)}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// LANGUAGE SWITCHER
// ─────────────────────────────────────────────
function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: "flex", border: "1px solid rgba(154,143,106,0.35)", overflow: "hidden" }}>
      {(["de", "en"] as Lang[]).map((l, i) => (
        <button key={l} onClick={() => setLang(l)} style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase", padding: "7px 13px",
          cursor: "pointer", border: "none",
          borderLeft: i > 0 ? "1px solid rgba(154,143,106,0.35)" : "none",
          background: lang === l ? "#9A8F6A" : "transparent",
          color: lang === l ? "#F4F2EC" : "#9A8F6A",
          transition: "background 0.22s, color 0.22s",
        }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({ scrollY }: { scrollY: number }) {
  const { lang } = useLang();
  const scrolled = scrollY > 60;
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "14px 48px" : "26px 48px",
      background: scrolled ? "rgba(244,242,236,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(154,143,106,0.15)" : "none",
      transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(-14px)",
    }}>
      <a href="#" style={{ textDecoration: "none", display: "inline-flex" }}>
        <img src="/logo.png" alt="Strada Garden" style={{ height: scrolled ? 42 : 50, width: "auto", display: "block", transition: "height 0.5s" }} />
      </a>

      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {NAV_ITEMS.map((item, i) => {
          if (item.href === "#menu") {
            return (
              <div key={item.de} ref={menuRef} style={{ position: "relative" }}>
                <button onClick={() => setMenuOpen(o => !o)} style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center", gap: 5,
                  fontFamily: "Inter, sans-serif", fontSize: "0.68rem", fontWeight: 400,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: menuOpen ? "#9A8F6A" : "#5C5845",
                  opacity: mounted ? 1 : 0, transition: `opacity 0.6s ease ${i * 70 + 200}ms, color 0.2s`,
                }}>
                  {t(lang, item.de, item.en)}
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" style={{ transition: "transform 0.25s", transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="M1 1L4.5 5L8 1" stroke="#9A8F6A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {/* Dropdown */}
                <div style={{
                  position: "absolute", top: "calc(100% + 18px)", left: "50%",
                  transform: menuOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-8px)",
                  background: "rgba(244,242,236,0.98)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(154,143,106,0.2)",
                  boxShadow: "0 20px 60px rgba(28,26,21,0.12)",
                  minWidth: 220, zIndex: 200, overflow: "hidden",
                  opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none",
                  transition: "opacity 0.25s, transform 0.25s",
                }}>
                  <div style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(154,143,106,0.12)" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.54rem", fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: "#9A8F6A" }}>
                      {t(lang, "Unsere Karten", "Our Menus")}
                    </span>
                  </div>
                  {MENU_PDF_LINKS.map((pdf, idx) => (
                    <a key={pdf.de} href={pdf.href} target="_blank" rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", textDecoration: "none", borderBottom: idx < MENU_PDF_LINKS.length - 1 ? "1px solid rgba(154,143,106,0.08)" : "none", transition: "background 0.18s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(154,143,106,0.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{pdf.icon}</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#3A3828" }}>{t(lang, pdf.de, pdf.en)}</span>
                      </div>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.35 }}>
                        <path d="M1 9L9 1M9 1H3M9 1V7" stroke="#9A8F6A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ))}
                  <div style={{ padding: "10px 20px 12px", borderTop: "1px solid rgba(154,143,106,0.08)" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", color: "rgba(92,88,69,0.4)", fontStyle: "italic" }}>
                      {t(lang, "Öffnet als PDF", "Opens as PDF")}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <a key={item.de} href={item.href} style={{
              textDecoration: "none", color: "#5C5845",
              fontFamily: "Inter, sans-serif", fontSize: "0.68rem", fontWeight: 400,
              letterSpacing: "0.16em", textTransform: "uppercase",
              opacity: mounted ? 1 : 0, transition: `opacity 0.6s ease ${i * 70 + 200}ms, color 0.2s`,
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#9A8F6A")}
              onMouseLeave={e => (e.currentTarget.style.color = "#5C5845")}
            >
              {t(lang, item.de, item.en)}
            </a>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div className="nav-desktop"><LangSwitcher /></div>
        <a href="#reservations" className="btn btn-solid nav-cta" style={{ padding: "11px 24px" }}>
          {t(lang, "Reservieren", "Reserve")}
        </a>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function Hero({ scrollY }: { scrollY: number }) {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(26px)",
    transition: `opacity 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <section className="vine-bg" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#F4F2EC" }}>

      {/* Video reel */}
      <div style={{
        position: "absolute", right: "4%", top: "50%",
        transform: `translateY(calc(-50% + ${scrollY * 0.06}px))`,
        zIndex: 2, width: "min(320px, 28vw)",
        opacity: mounted ? 1 : 0, transition: "opacity 1.4s ease 0.15s",
      }}>
        <div style={{ position: "relative", borderRadius: 36, overflow: "hidden", boxShadow: "0 40px 100px rgba(28,26,21,0.22), inset 0 0 0 1.5px rgba(154,143,106,0.35)", background: "#0a0a0a", aspectRatio: "9/16" }}>
          <video src="/video2.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,26,21,0.35) 0%, transparent 40%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 80, height: 5, borderRadius: 3, background: "rgba(154,143,106,0.55)" }} />
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", fontStyle: "italic", color: "rgba(244,242,236,0.55)", letterSpacing: "0.2em" }}>strada garden</span>
          </div>
        </div>
        <div style={{ margin: "8px auto 0", width: "70%", height: 24, background: "radial-gradient(ellipse, rgba(28,26,21,0.18) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(6px)" }} />
      </div>

      {/* Gradient mask */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to right, #F4F2EC 0%, #F4F2EC 38%, rgba(244,242,236,0.65) 58%, rgba(244,242,236,0) 72%)" }} />

      {/* Warm glow behind phone */}
      <div style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", width: 400, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(154,143,106,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3, width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 80px", paddingTop: 130, paddingBottom: 80 }}>
        <div style={{ maxWidth: 540 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, ...fade(120) }}>
            <span style={{ display: "block", width: 40, height: 1, background: "#9A8F6A" }} />
            <span style={{ color: "#9A8F6A", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
              {t(lang, "Gegr. 2009 · Wien", "Est. 2009 · Vienna")}
            </span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 5vw, 4.6rem)", fontWeight: 500, lineHeight: 1.06, color: "#9A8F6A", marginBottom: 24, ...fade(220) }}>
            {lang === "de"
              ? <>Wo jedes <em style={{ color: "#C8BC98", fontStyle: "italic" }}>Gericht</em><br />eine Geschichte erzählt</>
              : <>Where every <em style={{ color: "#C8BC98", fontStyle: "italic" }}>Dish</em><br />tells a Story</>}
          </h1>

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", fontWeight: 300, color: "#5C5845", lineHeight: 1.85, maxWidth: "40ch", marginBottom: 40, ...fade(360) }}>
            {t(lang,
              "Ein Refugium verfeinerten Geschmacks, wo saisonale Zutaten auf klassische Technik treffen — und jeder Tisch zum Erlebnis wird.",
              "A sanctuary of refined flavours, where seasonal ingredients meet classical technique — and every table becomes an occasion."
            )}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", ...fade(480) }}>
            <a href="#reservations" className="btn btn-solid">{t(lang, "Tisch reservieren", "Reserve a Table")}</a>
            <a href="#menu" className="btn btn-ghost-light">{t(lang, "Speisekarte", "View Menu")}</a>
          </div>

          <div style={{ display: "flex", gap: 40, marginTop: 56, paddingTop: 40, borderTop: "1px solid rgba(154,143,106,0.2)", ...fade(600) }}>
            {[
              ["18", t(lang, "Jahre Exzellenz",  "Years of Excellence")],
              ["3",  t(lang, "Michelin-Sterne",   "Michelin Stars")],
              ["60", t(lang, "Gedecke täglich",   "Covers Nightly")],
            ].map(([val, label], i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                {i > 0 && <div style={{ width: 1, height: 32, background: "#9A8F6A", opacity: 0.25 }} />}
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 500, color: "#9A8F6A", lineHeight: 1, marginBottom: 4 }}>{val}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#5C5845", fontWeight: 500 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div style={{
        position: "absolute", right: "calc(30% + 20px)", bottom: "13%", zIndex: 4,
        width: 108, height: 108, borderRadius: "50%",
        background: "#9A8F6A", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        boxShadow: "0 16px 48px rgba(154,143,106,0.4)",
        animation: "floatBadge 4s ease-in-out infinite",
        opacity: mounted ? 1 : 0, transition: "opacity 1.2s ease 1s",
      }}>
        <span style={{ fontFamily: "'Playfair Display', serif", color: "#F4F2EC", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.5 }}>
          {lang === "de" ? <><span style={{display:"block"}}>Täglich</span><span style={{display:"block"}}>geöffnet</span></> : <><span style={{display:"block"}}>Open</span><span style={{display:"block"}}>Nightly</span></>}
        </span>
        <span style={{ color: "rgba(244,242,236,0.5)", fontSize: "0.5rem", marginTop: 3 }}>{t(lang, "18 – 24 Uhr", "6pm – 12am")}</span>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: mounted ? 1 : 0, transition: "opacity 1.4s ease 1.2s" }}>
        <span style={{ color: "#9A8F6A", fontSize: "0.54rem", letterSpacing: "0.24em", textTransform: "uppercase", writingMode: "vertical-rl", opacity: 0.55 }}>{t(lang, "Scrollen", "Scroll")}</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ animation: "scrollCue 2.4s ease-in-out infinite" }}>
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="#9A8F6A" strokeWidth="1.2" opacity="0.4" />
          <rect x="6.5" y="5" width="3" height="6" rx="1.5" fill="#9A8F6A" />
        </svg>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// STORY
// ─────────────────────────────────────────────
function Story() {
  const { lang } = useLang();
  const { ref, inView } = useInView();

  return (
    <section id="story" ref={ref} className="vine-bg" style={{ background: "#F4F2EC", padding: "130px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>
        <div style={{ position: "relative", ...ss(inView, 0) }}>
          <div style={{ overflow: "hidden" }}>
            <img src="/main.jpeg" alt={t(lang, "Strada Garden Restaurant", "Strada Garden Restaurant")}
              style={{ width: "100%", height: 580, objectFit: "cover", display: "block", transform: inView ? "scale(1)" : "scale(1.06)", transition: "transform 1.5s cubic-bezier(0.22,1,0.36,1)" }} />
          </div>
          <div style={{ position: "absolute", bottom: -28, right: -28, width: 180, height: 180, border: "1px solid rgba(154,143,106,0.3)", pointerEvents: "none", opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.7s" }} />
          <div style={{ position: "absolute", top: -20, left: -20, background: "#1C1A15", padding: "16px 20px", ...ss(inView, 0, 400) }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 500, color: "#9A8F6A", lineHeight: 1 }}>2009</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,242,236,0.4)", marginTop: 4 }}>{t(lang, "Gegründet", "Founded")}</p>
          </div>
        </div>

        <div style={{ ...ss(inView, 1, 0, 180) }}>
          <Eyebrow de="Unsere Geschichte" en="Our Story" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 500, color: "#1C1A15", lineHeight: 1.1, marginBottom: 24 }}>
            {lang === "de" ? <>Verwurzelt in <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Tradition,</em><br />getrieben von Handwerk</> : <>Rooted in <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Tradition,</em><br />Driven by Craft</>}
          </h2>
          <div style={{ width: 48, height: 1, background: "#9A8F6A", marginBottom: 28 }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.93rem", fontWeight: 300, color: "#5C5845", lineHeight: 1.85, marginBottom: 20 }}>
            {t(lang,
              "Das Strada Garden entstand aus einer einzigen Überzeugung: Großartige Küche ist untrennbar mit großartiger Gastfreundschaft verbunden. Seit 2009 pflegen wir eine Küchenkultur, die auf absolutem Respekt vor den Zutaten basiert — saisonal, regional, ehrlich.",
              "Strada Garden was born from a single conviction: that great food is inseparable from great hospitality. Since 2009 we have built a kitchen culture around absolute respect for ingredients — seasonal, local, and honestly sourced."
            )}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.93rem", fontWeight: 300, color: "#5C5845", lineHeight: 1.85, marginBottom: 40 }}>
            {t(lang,
              "Küchenchef Éric Valmont führt ein Team, das unermüdlich trainiert und nichts verschwendet. Jeder Teller ist das Ergebnis bewusster Entscheidung — niemals Konvention.",
              "Chef Éric Valmont leads a team that trains endlessly and wastes nothing. Every plate is the result of considered choice — never convention."
            )}
          </p>
          <a href="#menu" className="btn btn-ghost-light">{t(lang, "Speisekarte erkunden", "Explore the Menu")}</a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────
function Menu() {
  const { lang } = useLang();
  const [active, setActive] = useState("cat1");
  const [animKey, setAnimKey] = useState(0);
  const { ref, inView } = useInView(0.08);

  return (
    <section id="menu" ref={ref} className="vine-bg vine-bg-dark" style={{ background: "#1C1A15", padding: "130px 80px", opacity: inView ? 1 : 0, transition: "opacity 0.9s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 28 }}>
          <div style={{ ...ss(inView, 0, 100) }}>
            <Eyebrow de="À La Carte" en="À La Carte" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500, color: "#F4F2EC", lineHeight: 1.1 }}>
              {lang === "de" ? <>Eine saisonale <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Auswahl</em></> : <>A Seasonal <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Selection</em></>}
            </h2>
          </div>
          <div style={{ display: "flex", border: "1px solid rgba(154,143,106,0.25)", ...ss(inView, 1, 100) }}>
            {Object.entries(MENU_CATS).map(([key, labels], i, arr) => (
              <button key={key} onClick={() => { setActive(key); setAnimKey(k => k + 1); }} className="btn" style={{
                padding: "12px 22px", borderRadius: 0,
                background: active === key ? "#9A8F6A" : "transparent",
                color: active === key ? "#F4F2EC" : "rgba(154,143,106,0.55)",
                borderRight: i < arr.length - 1 ? "1px solid rgba(154,143,106,0.25)" : "none",
                borderTop: "none", borderBottom: "none", borderLeft: "none",
                transform: "none", boxShadow: "none",
              }}>
                {t(lang, labels.de, labels.en)}
              </button>
            ))}
          </div>
        </div>

        <div key={animKey}>
          {MENU_ITEMS[active].map((item, i) => (
            <div key={item.name} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "30px 0", borderTop: i === 0 ? "1px solid rgba(154,143,106,0.15)" : "none",
              borderBottom: "1px solid rgba(154,143,106,0.15)", gap: 24,
              animation: `menuItemIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 90}ms both`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 500, color: "#F4F2EC" }}>{item.name}</span>
                  {item.tag && <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", padding: "3px 10px", background: "rgba(154,143,106,0.12)", color: "#9A8F6A", border: "1px solid rgba(154,143,106,0.25)" }}>{t(lang, item.tag.de, item.tag.en)}</span>}
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.84rem", fontWeight: 300, color: "rgba(244,242,236,0.42)", lineHeight: 1.6 }}>{t(lang, item.de, item.en)}</p>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 400, color: "#9A8F6A", flexShrink: 0, marginTop: 2 }}>{item.price}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", fontWeight: 300, color: "rgba(244,242,236,0.2)", marginTop: 32 }}>
          {t(lang, "Alle Preise inkl. MwSt. · Allergene auf Anfrage · Karte wechselt saisonal.", "All prices include VAT · Allergen info available · Menu changes seasonally.")}
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────
function Gallery() {
  const { lang } = useLang();
  const { ref, inView } = useInView(0.08);

  return (
    <section id="gallery" ref={ref} className="vine-bg" style={{ background: "#F4F2EC", padding: "130px 80px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <Eyebrow de="Im Raum" en="In the Room" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 500, color: "#1C1A15", lineHeight: 1.1 }}>
            {lang === "de" ? <>Die <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Atmosphäre</em></> : <>The <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Atmosphere</em></>}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 290px)", gap: 12 }}>
          {GALLERY_IMGS.map((src, i) => (
            <div key={i} style={{ overflow: "hidden", gridColumn: i === 0 ? "span 2" : "span 1", gridRow: i === 0 ? "span 2" : "span 1", opacity: inView ? 1 : 0, transform: inView ? "scale(1)" : "scale(0.96)", transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${i * 110 + 80}ms, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${i * 110 + 80}ms` }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRESS
// ─────────────────────────────────────────────
function Press() {
  const { lang } = useLang();
  const { ref, inView } = useInView(0.1);

  return (
    <section id="press" ref={ref} className="vine-bg" style={{ background: "#F0EDE4", padding: "110px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Eyebrow de="Presse" en="Press" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48, marginTop: 32 }}>
          {PRESS_ITEMS.map((item, i) => (
            <div key={item.pub} style={{ borderTop: "1px solid rgba(154,143,106,0.3)", paddingTop: 32, ...ss(inView, i, 80, 140) }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.08rem", fontStyle: "italic", fontWeight: 400, color: "#1C1A15", lineHeight: 1.65, marginBottom: 24 }}>
                {lang === "de" ? `„${item.de}"` : `"${item.en}"`}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9A8F6A" }}>{item.pub}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#5C5845", fontWeight: 300 }}>{item.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// RESERVATIONS
// ─────────────────────────────────────────────
function Reservations() {
  const { lang } = useLang();
  const { ref, inView } = useInView(0.08);
  const [form, setForm] = useState({ name: "", email: "", date: "", guests: "2", note: "" });
  const [sent, setSent] = useState(false);

  const inputStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 300,
    width: "100%", padding: "14px 0",
    background: "transparent", border: "none", borderBottom: "1px solid rgba(154,143,106,0.28)",
    color: "#F4F2EC", outline: "none", letterSpacing: "0.04em", boxSizing: "border-box", transition: "border-color 0.25s",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif", fontSize: "0.58rem", fontWeight: 500,
    letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(154,143,106,0.65)", display: "block", marginBottom: 4,
  };

  const INFO = [
    [t(lang,"Öffnungszeiten","Opening Hours"), t(lang,"Dienstag – Sonntag · 18:00 – 24:00 Uhr","Tuesday – Sunday · 6:00 pm – 12:00 am")],
    [t(lang,"Adresse","Address"), "Stubenring 12, 1010 Wien"],
    [t(lang,"Telefon","Phone"), "+43 1 512 3400"],
    ["E-Mail", "reservierungen@stradagarden.at"],
  ];

  return (
    <section id="reservations" ref={ref} className="vine-bg vine-bg-dark" style={{ background: "#1C1A15", padding: "130px 80px", opacity: inView ? 1 : 0, transition: "opacity 0.9s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "start" }}>
        <div style={{ ...ss(inView, 0, 100) }}>
          <Eyebrow de="Reservierungen" en="Reservations" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 500, color: "#F4F2EC", lineHeight: 1.1, marginBottom: 28 }}>
            {lang === "de" ? <>Ihren <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Tisch</em> sichern</> : <>Secure Your <em style={{ fontStyle: "italic", color: "#9A8F6A" }}>Table</em></>}
          </h2>
          <div style={{ width: 48, height: 1, background: "#9A8F6A", marginBottom: 28 }} />
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 300, color: "rgba(244,242,236,0.42)", lineHeight: 1.85, marginBottom: 44 }}>
            {t(lang, "Wir empfehlen, mindestens zwei Wochen im Voraus zu buchen. Für Gruppen ab acht Personen kontaktieren Sie uns bitte direkt.", "We recommend booking at least two weeks in advance. For parties of eight or more, please contact us directly.")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {INFO.map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 20 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9A8F6A", flexShrink: 0, width: 96, paddingTop: 2 }}>{label}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", fontWeight: 300, color: "rgba(244,242,236,0.45)", lineHeight: 1.6 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...ss(inView, 1, 100) }}>
          {sent ? (
            <div style={{ padding: "52px 44px", border: "1px solid rgba(154,143,106,0.22)", textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 500, color: "#9A8F6A", marginBottom: 16 }}>{t(lang, "Vielen Dank", "Thank You")}</div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", fontWeight: 300, color: "rgba(244,242,236,0.38)", lineHeight: 1.75 }}>
                {t(lang, "Ihre Anfrage ist eingegangen. Wir bestätigen innerhalb von 24 Stunden.", "Your request has been received. We will confirm within 24 hours.")}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, rowGap: 34 }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>{t(lang, "Vollständiger Name", "Full Name")}</label>
                <input style={inputStyle} placeholder={t(lang, "Ihr Name", "Your name")} value={form.name} onChange={e => setForm({...form, name: e.target.value})} onFocus={e => e.target.style.borderBottomColor = "#9A8F6A"} onBlur={e => e.target.style.borderBottomColor = "rgba(154,143,106,0.28)"} />
              </div>
              <div>
                <label style={labelStyle}>{t(lang, "E-Mail", "Email")}</label>
                <input style={inputStyle} type="email" placeholder="ihre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} onFocus={e => e.target.style.borderBottomColor = "#9A8F6A"} onBlur={e => e.target.style.borderBottomColor = "rgba(154,143,106,0.28)"} />
              </div>
              <div>
                <label style={labelStyle}>{t(lang, "Gäste", "Guests")}</label>
                <select style={{ ...inputStyle, appearance: "none" }} value={form.guests} onChange={e => setForm({...form, guests: e.target.value})}>
                  {[1,2,3,4,5,6,7].map(n => <option key={n} value={n} style={{ background: "#1C1A15" }}>{n} {lang === "de" ? (n===1?"Gast":"Gäste") : (n===1?"Guest":"Guests")}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>{t(lang, "Wunschdatum", "Preferred Date")}</label>
                <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} onFocus={e => e.target.style.borderBottomColor = "#9A8F6A"} onBlur={e => e.target.style.borderBottomColor = "rgba(154,143,106,0.28)"} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>{t(lang, "Besonderer Wunsch", "Special Request")}</label>
                <input style={inputStyle} placeholder={t(lang, "Allergien, Anlass…", "Allergies, occasion…")} value={form.note} onChange={e => setForm({...form, note: e.target.value})} onFocus={e => e.target.style.borderBottomColor = "#9A8F6A"} onBlur={e => e.target.style.borderBottomColor = "rgba(154,143,106,0.28)"} />
              </div>
              <div style={{ gridColumn: "span 2", marginTop: 8 }}>
                <button onClick={() => setSent(true)} className="btn btn-solid btn-full">{t(lang, "Tisch anfragen", "Request Reservation")}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  const { lang } = useLang();

  const COLS = [
    { label: t(lang,"Navigation","Navigate"), links: [{label:t(lang,"Geschichte","Story"),href:"#story"},{label:t(lang,"Speisekarte","Menu"),href:"#menu"},{label:t(lang,"Galerie","Gallery"),href:"#gallery"},{label:t(lang,"Presse","Press"),href:"#press"}] },
    { label: t(lang,"Besuchen","Visit"), links: [{label:t(lang,"Di – So","Tue – Sun")},{label:t(lang,"18 – 24 Uhr","6pm – 12am")},{label:"Stubenring 12"},{label:t(lang,"1010 Wien","1010 Vienna")}] },
    { label: t(lang,"Verbinden","Connect"), links: [{label:"Instagram"},{label:"Facebook"},{label:t(lang,"Presse-Anfragen","Press Enquiries")},{label:t(lang,"Karriere","Careers")}] },
  ];

  return (
    <footer id="contact" style={{
      position: "relative", overflow: "hidden", padding: "72px 80px 44px",
      background: "linear-gradient(135deg, #08201a 0%, #0d2820 35%, #071812 65%, #040e0a 100%)",
    }}>
      {/* Animated SVG vine overlay for footer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.12 }}>
        <svg width="100%" height="100%" viewBox="0 0 1400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#45a070" strokeLinecap="round">
            <path strokeWidth="28" d="M-100 500 C 100 380, 200 280, 350 200 C 500 120, 680 100, 800 50 C 900 10, 950 -20, 1100 -30" />
            <path strokeWidth="18" d="M 200 500 C 350 400, 420 300, 550 220 C 680 140, 820 120, 950 80 C 1050 50, 1150 20, 1300 -10" />
            <path strokeWidth="22" d="M-50 300 C 100 280, 220 310, 350 360 C 480 410, 580 440, 700 460 C 820 480, 950 470, 1100 450 C 1220 435, 1350 420, 1450 400" />
            <path strokeWidth="10" stroke="#9A8F6A" d="M 400 500 C 450 420, 480 360, 520 300 C 560 240, 600 190, 650 140 C 700 90, 750 50, 820 20" />
          </g>
        </svg>
      </div>

      {/* Dark overlay for text readability */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(4,14,10,0.55)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 60, paddingBottom: 52, borderBottom: "1px solid rgba(154,143,106,0.15)" }}>
          <div>
            <div style={{ marginBottom: 24 }}>
              <img src="/logo.png" alt="Strada Garden" style={{ height: 54, width: "auto", display: "block" }} />
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(244,242,236,0.35)", lineHeight: 1.85, maxWidth: "30ch" }}>
              {t(lang, "Gehobene Küche im Herzen Wiens. Ein Versprechen an Exzellenz, Saison für Saison.", "Fine dining in the heart of Vienna. A commitment to excellence, season after season.")}
            </p>
          </div>
          {COLS.map(col => (
            <div key={col.label}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "#9A8F6A", marginBottom: 20 }}>{col.label}</p>
              {col.links.map((link: any) => (
                <div key={link.label} style={{ marginBottom: 10 }}>
                  <a href={link.href || "#"} style={{ textDecoration: "none", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", fontWeight: 300, color: "rgba(244,242,236,0.32)", display: "block", transition: "color 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(244,242,236,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(244,242,236,0.32)")}
                  >{link.label}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 300, color: "rgba(244,242,236,0.2)", letterSpacing: "0.06em" }}>
            © {new Date().getFullYear()} Strada Garden. {t(lang, "Alle Rechte vorbehalten.", "All rights reserved.")}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 300, color: "rgba(244,242,236,0.2)", letterSpacing: "0.06em" }}>
            {t(lang, "Datenschutz · AGB", "Privacy Policy · Terms")}
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function HomePage() {
  const scrollY = useScrollY();
  const [lang, setLang] = useState<Lang>("de");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #F4F2EC; }

        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase; line-height: 1;
          text-decoration: none; cursor: pointer; border: 1px solid transparent;
          padding: 15px 32px;
          transition: background 0.28s, border-color 0.28s, color 0.28s, transform 0.18s, box-shadow 0.28s;
          white-space: nowrap; user-select: none; -webkit-font-smoothing: antialiased;
        }
        .btn:focus-visible { outline: 2px solid #9A8F6A; outline-offset: 3px; }
        .btn-solid { background: #9A8F6A; color: #F4F2EC; border-color: #9A8F6A; }
        .btn-solid:hover { background: #7A7054; border-color: #7A7054; transform: translateY(-2px); box-shadow: 0 10px 28px rgba(154,143,106,0.3); }
        .btn-solid:active { transform: translateY(0); box-shadow: none; }
        .btn-ghost-light { background: transparent; color: #9A8F6A; border-color: #9A8F6A; }
        .btn-ghost-light:hover { background: rgba(154,143,106,0.08); transform: translateY(-2px); }
        .btn-full { width: 100%; padding: 17px 32px; }

        @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes scrollCue { 0%,100%{transform:translateY(0);opacity:1} 60%{transform:translateY(9px);opacity:0.2} }
        @keyframes menuItemIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        @media (max-width: 900px) { .nav-desktop{display:none!important} .nav-cta{display:none!important} }

        input::placeholder { color: rgba(244,242,236,0.18); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5) sepia(1) saturate(0.4); }
        select option { background: #1C1A15; color: #F4F2EC; }

        /* Vine watermark */
        .vine-bg { position: relative; overflow: hidden; }
        .vine-bg::before {
          content: '';
          position: absolute; inset: -20%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='1400' viewBox='0 0 1400 1400'%3E%3Cg fill='none' stroke='%239A8F6A' stroke-linecap='round'%3E%3Cpath stroke-width='18' d='M -100 1100 C 100 900,150 700,300 550 C 450 400,650 380,750 260 C 850 140,820 -20,1000 -80'/%3E%3Cpath stroke-width='14' d='M 300 1450 C 450 1200,500 1000,620 820 C 740 640,900 580,980 430 C 1060 280,1020 100,1180 20'/%3E%3Cpath stroke-width='16' d='M -80 400 C 80 350,220 420,340 520 C 460 620,520 760,640 840 C 760 920,920 920,1020 1040 C 1120 1160,1120 1320,1280 1420'/%3E%3Cpath stroke-width='8' d='M -100 700 C 50 650,150 600,250 520 C 350 440,400 360,480 280 C 560 200,620 120,720 60'/%3E%3Cpath stroke-width='6' d='M 50 1100 C 80 1000,100 900,130 800 C 160 700,180 600,200 500 C 220 400,230 300,250 200'/%3E%3Cpath stroke-width='10' d='M -50 900 C 30 840,80 780,120 700 C 160 620,170 540,200 460 C 230 380,250 300,270 200'/%3E%3C/g%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 1400px 1400px;
          opacity: 0.045; pointer-events: none; z-index: 0;
        }
        .vine-bg-dark::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='1400' viewBox='0 0 1400 1400'%3E%3Cg fill='none' stroke='%23C8BC98' stroke-linecap='round'%3E%3Cpath stroke-width='18' d='M -100 1100 C 100 900,150 700,300 550 C 450 400,650 380,750 260 C 850 140,820 -20,1000 -80'/%3E%3Cpath stroke-width='14' d='M 300 1450 C 450 1200,500 1000,620 820 C 740 640,900 580,980 430 C 1060 280,1020 100,1180 20'/%3E%3Cpath stroke-width='16' d='M -80 400 C 80 350,220 420,340 520 C 460 620,520 760,640 840 C 760 920,920 920,1020 1040 C 1120 1160,1120 1320,1280 1420'/%3E%3Cpath stroke-width='8' d='M -100 700 C 50 650,150 600,250 520 C 350 440,400 360,480 280 C 560 200,620 120,720 60'/%3E%3Cpath stroke-width='6' d='M 50 1100 C 80 1000,100 900,130 800 C 160 700,180 600,200 500'/%3E%3Cpath stroke-width='10' d='M -50 900 C 30 840,80 780,120 700 C 160 620,170 540,200 460'/%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.065;
        }
        .vine-bg > * { position: relative; z-index: 1; }
      `}</style>

      <Navbar scrollY={scrollY} />
      <main>
        <Hero scrollY={scrollY} />
        <Story />
        <Menu />
        <Gallery />
        <Press />
        <Reservations />
      </main>
      <Footer />
    </LangContext.Provider>
  );
}