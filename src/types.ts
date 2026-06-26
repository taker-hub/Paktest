export interface SystemDefaults {
  name: string;
  apiRoute: string;
  maintenanceHost: string;
  backupRelay: string;
  customRelay: string;
  masterKey: string;
  metricNode: string;
  cleanIps: string;
  slaveNodes: string;
  deviceId: string;
  mode: 'alpha' | 'beta' | 'both';
  agent: string;
  socketPorts: string;
  customDns: string;
  resolveIp: string;
  cascade: string;
  enableOpt1: boolean;
  enableOpt2: boolean;
  tgToken: string;
  tgChatId: string;
  tgAdminId: string;
  cfAccountId: string;
  cfApiToken: string;
  cfWorkerName: string;
  isPaused: boolean;
  silentAlerts: boolean;
  githubRepo: string;
  nameStrategy: string;
  namePrefix: string;
  tgBotLang: 'fa' | 'en';
  subUserAgent: string;
  customPanelUrl: string;
  limitTotalReq: number;
  expiryMs: number;
  allowSyncWorker: boolean;
  nat64Prefix: string;
  enableDirectConfigs: boolean;
  autoUpdate: boolean;
  autoUpdateFormat: 'normal' | 'obfuscated';
}

export interface MockUser {
  id: string;
  name: string;
  limitTotalReq: number | null;
  limitDailyReq: number | null;
  expiryMs: number | null;
  notes?: string;
  maxConfigs?: number | null;
  proxyIp?: string | null;
  cleanIp?: string | null;
  userMode?: 'alpha' | 'beta' | 'both' | null;
  userPorts?: string | null;
  userNodes?: string | null;
  nat64?: string | null;
  createdAt: number;
  isPaused?: boolean;
  disabledReason?: string | null;
  disabledAt?: number | null;
}

export interface FakeConfig {
  name: string;
  enabled: boolean;
}
