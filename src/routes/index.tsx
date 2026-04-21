import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Github, Sparkles } from "lucide-react";
import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["vitesse-dark"],
      langs: ["html", "tsx", "css", "bash"],
    });
  }
  return highlighterPromise;
}

const SITE_URL = "https://icon.coin2trans.com";
const SITE_TITLE =
  "Coin2Trans Icon — Free Cryptocurrency Icons CDN for Developers (BTC, ETH, SOL & 70+)";
const SITE_DESCRIPTION =
  "Free, open-source cryptocurrency icons hosted on a fast CDN. 70+ coins (Bitcoin, Ethereum, Solana, USDC) in color, black & white SVG variants. MIT licensed — copy a URL and ship.";
const SITE_KEYWORDS =
  "cryptocurrency icons, crypto icons, free crypto icons, bitcoin icon, ethereum icon, solana icon, crypto logo, coin icons, crypto icon CDN, open source crypto icons, svg crypto icons, developer crypto assets";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "keywords", content: SITE_KEYWORDS },
      { name: "author", content: "Coin2Trans Icon" },

      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Coin2Trans Icon — free cryptocurrency icons CDN" },

      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:image:alt", content: "Coin2Trans Icon — free cryptocurrency icons CDN" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "Coin2Trans Icon",
              description: SITE_DESCRIPTION,
              inLanguage: "en",
              publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#org`,
              name: "Coin2Trans Icon",
              url: SITE_URL,
              logo: `${SITE_URL}/icon-512.png`,
            },
            {
              "@type": "SoftwareApplication",
              name: "Coin2Trans Icon",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              license: "https://opensource.org/licenses/MIT",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
          ],
        }),
      },
    ],
  }),
});

const CDN_BASE = "https://icon.coin2trans.com";
type Variant = "color" | "black" | "white";

function buildPath(variant: Variant, code: string) {
  return `${CDN_BASE}/${variant}/${code}.svg`;
}

type Lang = "html" | "jsx" | "css" | "bash";

const SNIPPETS: { id: Lang; label: string; build: (v: Variant) => string }[] = [
  {
    id: "html",
    label: "HTML",
    build: (v) =>
      `<!-- Drop-in <img>, no build step required -->
<img
  src="${buildPath(v, "btc")}"
  alt="Bitcoin"
  loading="lazy"
/>`,
  },
  {
    id: "jsx",
    label: "React",
    build: (v) =>
      `import { useMemo } from "react";

const CDN = "${CDN_BASE}";

export function CoinIcon({ code, size = 64 }: { code: string; size?: number }) {
  const src = useMemo(
    () => \`\${CDN}/${v}/\${code}.svg\`,
    [code, size],
  );
  return <img src={src} alt={code} width={size} height={size} loading="lazy" />;
}

// Usage
<CoinIcon code="eth" />`,
  },
  {
    id: "css",
    label: "CSS",
    build: (v) =>
      `.coin-btc {
  width: 64px;
  height: 64px;
  background-image: url("${buildPath(v, "btc")}");
  background-size: contain;
  background-repeat: no-repeat;
}`,
  },
  {
    id: "bash",
    label: "cURL",
    build: (v) =>
      `# Download a single icon
curl -O ${buildPath(v, "btc")}

# Batch download a few coins
for c in btc eth sol usdc; do
  curl -O "${CDN_BASE}/${v}/$c.svg"
done`,
  },
];

function Index() {
  const [variant, setVariant] = useState<Variant>("color");
  const [lang, setLang] = useState<Lang>("html");
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const s = SNIPPETS.find((x) => x.id === lang)!;
    return s.build(variant);
  }, [lang, variant]);

  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((hl) => {
        if (cancelled) return;
        const out = hl.codeToHtml(code, {
          lang: lang === "jsx" ? "tsx" : lang,
          theme: "vitesse-dark",
        });
        setHtml(out);
      })
      .catch(() => {
        if (!cancelled) setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-mono text-sm tracking-tight">
            coin2trans<span className="text-primary"> icon</span>
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <Github className="h-3.5 w-3.5" />
          GitHub
        </a>
      </header>

      {/* Hero + Snippet (fits desktop without scroll) */}
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 pb-6">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Free & open source · MIT licensed
          </div>
          <h1 className="mx-auto mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Crypto icons for{" "}
            <span className="bg-gradient-to-r from-primary to-amber-200 bg-clip-text text-transparent">
              every developer.
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
            A hosted CDN of cryptocurrency icons. Pick a style, copy the snippet.
          </p>

          {/* Path scheme */}
          <div className="mx-auto mt-5 inline-flex flex-wrap items-center justify-center gap-1 rounded-lg border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            <span className="text-foreground/60">{CDN_BASE}/</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">variant</span>
            <span>/</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">CODE</span>
            <span>.svg</span>
          </div>
        </div>

        {/* Snippet card */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur">
          {/* Toolbar */}
          <div className="flex flex-col gap-2 border-b border-border bg-surface-elevated/60 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                {lang === "bash" ? "terminal" : `snippet.${lang}`}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Segment
                value={variant}
                onChange={(v) => setVariant(v as Variant)}
                options={[
                  { value: "color", label: "Color" },
                  { value: "black", label: "Black" },
                  { value: "white", label: "White" },
                ]}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border bg-background/40 px-2">
            {SNIPPETS.map((s) => {
              const active = s.id === lang;
              return (
                <button
                  key={s.id}
                  onClick={() => setLang(s.id)}
                  className={`relative px-3 py-2 font-mono text-xs transition ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                  {active && <span className="absolute inset-x-2 -bottom-px h-px bg-primary" />}
                </button>
              );
            })}
            <div className="ml-auto pr-1">
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-primary" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code */}
          <div
            className="shiki-host overflow-auto px-5 py-4 font-mono text-[13px] leading-relaxed"
            style={{ maxHeight: "min(360px, 42vh)" }}
            dangerouslySetInnerHTML={{ __html: html || `<pre>${escapeHtml(code)}</pre>` }}
          />
        </div>

        <p className="mx-auto mt-3 max-w-md text-center text-xs text-muted-foreground">
          Replace <span className="font-mono text-foreground/80">btc</span> with any ticker —{" "}
          <span className="font-mono text-foreground/80">eth</span>,{" "}
          <span className="font-mono text-foreground/80">sol</span>,{" "}
          <span className="font-mono text-foreground/80">usdc</span>, and more.
        </p>
      </section>

      <footer className="border-t border-border/60 py-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-1 px-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} coin2trans icon — Free for personal & commercial use.</span>
          <span className="font-mono">Made for developers.</span>
        </div>
      </footer>
    </main>
  );
}

function Segment({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-md border border-border bg-background/60 p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-[5px] px-2.5 py-1 text-xs font-medium transition ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
