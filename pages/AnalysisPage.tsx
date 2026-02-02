import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { AnalysisState } from '../types';
import { analyzeImage, generateSpeech } from '../services/geminiService';

// Helper to decode base64 string
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const AnalysisPage: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    imagePreview: null,
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const uploadZoneRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (state.result && resultRef.current) {
      resultRef.current.focus();
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.result]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setState(prev => ({ ...prev, error: "عذراً، يجب اختيار ملف صورة بصيغة (JPG, PNG, WEBP)." }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          imagePreview: reader.result as string,
          error: null,
          result: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploadZoneRef.current) uploadZoneRef.current.classList.add('border-primary-900', 'bg-primary-50', 'scale-[1.02]');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploadZoneRef.current) uploadZoneRef.current.classList.remove('border-primary-900', 'bg-primary-50', 'scale-[1.02]');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploadZoneRef.current) uploadZoneRef.current.classList.remove('border-primary-900', 'bg-primary-50', 'scale-[1.02]');
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleAnalyze = async () => {
    if (!state.imagePreview) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const base64Data = state.imagePreview.split(',')[1];
      const analysis = await analyzeImage(base64Data);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        result: analysis
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "واجهنا مشكلة تقنية أثناء المعالجة. يرجى المحاولة مرة أخرى."
      }));
    }
  };

  const handlePlayAudio = async () => {
    if (!state.result?.saudiSummary || isSpeaking) return;

    setIsSpeaking(true);
    try {
      const base64Audio = await generateSpeech(state.result.saudiSummary);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const ctx = audioContextRef.current;
      const audioBytes = decode(base64Audio);
      
      const dataInt16 = new Int16Array(audioBytes.buffer);
      const numChannels = 1;
      const sampleRate = 24000;
      const frameCount = dataInt16.length / numChannels;
      
      const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();

    } catch (err) {
      console.error("Audio playback error:", err);
      setIsSpeaking(false);
      setState(prev => ({ ...prev, error: "تعذر تشغيل الملف الصوتي." }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20 perspective-2000">
      
      {/* Header Section with 3D Float */}
      <header className="text-center space-y-4 animate-fade-in transform-style-3d hover:rotate-x-12 transition-transform duration-700">
        <h2 className="text-4xl md:text-5xl font-black text-primary-900 leading-tight drop-shadow-sm translate-z-10">
          مركز الفحص البصري
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium translate-z-10">
          قم بتحليل واجهاتك للتأكد من توافقها مع معايير الوصول العالمية (WCAG) وتجربة المستخدم.
        </p>
      </header>

      {/* Upload Section - 3D Container */}
      <section 
        aria-labelledby="upload-heading" 
        className="bg-white p-2 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 animate-slide-up transform hover:scale-[1.01] transition-transform duration-500"
      >
        <h3 id="upload-heading" className="sr-only">منطقة رفع الصور</h3>
        
        {!state.isLoading ? (
          <div className="p-8 md:p-12">
             <label 
                ref={uploadZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                htmlFor="screenshot-upload" 
                className={`
                  relative flex flex-col items-center justify-center w-full h-80 
                  border-4 border-dashed rounded-2xl cursor-pointer transition-all duration-500 ease-out
                  ${state.imagePreview ? 'border-accent-500 bg-green-50/20' : 'border-slate-300 hover:border-primary-900 hover:bg-slate-50'}
                  group focus-within:ring-4 focus-within:ring-yellow-400 transform-style-3d
                `}
              >
                {!state.imagePreview ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center transform-style-3d">
                    <div className="w-24 h-24 mb-6 rounded-3xl bg-blue-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg transition-all duration-500 translate-z-10">
                      <svg className="w-12 h-12 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                    </div>
                    <p className="mb-2 text-2xl font-bold text-primary-900 translate-z-10">انقر للرفع أو اسحب الصورة هنا</p>
                    <p className="text-base text-slate-500 translate-z-10">ندعم ملفات JPG, PNG (بحد أقصى 5 ميجابايت)</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-4 transform-style-3d">
                    <img 
                      src={state.imagePreview} 
                      alt="معاينة الصورة" 
                      className="max-h-full max-w-full object-contain rounded-xl shadow-lg translate-z-20"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl translate-z-30 backdrop-blur-sm">
                      <span className="text-white font-bold text-lg bg-black/50 px-6 py-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform">تغيير الصورة</span>
                    </div>
                  </div>
                )}
                
                <input 
                  ref={fileInputRef}
                  id="screenshot-upload" 
                  type="file" 
                  accept="image/*"
                  className="sr-only" 
                  onChange={handleFileChange}
                  aria-describedby="upload-hint"
                />
              </label>

              {state.error && (
                <div role="alert" className="mt-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg flex items-center gap-3 animate-fade-in shadow-md">
                  <svg className="h-6 w-6 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 font-bold">{state.error}</span>
                </div>
              )}

              <div className="mt-8 flex justify-center perspective-1000">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!state.imagePreview}
                  className="min-w-[240px] shadow-xl shadow-primary-900/30 transform transition-transform hover:-translate-y-1 hover:rotate-x-6 active:translate-y-0 active:rotate-x-0"
                >
                  بدء المعالجة الذكية
                </Button>
              </div>
          </div>
        ) : (
          /* Loading State with 3D Scanner */
          <div className="p-16 flex flex-col items-center justify-center min-h-[400px] perspective-1000" aria-live="assertive" aria-busy="true">
            <div className="relative w-full max-w-md h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 mb-8 shadow-inner transform rotate-x-12 transition-transform duration-[2000ms]">
               {/* Skeleton Content */}
               <div className="absolute inset-0 p-6 space-y-4 opacity-50">
                  <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                  <div className="h-32 bg-slate-300 rounded w-full"></div>
                  <div className="flex gap-4">
                    <div className="h-10 bg-slate-300 rounded w-1/3"></div>
                    <div className="h-10 bg-slate-300 rounded w-1/3"></div>
                  </div>
               </div>
               {/* 3D Laser Scanner Line */}
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent-500 to-transparent shadow-[0_0_30px_4px_rgba(21,128,61,0.6)] animate-scan z-10 mix-blend-screen"></div>
            </div>
            <h3 className="text-2xl font-bold text-primary-900 mb-2 animate-pulse">جاري فحص الواجهة...</h3>
            <p className="text-slate-500">يقوم الذكاء الاصطناعي الآن بمسح الطبقات البصرية</p>
          </div>
        )}
      </section>

      {/* Results Grid Section */}
      {state.result && (
        <main 
          ref={resultRef} 
          tabIndex={-1} 
          className="space-y-10 focus:outline-none"
          aria-label="نتائج تحليل الواجهة"
        >
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div>
              <h2 className="text-3xl font-black text-primary-900 mb-2">تقرير الفحص الفني</h2>
              <p className="text-slate-600">تم إنشاء هذا التقرير بناءً على معايير WCAG 2.1</p>
            </div>
            
            <Button 
              variant="secondary" 
              onClick={handlePlayAudio}
              disabled={isSpeaking}
              className="group relative overflow-hidden shadow-lg hover:shadow-green-900/20 transform hover:-translate-y-1 transition-all"
              aria-label={isSpeaking ? "جاري قراءة التقرير" : "استمع للملخص باللهجة السعودية"}
            >
              <div className={`absolute inset-0 bg-green-700 transition-transform duration-[2000ms] ease-linear ${isSpeaking ? 'translate-x-0' : 'translate-x-full'}`} />
              <div className="relative flex items-center gap-2 z-10">
                {isSpeaking ? (
                   <>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span>المساعد الصوتي يتحدث...</span>
                   </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>استمع للملخص (سعودي)</span>
                  </>
                )}
              </div>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 transform-style-3d">
            
            {/* General Vision Card - 3D Reveal */}
            <section className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden lg:col-span-2 animate-slide-up hover-lift-3d" style={{animationDelay: '0.2s'}}>
              <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-white">التقييم الشامل</h3>
              </div>
              <div className="p-8">
                <p className="text-lg text-slate-800 leading-8 font-medium">
                  {state.result.summary}
                </p>
                {/* Saudi Summary Visually distinguished */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                   <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-200 shrink-0">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Saudi&backgroundColor=c6e5c3" alt="Avatar" className="w-full h-full" />
                      </div>
                      <div className="flex-1 bg-green-50/50 p-5 rounded-2xl rounded-tr-none border border-green-100 relative">
                        <h4 className="text-sm font-bold text-green-800 mb-2">مساعد Pexel (سعودي):</h4>
                        <p className="text-slate-700 italic leading-relaxed">
                          "{state.result.saudiSummary}"
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* Contrast Analysis */}
            <section className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden animate-slide-up hover-lift-3d group" style={{animationDelay: '0.3s'}}>
              <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between group-hover:bg-red-50 transition-colors">
                <h3 className="text-xl font-bold text-primary-900 flex items-center gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse"></span>
                  تحليل التباين والألوان
                </h3>
              </div>
              <div className="p-6">
                {state.result.contrastIssues.length > 0 ? (
                  <ul className="space-y-4" role="list">
                    {state.result.contrastIssues.map((issue, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                        <span className="shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mt-1 text-red-600 transition-transform group-hover:scale-110">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </span>
                        <p className="text-slate-700 font-medium leading-relaxed">{issue}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-green-600">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-bold text-lg">التباين ممتاز ومريح للعين</p>
                  </div>
                )}
              </div>
            </section>

            {/* Spatial Analysis */}
            <section className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden animate-slide-up hover-lift-3d group" style={{animationDelay: '0.4s'}}>
              <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between group-hover:bg-yellow-50 transition-colors">
                <h3 className="text-xl font-bold text-primary-900 flex items-center gap-3">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)] animate-pulse"></span>
                  التخطيط والأبعاد
                </h3>
              </div>
              <div className="p-6">
                 {state.result.spatialIssues.length > 0 ? (
                  <ul className="space-y-4" role="list">
                    {state.result.spatialIssues.map((issue, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                         <span className="shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mt-1 text-yellow-700 transition-transform group-hover:scale-110">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        </span>
                        <p className="text-slate-700 font-medium leading-relaxed">{issue}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 text-green-600">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-bold text-lg">التوزيع المكاني متناسق</p>
                  </div>
                )}
              </div>
            </section>

            {/* Suggestions - 3D Gradient Card */}
            <section className="relative bg-gradient-to-br from-primary-900 to-slate-900 rounded-2xl shadow-2xl lg:col-span-2 text-white overflow-hidden animate-slide-up hover-lift-3d" style={{animationDelay: '0.5s'}}>
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
              
              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <svg className="w-8 h-8 text-yellow-400 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                   توصيات التحسين
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                   {state.result.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-white/10 p-5 rounded-xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all hover:scale-[1.02]">
                      <p className="font-medium text-lg leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
          
          <div className="flex justify-center pt-8">
            <Button variant="outline" onClick={() => {
              setState({ isLoading: false, error: null, result: null, imagePreview: null });
              if (fileInputRef.current) fileInputRef.current.value = "";
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-12 py-4 text-lg border-2 hover:bg-white hover:shadow-lg transition-all"
            >
              إجراء فحص جديد
            </Button>
          </div>
        </main>
      )}
    </div>
  );
};