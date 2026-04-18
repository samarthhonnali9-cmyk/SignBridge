import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { RefreshCw, Camera, CameraOff } from 'lucide-react';
import './WebcamView.css';

export default function WebcamView({ onGestureDetect, onModelLoaded, recognitionMode = 'grammar', children }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error' | 'off'
  const [errorMsg, setErrorMsg] = useState('');
  const recognizerRef = useRef(null);
  const requestRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const streamRef = useRef(null); // track stream to stop it
  const modeRef = useRef(recognitionMode);

  // Sync mode prop to ref so the prediction loop can read the latest value without restarting
  useEffect(() => {
    modeRef.current = recognitionMode;
  }, [recognitionMode]);

  const startCamera = async () => {
    setStatus('loading');
    setErrorMsg('');

    let stream = null;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        '/node_modules/@mediapipe/tasks-vision/wasm'
      );

      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });

      recognizerRef.current = recognizer;

      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream; // save reference

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          setStatus('ready');
          if (onModelLoaded) onModelLoaded();
          predictWebcam();
        };
      }
    } catch (err) {
      console.error('Camera/ML init error:', err);
      setStatus('error');
      setErrorMsg(err?.message?.includes('Permission') ? 'Camera permission denied.' : 'Failed to load AI model.');
      if (onModelLoaded) onModelLoaded();
      if (stream) stream.getTracks().forEach((t) => t.stop());
    }

    const predictWebcam = () => {
      if (
        videoRef.current &&
        videoRef.current.videoWidth > 0 &&
        recognizerRef.current &&
        videoRef.current.currentTime !== lastVideoTimeRef.current
      ) {
        lastVideoTimeRef.current = videoRef.current.currentTime;
        try {
          const now = Date.now();
          const results = recognizerRef.current.recognizeForVideo(videoRef.current, now);

          if (results?.gestures?.length > 0) {
            // Two-hand detection
            if (results.gestures.length >= 2) {
              const g1 = results.gestures[0][0].categoryName;
              const g2 = results.gestures[1][0].categoryName;
              const avg = (results.gestures[0][0].score + results.gestures[1][0].score) / 2;

              if (g1 === 'Open_Palm' && g2 === 'Open_Palm') onGestureDetect('Thank You', avg);
              else if (g1 === 'Closed_Fist' && g2 === 'Closed_Fist') onGestureDetect('Help', avg);
              else if (g1 === 'Victory' && g2 === 'Victory') onGestureDetect('Goodbye', avg);
              else if (g1 === 'Thumb_Down' && g2 === 'Thumb_Down') onGestureDetect('Pain', avg);
              else if (g1 === 'Thumb_Up' && g2 === 'Thumb_Up') onGestureDetect('Need', avg);
            } else {
              // Single hand
              const gesture = results.gestures[0][0];
              const landmarks = results.landmarks[0];
              const wrist = landmarks[0];
              let resolved = gesture.categoryName;

              if (modeRef.current === 'alphabet') {
                const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
                let letter = 'None';

                // HIGHEST POINT LOGIC (Absolute Truth for A vs P)
                const tips = [landmarks[4].y, landmarks[8].y, landmarks[12].y, landmarks[16].y, landmarks[20].y];
                const highestPoint = Math.min(...tips); // Lower Y means higher on screen
                
                // Extension Checks: For Thumb (A), ensure it is significantly higher than the Index Knuckle to avoid 'S' fist overlap
                const tUp = landmarks[4].y === highestPoint && dist(landmarks[4], landmarks[3]) > 0.05 && landmarks[4].y < landmarks[5].y - 0.02;
                const iUp = dist(landmarks[8], landmarks[0]) > dist(landmarks[5], landmarks[0]) * 1.25;
                const mUp = dist(landmarks[12], landmarks[0]) > dist(landmarks[9], landmarks[0]) * 1.25;
                const rUp = dist(landmarks[16], landmarks[0]) > dist(landmarks[13], landmarks[0]) * 1.25;
                const pUp = dist(landmarks[20], landmarks[0]) > dist(landmarks[17], landmarks[0]) * 1.25;

                const count = (iUp?1:0) + (mUp?1:0) + (rUp?1:0) + (pUp?1:0);
                
                // PRIORITY SWITCH
                if (tUp && count === 0) {
                   letter = 'A'; // Thumb is the ONLY highest point
                } else if (iUp && count === 1) {
                   letter = 'P'; // Index is the ONLY highest point
                } else if (count === 0 && !tUp) {
                   letter = 'S'; // Fist (Nothing is high up)
                } else if (count === 2) {
                   letter = 'R'; 
                } else if (count === 3) {
                   letter = 'M';
                } else if (count >= 4) {
                   letter = 'B';
                }

                if (onGestureDetect) {
                  // Revert to 0.98 for trained alphabet gestures so S isn't rejected by low MediaPipe confidence
                  onGestureDetect(letter, letter === 'None' ? 0 : 0.98);
                }
              } else {
                // Grammar mode logic
                if (resolved === 'Open_Palm') resolved = wrist.y > 0.6 ? 'My' : 'Stop';
                else if (resolved === 'Closed_Fist') resolved = 'Attention';
                else if (resolved === 'Victory') resolved = wrist.y > 0.6 ? 'Name' : 'Hello';
                if (onGestureDetect) onGestureDetect(resolved, gesture.score);
              }
            }
          } else {
            if (onGestureDetect) onGestureDetect('None', 0);
          }
        } catch (e) {
          console.error("Inference Error:", e);
        }
      }
      requestRef.current = requestAnimationFrame(predictWebcam);
    };
  };

  const stopCamera = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (onGestureDetect) onGestureDetect('None', 0);
    setStatus('off');
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (recognizerRef.current) recognizerRef.current.close().catch(() => { });
    };
  }, []);

  return (
    <div className="webcam-container glass-panel">
      {/* Loading overlay */}
      {status === 'loading' && (
        <div className="webcam-status-overlay">
          <div className="spinner" />
          <p className="status-msg">Initializing AI Camera...</p>
        </div>
      )}

      {/* Error overlay */}
      {status === 'error' && (
        <div className="webcam-status-overlay">
          <Camera size={40} className="error-icon" />
          <p className="status-msg error">{errorMsg || 'Camera failed to start.'}</p>
          <button className="retry-btn" onClick={startCamera}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      )}

      {/* Camera ready badge */}
      {status === 'ready' && (
        <div className="cam-ready-badge">
          <span className="ready-dot" />
          Ready to Detect
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="webcam-video"
        style={{ opacity: status === 'ready' ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />

      {/* Corner markers */}
      <div className="webcam-overlay pointer-events-none">
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />
      </div>

      {children}

      {/* Camera Off / On toggle button */}
      {(status === 'ready' || status === 'off') && (
        <div className="cam-toggle-bar">
          {status === 'ready' ? (
            <button className="cam-off-btn" onClick={stopCamera}>
              <CameraOff size={16} /> Turn Off Camera
            </button>
          ) : (
            <button className="cam-off-btn cam-on-btn" onClick={startCamera}>
              <Camera size={16} /> Turn On Camera
            </button>
          )}
        </div>
      )}
    </div>
  );
}
