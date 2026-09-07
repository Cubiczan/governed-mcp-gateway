# Glama MCP introspection (https://glama.ai/mcp/servers/Cubiczan/governed-mcp-gateway)
# Builds from this Cubiczan workspace. Stdio only — no published ports.
#
# Glama's admin UI often generates its own image and wraps CMD with `mcp-proxy --`.
# If the crawler does not auto-detect this file, paste the values from
# docs/glama-release.md into https://glama.ai/mcp/servers/Cubiczan/governed-mcp-gateway/admin/dockerfile
#
#   Build steps: ["npm ci --no-audit --no-fund"]
#   CMD arguments: ["node", "--import", "tsx", "packages/governed-mcp-gateway/src/mcp.ts"]
#
# Stdio stdout is NDJSON (Glama mcp-proxy). Do not emit Content-Length headers.

FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages

RUN npm ci --no-audit --no-fund \
  && npm cache clean --force

ENV NODE_ENV=production

CMD ["node", "--import", "tsx", "packages/governed-mcp-gateway/src/mcp.ts"]
