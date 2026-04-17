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
      const now = Date.now();
      if (
        videoRef.current &&
        videoRef.current.videoWidth > 0 &&
        recognizerRef.current &&
        videoRef.current.currentTime !== lastVideoTimeRef.current
      ) {
        lastVideoTimeRef.current = videoRef.current.currentTime;
        try {
          const results = recognizerRef.current.recognizeForVideo(videoRef.current, now);

          if (results?.gestures?.length > 0) {
            // Two-hand gestures first
            if (results.gestures.length === 2 && onGestureDetect) {
              const g1 = results.gestures[0][0].categoryName;
              const g2 = results.gestures[1][0].categoryName;
              const avg = (results.gestures[0][0].score + results.gestures[1][0].score) / 2;

              if (g1 === 'Open_Palm' && g2 === 'Open_Palm') {
                onGestureDetect('Thank You', avg);
                requestRef.current = requestAnimationFrame(predictWebcam);
                return;
              }
              if (g1 === 'Closed_Fist' && g2 === 'Closed_Fist') {
                onGestureDetect('Help', avg);
                requestRef.current = requestAnimationFrame(predictWebcam);
                return;
              }
              if (g1 === 'Victory' && g2 === 'Victory') {
                onGestureDetect('Goodbye', avg);
                requestRef.current = requestAnimationFrame(predictWebcam);
                return;
              }
              if (g1 === 'Thumb_Down' && g2 === 'Thumb_Down') {
                onGestureDetect('Pain', avg);
                requestRef.current = requestAnimationFrame(predictWebcam);
                return;
              }

              if (g1 === 'Thumb_Up' && g2 === 'Thumb_Up') {
                onGestureDetect('Need', avg);
                requestRef.current = requestAnimationFrame(predictWebcam);
                return;
              }

            }

            // Single hand
            const gesture = results.gestures[0][0];
            const landmarks = results.landmarks[0];
            const wrist = landmarks[0]; // wrist Y: 0=top (forehead), 1=bottom
            let resolved = gesture.categoryName;

            if (modeRef.current === 'alphabet') {
              // Binary Finger Encoding (BFE) Heuristic for 26 alphabets based on 5-finger extension
              const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

              // Finger is extended if tip is further from wrist than PIP
              const tOut = dist(landmarks[0], landmarks[4]) > dist(landmarks[0], landmarks[2]) * 1.3;
              const iOut = dist(landmarks[0], landmarks[8]) > dist(landmarks[0], landmarks[6]) * 1.2;
              const mOut = dist(landmarks[0], landmarks[12]) > dist(landmarks[0], landmarks[10]) * 1.2;
              const rOut = dist(landmarks[0], landmarks[16]) > dist(landmarks[0], landmarks[14]) * 1.2;
              const pOut = dist(landmarks[0], landmarks[20]) > dist(landmarks[0], landmarks[18]) * 1.2;

              const sig = `${tOut + 0}${iOut + 0}${mOut + 0}${rOut + 0}${pOut + 0}`;

              let letter = 'None';
              switch (sig) {
                case '00000':
                case '10000':
                  // In ASL 'A', the thumb tip (4) is higher or near index PIP (6)
                  if (landmarks[4].y <= landmarks[6].y + 0.05) {
                    letter = 'A';
                  } else if (dist(landmarks[4], landmarks[17]) < dist(landmarks[4], landmarks[5])) {
                    letter = 'M';
                  } else if (landmarks[4].y > landmarks[10].y) {
                    letter = 'E';
                  } else {
                    letter = 'S';
                  }
                  break;
                case '01000': letter = 'D'; break;
                case '01111': letter = 'B'; break;
                case '11111': letter = 'C'; break;
                case '00111': letter = 'F'; break;
                case '00001': letter = 'I'; break;
                case '10001': letter = 'Y'; break;
                case '11000': letter = 'L'; break;
                case '01110': letter = 'W'; break;
                case '01100':
                  if (dist(landmarks[8], landmarks[12]) < dist(landmarks[5], landmarks[9]) * 0.6) {
                    letter = 'R';
                  } else if (dist(landmarks[8], landmarks[12]) > dist(landmarks[5], landmarks[9]) * 1.5) {
                    letter = 'V';
                  } else {
                    letter = 'U';
                  }
                  break;
                case '11100': letter = 'P'; break;
                case '01001': letter = 'Z'; break;
                case '10011': letter = 'J'; break;
                case '11001': letter = 'K'; break;
                case '10100': letter = 'T'; break;
                case '00010': letter = 'N'; break;
                case '00100': letter = 'H'; break;
                case '01010': letter = 'X'; break;
                case '00101': letter = 'Q'; break;
                case '10010': letter = 'O'; break;
                case '01101': letter = 'G'; break;
                default:
                  if (sig.includes('1111')) letter = 'B';
                  else if (sig.includes('111')) letter = 'W';
                  else letter = 'None';
              }
              resolved = letter;
            } else {
              // Normal grammar mode
              if (resolved === 'Open_Palm') {
                resolved = wrist.y > 0.6 ? 'My' : 'Stop';
              } else if (resolved === 'Closed_Fist') {
                resolved = 'Attention';
              } else if (resolved === 'Pointing_Up') {
                if (wrist.y < 0.3) resolved = 'Fever';
                else if (wrist.y > 0.6) resolved = 'I';
                else resolved = 'You';
              } else if (resolved === 'Victory') {
                resolved = wrist.y > 0.6 ? 'Name' : 'Hello';
              }
            }

            if (onGestureDetect) onGestureDetect(resolved, gesture.score);
          } else {
            if (onGestureDetect) onGestureDetect('None', 0);
          }
        } catch (e) {
          console.error(e);
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
