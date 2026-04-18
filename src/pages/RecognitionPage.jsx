import { useState, useEffect, useRef, useCallback } from 'react';
import WebcamView from '../components/WebcamView';
import DetectionResult from '../components/DetectionResult';
import ConfidenceMeter from '../components/ConfidenceMeter';
import HistoryLog from '../components/HistoryLog';
import ActionOverlays from '../components/ActionOverlays';
import AnalyticsBar from '../components/AnalyticsBar';
import SentenceBuilder from '../components/SentenceBuilder';
import { Activity, Download, FileText, Share2, Shield, Settings2, Sparkles } from 'lucide-react';
import { useSign } from '../context/SignContext';
import './RecognitionPage.css';

// System Maps
const GESTURE_MAP = {
  "Thumb_Up": "Yes",
  "Thumb_Down": "No",
  "Stop": "Stop",
  "Victory": "Hello",
  "Help": "Help",
  "Goodbye": "Goodbye",
  "ILoveYou": "I Love You",
  "Pointing_Up": "Water",
  "Closed_Fist": "Attention",
  "Thank You": "Thank You",
  "Pain": "Pain",
  "Fever": "Fever"
};

// Language Dictionaries
const DICTIONARIES = {
  "en-US": {
    "Yes": "Yes", "No": "No", "Stop": "Stop", "Hello": "Hello", "Help": "Help needed", "Goodbye": "Goodbye",
    "I Love You": "I Love You", "Water": "Need Water", "Attention": "Attention", "Thank You": "Thank You",
    "Pain": "I am in pain", "Fever": "I have a fever", "My": "My", "I": "I", "You": "You", "Name": "Name",
    "Need": "Need", 
    "A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F", "G": "G", "H": "H", "I": "I", "J": "J",
    "K": "K", "L": "L", "M": "M", "N": "N", "O": "O", "P": "P", "Q": "Q", "R": "R", "S": "S", "T": "T",
    "U": "U", "V": "V", "W": "W", "X": "X", "Y": "Y", "Z": "Z"
  },
  "hi-IN": {
    "Yes": "हाँ", "No": "नहीं", "Stop": "रुको", "Hello": "नमस्ते", "Help": "मदद चाहिए", "Goodbye": "अलविदा",
    "I Love You": "मैं तुमसे प्यार करता हूँ", "Water": "पानी चाहिए", "Attention": "ध्यान दें", "Thank You": "धन्यवाद",
    "Pain": "मुझे दर्द हो रहा है", "Fever": "मुझे बुखार है", "My": "मेरा", "I": "मैं", "You": "तुम", "Name": "नाम",
    "Need": "ज़रूरत है",
    "A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F", "G": "G", "H": "H", "I": "I", "J": "J",
    "K": "K", "L": "L", "M": "M", "N": "N", "O": "O", "P": "P", "Q": "Q", "R": "R", "S": "S", "T": "T",
    "U": "U", "V": "V", "W": "W", "X": "X", "Y": "Y", "Z": "Z"
  },
  "kn-IN": {
    "Yes": "ಹೌದು", "No": "ಇಲ್ಲ", "Stop": "ನಿಲ್ಲಿಸಿ", "Hello": "ನಮಸ್ಕಾರ", "Help": "ಸಹಾಯ ಬೇಕು", "Goodbye": "ವಿದಾಯ",
    "I Love You": "ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ", "Water": "ನೀರು ಬೇಕು", "Attention": "ಗಮನಿಸಿ", "Thank You": "ಧನ್ಯವಾದಗಳು",
    "Pain": "ನನಗೆ ನೋವಾಗುತ್ತಿದೆ", "Fever": "ನನಗೆ ಜ್ವರ ಇದೆ", "My": "ನನ್ನ", "I": "ನಾನು", "You": "ನೀವು", "Name": "ಹೆಸರು",
    "Need": "ಬೇಕಾಗಿದೆ",
    "A": "A", "B": "B", "C": "C", "D": "D", "E": "E", "F": "F", "G": "G", "H": "H", "I": "I", "J": "J",
    "K": "K", "L": "L", "M": "M", "N": "N", "O": "O", "P": "P", "Q": "Q", "R": "R", "S": "S", "T": "T",
    "U": "U", "V": "V", "W": "W", "X": "X", "Y": "Y", "Z": "Z"
  }
};

