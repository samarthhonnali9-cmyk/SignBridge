import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, FastForward, Keyboard } from 'lucide-react';
import './TextToSignPage.css';

// Dictionary of known words and their simulated "avatar" icon/emoji
const SIGN_DICTIONARY = {
  "hello": "👋", "hi": "👋", "hey": "👋",
  "yes": "👍", "yeah": "👍",
  "no": "👎", "nah": "👎",
  "stop": "✋", "wait": "✋",
  "help": "🤝", "support": "🤝",
  "goodbye": "👋", "bye": "👋",
  "iloveyou": "🤟", "love": "🤟",
  "water": "🚰", "drink": "🚰",
  "attention": "✊", "listen": "✊",
  "thankyou": "🙏", "thanks": "🙏",
  "pain": "🤕", "hurt": "🤕",
  "fever": "🤒", "sick": "🤒",
  "my": "✋", "mine": "✋",
  "name": "📛",
  "is": "👉", "are": "👉", "am": "👉", "be": "👉",
  "i": "👆", "me": "👆",
  "need": "🤲", "want": "🤲",
  "please": "🥺",
  "what": "👐", "where": "🤷", "who": "🤔", "how": "🤷",
  "you": "👉", "your": "👉",
  "good": "👍", "great": "👍",
  "bad": "👎", "sad": "😔",
  "happy": "😊", "smile": "😊",
  // ASL Alphabet Mappings
  "a": "✊", "b": "✋", "c": "🤏", "d": "☝️", "e": "👊", 
  "f": "👌", "g": "👈", "h": "👈", "j": "🤙", 
  "k": "🖖", "l": "🤟", "m": "👊", "n": "👊", "o": "👌", 
  "p": "👇", "q": "👇", "r": "🤞", "s": "✊", "t": "👊", 
  "u": "✌️", "v": "✌️", "w": "🖐️", "x": "☝️", "y": "🤙", "z": "☝️"
};

export default function TextToSignPage() {
  const [inputText, setInputText] = useState("My name is Ram");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeqIndex, setCurrentSeqIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [words, setWords] = useState([]);
  const [sequence, setSequence] = useState([]);
  const timerRef = useRef(null);

  // Parse text into words and flatten into animation sequence (words + letters)
  useEffect(() => {
    const rawWords = inputText.trim().split(/\s+/).filter(w => w.length > 0);
    const newSequence = [];
    
    rawWords.forEach((word, wIndex) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (SIGN_DICTIONARY[cleanWord]) {
        newSequence.push({ wordIndex: wIndex, word, display: SIGN_DICTIONARY[cleanWord], type: 'word' });
      } else {
        // Fingerspell unknown words
        const letters = cleanWord.split('');
        if (letters.length === 0) {
          newSequence.push({ wordIndex: wIndex, word, display: '?', type: 'word' });
        } else {
          letters.forEach(l => {
            const signEmoji = SIGN_DICTIONARY[l] || "";
            newSequence.push({ 
              wordIndex: wIndex, 
              word, 
              display: signEmoji ? `${signEmoji} ${l.toUpperCase()}` : l.toUpperCase(), 
              type: 'letter' 
            });
          });
        }
      }
    });

    setWords(rawWords);
    setSequence(newSequence);
    setCurrentSeqIndex(-1);
    setIsPlaying(false);
  }, [inputText]);

  // Playback logic
  useEffect(() => {
    if (isPlaying && sequence.length > 0) {
      timerRef.current = setTimeout(function nextFrame() {
        setCurrentSeqIndex((prev) => {
          const nextIdx = prev + 1;
          if (nextIdx >= sequence.length) {
            setIsPlaying(false);
            return prev;
          }
          
          // Calculate delay for next frame (letters are faster than words)
          const isNextLetter = sequence[nextIdx].type === 'letter';
          const baseDelay = isNextLetter ? 600 : 1500;
          const delay = baseDelay / playbackSpeed;
          
          timerRef.current = setTimeout(nextFrame, delay);
          return nextIdx;
        });
      }, 0); // Start immediately 
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, sequence, playbackSpeed]);

  const handlePlayPause = () => {
    if (sequence.length === 0) return;
    if (!isPlaying && currentSeqIndex >= sequence.length - 1) {
      setCurrentSeqIndex(0);
    } else if (!isPlaying && currentSeqIndex === -1) {
      setCurrentSeqIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSeqIndex(-1);
  };

  const currentFrame = currentSeqIndex >= 0 && currentSeqIndex < sequence.length ? sequence[currentSeqIndex] : null;

  return (
    <div className="text-to-sign-page container animate-fade-in relative">
      
      <div className="tts-header flex justify-between items-center mb-6 mt-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Keyboard className="text-accent-blue" />
          <span className="text-gradient">Text to Sign Translation</span>
        </h2>
      </div>

      <div className="tts-grid">
        <div className="tts-input-panel glass-panel">
          <h3>Enter Text</h3>
          <p className="tts-subtitle">Type words or a sentence to see it translated into a sign sequence.</p>
          
          <textarea
            className="tts-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="E.g., My name is Ram..."
            rows="5"
          />

          <div className="tts-stats flex justify-between">
            <span>{words.length} Words | {sequence.length} Frames</span>
          </div>

          <div className="tts-speed-control mt-4">
            <span className="speed-label">Playback Speed:</span>
            <div className="speed-buttons">
              {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  className={`speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
                  onClick={() => setPlaybackSpeed(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tts-playback-panel glass-panel">
          <div className="avatar-screen">
            {currentSeqIndex === -1 ? (
              <div className="avatar-placeholder">
                <FastForward size={48} className="opacity-50 mb-4" />
                <p>Press Play to begin sequence</p>
              </div>
            ) : (
              <div className="avatar-active animate-fade-in" key={currentSeqIndex}>
                <div className={`sign-emoji ${currentFrame.type === 'letter' ? 'letter-mode' : ''}`}>
                  {currentFrame.display}
                </div>
                <div className="sign-word">
                  {currentFrame.word}
                  {currentFrame.type === 'letter' && <span className="fingerspell-badge">Fingerspelling</span>}
                </div>
              </div>
            )}
            
            <div className="playback-progress-bar">
              <div 
                className="playback-progress-fill" 
                style={{ width: `${sequence.length > 0 ? ((currentSeqIndex + 1) / sequence.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="playback-controls">
            <button className="control-btn" onClick={handleReset} title="Reset">
              <RotateCcw size={20} />
            </button>
            <button 
              className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`} 
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button className="control-btn" onClick={() => { setIsPlaying(false); setCurrentSeqIndex(sequence.length - 1); }} title="Stop">
              <Square size={20} />
            </button>
          </div>

          <div className="sequence-preview">
            {words.map((word, idx) => {
              const isActive = currentFrame && currentFrame.wordIndex === idx;
              const isPast = currentFrame && currentFrame.wordIndex > idx;
              return (
                <span 
                  key={idx} 
                  className={`sequence-word ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                  onClick={() => { 
                    setIsPlaying(false); 
                    const firstFrameForWord = sequence.findIndex(s => s.wordIndex === idx);
                    if (firstFrameForWord !== -1) setCurrentSeqIndex(firstFrameForWord);
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
