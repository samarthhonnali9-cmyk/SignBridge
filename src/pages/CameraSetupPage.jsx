import { Camera, ShieldAlert, Video, Hand } from 'lucide-react';
import Button from '../components/Button';
import './CameraSetupPage.css';

export default function CameraSetupPage() {
  return (
    <div className="setup-page flex items-center justify-center container animate-fade-in">
      <div className="setup-card glass-panel flex flex-col items-center text-center">
        <div className="setup-icon-wrapper mb-6">
          <Camera size={48} className="text-gradient" />
        </div>
        
        <h2 className="setup-title mb-4">Camera Access Required</h2>
        
        <p className="setup-desc mb-8">
          SignBridge needs access to your webcam to detect and translate your sign language gestures locally in real-time. We prioritize your privacy—no video is recorded or sent to our servers.
        </p>
        
        <ul className="text-left w-full mb-8 space-y-4">
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Hand size={18} />
            </div>
            <div>
              <span className="font-semibold text-gray-200">Sentence Building Words</span>
              <p className="text-sm text-gray-400 mt-1">
                <span className="text-blue-400 font-bold">I</span>: Pointing Up near chest<br/>
                <span className="text-blue-400 font-bold">You</span>: Pointing Up forward<br/>
                <span className="text-blue-400 font-bold">My</span>: Open Palm near chest<br/>
                <span className="text-blue-400 font-bold">Name</span>: Two Fingers (Victory) near chest<br/>
                <span className="text-blue-400 font-bold">Need</span>: Two Thumbs Up
              </p>
            </div>
          </li>
          
          <li className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-green-400">
              <span className="font-bold">Aa</span>
            </div>
            <div>
              <span className="font-semibold text-gray-200">Alphabet Mode (True ASL)</span>
              <p className="text-sm text-gray-400 mt-1">
                Toggle the switch at the top to <b>Alphabet Mode</b> and form the actual American Sign Language letters:
                <br/><span className="text-green-400 font-bold">S</span> = Fist with thumb tightly wrapped across the front
                <br/><span className="text-green-400 font-bold">A</span> = Fist with thumb pointing straight UP along the side
                <br/><span className="text-green-400 font-bold">R</span> = Index and Middle fingers crossed (or just extended together)
                <br/><span className="text-green-400 font-bold">M</span> = Fist with thumb tucked completely underneath
              </p>
            </div>
          </li>
        </ul>
        
        <div className="privacy-note flex items-center gap-2 mb-8">
          <ShieldAlert size={16} color="#10b981" />
          <span>100% Secure & On-Device Processing</span>
        </div>
        
        <div className="setup-actions">
          <Button to="/recognize" glow={true}>
            <Video size={18} /> Enable Camera
          </Button>
        </div>
      </div>
    </div>
  );
}
