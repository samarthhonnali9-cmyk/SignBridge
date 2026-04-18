import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, FastForward, Keyboard } from 'lucide-react';
import './TextToSignPage.css';

// ─── ASL Real Hand Photos (Individual PNGs + Sprite Sheet fallback) ────────────
// 14 letters have dedicated high-res photos, rest use chart sprite
const INDIVIDUAL = new Set(['a','b','c','d','e','f','g','h','i','j','m','p','r','s', 'victory']);

const CHART = '/asl/asl_chart.png';
const COLS = 7, ROWS = 4;

const SPRITE = {
  'a':{c:0,r:0},'b':{c:1,r:0},'c':{c:2,r:0},'d':{c:3,r:0},
  'e':{c:4,r:0},'f':{c:5,r:0},'g':{c:6,r:0},
  'h':{c:0,r:1},'i':{c:1,r:1},'j':{c:2,r:1},'k':{c:3,r:1},
  'l':{c:4,r:1},'m':{c:5,r:1},'n':{c:6,r:1},
  'o':{c:0,r:2},'p':{c:1,r:2},'q':{c:2,r:2},'r':{c:3,r:2},
  's':{c:4,r:2},'t':{c:5,r:2},
  'u':{c:0,r:3},'v':{c:1,r:3},'w':{c:2,r:3},'x':{c:3,r:3},
  'y':{c:4,r:3},'z':{c:5,r:3},
};

const GESTURE = {
  a:'Closed fist, thumb to side',   b:'Flat open palm, fingers up',
  c:'Curved hand like C',            d:'Index up, others curled',
  e:'Bent fingers, thumb under',     f:'Index+thumb circle (OK)',
  g:'Index points sideways',         h:'Index+middle sideways',
  i:'Pinky up, others closed',       j:'Pinky up, draw J in air',
  k:'Index+middle up, spread',       l:'Thumb+index = L shape',
  m:'3 fingers over thumb',          n:'2 fingers over thumb',
  o:'All fingers form O shape',      p:'K shape, point down',
  q:'G shape, point down',           r:'Index+middle crossed',
  s:'Closed fist, thumb over',       t:'Thumb between fingers',
  u:'Index+middle together up',      v:'Index+middle spread (V)',
  w:'3 fingers spread out',          x:'Index finger hooked',
  y:'Thumb+pinky extended',          z:'Index draws Z in air',
};

const SIGN_DICT = {
  "hello":{key:'h',label:"Hello"},  "hi":{key:'h',label:"Hi"},
  "yes":{key:'y',label:"Yes"},      "no":{key:'n',label:"No"},
  "stop":{key:'b',label:"Stop"},    "thanks":{key:'b',label:"Thanks"},
  "help":{key:'s',label:"Help"},    "name":{key:'victory',label:"Name"},
  "my":{key:'b',label:"My"},
  "please":{key:'p',label:"Please"},"good":{key:'g',label:"Good"},
  ...Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(l=>[l,{key:l,label:l.toUpperCase()}]))
};

