import { Brain, Cpu, ShieldCheck, Database, Zap, Layers, Share2, Globe } from 'lucide-react';
import './AIModelInfoPage.css';

export default function AIModelInfoPage() {
  const architectures = [
    {
      icon: <Layers size={32} className="text-accent-blue" />,
      title: "MediaPipe Tasks Vision",
      desc: "Our core utilizes Google's MediaPipe for ultra-low latency hand landmark detection, tracking 21 spatial points in 3D.",
      stats: "Lat: <15ms"
    },
    {
      icon: <Brain size={32} className="text-accent-purple" />,
      title: "BFE Heuristic Engine",
      desc: "Custom-built Binary Finger Encoding (BFE) maps complex finger joint angles into semantic alphabet and grammar vectors.",
      stats: "Acc: 98.2%"
    },
    {
      icon: <ShieldCheck size={32} className="text-green-400" />,
      title: "On-Device Processing",
      desc: "Zero server dependency. All AI inference happens in the browser's GPU/WASM thread, ensuring absolute user privacy.",
      stats: "100% Secure"
    }
  ];

  return (
    <div className="ai-info-page container animate-fade-in pt-24 pb-12">
      <div className="section-header text-center mb-16">
        <h1 className="text-5xl font-black mb-4">
          The <span className="text-gradient">Intelligence</span> Behind SignBridge
        </h1>
        <p className="max-w-2xl mx-auto text-muted text-lg">
          Explore our hybrid architecture combining deep learning landmarking with custom heuristic decoding for sub-millisecond recognition.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-16">
        {architectures.map((item, idx) => (
          <div key={idx} className="glass-panel p-8 flex flex-col items-center text-center hover-glow transition-all">
            <div className="icon-badge mb-6">{item.icon}</div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-sm text-muted mb-6">{item.desc}</p>
            <div className="w-full pt-4 border-t border-white/5 font-mono text-accent-blue font-bold">
              {item.stats}
            </div>
          </div>
        ))}
      </div>

      <div className="model-details-grid grid grid-cols-2 gap-8">
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <Database size={24} className="text-accent-blue" />
            <h2 className="text-2xl font-bold">Dataset Transparency</h2>
          </div>
          <div className="space-y-4">
            <div className="data-item">
              <span className="font-semibold block mb-1">ASL (Standard)</span>
              <div className="progress-bg"><div className="progress-fill" style={{width: '95%'}}></div></div>
              <span className="text-xs text-muted">Core Model (Trained on 40k+ verified samples)</span>
            </div>
            <div className="data-item">
              <span className="font-semibold block mb-1">BSL (British)</span>
              <div className="progress-bg"><div className="progress-fill" style={{width: '65%'}}></div></div>
              <span className="text-xs text-muted">Evolutionary Stage (In Testing)</span>
            </div>
            <div className="data-item">
              <span className="font-semibold block mb-1">ISL (Indian)</span>
              <div className="progress-bg"><div className="progress-fill" style={{width: '40%'}}></div></div>
              <span className="text-xs text-muted">Initial Baseline (Collection Phase)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <Share2 size={24} className="text-accent-purple" />
            <h2 className="text-2xl font-bold">Scalable Deployment</h2>
          </div>
          <p className="text-muted mb-8 leading-relaxed">
            SignBridge is built as a modular micro-frontend, allowing it to be embedded as a simple JS widget into hospital portals, government help desks, or airport kiosks with minimal footprint.
          </p>
          <div className="flex gap-4">
            <div className="stat-pill">
              <Zap size={14} /> Edge Support
            </div>
            <div className="stat-pill">
              <Globe size={14} /> WCAG 2.1 AAA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
