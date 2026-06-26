/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SetupGuide from './components/SetupGuide';
import ObfuscatorWorkspace from './components/ObfuscatorWorkspace';
import SubscriptionPlayground from './components/SubscriptionPlayground';
import DocsViewer from './components/DocsViewer';
import { Cpu, Code, BookOpen, Layers, Shield, Sun, Moon, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'setup' | 'compiler' | 'playground' | 'docs'>('compiler');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Handle Light/Dark Mode toggling
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#080c14';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#080c14] transition-colors duration-300 flex flex-col">
      {/* Premium Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between flex-row-reverse">
          {/* Logo and Brand Title (RTL preferred for Persian) */}
          <div className="flex items-center gap-3.5 flex-row-reverse">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/10 rounded-bl-full group-hover:scale-150 transition-transform"></div>
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 flex-row-reverse">
                <span className="font-black text-slate-900 dark:text-white tracking-tight text-lg sm:text-xl">نهان / Nahan</span>
                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 tracking-wider">v2.6.0</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">درگاه ترانزیت شبکه و مبهم‌ساز کدهای ورکر</p>
            </div>
          </div>

          {/* Theme Switcher & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
              title={theme === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
            <a
              href="https://github.com/itsyebekhe/nahan"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition shadow-md shadow-indigo-600/10"
            >
              مخزن گیت‌هاب پروژه &larr;
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 flex flex-col justify-between">
        
        {/* Navigation Tabs (RTL alignment) */}
        <div className="flex items-center justify-start gap-2 border-b border-slate-200 dark:border-slate-800 pb-px flex-row-reverse overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab('compiler')}
            className={`px-5 py-3 border-b-2 font-black text-xs sm:text-sm tracking-wide transition whitespace-nowrap flex items-center gap-2 flex-row-reverse ${
              activeTab === 'compiler'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            کامپایلر و مبهم‌ساز کدهای ورکر
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-5 py-3 border-b-2 font-black text-xs sm:text-sm tracking-wide transition whitespace-nowrap flex items-center gap-2 flex-row-reverse ${
              activeTab === 'setup'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300'
            }`}
          >
            <Layers className="w-4.5 h-4.5" />
            راهنمای نصب زنده
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-5 py-3 border-b-2 font-black text-xs sm:text-sm tracking-wide transition whitespace-nowrap flex items-center gap-2 flex-row-reverse ${
              activeTab === 'playground'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300'
            }`}
          >
            <Code className="w-4.5 h-4.5" />
            شبیه‌ساز و تست اشتراک
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-5 py-3 border-b-2 font-black text-xs sm:text-sm tracking-wide transition whitespace-nowrap flex items-center gap-2 flex-row-reverse ${
              activeTab === 'docs'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            مستندات و توضیحات فنی
          </button>
        </div>

        {/* Tab Content Renderer with Animation Wrapper */}
        <div className="flex-1 space-y-6">
          {/* Important Camouflage Alert Banner */}
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-5 text-right relative overflow-hidden flex flex-col md:flex-row-reverse items-center justify-between gap-4 animate-fade-in">
            <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-br-full pointer-events-none"></div>
            <div className="flex items-start gap-4 flex-row-reverse text-right">
              <span className="text-2xl mt-1 select-none">🛡️</span>
              <div className="space-y-1">
                <h4 className="font-black text-sm text-amber-800 dark:text-amber-400">توجه بسیار مهم امنیتی: سیستم استتار (Camouflage) فعال است!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-justify">
                  آدرس اصلی ورکر شما به طور هوشمند و عمدی سایت‌های مرجع مانند <strong>اوبونتو (Ubuntu)</strong> یا <strong>داکر (Docker)</strong> را نشان می‌دهد تا توسط سیستم‌های فیلترینگ شناسایی نشود. برای ورود به پنل مدیریت مخفی خود، باید عبارت <code className="font-mono text-rose-500 bg-amber-500/5 px-1.5 py-0.5 rounded text-[11px] font-bold">/sync/dash</code> را به انتهای آدرس ورکر خود اضافه کنید.
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <a 
                href="https://long-shape-dbd8.hectorhastam1.workers.dev/sync/dash" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full md:w-auto inline-flex justify-center px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl text-xs transition shadow-md shadow-amber-600/10"
              >
                ورود مستقیم به پنل شما &larr;
              </a>
            </div>
          </div>

          {activeTab === 'compiler' && <ObfuscatorWorkspace />}
          {activeTab === 'setup' && <SetupGuide />}
          {activeTab === 'playground' && <SubscriptionPlayground />}
          {activeTab === 'docs' && <DocsViewer />}
        </div>
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 py-6 transition-all text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 flex-row-reverse text-xs font-bold text-slate-400">
          <p className="tracking-wide">نهان (Nahan) • سامانه متن‌باز ترانزیت شبکه و دروازه اشتراک بدون سرور</p>
          <div className="flex items-center gap-3">
            <span>تحت لایسنس MIT</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a href="https://github.com/itsyebekhe/nahan" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition">پروژه در گیت‌هاب</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

