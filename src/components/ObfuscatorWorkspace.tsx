import React, { useState, useEffect } from 'react';
import { SystemDefaults } from '../types';
import { FALLBACK_WORKER_CODE } from '../utils/fallbackWorker';
import { injectCustomDefaults, obfuscateCode } from '../utils/obfuscator';
import { Copy, Download, GitPullRequest, Code, Shield, Key, Eye, EyeOff, Check, RotateCcw, HelpCircle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

export default function ObfuscatorWorkspace() {
  const [config, setConfig] = useState<SystemDefaults>({
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
    subUserAgent: "",
    customPanelUrl: "",
    limitTotalReq: 0,
    expiryMs: 0,
    allowSyncWorker: false,
    nat64Prefix: "",
    enableDirectConfigs: false,
    autoUpdate: false,
    autoUpdateFormat: "normal"
  });

  const [rawCode, setRawCode] = useState<string>(FALLBACK_WORKER_CODE);
  const [compiledCode, setCompiledCode] = useState<string>('');
  const [isObfuscating, setIsObfuscating] = useState<boolean>(true);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compiled' | 'original'>('compiled');

  // Trigger reactive compilation
  useEffect(() => {
    try {
      // 1. First inject customized settings into fallback/raw code
      const customizedJs = injectCustomDefaults(rawCode, config);
      
      // 2. Apply obfuscation if enabled, or output raw customized JS
      if (isObfuscating) {
        const encryptedJs = obfuscateCode(customizedJs);
        setCompiledCode(encryptedJs);
      } else {
        setCompiledCode(customizedJs);
      }
    } catch (e) {
      console.error(e);
      setCompiledCode('Error compiling code: ' + (e as Error).message);
    }
  }, [config, rawCode, isObfuscating]);

  const handleFetchLiveCode = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch('https://raw.githubusercontent.com/itsyebekhe/nahan/refs/heads/main/_worker.js');
      if (response.ok) {
        const text = await response.text();
        setRawCode(text);
        showToast('fetched');
      } else {
        alert('خطا در دریافت کد از گیت‌هاب. از کد ذخیره‌شده پیش‌فرض استفاده شد.');
      }
    } catch (e) {
      alert('خطای اتصال به شبکه. بررسی کنید که تحریم‌شکن شما روشن باشد.');
    } finally {
      setFetchLoading(false);
    }
  };

  const showToast = (type: string) => {
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showToast(type);
  };

  const handleDownload = () => {
    const blob = new Blob([compiledCode], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '_worker.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('downloaded');
  };

  const resetConfig = () => {
    if (confirm('آیا می‌خواهید تنظیمات متغیرها به حالت اولیه بازنشانی شوند؟')) {
      setConfig({
        ...config,
        apiRoute: "sync",
        masterKey: "admin",
        deviceId: "",
        cleanIps: "",
        backupRelay: "",
        enableOpt1: true,
        enableOpt2: true,
        nat64Prefix: "",
        enableDirectConfigs: false,
        autoUpdate: false
      });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Toast Notifier */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-2xl z-50 animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4" />
          {copied === 'compiled' && 'کد خروجی در حافظه کپی شد!'}
          {copied === 'original' && 'کد اصلی در حافظه کپی شد!'}
          {copied === 'fetched' && 'کد اصلی با موفقیت از گیت‌هاب دریافت شد!'}
          {copied === 'downloaded' && 'فایل _worker.js دانلود شد!'}
        </div>
      )}

      {/* Left side: Customize Variables form */}
      <div className="xl:col-span-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10"></div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-900">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">پیکربندی متغیرها</span>
            <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">شخصی‌سازی کدهای ورکر</h3>
          </div>
          <button
            onClick={resetConfig}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition"
            title="بازنشانی به تنظیمات پیش‌فرض"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-right">
          {/* API Route & Master Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400">مسیر پنل مدیریت (API Route)</label>
              <input
                type="text"
                value={config.apiRoute}
                onChange={e => setConfig({ ...config, apiRoute: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 outline-none text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400">رمز ورود به پنل (Master Key)</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={config.masterKey}
                  onChange={e => setConfig({ ...config, masterKey: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 outline-none text-xs font-mono pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-indigo-400"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Device UUID */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400">شناسه UUID اتصال (deviceId)</label>
              <button
                type="button"
                onClick={() => setConfig({ ...config, deviceId: crypto.randomUUID() })}
                className="text-[10px] text-indigo-500 hover:text-indigo-400 font-bold bg-indigo-500/5 hover:bg-indigo-500/10 px-2 py-0.5 rounded transition"
              >
                تولید UUID جدید
              </button>
            </div>
            <input
              type="text"
              value={config.deviceId}
              onChange={e => setConfig({ ...config, deviceId: e.target.value })}
              placeholder="خالی بگذارید تا به طور خودکار از مسیر API تولید شود"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 outline-none text-xs font-mono"
            />
          </div>

          {/* Clean IPs */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400">لیست آی‌پی‌های تمیز کلودفلر (Clean IPs)</label>
            <textarea
              rows={2}
              value={config.cleanIps}
              onChange={e => setConfig({ ...config, cleanIps: e.target.value })}
              placeholder="1.2.3.4#پرچم&#10;5.6.7.8#آلمان&#10;9.10.11.12"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 outline-none text-xs font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Backup Relay IPs */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400">لیست آی‌پی‌های پروکسی/رله (Proxy IPs)</label>
            <textarea
              rows={2}
              value={config.backupRelay}
              onChange={e => setConfig({ ...config, backupRelay: e.target.value })}
              placeholder="104.20.0.1&#10;ip.clean.example.net"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 outline-none text-xs font-mono resize-none leading-relaxed"
            />
          </div>

          {/* NAT64 Prefix */}
          <div className="space-y-1">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400">پیشوند NAT64 برای اتصالات IPv6</label>
            <input
              type="text"
              value={config.nat64Prefix}
              onChange={e => setConfig({ ...config, nat64Prefix: e.target.value })}
              placeholder="64:ff9b::/96"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-indigo-500 outline-none text-xs font-mono"
            />
          </div>

          {/* Switches and Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs font-black text-slate-600 dark:text-slate-300">اتصال سریع TCP (TFO)</span>
              <input
                type="checkbox"
                checked={config.enableOpt1}
                onChange={e => setConfig({ ...config, enableOpt1: e.target.checked })}
                className="accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs font-black text-slate-600 dark:text-slate-300">مبهم‌سازی ECH فعال</span>
              <input
                type="checkbox"
                checked={config.enableOpt2}
                onChange={e => setConfig({ ...config, enableOpt2: e.target.checked })}
                className="accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs font-black text-slate-600 dark:text-slate-300">تولید کانفیگ مستقیم</span>
              <input
                type="checkbox"
                checked={config.enableDirectConfigs}
                onChange={e => setConfig({ ...config, enableDirectConfigs: e.target.checked })}
                className="accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs font-black text-slate-600 dark:text-slate-300">آپدیت خودکار مخزن</span>
              <input
                type="checkbox"
                checked={config.autoUpdate}
                onChange={e => setConfig({ ...config, autoUpdate: e.target.checked })}
                className="accent-indigo-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Right side: Obfuscator & Code output */}
      <div className="xl:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl transition-all flex flex-col justify-between">
        
        {/* Workspace controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('compiled')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'compiled'
                  ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              کد خروجی کامپایل شده
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'original'
                  ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              کد منبع اصلی ورکر
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Sync button */}
            <button
              onClick={handleFetchLiveCode}
              disabled={fetchLoading}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <GitPullRequest className={`w-4 h-4 ${fetchLoading ? 'animate-spin text-indigo-500' : ''}`} />
              {fetchLoading ? 'در حال دریافت...' : 'دریافت زنده کد از گیت‌هاب'}
            </button>
          </div>
        </div>

        {/* Tab view containers */}
        <div className="relative">
          {activeTab === 'compiled' ? (
            <div className="space-y-4 animate-fade-in text-right">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
                <span>_worker.js (آماده کپی و استقرار در کلودفلر)</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(compiledCode, 'compiled')}
                    className="text-indigo-500 hover:text-indigo-400 transition"
                  >
                    کپی کد
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-emerald-500 hover:text-emerald-400 transition"
                  >
                    دانلود فایل
                  </button>
                </div>
              </div>
              <textarea
                value={compiledCode}
                readOnly
                className="w-full h-80 bg-slate-950 border border-slate-900 rounded-2xl p-4 font-mono text-[10px] text-slate-300 outline-none resize-none leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in text-right">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
                <span>سورس کد اصلی ورکر (خام)</span>
                <button
                  onClick={() => handleCopy(rawCode, 'original')}
                  className="text-indigo-500 hover:text-indigo-400 transition"
                >
                  کپی کد اصلی
                </button>
              </div>
              <textarea
                value={rawCode}
                onChange={e => setRawCode(e.target.value)}
                className="w-full h-80 bg-slate-950 border border-slate-900 rounded-2xl p-4 font-mono text-[10px] text-slate-300 outline-none resize-none leading-relaxed"
                placeholder="کدهای خام ورکر خود را بنویسید یا دکمه دریافت زنده گیت‌هاب را بزنید..."
              />
            </div>
          )}
        </div>

        {/* Obfuscation explanation panel */}
        <div className="border-t border-slate-100 dark:border-darkborder/50 pt-5 mt-4 space-y-4 text-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">طرح امنیتی مبهم‌سازی بایت‌شفتینگ XOR</h4>
            </div>
            
            {/* Encryption toggle */}
            <button
              onClick={() => setIsObfuscating(!isObfuscating)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-500 hover:bg-indigo-500/10 transition"
            >
              وضعیت رمزنگاری:
              <span className={isObfuscating ? "text-emerald-500" : "text-rose-500"}>
                {isObfuscating ? 'فعال (امن)' : 'غیرفعال (عادی)'}
              </span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
            سورس‌کد نهایی ابتدا در لایه کلاینت با موتور بومی مرورگر (<code className="font-mono text-indigo-500">TextEncoder</code>) به صورت بایت‌های یونیکد خام استخراج می‌شود. پس از آن، به جهت رفع انسداد به واسطه سامانه‌های تحلیل ترافیک فعال در روترها، کدهای جاوااسکریپت با کلید تصادفی XOR که بر روی بستر کلاینت به صورت متغیر تولید شده مبهم‌سازی می‌گردند. در نهایت، بایندر نهایی در زمان اجرا بر روی لبه کلودفلر، بایت‌ها را در محیط مستقل با کلاس استاندارد <code className="font-mono text-indigo-500">TextDecoder</code> دکد کرده و به صورت پویا با ساختار ماژول همگام‌سازی می‌نماید.
          </p>
        </div>

      </div>
    </div>
  );
}
