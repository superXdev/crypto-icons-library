import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, Search, Github, Sparkles } from "lucide-react";
import { CRYPTOS } from "@/lib/cryptos";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Cryptons — Free Cryptocurrency Icons for Developers" },
      {
        name: "description",
        content:
          "Free, open-source cryptocurrency icon set. 70+ coins in color & black, sized 32 & 64px. Copy a CDN URL and ship.",
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

function Index() {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState<Size>(64);
  const [variant, setVariant] = useState<Variant>("color");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CRYPTOS;
    return CRYPTOS.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [query]);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? null : k)), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-mono text-sm tracking-tight">cryptons<span className="text-primary">.dev</span></span>
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
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-12 text-center sm:pt-16 sm:pb-16">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Free & open source · MIT licensed
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Crypto icons for{" "}
          <span className="bg-gradient-to-r from-primary to-amber-200 bg-clip-text text-transparent">
            every developer.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          A clean, hosted set of {CRYPTOS.length}+ cryptocurrency icons. Copy a URL, drop it in your
          app. No build step, no signup.
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

      {/* Controls */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface/40 p-3 backdrop-blur sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Bitcoin, ETH, Solana…"
              className="w-full rounded-lg border border-border bg-background/60 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex gap-2">
            <SegmentGroup
              value={String(size)}
              onChange={(v) => setSize(Number(v) as Size)}
              options={[
                { value: "32", label: "32px" },
                { value: "64", label: "64px" },
              ]}
            />
            <SegmentGroup
              value={variant}
              onChange={(v) => setVariant(v as Variant)}
              options={[
                { value: "color", label: "Color" },
                { value: "black", label: "Black" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface/40 p-12 text-center text-sm text-muted-foreground">
            No icons match "{query}".
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((c) => {
              const url = buildPath(size, variant, c.code);
              const isCopied = copied === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => copy(url, c.code)}
                  className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-elevated"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-background/60 ring-1 ring-border transition group-hover:ring-primary/30">
                    <CryptoMark code={c.code} variant={variant} />
                  </div>
                  <div className="w-full text-center">
                    <div className="font-mono text-sm font-medium tracking-tight">{c.code}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.name}</div>
                  </div>
                  <div
                    className={`absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-md bg-background/80 py-1.5 text-[11px] font-medium backdrop-blur transition ${
                      isCopied
                        ? "text-primary opacity-100"
                        : "text-muted-foreground opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3" /> Copied URL
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy URL
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Usage */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock
            title="HTML"
            code={`<img src="${buildPath(size, variant, "BTC")}" alt="Bitcoin" width="${size}" height="${size}" />`}
            onCopy={(t) => copy(t, "snippet-html")}
            copied={copied === "snippet-html"}
          />
          <CodeBlock
            title="React / JSX"
            code={`<img\n  src="${buildPath(size, variant, "ETH")}"\n  alt="Ethereum"\n  width={${size}}\n  height={${size}}\n/>`}
            onCopy={(t) => copy(t, "snippet-jsx")}
            copied={copied === "snippet-jsx"}
          />
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} cryptons.dev — Free for personal & commercial use.</span>
          <span className="font-mono">Made for developers.</span>
        </div>
      </footer>
    </main>
  );
}

function SegmentGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-background/60 p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
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

function CodeBlock({
  title,
  code,
  onCopy,
  copied,
}: {
  title: string;
  code: string;
  onCopy: (text: string) => void;
  copied: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
        <button
          onClick={() => onCopy(code)}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-background/60 hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Inline SVG fallback "mark" rendered for each coin.
 * Since the CDN is illustrative, we render a deterministic colored monogram so
 * the grid looks polished without external image requests.
 */
function CryptoMark({ code, variant }: { code: string; variant: Variant }) {
  // Hash code -> hue
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) % 360;
  const bg =
    variant === "black"
      ? "oklch(0.18 0.01 250)"
      : `oklch(0.62 0.16 ${h})`;
  const fg = variant === "black" ? "oklch(0.97 0 0)" : "oklch(0.18 0.02 250)";
  const label = code.length <= 4 ? code : code.slice(0, 3);
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12">
      <circle cx="32" cy="32" r="30" fill={bg} />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fontWeight="600"
        fontSize={label.length >= 4 ? 16 : 20}
        fill={fg}
      >
        {label}
      </text>
    </svg>
  );
}
