/**
 * Vercel Fluid Compute entry for Streamable HTTP MCP.
 *
 * Stateless JSON request/response — no sticky sessions, no long-lived GET /mcp
 * SSE. Same initialize / tools/list / tools/call and Bearer principal as
 * `npm run gateway`.
 *
 * Public URL after deploy: https://$VERCEL_URL/mcp
 * (do not hardcode a hostname in this repo).
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("tsx/esm", pathToFileURL("./"));

const { handleWebRequest } = await import("../packages/governed-mcp-gateway/src/web.ts");

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export default {
  async fetch(request) {
    return handleWebRequest(request);
  },
};
