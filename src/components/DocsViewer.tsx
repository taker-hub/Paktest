import React, { useState } from 'react';
import { BookOpen, HelpCircle, FileText, ChevronDown, Sparkles, Terminal, ShieldAlert, Award } from 'lucide-react';

export default function DocsViewer() {
  const [docLang, setDocLang] = useState<'fa' | 'en'>('fa');
  const [activeTopic, setActiveTab] = useState<string>('features');

  const faContent = {
    features: [
      { title: "🛡️ پنهان در دید عموم (استتار پیشرفته)", text: "درخواست‌های غیرمجاز و اسکن‌های امنیتی فیلترچی به طور خودکار به سایت‌های معتبر جهانی (مثل ubuntu.com یا docker.com) پروکسی می‌شوند تا سرور شما کاملاً طبیعی به نظر برسد." },
      { title: "⚡ ترافیک رایگان کلودفلر لبه", text: "اجرا بر روی بستر لبه کلودفلر بدون نیاز به خرید سرورهای گران‌قیمت یا تمدید دوره سرور مجازی شخصی (VPS)." },
      { title: "🤖 مدیریت هوشمند ربات تلگرام", text: "مدیریت کامل مشترکین، قطع اضطراری، بررسی وضعیت ترافیک و دریافت لحظه‌ای لاگ‌های ورود و تغییرات از طریق ربات." },
      { text: "توقف خودکار اکانت مشترک پس از اتمام حجم کل، ترافیک روزانه یا زمان اعتبار در پایگاه داده SQLite D1.", title: "📊 مدیریت پهنای باند و قطع اتوماتیک" }
    ],
    faq: [
      { q: "پیام خطا IOT_DB namespace missing دریافت می‌کنم. دلیل چیست؟", a: "این خطا به معنی عدم برقراری پیوند (Binding) پایگاه داده D1 در تنظیمات ورکر کلودفلر است. به گام سوم راهنمای نصب مراجعه کرده و بایندینگی با متغیر دقیق IOT_DB ایجاد کنید." },
      { q: "چطور سورس‌کد ورکر خود را آپدیت کنم؟", a: "کافیست آخرین نسخه را از کادر کامپایلر دریافت کرده و پس از اعمال متغیرها مجدداً در بخش ویرایشگر کد ورکر کلودفلر کپی کنید. اطلاعات مشترکین در دیتابیس D1 ذخیره شده و پاک نخواهند شد." },
      { q: "آیا این سرویس در پلن رایگان کلودفلر با محدودیت روبرو می‌شود؟", a: "پلن رایگان کلودفلر امکان پردازش صد هزار (100k) درخواست را در روز می‌دهد. شما می‌توانید از بخش مانیتورینگ مصرف درگاه را در تب پیشرفته کنترل کنید." }
    ]
  };

  const enContent = {
    features: [
      { title: "🛡️ Hidden in Plain Sight (Camouflage)", text: "Unauthorized requests or scanning tools are automatically proxied to major sites like ubuntu.com, ensuring your worker resembles an ordinary server." },
      { title: "⚡ Free Cloudflare Edge Processing", text: "Executes directly on Cloudflare serverless edge network, meaning zero server costs, zero VPS maintenance, and high durability." },
      { title: "🤖 Advanced Telegram Bot Management", text: "Track connections, execute the Kill Switch, audit login logs, and receive security alerts instantly on Telegram." },
      { title: "📊 Automated User Life-cycle Guard", text: "Database triggers in SQLite D1 automatically pause accounts on quota depletion or calendar expiration limits." }
    ],
    faq: [
      { q: "What causes the 'IOT_DB namespace missing' error?", a: "This indicates that the D1 SQLite database isn't bound to the worker script. Go to Cloudflare -> Workers -> Settings -> Bindings, and add a D1 binding with the variable name 'IOT_DB'." },
      { q: "Will I lose user data when I update the worker code?", a: "No, all subscriber profiles and settings reside securely in the SQLite D1 database, completely isolated from the runtime script code." },
      { q: "How many connections can the Cloudflare free tier manage?", a: "The free tier grants 100,000 requests/day, which is more than enough for single-user or small family subscription routing nodes." }
    ]
  };

  return (
    <div className="space-y-8 text-right" style={{ direction: docLang === 'fa' ? 'rtl' : 'ltr' }}>
      
      {/* Lang selector & Topic Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTopic === 'features'
                ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {docLang === 'fa' ? 'امکانات و قابلیت‌ها' : 'Core Capabilities'}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTopic === 'faq'
                ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {docLang === 'fa' ? 'پرسش‌های متداول' : 'FAQ Directory'}
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setDocLang('fa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              docLang === 'fa' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            فارسی 🇮🇷
          </button>
          <button
            onClick={() => setDocLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              docLang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English 🇺🇸
          </button>
        </div>
      </div>

      {/* Topics Content */}
      <div className="space-y-6">
        {activeTopic === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {(docLang === 'fa' ? faContent.features : enContent.features).map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow text-justify relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/[0.02] rounded-bl-[100px]"></div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTopic === 'faq' && (
          <div className="space-y-4 animate-fade-in">
            {(docLang === 'fa' ? faContent.faq : enContent.faq).map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-sm text-right"
              >
                <h4 className="font-black text-xs text-indigo-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {item.q}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-justify pl-4">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Architecture Spec Panel */}
      <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-justify">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          {docLang === 'fa' ? 'مشخصات معماری شبکه نهان' : 'Nahan Gateway Architecture Specs'}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {docLang === 'fa'
            ? 'گیت‌وی نهان بر مبنای وب‌ساکت‌های کلودفلر لبه (Edge Websockets) ارتباطات دوطرفه سریع را برقرار می‌سازد. پروتکل‌های VLESS و Trojan از طریق پکت‌بین‌های پیش‌فرض و جداسازی هدرها شناسایی شده و هدرهای پاسخ‌دهی به صورت کاملاً همخوان با استانداردهای وب استتار می‌شوند.'
            : 'Nahan utilizes low-latency full-duplex Cloudflare Edge WebSockets. Configured VLESS and Trojan inbound proxies are validated on the fly. Unauthenticated scanner connections default to camouflage HTML nodes, mimicking static assets to enforce complete transport anonymity.'
          }
        </p>
      </div>

    </div>
  );
}
