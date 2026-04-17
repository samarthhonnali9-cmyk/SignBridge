import './ActionOverlays.css';
import { Heart, ShieldAlert, Radio, AlertOctagon, Droplets, CheckCircle2, UserCheck, Thermometer, AlertTriangle } from 'lucide-react';

const SIGN_DICTIONARY_EMOJIS = {
    "Yes": "👍", "No": "👎", "Stop": "✋", "Help": "🤝", "Hello": "👋", "Goodbye": "👋",
    "I Love You": "🤟", "Water": "🚰", "Attention": "✊", "Thank You": "🙏", "Pain": "🤕", "Fever": "🤒",
    "My": "✋", "I": "👆", "You": "👉", "Name": "📛", "Need": "🤲",
    "S": "✊", "A": "✊", "M": "👊", "R": "🤞", "E": "👊", "B": "✋", "C": "🤏", "D": "☝️", "F": "👌",
    "G": "👈", "H": "👈", "I": "🤙", "J": "🤙", "K": "🖖", "L": "🤟", "N": "👊", "O": "👌", "P": "👇",
    "Q": "👇", "T": "👊", "U": "✌️", "V": "✌️", "W": "🖐️", "X": "☝️", "Y": "🤙", "Z": "☝️"
};

export default function ActionOverlays({ activeAction }) {
    if (!activeAction) return null;

    return (
        <div className="action-overlay-container pointer-events-none">

            {/* STOP: Red Alert Card */}
            {activeAction === 'Stop' && (
                <div className="overlay-alert-card animate-pulse-fast border-red">
                    <div className="flex flex-col items-center justify-center h-full">
                        <AlertOctagon size={80} className="text-red-500 drop-shadow-red mb-4" />
                        <h2 className="text-4xl font-bold text-red-500 drop-shadow-red uppercase tracking-widest text-shadow-red">STOP</h2>
                    </div>
                </div>
            )}

            {/* HELP: Emergency Banner */}
            {activeAction === 'Help' && (
                <div className="overlay-emergency-banner glass-panel">
                    <div className="stripes"></div>
                    <div className="banner-content flex items-center justify-center gap-4 py-3">
                        <ShieldAlert size={32} color="#ff3333" className="animate-bounce" />
                        <span className="text-2xl font-bold uppercase tracking-wider text-white text-shadow-red">Emergency: Help Needed</span>
                        <ShieldAlert size={32} color="#ff3333" className="animate-bounce" />
                    </div>
                    {/* Add a full-border pulse to Help to match spec "red emergency alert card with pulse animation" */}
                    <div className="absolute inset-0 border-8 border-red-500/50 animate-ping pointer-events-none"></div>
                </div>
            )}

            {/* WATER: Blue Assistance Card */}
            {activeAction === 'Water' && (
                <div className="overlay-water-card">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Droplets size={80} className="text-blue-400 drop-shadow-blue mb-4 animate-bounce" />
                        <h2 className="text-3xl font-bold text-blue-400 drop-shadow-blue uppercase tracking-widest text-shadow-blue">Assistance: Water Needed</h2>
                    </div>
                </div>
            )}

            {/* THANK YOU: Green Success Card */}
            {activeAction === 'Thank You' && (
                <div className="overlay-success-card">
                    <div className="flex flex-col items-center justify-center h-full">
                        <CheckCircle2 size={100} className="text-green-400 drop-shadow-green mb-4 animate-scale-up" />
                        <h2 className="text-4xl font-extrabold text-green-400 drop-shadow-green uppercase tracking-widest text-shadow-green">Thanks Recognized!</h2>
                    </div>
                </div>
            )}

            {/* HELLO: Welcome Greeting Animation */}
            {activeAction === 'Hello' && (
                <div className="overlay-hello-card">
                    <div className="hello-banner glass-panel animate-slide-down border-teal shadow-teal">
                        <UserCheck size={40} className="text-teal-300 drop-shadow-teal mr-4" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-teal-300/50 uppercase tracking-widest">Greeting Recognized</span>
                            <h2 className="text-3xl font-bold text-teal-400 drop-shadow-teal tracking-wide">Welcome! Hello!</h2>
                        </div>
                    </div>
                </div>
            )}

            {/* I LOVE YOU: Heart Animation */}
            {activeAction === 'I Love You' && (
                <div className="overlay-center absolute-center">
                    <Heart size={140} fill="#fa3e89" color="#fa3e89" className="animate-heartbeat drop-shadow-pink" />
                </div>
            )}

            {/* ATTENTION: Notification Pulse */}
            {activeAction === 'Attention' && (
                <div className="overlay-center absolute-center">
                    <div className="radar-pulse">
                        <div className="pulse-ring border-cyan-400"></div>
                        <div className="pulse-ring delay-1 border-cyan-400"></div>
                        <div className="pulse-ring delay-2 border-cyan-400"></div>
                        <Radio size={80} color="#22d3ee" className="drop-shadow-cyan z-10 relative" />
                    </div>
                </div>
            )}

            {/* PAIN: Orange warning card */}
            {activeAction === 'Pain' && (
                <div className="overlay-pain-card">
                    <div className="flex flex-col items-center justify-center h-full">
                        <AlertTriangle size={80} className="text-orange-400 drop-shadow-orange mb-4 animate-bounce" />
                        <h2 className="text-3xl font-bold text-orange-400 drop-shadow-orange uppercase tracking-widest">I Am In Pain</h2>
                    </div>
                </div>
            )}

            {/* FEVER: Hot red thermometer card */}
            {activeAction === 'Fever' && (
                <div className="overlay-fever-card">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Thermometer size={80} className="text-red-400 drop-shadow-red mb-4 animate-scale-up" />
                        <h2 className="text-3xl font-bold text-red-400 drop-shadow-red uppercase tracking-widest">I Have a Fever</h2>
                    </div>
                </div>
            )}

            {/* GENERIC / PLAYBACK: Shows emojis for words/letters */}
            {!["Stop", "Help", "Water", "Thank You", "Hello", "I Love You", "Attention", "Pain", "Fever"].includes(activeAction) && (
                <div className="overlay-playback-card animate-pop-in">
                    <div className="playback-content glass-panel">
                        <div className="playback-emoji">{SIGN_DICTIONARY_EMOJIS[activeAction] || ""}</div>
                        <div className="playback-text">{activeAction}</div>
                    </div>
                </div>
            )}

        </div>
    );
}