const VISUAL_ACTIONS = ["Stop", "Help", "I Love You", "Attention", "Water", "Thank You", "Hello", "Pain", "Fever"];

// Helper for ASL Sprites
const INDIVIDUAL_ASL = new Set(['a','b','c','d','e','f','g','h','i','j','m','p','r','s']);
const ASL_SPRITE = {
  'a':{c:0,r:0},'b':{c:1,r:0},'c':{c:2,r:0},'d':{c:3,r:0},
  'e':{c:4,r:0},'f':{c:5,r:0},'g':{c:6,r:0},
  'h':{c:0,r:1},'i':{c:1,r:1},'j':{c:2,r:1},'k':{c:3,r:1},
  'l':{c:4,r:1},'m':{c:5,r:1},'n':{c:6,r:1},
  'o':{c:0,r:2},'p':{c:1,r:2},'q':{c:2,r:2},'r':{c:3,r:2},
  's':{c:4,r:2},'t':{c:5,r:2},
  'u':{c:0,r:3},'v':{c:1,r:3},'w':{c:2,r:3},'x':{c:3,r:3},
  'y':{c:4,r:3},'z':{c:5,r:3},
};
// Trained Letters array specifically aligned with the 3D WebCam algorithm
const TRAINED_LETTERS = ['A', 'P', 'S', 'R', 'M', 'B'];

const SIGN_DICTIONARY_EMOJIS = {
  "Yes": "👍", "No": "👎", "Stop": "✋", "Help": "🤝", "Hello": "👋", "Goodbye": "👋",
  "I Love You": "🤟", "Water": "🚰", "Attention": "✊", "Thank You": "🙏", "Pain": "🤕", "Fever": "🤒",
  "My": "✋", "I": "👆", "You": "👉", "Name": "📛", "Need": "🤲",
  "A": "👍", "S": "✊", "M": "🤟", "R": "🤞", "E": "🖐️", "B": "✋", "C": "🤏", "D": "☝️", "F": "👌",
  "G": "👈", "H": "👈", "J": "🤙", "K": "🖖", "L": "🤙", "N": "👊", "O": "👌", "P": "☝️",
  "Q": "👇", "T": "👊", "U": "✌️", "V": "✌️", "W": "🖐️", "X": "☝️", "Y": "🤙", "Z": "☝️"
};

const SENTENCE_COOLDOWN_MS = 2500;

