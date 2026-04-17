import { ArrowRight, Sparkles, Zap, Shield, Mic, Keyboard, Heart, Building2, Briefcase, HelpCircle, PhoneCall, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const useCases = [
    { icon: <Heart size={24} />, title: "Healthcare", desc: "Enable seamless patient-doctor communication in emergency wards." },
    { icon: <Building2 size={24} />, title: "Govt Offices", desc: "Transform public service help desks into inclusive environments." },
    { icon: <GraduationCap size={24} />, title: "Education", desc: "Assist students and teachers in classroom interactions." },
    { icon: <Briefcase size={24} />, title: "Hospitality", desc: "Improve guest services at front desks and concierge." },
    { icon: <PhoneCall size={24} />, title: "Support", desc: "Upgrade call centers with real-time sign video support." },
    { icon: <HelpCircle size={24} />, title: "Public Hubs", desc: "Enhance information kiosks at airports and stations." }
  ];

  return (
    <div className="landing-page">
      {/* Background glow orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <section className="hero-section container animate-fade-in relative z-10">
        <div className="hero-content text-center">
          {/* Top badge */}
          <div className="hero-badge mx-auto mb-8 cursor-pointer hover:scale-105 transition-transform">
            <Sparkles size={14} />
            <span>Winner: Future of Accessibility 2026</span>
          </div>

          <h1 className="hero-title">
            Breaking Barriers with<br />
            <span className="text-gradient">Real-Time Sign AI</span>
          </h1>

          <p className="hero-subtitle mx-auto">
            SignBridge translates gestures into speech instantly using advanced 3D motion tracking. 
            A professional platform for clinics, offices, and emergency communication.
          </p>

          <div className="hero-actions justify-center">
            <button className="cta-primary glow" onClick={() => navigate('/setup')}>
              <Zap size={18} />
              Launch Live Engine
            </button>
            <button className="cta-secondary" onClick={() => navigate('/text-to-sign')}>
              <Keyboard size={18} />
              Text to Sign Tool
            </button>
          </div>

          <div className="stats-row justify-center mt-12 bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="stat-item">
              <span className="stat-number text-accent-blue">A-Z</span>
              <span className="stat-label">Letters</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number text-accent-purple">ISL/BSL/ASL</span>
              <span className="stat-label">Standards</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number text-green-400">98%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number text-yellow-400">0ms</span>
              <span className="stat-label">Server Lag</span>
            </div>
          </div>
        </div>
      </section>

      <section className="use-cases-section py-24 bg-black/30 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Empowering <span className="text-gradient">Professional Sectors</span></h2>
            <p className="text-muted max-w-xl mx-auto">Universal accessibility designed for high-stakes, real-world environments.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div key={i} className="glass-panel p-8 hover-border-blue transition-all group">
                <div className="uc-icon text-accent-blue mb-4 group-hover:scale-110 transition-transform">
                  {uc.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{uc.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer py-12 border-t border-white/5 relative z-10">
        <div className="container flex justify-between items-center text-sm text-muted">
          <span>© 2026 SignBridge AI Strategy. All Rights Reserved.</span>
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><Shield size={14} className="text-green-400" /> HIPAA Secure</span>
            <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-400" /> Edge Compute</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
