# CirclFi MCP Server

The official [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for **[CirclFi](https://circlfi.com)** — the institutional-grade equity valuation platform.

This MCP server acts as a secure bridge between AI assistants (like Claude) and the CirclFi valuation engine, allowing your AI to instantly analyze, screen, and compare intrinsic valuations across 5,900+ US equities.

## Features & Available Tools

This MCP exposes two primary tools to your AI assistant:

### 1. `get_stock_valuation`
Fetch the complete intrinsic valuation breakdown for any specific stock ticker.

**Free Users:** You get instant access to the 3 fundamental valuation models:
1. Bayesian DCF (Discounted Cash Flow)
2. EPV (Earnings Power Value)
3. CUCE Ensemble (CirclFi Unified Consensus Estimate)

**Premium Subscribers:** You unlock the complete suite of 13 institutional valuation models, including:
4. EROIC Spread Valuation
5. First Chicago Method
6. Markov DDM (Dividend Discount Model)
7. ML-RIV (Machine Learning Residual Income Valuation)
8. PWERM (Probability-Weighted Expected Return Method)
9. Dynamic NAV (Net Asset Value)
10. OPM (Option Pricing Model)
11. Monte Carlo Simulations
12. Comparable Company Analysis (CCA)
13. Precedent Transactions Analysis

### 2. `get_market_screener` *(Premium Only)*
Command your AI to screen the entire US stock market (5,900+ stocks) in seconds.
* **Filter by:** Quality of Company (QOC), Value Trap Score, or specific Industries.
* **Data Formatting:** The AI can request the data in JSON for analysis, or generate a downloadable CSV file containing the screener results.
* **Fetch All:** Instantly pull the entire database of valuations.

## Installation & Setup (Claude Desktop)

To use this server, you need to add it to your Claude Desktop configuration.

1. Open your Claude Desktop configuration file. Usually located at:
   * **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   * **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the `circlfi` server to your `mcpServers` object as shown below.

### Setup for Free Users
If you are not subscribed, simply leave the `CIRCLFI_EMAIL` blank. You will automatically get access to the 3 free valuation models for any stock.

```json
{
  "mcpServers": {
    "circlfi": {
      "command": "npx",
      "args": ["-y", "github:negm17111995/Circlfi-MCP"],
      "env": {
        "CIRCLFI_EMAIL": ""
      }
    }
  }
}
```

### Setup for Premium Subscribers
If you have an active CirclFi subscription, replace the email below with the exact email you used to purchase via Gumroad. The server will securely verify your active subscription in real-time and unlock all 13 models + the market screener.

```json
{
  "mcpServers": {
    "circlfi": {
      "command": "npx",
      "args": ["-y", "github:negm17111995/Circlfi-MCP"],
      "env": {
        "CIRCLFI_EMAIL": "YOUR_GUMROAD_EMAIL@gmail.com"
      }
    }
  }
}
```

3. Restart Claude Desktop. You will now see the hammer icon 🔨 indicating that the CirclFi tools are available!

## How It Works (Security & Architecture)

This repository contains a **Thin Client**. 
It does not contain any sensitive algorithms, proprietary valuation models, or hardcoded API keys. 

When your AI assistant requests a valuation or runs a screener:
1. This client forwards the request (along with your configured `CIRCLFI_EMAIL`) to the private CirclFi API (`https://circlfi.com/api/mcp`).
2. The CirclFi API securely verifies your active subscription with Gumroad in real-time.
3. If valid, the proprietary 13-model data is returned directly to your AI assistant for analysis. If left blank or the subscription is expired, the AI receives the free tier data and an upsell message.

## Example Prompts to try with Claude
* *"What is the intrinsic value of AAPL according to CirclFi?"*
* *"Use the CirclFi market screener to generate a CSV of all Technology stocks with a Quality of Company score above 7 and a Value Trap score below 20."*
* *"Compare the Bayesian DCF valuations of MSFT and GOOGL."*

## Support
For issues with the MCP Server, please open a GitHub Issue. For questions regarding the valuations or your subscription, contact CirclFi support.
