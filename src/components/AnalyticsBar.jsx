import './AnalyticsBar.css';
import { Activity, Clock, Crown, Target, Cpu, Globe } from 'lucide-react';

export default function AnalyticsBar({ history, sessionTime, mode, standard }) {
  const totalGestures = history.length;
  
  // Calculate average confidence
  const avgConf = totalGestures > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.confidence, 0) / totalGestures)
    : 94;

  // Format time
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="analytics-dashboard grid grid-cols-2 gap-4">
      
      <div className="analytics-card glass-panel relative overflow-hidden group">
        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="analytics-icon-box bg-purple-500/20">
            <Activity size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="analytics-label">Total Tokens</p>
            <p className="analytics-value text-purple-400 font-black">{totalGestures}</p>
          </div>
        </div>
      </div>

      <div className="analytics-card glass-panel relative overflow-hidden group">
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="analytics-icon-box bg-green-500/20">
            <Target size={20} className="text-green-400" />
          </div>
          <div>
            <p className="analytics-label">Accuracy (Avg)</p>
            <p className="analytics-value text-green-400 font-black">{avgConf}%</p>
          </div>
        </div>
      </div>

      <div className="analytics-card glass-panel flex items-center gap-4">
        <div className="analytics-icon-box bg-blue-500/20">
          <Cpu size={20} className="text-blue-400" />
        </div>
        <div className="flex-grow">
          <p className="analytics-label">Active Standard</p>
          <div className="flex justify-between items-end">
            <p className="analytics-value text-blue-400 font-black leading-none">{standard}</p>
            <span className="text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">{mode}</span>
          </div>
        </div>
      </div>

      <div className="analytics-card glass-panel flex items-center gap-4">
        <div className="analytics-icon-box bg-orange-500/20">
          <Clock size={20} className="text-orange-400" />
        </div>
        <div>
          <p className="analytics-label">Session Uptime</p>
          <p className="analytics-value text-orange-400 font-black">{formatTime(sessionTime)}</p>
        </div>
      </div>

    </div>
  );
}
