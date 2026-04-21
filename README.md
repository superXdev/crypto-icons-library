# Coin2Trans Crypto Icons Library

Lightweight developer-focused CDN page and snippet generator for cryptocurrency icons.

## 400+ icon collection

This library provides access to 400+ cryptocurrency icons through a simple CDN URL pattern.
The upstream icon dataset from `spothq/cryptocurrency-icons` covers almost 500 currencies and altcoins, and this project focuses on serving those assets in a developer-friendly way.

## Source of icons

This project uses icon assets sourced from `spothq/cryptocurrency-icons`:

- Repository: [spothq/cryptocurrency-icons](https://github.com/spothq/cryptocurrency-icons)
- Upstream includes PNG and SVG icon sets, ticker manifest data, and multi-style variants.

## Current URL format

Icons are exposed as SVG with lowercase symbol codes:

`https://icon.coin2trans.com/{variant}/{symbol}.svg`

Examples:

- `https://icon.coin2trans.com/color/btc.svg`
- `https://icon.coin2trans.com/black/eth.svg`
- `https://icon.coin2trans.com/white/sol.svg`

Where:

- `variant` is one of `color`, `black`, or `white`
- `symbol` is a lowercase ticker, such as `btc`, `eth`, `usdc`

## Snippet examples

### HTML

```html
<img src="https://icon.coin2trans.com/color/btc.svg" alt="Bitcoin" loading="lazy" />
```

### React

```tsx
import { useMemo } from "react";

const CDN = "https://icon.coin2trans.com";

export function CoinIcon({ code, size = 64 }: { code: string; size?: number }) {
  const src = useMemo(() => `${CDN}/color/${code}.svg`, [code]);
  return <img src={src} alt={code} width={size} height={size} loading="lazy" />;
}
```

### CSS

```css
.coin-btc {
  width: 64px;
  height: 64px;
  background-image: url("https://icon.coin2trans.com/color/btc.svg");
  background-size: contain;
  background-repeat: no-repeat;
}
```

## Development

Install dependencies:

```bash
npm install
```

Run local development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

## Deploy to Cloudflare Workers

This project is configured to run on Cloudflare Workers using `wrangler.jsonc`.

Prerequisites:

- Cloudflare account
- Node.js 20+
- Wrangler CLI (use `npx` or global install)

### 1) Install dependencies

```bash
npm install
```

### 2) Authenticate Wrangler

```bash
npx wrangler login
```

### 3) Deploy

```bash
npx wrangler deploy
```

### 4) Set custom domain (optional)

After deploy, bind your custom domain in Cloudflare Dashboard:

- Go to `Workers & Pages`
- Open worker: `coin2trans-icon`
- Open `Settings` -> `Domains & Routes`
- Add your production domain (for example: `icon.coin2trans.com`)

### 5) Verify

Check:

- Worker URL responds successfully
- Root app loads correctly
- Sample icon URLs resolve, such as `https://icon.coin2trans.com/color/btc.svg`
