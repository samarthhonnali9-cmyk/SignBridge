import { Volume2, Trash2, Type, MessageSquareText, RotateCcw, Save, CheckCircle2 } from 'lucide-react';
import './SentenceBuilder.css';

const PUNCTUATIONS = [
  { label: 'None', value: '' },
  { label: '. Period', value: '.' },
  { label: '? Question', value: '?' },
  { label: '! Exclaim', value: '!' },
  { label: ', Comma', value: ',' },
];

export default function SentenceBuilder({
  sentence,
  words,
  language,
  onClear,
  onSpeak,
  onSave,
  onPlaySign,
  onPunctuationChange,
  punctuation,
}) {
  const isEmpty = words.length === 0;

  return (
    <div className="sentence-builder glass-panel relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue"></div>
      
      {/* Header */}
      <div className="sb-header">
        <div className="sb-title">
          <MessageSquareText size={16} className="sb-title-icon" />
          <span>Intelligent Sentence Builder</span>
        </div>
        <div className="sb-word-count">{words.length} tokens</div>
      </div>

      {/* Sentence Display */}
      <div className={`sb-sentence-display ${isEmpty ? 'empty' : ''}`}>
        {isEmpty ? (
          <span className="sb-placeholder">
            <Type size={14} style={{ display: 'inline', marginRight: '6px', opacity: 0.5 }} />
            Communication stream ready… Start signing to translate.
          </span>
        ) : (
          <span className="sb-sentence-text">{sentence}</span>
        )}
      </div>

      {/* Word Chips */}
      {!isEmpty && (
        <div className="sb-chips animate-fade-in">
          {words.map((w, i) => (
            <span key={i} className="sb-chip">
              {w}
            </span>
          ))}
          {punctuation && <span className="sb-chip sb-chip-punct">{punctuation}</span>}
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="sb-control-bar flex items-center justify-between mt-6 pt-4 border-t border-white/5">
        
        <div className="sb-punctuation-group flex items-center gap-3">
          <label className="text-xs font-bold text-muted uppercase tracking-tighter">Punctuation</label>
          <div className="sb-punct-options">
            {PUNCTUATIONS.map((p) => (
              <button
                key={p.value}
                className={`sb-punct-btn ${punctuation === p.value ? 'active' : ''}`}
                onClick={() => onPunctuationChange(p.value)}
              >
                {p.value === '' ? 'None' : p.value}
              </button>
            ))}
          </div>
        </div>

        <div className="sb-actions flex gap-2">
           <button className="sb-btn sb-action-btn" onClick={onPlaySign} disabled={isEmpty} title="Play sign animation">
              <RotateCcw size={14} /> <span>Animate</span>
           </button>
           <button className="sb-btn sb-action-btn" onClick={onSpeak} disabled={isEmpty}>
              <Volume2 size={14} /> <span>Speak</span>
           </button>
           <button className="sb-btn sb-save-btn" onClick={onSave} disabled={isEmpty}>
              <Save size={14} /> <span>Save Sentence</span>
           </button>
           <button className="sb-btn sb-clear-btn" onClick={onClear} disabled={isEmpty}>
              <Trash2 size={14} />
           </button>
        </div>

      </div>
    </div>
  );
}
