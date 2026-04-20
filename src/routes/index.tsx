import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Github, Sparkles } from "lucide-react";
import { codeToHtml } from "shiki";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Cryptons — Free Cryptocurrency Icons for Developers" },
      {
        name: "description",
        content:
          "Free, open-source cryptocurrency icon CDN. 70+ coins in color & black, 32 & 64px. Copy a URL and ship.",
      },
      { property: "og:title", content: "Cryptons — Free Cryptocurrency Icons" },
      {
        property: "og:description",
        content: "Copy-paste CDN URLs for 70+ crypto icons. Free for any project.",
      },
    ],
  }),
});

const CDN_BASE = "https://cdn.cryptons.dev";
type Size = 32 | 64;
type Variant = "color" | "black";

function buildPath(size: Size, variant: Variant, code: string) {
  return `${CDN_BASE}/${size}/${variant}/${code}.png`;
}

type Lang = "html" | "jsx" | "css" | "bash";

const SNIPPETS: { id: Lang; label: string; build: (s: Size, v: Variant) => string }[] = [
  {
    id: "html",
    label: "HTML",
    build: (s, v) =>
      `<!-- Drop-in <img>, no build step required -->
<img
  src="${buildPath(s, v, "BTC")}"
  alt="Bitcoin"
  width="${s}"
  height="${s}"
  loading="lazy"
/>`,
  },
  {
    id: "jsx",
    label: "React",
    build: (s, v) =>
      `import { useMemo } from "react";

const CDN = "${CDN_BASE}";

export function CoinIcon({ code, size = ${s} }: { code: string; size?: number }) {
  const src = useMemo(
    () => \`\${CDN}/\${size}/${v}/\${code.toUpperCase()}.png\`,
    [code, size],
  );
  return <img src={src} alt={code} width={size} height={size} loading="lazy" />;
}

// Usage
<CoinIcon code="ETH" />`,
  },
  {
    id: "css",
    label: "CSS",
    build: (s, v) =>
      `.coin-btc {
  width: ${s}px;
  height: ${s}px;
  background-image: url("${buildPath(s, v, "BTC")}");
  background-size: contain;
  background-repeat: no-repeat;
}`,
  },
  {
    id: "bash",
    label: "cURL",
    build: (s, v) =>
      `# Download a single icon
curl -O ${buildPath(s, v, "BTC")}

# Batch download a few coins
for c in BTC ETH SOL USDC; do
  curl -O "${CDN_BASE}/${s}/${v}/$c.png"
done`,
  },
];

function Index() {
  const [size, setSize] = useState<Size>(64);
  const [variant, setVariant] = useState<Variant>("color");
  const [lang, setLang] = useState<Lang>("html");
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const s = SNIPPETS.find((x) => x.id === lang)!;
    return s.build(size, variant);
  }, [lang, size, variant]);

  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: lang === "jsx" ? "tsx" : lang,
      theme: "vitesse-dark",
    })
      .then((out) => {
        if (!cancelled) setHtml(out);
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
    <main className="min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-mono text-sm tracking-tight">
            cryptons<span className="text-primary">.dev</span>
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

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-10 pb-10 text-center sm:pt-16">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Free & open source · MIT licensed
        </div>
        <h1 className="mx-auto mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Crypto icons for{" "}
          <span className="bg-gradient-to-r from-primary to-amber-200 bg-clip-text text-transparent">
            every developer.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          A hosted CDN of cryptocurrency icons. Pick a size, pick a style, copy the snippet.
        </p>

        {/* Path scheme */}
        <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-1 rounded-lg border border-border bg-surface/60 px-3 py-2 font-mono text-xs text-muted-foreground sm:text-sm">
          <span className="text-foreground/60">{CDN_BASE}/</span>
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">size</span>
          <span>/</span>
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">variant</span>
          <span>/</span>
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">CODE</span>
          <span>.png</span>
        </div>
      </section>

      {/* Snippet card */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-border bg-surface-elevated/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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
                value={String(size)}
                onChange={(v) => setSize(Number(v) as Size)}
                options={[
                  { value: "32", label: "32" },
                  { value: "64", label: "64" },
                ]}
              />
              <Segment
                value={variant}
                onChange={(v) => setVariant(v as Variant)}
                options={[
                  { value: "color", label: "Color" },
                  { value: "black", label: "Black" },
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
                  className={`relative px-3 py-2.5 font-mono text-xs transition ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-px h-px bg-primary" />
                  )}
                </button>
              );
            })}
            <div className="ml-auto pr-1">
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
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
          <div className="relative">
            <div
              className="shiki-host overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html || `<pre>${escapeHtml(code)}</pre>` }}
            />
          </div>
        </div>

        <p className="mx-auto mt-4 max-w-md text-center text-xs text-muted-foreground">
          Replace <span className="font-mono text-foreground/80">BTC</span> with any ticker —{" "}
          <span className="font-mono text-foreground/80">ETH</span>,{" "}
          <span className="font-mono text-foreground/80">SOL</span>,{" "}
          <span className="font-mono text-foreground/80">USDC</span>, and more.
        </p>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} cryptons.dev — Free for personal & commercial use.</span>
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
