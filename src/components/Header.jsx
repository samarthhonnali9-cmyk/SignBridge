import { Link, useLocation } from 'react-router-dom';
import { Camera, Globe, Info, Keyboard, Activity, Home } from 'lucide-react';
import { useSign } from '../context/SignContext';
import './Header.css';

export default function Header() {
  const { standard, setStandard } = useSign();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <header className={`header-glass ${isHome ? 'is-transparent' : ''}`}>
      <div className="container header-inner flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="brand flex items-center gap-2">
            <div className="logo-box">
              <Camera size={22} color="#00f0ff" />
            </div>
            <span className="brand-text">Sign<span className="text-gradient">Bridge</span></span>
          </Link>

          <nav className="nav-links flex items-center gap-6">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={16} /> <span>Home</span>
            </Link>
            <Link to="/recognize" className={`nav-link ${location.pathname === '/recognize' ? 'active' : ''}`}>
              <Activity size={16} /> <span>Live Detect</span>
            </Link>
            <Link to="/text-to-sign" className={`nav-link ${location.pathname === '/text-to-sign' ? 'active' : ''}`}>
              <Keyboard size={16} /> <span>Text to Sign</span>
            </Link>
            <Link to="/ai-info" className={`nav-link ${location.pathname === '/ai-info' ? 'active' : ''}`}>
              <Info size={16} /> <span>AI Info</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="standard-selector flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full border-blue">
            <Globe size={14} className="text-accent-blue" />
            <select 
              value={standard} 
              onChange={(e) => setStandard(e.target.value)}
              className="standard-dropdown"
            >
              <option value="ASL">ASL (American)</option>
              <option value="BSL">BSL (British)</option>
              <option value="ISL">ISL (Indian)</option>
            </select>
          </div>
          
          <Link to="/setup" className="nav-button glow">
            Launch Platform
          </Link>
        </div>

      </div>
    </header>
  );
}
