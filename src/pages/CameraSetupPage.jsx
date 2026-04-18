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
        
        {/* Gesture Guide Removed per request */}
        <div className="setup-guidance-note mb-8 text-sm text-muted">
          Your camera will only be used to detect hand landmarks. All data remains on your device.
        </div>
        
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
