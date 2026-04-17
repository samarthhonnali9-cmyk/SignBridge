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
    "Need": "Need", "S": "S", "A": "A", "R": "R", "M": "M"
  },
  "hi-IN": {
    "Yes": "हाँ", "No": "नहीं", "Stop": "रुको", "Hello": "नमस्ते", "Help": "मदದ चाहिए", "Goodbye": "अलविदा",
    "I Love You": "मैं तुमसे प्यार करता हूँ", "Water": "पानी चाहिए", "Attention": "ध्यान दें", "Thank You": "धन्यवाद",
    "Pain": "मुझे दर्द हो रहा है", "Fever": "मुझे बुखार है", "My": "मेरा", "I": "मैं", "You": "तुम", "Name": "नाम",
    "Need": "ज़रूरत है", "S": "S", "A": "A", "R": "R", "M": "M"
  },
  "kn-IN": {
    "Yes": "ಹೌದು", "No": "ಇಲ್ಲ", "Stop": "ನಿಲ್ಲಿಸಿ", "Hello": "ನಮಸ್ಕಾರ", "Help": "ಸಹಾಯ ಬೇಕು", "Goodbye": "ವಿದಾಯ",
    "I Love You": "ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ", "Water": "ನೀರು ಬೇಕು", "Attention": "ಗಮನಿಸಿ", "Thank You": "ಧನ್ಯವಾದಗಳು",
    "Pain": "ನನಗೆ ನೋವಾಗುತ್ತಿದೆ", "Fever": "ನನಗೆ ಜ್ವರ ಇದೆ", "My": "ನನ್ನ", "I": "ನಾನು", "You": "ನೀವು", "Name": "ಹೆಸರು",
    "Need": "ಬೇಕಾಗಿದೆ", "S": "S", "A": "A", "R": "R", "M": "M"
  }
};

const VISUAL_ACTIONS = ["Stop", "Help", "I Love You", "Attention", "Water", "Thank You", "Hello", "Pain", "Fever"];

const SIGN_DICTIONARY_EMOJIS = {
  "Yes": "👍", "No": "👎", "Stop": "✋", "Help": "🤝", "Hello": "👋", "Goodbye": "👋",
  "I Love You": "🤟", "Water": "🚰", "Attention": "✊", "Thank You": "🙏", "Pain": "🤕", "Fever": "🤒",
  "My": "✋", "I": "👆", "You": "👉", "Name": "📛", "Need": "🤲",
  "S": "✊", "A": "✊", "M": "👊", "R": "🤞", "E": "👊", "B": "✋", "C": "🤏", "D": "☝️", "F": "👌",
  "G": "👈", "H": "👈", "J": "🤙", "K": "🖖", "L": "🤟", "N": "👊", "O": "👌", "P": "👇",
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

  const handleGestureDetect = useCallback((rawLabel, score) => {
    let translated = rawLabel === "None" ? "None" : (GESTURE_MAP[rawLabel] || rawLabel);
    const currentConfidence = Math.floor(score * 100);
    
    if (translated === "None" || currentConfidence < 65) {
      if (translated === "None") {
        setDetectedText("Monitoring...");
        setConfidence(0);
        if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
        actionTimeoutRef.current = setTimeout(() => setActiveAction(null), 1000);
      }
      return;
    }

    setDetectedText(translated);
    setConfidence(currentConfidence);

    if (translated !== prevTextRef.current) {
      const dict = DICTIONARIES[language];
      speakText(dict[translated] || translated, language);
      prevTextRef.current = translated;

      if (VISUAL_ACTIONS.includes(translated)) {
        setActiveAction(translated);
        if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
      } else {
        setActiveAction(null);
      }

      const now = Date.now();
      const isSameWord = lastSentenceWordRef.current === translated;
      const timeSinceLast = now - lastSentenceWordTimeRef.current;

      if (!isSameWord || timeSinceLast > SENTENCE_COOLDOWN_MS) {
        setSentenceWords(prev => [...prev, translated]);
        lastSentenceWordRef.current = translated;
        lastSentenceWordTimeRef.current = now;
      }

      setHistory(prev => [{ text: translated, confidence: currentConfidence, timestamp: Date.now() }, ...prev].slice(0, 50));
    }
  }, [language, speakText]);

  return (
    <div className="recognition-page container animate-fade-in pt-24 pb-8">
      
      <div className="recognition-dashboard grid grid-cols-12 gap-6 mb-8">
        
        {/* Main Feed View */}
        <div className="col-span-8 flex flex-col gap-6">
          
          <div className="relative rounded-3xl overflow-hidden glass-panel border-blue shadow-glow">
             <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-green-500/30 text-green-400 text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  LIVE AI RECOGNITION
                </div>
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/50 text-xs font-mono">
                  {standard} / {recognitionMode.toUpperCase()}
                </div>
             </div>

             <WebcamView onGestureDetect={handleGestureDetect} onModelLoaded={handleModelLoaded} recognitionMode={recognitionMode}>
                <ActionOverlays activeAction={activeAction} />
             </WebcamView>
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
