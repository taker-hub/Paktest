export const FALLBACK_WORKER_CODE = `import { connect } from "cloudflare:sockets";

/* 
 * Nahan (نهان) - IoT & Subscription Serverless Transit Gateway
 * Powered by Cloudflare Workers and D1 SQLite.
 */

const CURRENT_VERSION = "2.6.0";

const SYSTEM_DEFAULTS = {
    name: "Nahan Gateway",
    apiRoute: "sync",
    maintenanceHost: "https://www.ubuntu.com, https://www.docker.com",
    backupRelay: "",
    customRelay: "",
    masterKey: "admin",
    metricNode: "time.is",
    cleanIps: "",
    slaveNodes: "",
    deviceId: "",
    mode: "both",
    agent: "chrome",
    socketPorts: "443,2053,2083",
    customDns: "https://cloudflare-dns.com/dns-query",
    resolveIp: "1.1.1.1",
    cascade: "",
    enableOpt1: true,
    enableOpt2: true,
    tgToken: "",
    tgChatId: "",
    tgAdminId: "",
    cfAccountId: "",
    cfApiToken: "",
    cfWorkerName: "",
    isPaused: false,
    silentAlerts: false,
    githubRepo: "itsyebekhe/nahan",
    nameStrategy: "default",
    namePrefix: "Core",
    tgBotLang: "fa",
    users: [],
    subUserAgent: "",
    customPanelUrl: "",
    limitTotalReq: 0,
    expiryMs: 0,
    linkedPanels: [],
    hubPanelUrl: "",
    allowSyncWorker: false,
    nat64Prefix: "",
    enableDirectConfigs: false,
    autoUpdate: false,
    autoUpdateFormat: "normal",
    fakeConfigs: [
        { name: "📊 {usage}", enabled: true },
        { name: "📅 {expiry}", enabled: true }
    ],
};

let sysConfig = { ...SYSTEM_DEFAULTS };
let isolateStartTime = Date.now();
let activeConnections = 0;

export default {
  async fetch(request, env, ctx) {
    try {
      if (env.IOT_DB) {
        const stored = await env.IOT_DB.prepare("SELECT value FROM kv_store WHERE key = ?").bind("sys_config").all();
        if (stored.results && stored.results.length > 0) {
          sysConfig = { ...SYSTEM_DEFAULTS, ...JSON.parse(stored.results[0].value) };
        }
      }
      
      const url = new URL(request.url);
      const isWebSocket = request.headers.get("Upgrade")?.toLowerCase() === "websocket";

      if (isWebSocket) {
        if (sysConfig.isPaused) return new Response("Service Paused", { status: 503 });
        return await handleWebSocket(request, env, ctx);
      }

      const path = url.pathname.replace(/\\/$/, "");
      const apiPrefix = "/" + sysConfig.apiRoute;

      if (path === apiPrefix + "/dash") {
        return new Response(getDashboardUI(), { headers: { "Content-Type": "text/html;charset=utf-8" } });
      }

      if (path === apiPrefix + "/api/auth" && request.method === "POST") {
        const data = await request.json();
        if (data.key === sysConfig.masterKey) {
          return new Response(JSON.stringify({ success: true, config: sysConfig, version: CURRENT_VERSION }), { headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ success: false }), { status: 401 });
      }

      // Default Camouflage Page Redirect
      return fetch(new Request("https://www.ubuntu.com" + url.pathname, request));
    } catch (e) {
      return new Response("Error: " + e.message, { status: 500 });
    }
  }
};

async function handleWebSocket(request, env, ctx) {
  const [client, webSocket] = Object.values(new WebSocketPair());
  webSocket.accept();
  activeConnections++;
  
  webSocket.addEventListener("close", () => activeConnections--);
  webSocket.addEventListener("error", () => activeConnections--);
  
  let remoteSocket;
  let writer;
  
  webSocket.addEventListener("message", async (event) => {
    try {
      if (!remoteSocket) {
        // Simple TCP Socket connection for telemetry proxying
        remoteSocket = connect({ hostname: sysConfig.resolveIp || "1.1.1.1", port: 443 });
        await remoteSocket.opened;
        writer = remoteSocket.writable.getWriter();
        
        remoteSocket.readable.pipeTo(new WritableStream({
          write(chunk) { webSocket.send(chunk); }
        }));
      }
      await writer.write(event.data);
    } catch (e) {
      webSocket.close();
    }
  });

  return new Response(null, { status: 101, webSocket: client });
}

function getDashboardUI() {
  return "Nahan Admin Dashboard Portal UI - Authenticate using Master Key";
}
`;
