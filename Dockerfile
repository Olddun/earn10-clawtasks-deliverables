FROM node:22-alpine

WORKDIR /app

COPY package.json README.md LAUNCHGUIDE.md agents.txt llms.txt server.json ./
COPY bin ./bin
COPY agent-money ./agent-money
COPY agent-revenue-copilot ./agent-revenue-copilot
COPY .well-known ./.well-known

ENV NODE_ENV=production

ENTRYPOINT ["node", "/app/bin/agent-revenue-copilot-mcp.mjs"]
