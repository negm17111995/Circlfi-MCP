# CirclFi MCP Server

[![npm version](https://img.shields.io/npm/v/circlfi-mcp)](https://www.npmjs.com/package/circlfi-mcp)
[![MCP](https://img.shields.io/badge/Model%20Context%20Protocol-server-blue)](https://modelcontextprotocol.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](./LICENSE)

The official [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for **[CirclFi](https://circlfi.com)** — the institutional-grade equity valuation platform.

Give any AI assistant direct access to **13 valuation models across 5,900+ US stocks**, recalculated daily from SEC EDGAR, FRED, and GDELT data. Intrinsic values, Quality of Company scores (32 fundamental signals), and Value Trap risk scores — as native AI tools.

## Two ways to connect

### Option A — Remote server (no install, works everywhere)

Point any MCP-compatible client at the hosted endpoint:

```
https://circlfi.com/mcp
```

- **Transport**: Streamable HTTP (stateless), current MCP spec
- **Auth**: none needed for the free tier. Premium subscribers send their Gumroad purchase email as a bearer token: `Authorization: Bearer you@example.com`
- Works with ChatGPT connectors (developer mode), Claude custom connectors (web/desktop), agent frameworks, and any cloud client that can't run local processes.

### Option B — Local stdio server (npm)

```bash
npx -y circlfi-mcp
```

(Installing from GitHub also works: `npx -y github:negm17111995/Circlfi-MCP`)

## Install in your client

<details>
<summary><strong>Claude Desktop</strong></summary>

Add to `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`, Windows: `%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "circlfi": {
      "command": "npx",
      "args": ["-y", "circlfi-mcp"],
      "env": { "CIRCLFI_EMAIL": "" }
    }
  }
}
```

Restart Claude Desktop and look for the tools icon. Premium subscribers: put your Gumroad purchase email in `CIRCLFI_EMAIL`.
</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add circlfi -- npx -y circlfi-mcp
```

Or with premium access:

```bash
claude mcp add circlfi -e CIRCLFI_EMAIL=you@example.com -- npx -y circlfi-mcp
```
</details>

<details>
<summary><strong>Cursor</strong></summary>

[**One-click install →**](cursor://anysphere.cursor-deeplink/mcp/install?name=circlfi&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImNpcmNsZmktbWNwIl19)

Or add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "circlfi": { "command": "npx", "args": ["-y", "circlfi-mcp"] }
  }
}
```
</details>

<details>
<summary><strong>VS Code (Copilot / MCP)</strong></summary>

```bash
code --add-mcp '{"name":"circlfi","command":"npx","args":["-y","circlfi-mcp"]}'
```
</details>

<details>
<summary><strong>Windsurf</strong></summary>

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "circlfi": { "command": "npx", "args": ["-y", "circlfi-mcp"] }
  }
}
```
</details>

<details>
<summary><strong>ChatGPT (connectors / developer mode)</strong></summary>

ChatGPT connects to remote MCP servers. In **Settings → Connectors → Advanced → Developer mode**, add a custom connector with the URL:

```
https://circlfi.com/mcp
```
</details>

<details>
<summary><strong>Any other MCP client</strong></summary>

- **Local**: command `npx`, args `["-y", "circlfi-mcp"]`, optional env `CIRCLFI_EMAIL`
- **Remote**: Streamable HTTP at `https://circlfi.com/mcp`, optional header `Authorization: Bearer <gumroad-email>`
</details>

## Available tools

### `get_stock_valuation`

Complete intrinsic valuation profile for any US ticker: fair value, implied upside, and statistical confidence per model, plus the Quality of Company (QOC) score and Value Trap risk score.

**Free tier** — 3 models, no signup: Bayesian DCF (10,000-run Monte Carlo with jump-diffusion), Earnings Power Value (Greenwald), CUCE Ensemble (meta-model).

**Premium** — all 13 models: the above plus EROIC Spread, First Chicago, Markov DDM, ML-RIV, Dynamic NAV, PWERM, Regime Cross-Sectional, Sentiment SOTP, FTNN Topology, and RCMH-DCF. Full methodology: [circlfi.com/methodology](https://circlfi.com/methodology/)

### `get_market_screener` *(Premium)*

Screen all 5,900+ US stocks in one call. Filter by minimum QOC, maximum Value Trap score, or industry; return JSON for analysis or CSV for download.

## Example prompts

- *"What is the intrinsic value of AAPL according to CirclFi?"*
- *"Screen for Software stocks with QOC above 8 and Value Trap below 10, output as CSV."*
- *"Compare the Bayesian DCF valuations of MSFT and GOOGL and tell me which trades further below fair value."*

## How it works (security & architecture)

This repository is a **thin client** — no proprietary algorithms, no API keys. Tool calls are forwarded to the CirclFi API (`https://circlfi.com/api/mcp`), which verifies premium subscriptions with Gumroad in real time and returns model output. Free-tier requests need no account at all. The hosted remote endpoint (`https://circlfi.com/mcp`) exposes the identical tools directly over Streamable HTTP.

All output is quantitative model data for educational purposes — not financial advice ([disclaimer](https://circlfi.com/disclaimer/)).

## Pricing

- **Free**: 3 models per stock, unlimited tickers
- **Premium** ($39/mo or $299/yr): all 13 models + market screener — [subscribe via Gumroad](https://circlfi.gumroad.com/l/dwaxoj), then use your purchase email as `CIRCLFI_EMAIL` (local) or bearer token (remote)

## Support

Open a [GitHub Issue](https://github.com/negm17111995/Circlfi-MCP/issues) for server problems. For valuation methodology or subscription questions, see [circlfi.com](https://circlfi.com).
