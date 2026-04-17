import './HistoryLog.css';
import { Trash2 } from 'lucide-react';

export default function HistoryLog({ history, onClearHistory }) {
  return (
    <div className="history-panel glass-panel">
      <div className="history-header mb-4 flex items-center justify-between">
        <span className="panel-title">Recognition History</span>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="clear-history-btn flex items-center gap-1"
            title="Clear History"
          >
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>
      
      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty text-muted">No gestures detected yet.</div>
        ) : (
          history.map((item, idx) => (
            <div key={item.timestamp + idx} className="history-item animate-slide-up">
              <div className="history-time">
                {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="history-text">{item.text}</div>
              <div className="history-conf">{item.confidence}%</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
