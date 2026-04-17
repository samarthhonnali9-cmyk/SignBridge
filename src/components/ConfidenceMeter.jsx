import './ConfidenceMeter.css';

export default function ConfidenceMeter({ score = 0 }) {
  const percentage = Math.max(0, Math.min(100, score));
  
  // Determine color based on score
  let colorClass = 'high-confidence';
  if (percentage < 50) colorClass = 'low-confidence';
  else if (percentage < 80) colorClass = 'medium-confidence';

  return (
    <div className="confidence-panel glass-panel">
      <div className="flex items-center justify-between mb-2">
        <span className="panel-title">AI Confidence</span>
        <span className={`score-text ${colorClass}`}>{percentage}%</span>
      </div>
      
      <div className="meter-track">
        <div 
          className={`meter-fill ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        >
          <div className="meter-glow"></div>
        </div>
      </div>
    </div>
  );
}
