#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Cloudflare Worker API URL
const API_URL = "https://circlfi.com/api/mcp";

// User provides their Gumroad email via env var in Claude config
const EMAIL = process.env.CIRCLFI_EMAIL || "";

const server = new Server({
  name: "circlfi-mcp",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_stock_valuation",
        description: "Get the latest intrinsic valuation of a single stock from CirclFi's 13-model engine. Includes Bayesian DCF, EPV, ML-RIV, etc.",
        inputSchema: {
          type: "object",
          properties: {
            ticker: {
              type: "string",
              description: "The stock ticker symbol (e.g., AAPL, MSFT)"
            }
          },
          required: ["ticker"]
        }
      },
      {
        name: "get_market_screener",
        description: "Screen the entire stock market (5,900+ stocks) using CirclFi data. Requires a paid subscription. Can filter by QOC, ValueTrapScore, or Industry. Can return JSON or CSV format.",
        inputSchema: {
          type: "object",
          properties: {
            filters: {
              type: "object",
              description: "Optional filters",
              properties: {
                minQoc: { type: "number", description: "Minimum Quality of Company score (0-10)" },
                maxVt: { type: "number", description: "Maximum Value Trap score (0-100, lower is better)" },
                industry: { type: "string", description: "Exact industry name" }
              }
            },
            fetchAll: {
              type: "boolean",
              description: "If true, fetch the entire dataset of 5,900+ stocks without filtering."
            },
            format: {
              type: "string",
              enum: ["json", "csv"],
              description: "Requested format. CSV is recommended if you plan to provide a downloadable file to the user."
            }
          }
        }
      }
    ]
  };
});

// Handle tool calls by forwarding them to Cloudflare
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: EMAIL,
        tool: request.params.name,
        args: request.params.arguments || {}
      })
    });

    const isCsv = response.headers.get("content-type")?.includes("csv");
    
    if (isCsv) {
      const text = await response.text();
      return {
        content: [{ type: "text", text: text }]
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        content: [{ type: "text", text: `Error: ${data.error || "Unknown error"}\nMessage: ${data.message || ""}` }],
        isError: true
      };
    }

    let output = JSON.stringify(data, null, 2);
    if (data.message) {
      output = `*** CIRCLFI SYSTEM MESSAGE ***\n${data.message}\n******************************\n\n${output}`;
    }

    return {
      content: [{ type: "text", text: output }]
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Connection error: ${error.message}` }],
      isError: true
    };
  }
});

// Start server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CirclFi MCP Server running on stdio");
}

run().catch(console.error);
