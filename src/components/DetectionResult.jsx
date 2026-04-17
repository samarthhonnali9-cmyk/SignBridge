import './DetectionResult.css';

export default function DetectionResult({ text = 'Waiting for gesture...' }) {
  const isWaiting = text === 'Waiting for gesture...' || text === 'Initializing AI Engine...';

  return (
    <div className="detection-panel glass-panel">
      <div className="panel-header">
        <span className="panel-title">Translation Result</span>
        {!isWaiting && (
          <div className="live-indicator">
            <span className="live-dot" />
            <span className="live-text">Live</span>
          </div>
        )}
      </div>

      <div className={`detected-text-container ${isWaiting ? 'waiting' : 'active'}`}>
        <p className="detected-text" key={text}>
          {text}
        </p>
      </div>
    </div>
  );
}
