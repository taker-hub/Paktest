import React, { useState } from 'react';
import { Database, Cpu, Settings, Play, ArrowRight, ArrowLeft, CheckCircle2, Shield, Lock, Terminal, Sparkles } from 'lucide-react';

export default function SetupGuide() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      title: 'ایجاد پایگاه داده D1 SQLite',
      subtitle: 'مرحله اول: ذخیره‌سازی ابری امن تنظیمات',
      icon: <Database className="w-5 h-5 text-indigo-400" />,
      description: 'در این گام، یک پایگاه داده سبک و با کارایی بالا در سرویس Cloudflare D1 ایجاد می‌کنیم تا تنظیمات و ترافیک کاربران حتی پس از آپدیت سورس‌کد ورکر به‌طور دائمی ذخیره شوند.',
      instructions: [
        'وارد پنل مدیریت Cloudflare (dash.cloudflare.com) شوید.',
        'از منوی کناری به بخش Storage & Databases و سپس D1 بروید.',
        'روی دکمه Create database کلیک کنید.',
        'نام پایگاه داده را با حروف کوچک وارد کنید (به عنوان مثال iot_db).',
        'روی دکمه نهایی Create کلیک کنید.'
      ]
    },
    {
      title: 'ساخت و دپلوی ورکر (Worker)',
      subtitle: 'مرحله دوم: استقرار دروازه ترانزیت شبکه',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      description: 'یک سرویس پردازش بدون سرور (Serverless) در بستر کلودفلر ایجاد می‌کنیم تا به عنوان دروازه ترانزیت ترافیک شما عمل کند.',
      instructions: [
        'در منوی ناوبری کلودفلر به بخش Compute و سپس Workers & Pages بروید.',
        'روی دکمه Create application و سپس Create Worker کلیک کنید.',
        'یک نام منحصر‌به‌فرد برای ورکر خود بنویسید (مثلاً nahan-core).',
        'روی دکمه Deploy کلیک کنید تا ورکر پایه ایجاد شود.',
        'در صفحه تایید، روی Edit code کلیک کنید تا ادیتور زنده باز شود.',
        'کد کپی‌شده از بخش «کامپایلر و مبهم‌ساز» را جایگزین کل کدهای پیش‌فرض کرده و روی Save and Deploy کلیک کنید.'
      ]
    },
    {
      title: 'اتصال (Bind) پایگاه داده به ورکر',
      subtitle: 'مرحله سوم: همگام‌سازی ارتباط دیتابیس با دروازه',
      icon: <Settings className="w-5 h-5 text-indigo-400" />,
      description: 'در این گام ورکر و پایگاه داده ایجاد شده را با تعریف یک متغیر به یکدیگر متصل می‌کنیم تا ورکر بتواند تغییرات را در دیتابیس بنویسد.',
      instructions: [
        'در داشبورد ورکر خود (مثلاً nahan-core) وارد زبانه Settings شوید.',
        'زیرمنوی Bindings را پیدا کرده و روی دکمه Add binding کلیک کنید.',
        'نوع بایندینگ را D1 Database انتخاب کنید.',
        'نام متغیر (Variable Name) را دقیقاً برابر عبارت IOT_DB با حروف بزرگ انگلیسی قرار دهید (بسیار مهم).',
        'پایگاه داده ساخته شده در مرحله اول را انتخاب کنید.',
        'روی Save کلیک کنید و در بالای صفحه ورکر روی Deploy کلیک کنید تا ورکر مجدداً راه‌اندازی شود.'
      ]
    },
    {
      title: 'ورود اولیه و تامین امنیت',
      subtitle: 'مرحله چهارم: دسترسی به پنل تحت وب',
      icon: <Shield className="w-5 h-5 text-indigo-400" />,
      description: 'دروازه نهان شما آماده کار است! اکنون اولین ورود امن را به داشبورد تجربه می‌کنیم.',
      instructions: [
        'آدرس ورکر خود را کپی کنید (به عنوان مثال https://nahan-core.subdomain.workers.dev).',
        'جهت عبور از سیستم استتار و استارت پنل، عبارت sync/dash/ را به انتهای آدرس اضافه کنید.',
        'مثال: https://nahan-core.subdomain.workers.dev/sync/dash',
        'رمز عبور اولیه کلمه admin با حروف کوچک است. آن را وارد کرده و لاگین کنید.',
        'فوراً به بخش تنظیمات (System) بروید، کلمه عبور را تغییر داده و فیلد API Route را از کلمه sync به یک مسیر اختصاصی پیچیده تغییر دهید تا آدرس پنل شما مخفی شود.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Step Progress Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`text-right p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/25 text-slate-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-2 left-2 text-emerald-400 animate-pulse">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-indigo-500 text-white' : isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  ۰{idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">گام</span>
              </div>
              <h4 className={`text-xs font-extrabold ${isActive ? 'text-indigo-500 dark:text-indigo-400' : isCompleted ? 'text-emerald-500/80' : 'text-slate-700 dark:text-slate-300'}`}>
                {step.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Main Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl transition-all">
        {/* Step details (Instructions) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-900">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              {steps[activeStep].icon}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">{steps[activeStep].subtitle}</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{steps[activeStep].title}</h3>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
            {steps[activeStep].description}
          </p>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-slate-500" />
              راهنمای گام به گام اجرا:
            </h4>
            <ul className="space-y-3">
              {steps[activeStep].instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => prev - 1)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              گام قبلی
            </button>
            <button
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep(prev => prev + 1)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-600/10"
            >
              گام بعدی
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Interface Mockup */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-lg select-none">
            {/* Mockup Header */}
            <div className="bg-slate-100 dark:bg-slate-900/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 text-[10px]">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <span className="text-slate-400 font-mono">dash.cloudflare.com</span>
              <div className="w-4 h-4"></div>
            </div>

            {/* Virtual Dashboard Mockup */}
            <div className="p-5 font-sans h-80 overflow-y-auto text-left flex flex-col" style={{ direction: 'ltr' }}>
              {activeStep === 0 && (
                <div className="space-y-4 animate-fade-in text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h5 className="font-bold text-sm">D1 Databases</h5>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                      <PlusIcon /> Create Database
                    </button>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-sm mx-auto shadow-sm">
                    <h6 className="font-bold text-xs">Create D1 database</h6>
                    <div className="space-y-2">
                      <label className="block text-[10px] text-slate-400 font-bold">Database Name</label>
                      <input type="text" readOnly value="iot_db" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg font-mono text-xs text-indigo-500 font-bold outline-none" />
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg text-[10px] text-amber-500 leading-normal">
                      Database name can contain lowercase letters (a-z), numbers (0-9), and underscores.
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">Create</button>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-4 animate-fade-in text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h5 className="font-bold text-sm">Workers & Pages</h5>
                    <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm">
                      Create Application
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-900 space-y-2">
                      <span className="text-xl">⚡</span>
                      <h6 className="font-bold text-xs">Hello World</h6>
                      <p className="text-[10px] text-slate-400">Start with a clean slate serverless script.</p>
                      <button className="w-full px-2 py-1 bg-indigo-600/10 text-indigo-500 rounded text-[10px] font-bold">Deploy Worker</button>
                    </div>
                    <div className="col-span-2 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full"></div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Compiler Loaded</span>
                        <h6 className="font-black text-sm text-indigo-400">_worker.js Editor</h6>
                      </div>
                      <div className="bg-slate-950 p-2 rounded-lg font-mono text-[9px] text-slate-300 border border-slate-800 h-28 overflow-hidden select-text">
                        <span className="text-indigo-400">import</span> &#123; connect &#125; <span className="text-indigo-400">from</span> <span className="text-emerald-400">"cloudflare:sockets"</span>;<br />
                        <span className="text-slate-500">// Nahan Serverless Telemetry Node</span><br />
                        <span className="text-indigo-400">const</span> <span className="text-yellow-400">CURRENT_VERSION</span> = <span className="text-emerald-400">"2.6.0"</span>;<br />
                        <span className="text-indigo-400">const</span> <span className="text-yellow-400">SYSTEM_DEFAULTS</span> = &#123;<br />
                        &nbsp;&nbsp;apiRoute: <span className="text-emerald-400">"sync"</span>,<br />
                        &nbsp;&nbsp;masterKey: <span className="text-emerald-400">"admin"</span><br />
                        &#125;;
                      </div>
                      <button className="mt-2 w-full py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">Save and Deploy</button>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4 animate-fade-in text-slate-800 dark:text-slate-200">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center">
                    <div>
                      <h5 className="font-black text-sm">nahan-core</h5>
                      <span className="text-[10px] text-slate-400">Worker Dashboard</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[9px] font-bold">Overview</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/25 text-[9px] font-bold text-indigo-400">Settings</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm max-w-sm mx-auto">
                    <h6 className="font-bold text-xs flex items-center gap-1">📁 Add D1 database binding</h6>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold mb-1">Variable Name</label>
                        <input type="text" readOnly value="IOT_DB" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-slate-800 dark:text-slate-100 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold mb-1">D1 Database</label>
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold flex justify-between items-center text-slate-800 dark:text-slate-100">
                          <span>iot_db</span>
                          <span>▼</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">Save Binding</button>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4 animate-fade-in text-slate-800 dark:text-slate-200 flex flex-col justify-between h-full">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-4 shadow-md max-w-sm mx-auto my-auto relative">
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h6 className="font-black text-sm">Nahan Authentication</h6>
                      <p className="text-[10px] text-slate-400">Authenticate to access admin dashboard</p>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-[9px] text-slate-400 font-bold">Master Key</label>
                        <input type="password" readOnly value="•••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg font-mono text-xs outline-none" />
                      </div>
                      <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm">
                        Authenticate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Infographic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[100px] -z-10 group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black">۱</div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">همگام‌سازی و کلود D1</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
            پروژه نهان اطلاعات را مستقیماً در دیتابیس لوکال ابری SQLite ذخیره می‌کند. به دلیل عدم وابستگی به حافظه موقت (KV)، با هر بار آپدیت ورکر، ترافیک کاربران و اکانت‌ها به طور کامل حفظ می‌شوند.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">۲</div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">طرح هوشمند استتار</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
            پورتال مدیریت و لینک‌های اشتراک نهان در مسیرهای اختصاصی رمزگذاری‌شده شما قرار می‌گیرند. در صورت هرگونه اسکن آی‌پی توسط فیلترچی، سایت شما به عنوان یک آینه کامل از اوبونتو یا داکر تغییر شکل می‌دهد.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-[100px] -z-10 group-hover:bg-purple-500/10 transition-colors"></div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-black">۳</div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">ترانزیت بایت‌شفتینگ XOR</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-justify">
            با استفاده از ابزار مبهم‌ساز نهایی، کدهای شما پیش از آپلود بر روی بستر کلودفلر، به صورت آرایه‌ای از کدهای بایت‌شفت‌شده فشرده می‌شوند تا شناسایی و تحلیل رفتار سورس‌کد لبه کلودفلر توسط سامانه‌های سانسور غیرممکن شود.
          </p>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}
