import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-24 animate-fade-in">
      
      {/* 3D Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between gap-12 py-6 md:py-12 perspective-2000" aria-labelledby="hero-title">
        
        {/* Left: Text Content - Reverse Parallax for Depth */}
        <div className="flex-1 text-center md:text-right space-y-8 z-20 animate-parallax-reverse transform-style-3d">
          <h2 id="hero-title" className="text-5xl md:text-7xl font-black text-primary-900 leading-tight tracking-tight drop-shadow-sm translate-z-20">
            بصيرتك في <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent-600 to-accent-400 relative inline-block">
              عالم التصميم
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent-500 opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-xl font-medium translate-z-10">
            مساعدك الشخصي لتحليل واجهات المستخدم. ارفع لقطة الشاشة، وسنقوم بفحص التباين، المسافات، وسهولة الوصول.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 translate-z-10">
            <Button 
              onClick={() => navigate('/analyze')} 
              className="shadow-xl shadow-primary-900/20 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 bg-primary-900"
              aria-label="ابدأ التحليل البصري الآن"
            >
              <span className="text-xl">ابدأ التحليل مجاناً</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Right: Abstract AI Vision Art */}
        <div className="flex-1 w-full max-w-xl relative md:mt-0 mt-10 perspective-2000 group">
           {/* Wrap float and parallax to avoid transform conflict */}
           <div className="animate-float transform-style-3d">
              <div className="animate-parallax transform-style-3d relative">
                 
                 {/* Glow behind the art */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-[60px] transform scale-90 animate-pulse translate-z-10"></div>
                 
                 {/* Abstract AI Vision SVG Illustration */}
                 <svg 
                    viewBox="0 0 600 500" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-full h-auto drop-shadow-2xl transform rotate-y-[-6deg] rotate-x-[4deg] group-hover:rotate-0 transition-transform duration-700 ease-out translate-z-20"
                 >
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F172A" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1E293B" stopOpacity="0.6" />
                      </linearGradient>
                      <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#DB2777" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="gradBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#14B8A6" stopOpacity="0" />
                         <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.2" />
                         <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Back Layer: Floating Abstract Planes (UI Layers) */}
                    <path d="M100 150 L350 100 L450 250 L200 300 Z" fill="url(#grad1)" stroke="white" strokeOpacity="0.2" strokeWidth="1" className="opacity-60" />
                    <path d="M150 200 L400 150 L500 300 L250 350 Z" fill="url(#grad2)" stroke="white" strokeOpacity="0.3" strokeWidth="1" />

                    {/* Middle Layer: Fluid Wave (Organic AI) */}
                    <path 
                      d="M50 350 C150 450 250 250 350 300 C450 350 550 200 580 250" 
                      stroke="#F97316" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeOpacity="0.6"
                      fill="none"
                      filter="url(#glow)"
                    />
                     <path 
                      d="M70 360 C170 460 270 260 370 310 C470 360 570 210 600 260" 
                      stroke="#DB2777" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeOpacity="0.4"
                      fill="none"
                    />

                    {/* Front Layer: Scanning Grid & Data Points */}
                    <g className="animate-scan">
                      <rect x="200" y="150" width="200" height="200" fill="url(#gradBeam)" />
                      <line x1="200" y1="250" x2="400" y2="250" stroke="#14B8A6" strokeWidth="2" strokeOpacity="0.5" />
                    </g>

                    {/* Floating Nodes (Data) */}
                    <circle cx="350" cy="100" r="8" fill="#14B8A6" filter="url(#glow)" />
                    <circle cx="200" cy="300" r="6" fill="#F97316" filter="url(#glow)" />
                    <circle cx="500" cy="300" r="10" fill="#7C3AED" filter="url(#glow)" />
                    
                    {/* Connecting Lines */}
                    <line x1="350" y1="100" x2="500" y2="300" stroke="white" strokeOpacity="0.1" strokeDasharray="5 5" />
                    <line x1="200" y1="300" x2="350" y2="100" stroke="white" strokeOpacity="0.1" strokeDasharray="5 5" />

                 </svg>
              </div>
           </div>
        </div>
      </section>

      {/* 3D Features Cards - Updated to perspective-2000 for dynamic effect */}
      <section aria-labelledby="features-title" className="grid md:grid-cols-3 gap-8 perspective-2000">
        <h3 id="features-title" className="sr-only">مميزات التطبيق</h3>
        
        {[
          {
            title: "تحليل التباين اللوني",
            desc: "نتأكد من أن الألوان سهلة القراءة ومريحة للعين وفق معايير WCAG العالمية.",
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
            color: "bg-blue-100 text-blue-600"
          },
          {
            title: "كشف التداخل",
            desc: "نكتشف العناصر المتداخلة أو المسافات الضيقة التي قد تربك المستخدم.",
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />,
            color: "bg-purple-100 text-purple-600"
          },
          {
            title: "وصف صوتي دقيق",
            desc: "جميع التقارير مصممة لتكون مقروءة بوضوح بواسطة قارئات الشاشة.",
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
            color: "bg-orange-100 text-orange-600"
          }
        ].map((feature, idx) => (
          <div key={idx} className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-x-2 transform-style-3d hover-lift-3d animate-parallax">
            <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-6 translate-z-10`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {feature.icon}
              </svg>
            </div>
            <h4 className="text-xl font-black mb-3 text-primary-900 group-hover:text-accent-600 transition-colors translate-z-10">{feature.title}</h4>
            <p className="text-slate-600 font-medium leading-relaxed translate-z-10">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};