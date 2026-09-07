/**
 * Stdio MCP process entry for Glama / `npm run mcp`.
 * HTTP control-plane remains `src/server.ts`.
 */
import { serveStdio } from "./stdio.ts";

await serveStdio();
