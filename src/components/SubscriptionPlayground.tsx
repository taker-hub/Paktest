import React, { useState, useEffect } from 'react';
import { MockUser, FakeConfig } from '../types';
import { Plus, Trash, Globe, Shield, Database, Copy, Check, Terminal, Play, Settings, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function SubscriptionPlayground() {
  const [users, setUsers] = useState<MockUser[]>([
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Ali_Gateway",
      limitTotalReq: 6000 * 50, // 50 GB
      limitDailyReq: 3000, // 500 MB
      expiryMs: Date.now() + 30 * 86400000, // 30 days
      createdAt: Date.now(),
      proxyIp: "104.20.0.1",
      cleanIp: "162.159.192.1",
      userMode: "both",
      userPorts: "443"
    },
    {
      id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      name: "Sara_Node",
      limitTotalReq: null,
      limitDailyReq: null,
      expiryMs: null,
      createdAt: Date.now(),
      userMode: "alpha",
      userPorts: "2053"
    }
  ]);

  const [newUser, setNewUser] = useState<{
    name: string;
    trafficLimitGb: string;
    days: string;
    proxyIp: string;
    cleanIp: string;
    userMode: 'alpha' | 'beta' | 'both';
    userPorts: string;
  }>({
    name: '',
    trafficLimitGb: '',
    days: '',
    proxyIp: '',
    cleanIp: '',
    userMode: 'both',
    userPorts: '443'
  });

  const [selectedUser, setSelectedUser] = useState<string>('550e8400-e29b-41d4-a716-446655440000');
  const [format, setFormat] = useState<'uri' | 'yaml' | 'json'>('yaml');
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleAddUser = () => {
    if (!newUser.name.trim()) return alert('لطفاً نام مشترک را وارد کنید.');
    
    const id = crypto.randomUUID();
    const created: MockUser = {
      id,
      name: newUser.name.trim(),
      limitTotalReq: newUser.trafficLimitGb ? Math.floor(parseFloat(newUser.trafficLimitGb) * 6000) : null,
      limitDailyReq: null,
      expiryMs: newUser.days ? Date.now() + parseInt(newUser.days) * 86400000 : null,
      proxyIp: newUser.proxyIp || null,
      cleanIp: newUser.cleanIp || null,
      userMode: newUser.userMode,
      userPorts: newUser.userPorts || "443",
      createdAt: Date.now()
    };

    setUsers([...users, created]);
    setSelectedUser(id);
    setNewUser({
      name: '',
      trafficLimitGb: '',
      days: '',
      proxyIp: '',
      cleanIp: '',
      userMode: 'both',
      userPorts: '443'
    });
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) return alert('باید حداقل یک مشترک فرضی در لیست باقی بماند.');
    const nextList = users.filter(u => u.id !== id);
    setUsers(nextList);
    if (selectedUser === id) setSelectedUser(nextList[0].id);
  };

  // Compile Simulated Subscription response in browser
  useEffect(() => {
    const userObj = users.find(u => u.id === selectedUser);
    if (!userObj) return;

    const proxyIp = userObj.proxyIp || "104.20.0.1";
    const cleanIp = userObj.cleanIp || "162.159.192.1";
    const ports = (userObj.userPorts || "443").split(',').map(p => p.trim());
    const mode = userObj.userMode || "both";

    if (format === 'yaml') {
      // Generate Clash Verge YAML
      let proxiesYaml = '';
      let namesList: string[] = [];

      ports.forEach((port, idx) => {
        const isTls = port !== "80";
        if (mode === 'alpha' || mode === 'both') {
          const name = `VLESS-Node-${port}-${userObj.name}`;
          namesList.push(`"${name}"`);
          proxiesYaml += `- name: "${name}"
  type: vless
  server: ${cleanIp}
  port: ${port}
  uuid: ${userObj.id}
  udp: true
  tls: ${isTls}
  servername: nahan-edge.workers.dev
  network: ws
  ws-opts:
    path: "/ws-telemetry-nahan"
    headers:
      Host: nahan-edge.workers.dev
  skip-cert-verify: true\n`;
        }

        if (mode === 'beta' || mode === 'both') {
          const name = `Trojan-Node-${port}-${userObj.name}`;
          namesList.push(`"${name}"`);
          proxiesYaml += `- name: "${name}"
  type: trojan
  server: ${cleanIp}
  port: ${port}
  password: ${userObj.id}
  udp: true
  tls: ${isTls}
  sni: nahan-edge.workers.dev
  network: ws
  ws-opts:
    path: "/ws-telemetry-nahan"
    headers:
      Host: nahan-edge.workers.dev
  skip-cert-verify: true\n`;
        }
      });

      const output = `mixed-port: 7890
allow-lan: false
mode: rule
log-level: warning
ipv6: true

proxies:
${proxiesYaml}
proxy-groups:
  - name: "✅ Selector"
    type: select
    proxies:
      - "💦 Best Ping 🚀"
      ${namesList.join('\n      ')}
  - name: "💦 Best Ping 🚀"
    type: url-test
    url: "https://www.gstatic.com/generate_204"
    interval: 30
    tolerance: 50
    proxies:
      ${namesList.join('\n      ')}

rules:
  - DOMAIN-SUFFIX,ir,DIRECT
  - GEOIP,IR,DIRECT
  - MATCH,✅ Selector`;

      setGeneratedOutput(output);
    } else if (format === 'json') {
      // Generate SingBox JSON
      const outbounds: any[] = [];
      const tags: string[] = [];

      ports.forEach(port => {
        const isTls = port !== "80";
        if (mode === 'alpha' || mode === 'both') {
          const tag = `VLESS-${port}-${userObj.name}`;
          tags.push(tag);
          outbounds.push({
            type: "vless",
            tag,
            server: cleanIp,
            server_port: parseInt(port),
            uuid: userObj.id,
            tls: {
              enabled: isTls,
              server_name: "nahan-edge.workers.dev",
              insecure: true
            },
            transport: {
              type: "ws",
              path: "/ws-telemetry-nahan",
              headers: {
                Host: "nahan-edge.workers.dev"
              }
            }
          });
        }

        if (mode === 'beta' || mode === 'both') {
          const tag = `Trojan-${port}-${userObj.name}`;
          tags.push(tag);
          outbounds.push({
            type: "trojan",
            tag,
            server: cleanIp,
            server_port: parseInt(port),
            password: userObj.id,
            tls: {
              enabled: isTls,
              server_name: "nahan-edge.workers.dev",
              insecure: true
            },
            transport: {
              type: "ws",
              path: "/ws-telemetry-nahan",
              headers: {
                Host: "nahan-edge.workers.dev"
              }
            }
          });
        }
      });

      const fullConfig = {
        log: { level: "warn", timestamp: true },
        dns: {
          servers: [
            { address: "https://8.8.8.8/dns-query", tag: "dns-remote" },
            { address: "8.8.8.8", detour: "direct", tag: "dns-direct" }
          ]
        },
        inbounds: [
          { type: "tun", tag: "tun-in", address: ["172.19.0.1/28"], auto_route: true, stack: "mixed" }
        ],
        outbounds: [
          ...outbounds,
          {
            type: "selector",
            tag: "✅ Selector",
            outbounds: ["Best Ping 🚀", ...tags]
          },
          {
            type: "urltest",
            tag: "Best Ping 🚀",
            outbounds: [...tags],
            url: "https://www.gstatic.com/generate_204"
          },
          { type: "direct", tag: "direct" }
        ],
        route: {
          rules: [
            { geoip: ["private"], outbound: "direct" },
            { geoip: ["ir"], outbound: "direct" }
          ],
          final: "✅ Selector"
        }
      };

      setGeneratedOutput(JSON.stringify(fullConfig, null, 2));
    } else {
      // Generate Raw Base64 URIs
      let configsList: string[] = [];
      ports.forEach(port => {
        const sec = port === "80" ? "none" : "tls";
        if (mode === 'alpha' || mode === 'both') {
          configsList.push(`vless://${userObj.id}@${cleanIp}:${port}?encryption=none&security=${sec}&sni=nahan-edge.workers.dev&type=ws&host=nahan-edge.workers.dev&path=/ws-telemetry-nahan#VLESS-${port}-${userObj.name}`);
        }
        if (mode === 'beta' || mode === 'both') {
          configsList.push(`trojan://${userObj.id}@${cleanIp}:${port}?security=${sec}&sni=nahan-edge.workers.dev&type=ws&host=nahan-edge.workers.dev&path=/ws-telemetry-nahan#Trojan-${port}-${userObj.name}`);
        }
      });

      // Simple mock info header that gateway panels send
      const usedBytes = userObj.limitTotalReq ? Math.floor(userObj.limitTotalReq * 0.45) : 340500000;
      const totalBytes = userObj.limitTotalReq ? userObj.limitTotalReq : 0;
      const mockHeader = `Subscription-UserInfo: upload=0; download=${usedBytes}; total=${totalBytes}; expire=0`;

      const finalBody = configsList.join('\n');
      setGeneratedOutput(`# MOCK RESPONSE HEADERS:\n# ${mockHeader}\n\n${btoa(finalBody)}`);
    }
  }, [users, selectedUser, format]);

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeUserObj = users.find(u => u.id === selectedUser);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Simulated Subscribers database */}
      <div className="xl:col-span-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden transition-all text-right">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-10"></div>
        <div className="pb-3 border-b border-slate-100 dark:border-slate-900">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">پایگاه داده فرضی</span>
          <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">مدیریت کاربران و محدودیت‌ها</h3>
        </div>

        {/* Existing Users List */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">لیست کاربران فعال:</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {users.map(u => (
              <div 
                key={u.id}
                onClick={() => setSelectedUser(u.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedUser === u.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(u.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-3 min-w-0 text-right">
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                    <p className="text-[9px] font-mono text-slate-400 truncate">{u.id.split('-')[0]}...</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${u.userMode === 'alpha' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Mock User form */}
        <div className="border-t border-slate-100 dark:border-slate-900 pt-4 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">افزودن مشترک تستی جدید:</h4>
          
          <div className="space-y-2">
            <input
              type="text"
              placeholder="نام کاربر (مثال: Mehrdad_Vpn)"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-emerald-500 outline-none text-xs"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="حجم ترافیک (GB)"
                value={newUser.trafficLimitGb}
                onChange={e => setNewUser({ ...newUser, trafficLimitGb: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-emerald-500 outline-none text-xs"
              />
              <input
                type="number"
                placeholder="مدت اعتبار (روز)"
                value={newUser.days}
                onChange={e => setNewUser({ ...newUser, days: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-emerald-500 outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="آی‌پی تمیز سفارشی"
                value={newUser.cleanIp}
                onChange={e => setNewUser({ ...newUser, cleanIp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-emerald-500 outline-none text-xs font-mono"
              />
              <input
                type="text"
                placeholder="آی‌پی پروکسی رله"
                value={newUser.proxyIp}
                onChange={e => setNewUser({ ...newUser, proxyIp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-emerald-500 outline-none text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <select
                value={newUser.userMode}
                onChange={e => setNewUser({ ...newUser, userMode: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 focus:border-emerald-500 outline-none"
              >
                <option value="both">پروتکل دوگانه</option>
                <option value="alpha">VLESS</option>
                <option value="beta">Trojan</option>
              </select>
              <input
                type="text"
                placeholder="پورت (مثال: 443)"
                value={newUser.userPorts}
                onChange={e => setNewUser({ ...newUser, userPorts: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-emerald-500 outline-none font-mono"
              />
            </div>

            <button
              onClick={handleAddUser}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/10 transition-colors"
            >
              ثبت و الحاق مشترک
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Subscription Output Terminal */}
      <div className="xl:col-span-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden transition-all text-right flex flex-col justify-between">
        
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('yaml')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                format === 'yaml'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clash Verge (YAML)
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                format === 'json'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sing-Box (JSON)
            </button>
            <button
              onClick={() => setFormat('uri')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                format === 'uri'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Base64 Sub (URI)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              دروازه فرضی فعال
            </span>
          </div>
        </div>

        {/* Selected User Info Status */}
        {activeUserObj && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-darkborder/50">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">نام کاربر شبیه‌ساز</span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">{activeUserObj.name}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">شناسه UUID فرضی</span>
              <span className="text-[10px] font-mono text-slate-500 truncate block max-w-[130px]">{activeUserObj.id}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">محدودیت ترافیک</span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                {activeUserObj.limitTotalReq ? `${(activeUserObj.limitTotalReq / 6000).toFixed(0)} GB` : 'نامحدود'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold">پورت‌های تعریف شده</span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 font-mono">{activeUserObj.userPorts || "443"}</span>
            </div>
          </div>
        )}

        {/* Generated Config Output */}
        <div className="relative">
          <div className="absolute top-3 left-3">
            <button
              onClick={handleCopyText}
              className="p-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'کپی شد' : 'کپی خروجی'}
            </button>
          </div>
          <textarea
            value={generatedOutput}
            readOnly
            className="w-full h-80 bg-slate-950 border border-slate-900 rounded-2xl p-4 pt-14 font-mono text-[10px] text-slate-300 outline-none resize-none leading-relaxed text-left"
            style={{ direction: 'ltr' }}
          />
        </div>

        {/* Help block */}
        <div className="border-t border-slate-100 dark:border-darkborder/50 pt-4 mt-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
            💡 <strong>شبیه‌ساز رفتار گیت‌وی:</strong> این شبیه‌ساز دقیقاً نشان می‌دهد که گیت‌وی نهان چطور درخواست کلاینت‌ها را مدیریت می‌کند. هنگامی که ساب‌اسکریپشن کاربر (مثلاً کلش یا سینگ‌باکس) به گیت‌وی فراخوانی می‌شود، کدهای ورکر با تشخیص نوع کلاینت از طریق هدر User-Agent، بادی متناسب با هسته آن نرم‌افزار را در قالب مناسب (YAML یا JSON) پاسخ می‌دهد.
          </p>
        </div>

      </div>
    </div>
  );
}
