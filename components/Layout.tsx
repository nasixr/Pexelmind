import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button'; // Assuming Button component is available

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [scrolled, setScrolled] = useState(false);

  // Track window size for normalization
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll for navbar shadow intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse movement for spotlight and parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate normalized coordinates (-1 to 1)
  const normX = (mousePos.x / windowSize.width) * 2 - 1;
  const normY = (mousePos.y / windowSize.height) * 2 - 1;

  return (
    <div 
      className="min-h-screen flex flex-col bg-background-50 text-slate-900 font-sans overflow-hidden relative"
      style={{
        '--mouse-x': normX,
        '--mouse-y': normY,
      } as React.CSSProperties}
    >
      
      {/* 3D Background Grid Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 perspective-1000">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(20deg)_scale(1.5)] origin-top"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
      </div>

      {/* Mouse Spotlight Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(15, 23, 42, 0.08), transparent 40%)`
        }}
      />

      {/* Floating Glassmorphism Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
        <header 
          className={`
            w-full max-w-7xl mx-auto
            flex items-center justify-between px-6 py-3
            rounded-2xl border border-white/40
            bg-white/60 backdrop-blur-xl
            transition-all duration-300 ease-out
            ${scrolled ? 'shadow-lg shadow-primary-900/5 translate-y-0' : 'shadow-sm translate-y-2'}
          `}
        >
          {/* Logo Section (Right in RTL) */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none rounded-xl p-1 transition-all duration-300 hover:bg-white/40">
            {/* Icon - Right Side in RTL */}
            <div className="relative w-10 h-10 transform transition-transform duration-500 group-hover:rotate-y-12 transform-style-3d">
              {/* Pexel Mind Custom Vector Logo - Split Brain Design */}
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                 <path d="M48 20 C48 12 40 10 36 12 C34 6 22 8 20 16 C12 16 8 24 10 32 C4 36 4 50 12 58 C12 68 20 78 36 78 C42 78 48 72 48 68 V20 Z" fill="#0F172A" />
                 <path d="M52 20 C52 12 60 10 64 12 C66 6 78 8 80 16 C88 16 92 24 90 32 C96 36 96 50 88 58 C88 68 80 78 64 78 C58 78 52 72 52 68 V20 Z" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                 <circle cx="58" cy="30" r="4" fill="#0F172A" />
                 <path d="M58 30 L72 22" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
                 <circle cx="72" cy="22" r="4" fill="#0F172A" />
                 <circle cx="60" cy="48" r="4" fill="#0F172A" />
                 <path d="M60 48 H76" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
                 <circle cx="76" cy="48" r="4" fill="#0F172A" />
                 <circle cx="58" cy="66" r="4" fill="#0F172A" />
                 <path d="M58 66 L70 74" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
                 <circle cx="70" cy="74" r="4" fill="#0F172A" />
              </svg>
            </div>

            {/* Vertical Divider - Subtle */}
            <div className="w-[1px] h-8 bg-slate-300 rounded-full"></div>

            {/* Text - Left Side in RTL */}
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-xl font-black text-primary-900 tracking-tight leading-none uppercase font-sans">Pexel Mind</h1>
              <span className="text-[10px] font-bold text-[#15803D] tracking-[0.15em] uppercase mt-0.5 leading-tight">Design Intelligence</span>
            </div>
          </Link>
          
          {/* Navigation Section (Left in RTL) */}
          <div className="flex items-center gap-4">
             {!isHome && (
              <Link to="/" className="hidden md:flex items-center gap-2 text-primary-800 font-bold text-sm hover:text-accent-600 transition-colors py-2 px-4 rounded-lg hover:bg-white/50">
                <span>الرئيسية</span>
              </Link>
            )}
            
            <Link to="/analyze">
               <div className="flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-900/20 transition-all duration-300 transform hover:-translate-y-0.5">
                  <span>ابدأ التحليل</span>
                  <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               </div>
            </Link>
          </div>
        </header>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-28"></div>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 relative z-10 perspective-1000">
        {children}
      </main>

      <footer className="bg-primary-900 text-white py-10 mt-auto relative z-10 border-t border-primary-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6 space-x-6 space-x-reverse">
             <a 
               href="https://x.com/PexelMind?s=20" 
               target="_blank" 
               rel="noopener noreferrer"
               className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-110 group"
               aria-label="Visit Pexel Mind on X (Twitter)"
             >
               {/* X Logo */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
               </svg>
             </a>
          </div>
          <p className="font-medium text-lg mb-2 opacity-90">Pexel Mind © {new Date().getFullYear()}</p>
          <p className="text-slate-400 text-sm">تم التطوير لتسهيل الوصول الرقمي للجميع.</p>
        </div>
      </footer>
    </div>
  );
};