export default function RecognitionPage() {
  const { standard, language } = useSign();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [detectedText, setDetectedText] = useState("Initializing Engine...");
  const [confidence, setConfidence] = useState(0);
  const [history, setHistory] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]); // Saved sentences
  
  const [activeAction, setActiveAction] = useState(null); 
  const [sessionTime, setSessionTime] = useState(0);
  const [recognitionMode, setRecognitionMode] = useState('grammar'); 
  const [isPlayingSign, setIsPlayingSign] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);

  const [holdLetter, setHoldLetter] = useState(null);
  const holdStartTimeRef = useRef(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  const [sentenceWords, setSentenceWords] = useState([]);
  const [punctuation, setPunctuation] = useState('.');

  const prevTextRef = useRef("Waiting...");
  const actionTimeoutRef = useRef(null);
  const lastSpeechTimeRef = useRef(0);
  const lastSentenceWordRef = useRef('');
  const lastSentenceWordTimeRef = useRef(0);
  const playbackTimerRef = useRef(null);

  const handlePlaySign = useCallback(() => {
    if (sentenceWords.length === 0) return;
    setIsPlayingSign(true);
    setPlayIndex(0);
  }, [sentenceWords]);

  useEffect(() => {
    if (isPlayingSign && playIndex >= 0 && playIndex < sentenceWords.length) {
      const currentWord = sentenceWords[playIndex];
      setActiveAction(currentWord);
      const isLetter = currentWord.length === 1;
      const delay = isLetter ? 800 : 1500;
      
      playbackTimerRef.current = setTimeout(() => {
        if (playIndex < sentenceWords.length - 1) {
          setPlayIndex(playIndex + 1);
        } else {
          setIsPlayingSign(false);
          setPlayIndex(-1);
          setTimeout(() => setActiveAction(null), 1000);
        }
      }, delay);
    }
    return () => clearTimeout(playbackTimerRef.current);
  }, [isPlayingSign, playIndex, sentenceWords]);

  const buildDisplaySentence = useCallback((words, punct, lang) => {
    if (words.length === 0) return '';
    const dict = DICTIONARIES[lang];
    const translated = words.map(w => dict[w] || w);
    if (translated.length > 0) {
      translated[0] = translated[0].charAt(0).toUpperCase() + translated[0].slice(1);
    }
    return translated.join(' ') + (punct || '');
  }, []);

  const displaySentence = buildDisplaySentence(sentenceWords, punctuation, language);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        setRecognitionMode(prev => prev === 'grammar' ? 'alphabet' : 'grammar');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!modelLoaded) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [modelLoaded]);

  const speakText = useCallback((text, lang, force = false) => {
    const now = Date.now();
    if (!force && now - lastSpeechTimeRef.current < 2000) return;
    lastSpeechTimeRef.current = now;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => v.lang.replace('_', '-') === lang) || voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      if (targetVoice) utterance.voice = targetVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleSpeakSentence = useCallback(() => {
    if (sentenceWords.length === 0) return;
    const full = buildDisplaySentence(sentenceWords, punctuation, language);
    speakText(full, language, true);
  }, [sentenceWords, punctuation, language, buildDisplaySentence, speakText]);

  const handleClearSentence = useCallback(() => {
    setSentenceWords([]);
    lastSentenceWordRef.current = '';
    lastSentenceWordTimeRef.current = 0;
  }, []);

  const handleSaveSentence = useCallback(() => {
    if (sentenceWords.length === 0) return;
    setSessionHistory(prev => [displaySentence, ...prev]);
    handleClearSentence();
  }, [displaySentence, sentenceWords.length, handleClearSentence]);

  const handleExportHistory = () => {
    const content = "SignBridge Conversation Transcript\n" +
                    "Standard: " + standard + "\n" +
                    "Language: " + language + "\n" +
                    "----------------------------------\n\n" +
                    sessionHistory.join("\n") + 
                    "\n\nExported on: " + new Date().toLocaleString();
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `signbridge_transcript_${Date.now()}.txt`;
    link.click();
  };

  const handleModelLoaded = () => {
    setModelLoaded(true);
    setDetectedText("Environment Ready.");
  };

  const handleGestureDetect = useCallback((detectedGesture, score, topThree = []) => {
    const gesture = detectedGesture;
    setDetectedText(detectedGesture);
    setConfidence(Math.round(score * 100));
    setSuggestions(topThree.filter(g => g.category !== detectedGesture && g.score > 0.1).slice(0, 3));

    if (!modelLoaded) setModelLoaded(true);
    
    if (recognitionMode === 'alphabet') {
      // 1. Minimum confidence filter (70% for better sensitivity)
      if (score < 0.7 || !detectedGesture || detectedGesture === 'None') {
        setHoldLetter(null);
        setHoldProgress(0);
        return;
      }

      const HOLD_DURATION = 3000; // 3-second hold as requested by Jury

      if (detectedGesture === holdLetter) {
        if (holdProgress >= 100) return; // Prevent repeating indefinitely while held

        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
        setHoldProgress(progress);

        if (progress >= 100) {
          setSentenceWords(prev => [...prev, gesture]);
          lastSentenceWordTimeRef.current = Date.now();
          
          const dict = DICTIONARIES[language];
          speakText(dict[gesture] || gesture, language);
          
          // Intentionally NOT resetting holdLetter here to keep progress locked at 100%.
          // This prevents the system from infinitely looping and repeating the text/voice,
          // forcing the user to lower their hand before typing the next letter.
        }
      } else {
        setHoldLetter(gesture);
        holdStartTimeRef.current = Date.now();
        setHoldProgress(0);
      }
    } else {
      // Grammar mode (Optimized logic)
      if (gesture !== prevTextRef.current) {
        prevTextRef.current = gesture;
        
        if (!gesture || gesture === 'None') return;

        const dict = DICTIONARIES[language];
        speakText(dict[gesture] || gesture, language);

        if (VISUAL_ACTIONS.includes(gesture)) {
          setActiveAction(gesture);
          if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
          actionTimeoutRef.current = setTimeout(() => setActiveAction(null), 1000);
        }

        setSentenceWords(prev => [...prev, gesture]);
      }
    }
  }, [language, recognitionMode, holdLetter, modelLoaded, speakText]);

  const handleBackspace = useCallback(() => {
    setSentenceWords(prev => prev.slice(0, -1));
  }, []);

  const handleManualAdd = useCallback((item) => {
    setSentenceWords(prev => [...prev, item]);
    lastSentenceWordTimeRef.current = Date.now();
    const dict = DICTIONARIES[language];
    speakText(dict[item] || item, language);
  }, [language, speakText]);

  return (
    <div className="recognition-page container animate-fade-in pt-24 pb-8">
      
      <div className="recognition-dashboard grid grid-cols-12 gap-6 mb-8">
        
        {/* Main Feed View */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="recognition-engine relative rounded-3xl overflow-hidden glass-panel border-blue shadow-glow min-h-[500px]">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-green-500/30 text-green-400 text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  LIVE AI RECOGNITION
                </div>
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/50 text-xs font-mono">
                  {standard} / {recognitionMode.toUpperCase()}
                </div>
            </div>

            <WebcamView 
              onGestureDetect={handleGestureDetect} 
              onModelLoaded={handleModelLoaded}
              recognitionMode={recognitionMode}
            >
              <ActionOverlays activeAction={activeAction} />
            </WebcamView>
            
            {/* Hold Progress Overlay */}
            {holdProgress > 0 && holdProgress < 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-none transition-opacity">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center relative">
                    <svg className="w-24 h-24 absolute -rotate-90">
                      <circle
                        cx="48" cy="48" r="44"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-accent-blue"
                        strokeDasharray={276}
                        strokeDashoffset={276 - (276 * holdProgress) / 100}
                      />
                    </svg>
                    <span className="text-3xl font-black">{holdLetter}</span>
                  </div>
                  <span className="mt-4 px-4 py-1 bg-accent-blue/20 text-accent-blue text-xs font-bold rounded-full uppercase tracking-widest animate-pulse">
                    Hold Steady
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="engine-status bg-card p-6 rounded-2xl flex flex-col gap-4 border-light shadow-glow">
            {/* Two-Row Alphabet Reference Guide */}
            {recognitionMode === 'alphabet' ? (
              <div className="alphabet-master-guide bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between px-2">
                   <div className="flex flex-col">
                     <span className="text-xs font-black uppercase tracking-widest text-accent-blue">Alphabet Master Guide (A-Z)</span>
                     <span className="text-[11px] text-white/50 mt-1">Tap any letter or use the camera to type</span>
                   </div>
                   <span className="text-[10px] text-muted animate-pulse">Scroll Right ➡️</span>
                </div>
                
                {/* Only Show the Actually Trained Algorithm Letters */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth justify-center">
                  {TRAINED_LETTERS.map((letter, i) => (
                    <div key={i} onClick={() => handleManualAdd(letter)} className={`flex-shrink-0 flex flex-col items-center justify-between p-2 rounded-2xl border w-20 h-32 group transition-all cursor-pointer shadow-sm relative overflow-hidden bg-gradient-to-t from-accent-blue/10 to-transparent border-accent-blue/30 hover:border-accent-blue hover:scale-105 ${holdLetter === letter ? 'border-green-400 bg-green-500/20 shadow-glow' : ''}`}>
                      {holdLetter === letter && <div className="absolute bottom-0 left-0 right-0 bg-green-500/30 transition-all duration-75 z-0" style={{ height: `${holdProgress}%` }} />}
                      
                      <div className="z-10 flex-grow flex items-center justify-center">
                         <span className="text-4xl group-hover:animate-bounce origin-bottom drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-transform">
                           {SIGN_DICTIONARY_EMOJIS[letter] || '🤚'}
                         </span>
                      </div>
                      <span className="text-xl font-black bg-gradient-to-br from-[#00f0ff] to-[#8a2be2] text-transparent bg-clip-text mt-1 z-10">{letter}</span>
                    </div>
                  ))}
                  
                  {/* Action Keys */}
                  <div className="border-l border-white/10 mx-1"></div>
                  
                  <div onClick={handleBackspace} className="flex-shrink-0 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/10 w-[4.5rem] h-32 group hover:border-red-500 hover:bg-red-500/10 transition-all cursor-pointer shadow-sm">
                      <span className="text-sm font-black text-white/70 group-hover:text-red-400 transition-colors uppercase">Del</span>
                  </div>
                  <div onClick={() => handleManualAdd(" ")} className="flex-shrink-0 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/10 w-24 h-32 group hover:border-accent-blue hover:bg-accent-blue/10 transition-all cursor-pointer shadow-sm">
                      <span className="text-sm font-black text-white/70 group-hover:text-accent-blue transition-colors uppercase">Space</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="mode-toggle-hint flex items-center gap-3 text-xs font-bold text-muted uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl">
                  <Settings2 size={14} className="text-accent-blue" />
                  Press [Enter] to Toggle Mode
                </div>
                <div className="h-12 w-px bg-white/5" />
                <ConfidenceMeter value={confidence} />
              </div>
            )}

            {/* Hold Steady Helper */}
            {recognitionMode === 'alphabet' && (
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${detectedText === 'None' ? 'bg-red-500' : 'bg-accent-blue'} animate-pulse`} />
                   <span className="text-sm font-bold tracking-tight">
                     {detectedText === 'None' ? 'Gesture unclear - try again' : 'Hold gesture steady to confirm'}
                   </span>
                </div>
              </div>
            )}
          </div>

          <div className="sentence-builder-wrapper">
            <SentenceBuilder
              sentence={displaySentence}
              words={sentenceWords.map(w => DICTIONARIES[language][w] || w)}
              language={language}
              onClear={handleClearSentence}
              onSpeak={handleSpeakSentence}
              onPlaySign={handlePlaySign}
              onSave={handleSaveSentence}
              onPunctuationChange={setPunctuation}
              punctuation={punctuation}
            />
          </div>

        </div>

        {/* Analytics & Sidebar */}
        <div className="col-span-4 flex flex-col gap-6">
          <AnalyticsBar history={history} sessionTime={sessionTime} mode={recognitionMode} standard={standard} />
          
          <div className="glass-panel p-6 flex flex-col gap-6 flex-grow overflow-hidden">
             <DetectionResult text={DICTIONARIES[language][detectedText] || detectedText} />
             <ConfidenceMeter score={confidence} />
             
             <div className="flex-grow overflow-hidden">
                <HistoryLog 
                  history={history.map(item => ({ ...item, text: DICTIONARIES[language][item.text] || item.text }))} 
                  onClearHistory={() => setHistory([])} 
                />
             </div>

             <div className="flex gap-3 pt-4 border-t border-white/5">
                <button onClick={handleExportHistory} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all">
                  <Download size={16} /> Export Transcript
                </button>
                <div className="p-3 bg-white/5 rounded-xl text-muted hover:text-white cursor-pointer"><Settings2 size={18} /></div>
             </div>
          </div>

          {/* New Emergency SOS Card */}
          <div className="glass-panel p-6 border-red-500/20 bg-red-500/5 animate-pulse-slow">
             <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-red-500" />
                <h3 className="font-bold text-red-500">Critical Quick-Sign</h3>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-500/10 rounded-xl flex flex-col items-center">
                   <span className="text-xs font-bold uppercase tracking-tight text-red-400">🤒 SICK</span>
                   <span className="text-[10px] text-red-500/60 uppercase text-center">Double Thumbs Down</span>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl flex flex-col items-center">
                   <span className="text-xs font-bold uppercase tracking-tight text-red-400">🤝 HELP</span>
                   <span className="text-[10px] text-red-500/60 uppercase text-center">Double Fists</span>
                </div>
             </div>
          </div>

        </div>

      </div>

      {/* History Archive Table */}
      {sessionHistory.length > 0 && (
        <div className="session-history-archive glass-panel p-8 mt-4 animate-slide-up">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><FileText className="text-accent-blue" /> Session Transcript</h3>
              <div className="px-4 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest">{sessionHistory.length} Sentences Saved</div>
           </div>
           <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {sessionHistory.map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:border-blue-500/30 transition-all">
                  <span className="text-lg font-medium">{s}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg"><Share2 size={14} /></button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}

    </div>
  );
}
