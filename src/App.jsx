import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignProvider } from './context/SignContext';
import LandingPage from './pages/LandingPage';
import RecognitionPage from './pages/RecognitionPage';
import CameraSetupPage from './pages/CameraSetupPage';
import TextToSignPage from './pages/TextToSignPage';
import AIModelInfoPage from './pages/AIModelInfoPage';
import Header from './components/Header';

function App() {
  return (
    <SignProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<CameraSetupPage />} />
            <Route path="/recognize" element={<RecognitionPage />} />
            <Route path="/text-to-sign" element={<TextToSignPage />} />
            <Route path="/ai-info" element={<AIModelInfoPage />} />
          </Routes>
        </main>
      </Router>
    </SignProvider>
  );
}

export default App;