// ─── Sprite rendering helper ───────────────────────────────────────────────────
function SignSprite({ letterKey, size = 240 }) {
  if (!letterKey) return <div className="sign-fallback">?</div>;
  
  // Use individual PNG if we have it — clearest quality
  if (INDIVIDUAL.has(letterKey)) {
    return (
      <div className="sign-sprite-box" style={{ width: size, height: size, background: '#fff' }}>
        <img 
          src={letterKey === 'victory' ? `/asl/${letterKey}.webp` : `/asl/${letterKey}.png`} 
          alt={`ASL sign for ${letterKey.toUpperCase()}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  // Fallback: crop from chart sprite sheet
  const sp = SPRITE[letterKey];
  if (!sp) return <div className="sign-fallback">{letterKey.toUpperCase()}</div>;
  const bgW = size * COLS, bgH = size * ROWS;
  return (
    <div
      className="sign-sprite-box"
      style={{
        width: size, height: size,
        backgroundImage: `url(${CHART})`,
        backgroundSize: `${bgW}px ${bgH}px`,
        backgroundPosition: `${-(sp.c * size)}px ${-(sp.r * size)}px`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff',
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TextToSignPage() {
  const [inputText, setInputText] = useState("My name is Ram");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeqIndex, setCurrentSeqIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [words, setWords] = useState([]);
  const [sequence, setSequence] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const rawWords = inputText.trim().split(/\s+/).filter(w => w.length > 0);
    const newSeq = [];
    rawWords.forEach((word, wIndex) => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, '');
      if (SIGN_DICT[clean]) {
        const e = SIGN_DICT[clean];
        newSeq.push({ wordIndex: wIndex, word, key: e.key, label: e.label, type: 'word' });
      } else {
        clean.split('').forEach(l => {
          const e = SIGN_DICT[l];
          newSeq.push({ wordIndex: wIndex, word: l.toUpperCase(), key: l, label: l.toUpperCase(), type: 'letter' });
        });
      }
    });
    setWords(rawWords);
    setSequence(newSeq);
    setCurrentSeqIndex(-1);
    setIsPlaying(false);
  }, [inputText]);

  useEffect(() => {
    // We only want this effect to initiate the chain ONCE when isPlaying toggles to true.
    if (!isPlaying || sequence.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    let currentIndex = currentSeqIndex === -1 ? 0 : currentSeqIndex;

    const playNextFrame = () => {
      // Ensure we haven't gone out of bounds
      if (currentIndex >= sequence.length) {
        setIsPlaying(false);
        return;
      }

      // Display the current frame via a safe functional state update
      setCurrentSeqIndex(currentIndex);

      // Determine duration for THIS frame
      const currentItem = sequence[currentIndex];
      const delay = (currentItem?.type === 'letter' ? 900 : 1600) / playbackSpeed; // Slightly slower base speed to guarantee visibility

      // Wait the delay, then fire the next frame
      timerRef.current = setTimeout(() => {
        currentIndex++;
        playNextFrame();
      }, delay);
    };

    // Kick off the autonomous loop
    playNextFrame();

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, sequence, playbackSpeed]);

  const handlePlayPause = () => {
    if (!sequence.length) return;
    if (!isPlaying && currentSeqIndex >= sequence.length - 1) setCurrentSeqIndex(0);
    else if (!isPlaying && currentSeqIndex === -1) setCurrentSeqIndex(0);
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => { setIsPlaying(false); setCurrentSeqIndex(-1); };
  const frame = currentSeqIndex >= 0 && currentSeqIndex < sequence.length ? sequence[currentSeqIndex] : null;

  return (
    <div className="text-to-sign-page container animate-fade-in relative">
      <div className="tts-header flex justify-between items-center mb-6 mt-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Keyboard className="text-accent-blue" />
          <span className="text-gradient">Text to Sign Translation</span>
        </h2>
      </div>

      <div className="tts-grid">
        {/* ── Input Panel ── */}
        <div className="tts-input-panel glass-panel">
          <h3>Enter Text</h3>
          <p className="tts-subtitle">Type any word or sentence. Unknown words are fingerspelled letter by letter.</p>
          <textarea
            className="tts-textarea"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="E.g., My name is Sam..."
            rows="5"
          />
          <div className="tts-stats flex justify-between">
            <span>{words.length} Words | {sequence.length} Frames</span>
          </div>
          <div className="tts-speed-control mt-4">
            <span className="speed-label">Playback Speed:</span>
            <div className="speed-buttons">
              {[0.5, 1, 1.5, 2].map(s => (
                <button key={s} className={`speed-btn ${playbackSpeed === s ? 'active' : ''}`} onClick={() => setPlaybackSpeed(s)}>{s}x</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Playback Panel ── */}
        <div className="tts-playback-panel glass-panel">
          <div className="avatar-screen">
            {!frame ? (
              <div className="avatar-placeholder">
                <FastForward size={48} className="opacity-50 mb-4" />
                <p>Press Play to begin</p>
              </div>
            ) : (
              <div className="avatar-active animate-fade-in" key={currentSeqIndex}>
                <div className="sprite-wrapper">
                  <SignSprite letterKey={frame.key} size={220} />
                  <div className="sprite-label" style={{ color: '#00f0ff' }}>{frame.label}</div>
                  <div className="sprite-gesture">{GESTURE[frame.key] || 'Show the sign'}</div>
                  {frame.type === 'letter' && <span className="fingerspell-badge">Fingerspelling</span>}
                </div>
              </div>
            )}
            <div className="playback-progress-bar">
              <div className="playback-progress-fill" style={{ width: `${sequence.length > 0 ? ((currentSeqIndex + 1) / sequence.length) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="playback-controls">
            <button className="control-btn" onClick={handleReset}><RotateCcw size={20} /></button>
            <button className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`} onClick={handlePlayPause}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button className="control-btn" onClick={() => { setIsPlaying(false); setCurrentSeqIndex(sequence.length - 1); }}><Square size={20} /></button>
          </div>

          <div className="sequence-preview">
            {words.map((w, i) => {
              const isActive = frame && frame.wordIndex === i;
              const isPast = frame && frame.wordIndex > i;
              return (
                <span key={i} className={`sequence-word ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                  onClick={() => { setIsPlaying(false); const f = sequence.findIndex(s => s.wordIndex === i); if (f !== -1) setCurrentSeqIndex(f); }}>
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
