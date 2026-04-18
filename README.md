# 🌉 SignBridge: AI-Powered ASL Accessibility Bridge

**SignBridge** is a premium, real-time accessibility application designed to bridge the communication gap between the Deaf/Hard-of-Hearing community and the hearing world. Using state-of-the-art **MediaPipe AI Landmarks** and custom **3D Heuristic Algorithms**, SignBridge translates American Sign Language (ASL) gestures into text, speech, and vice versa.

---

## 🚀 Key Features

### 1. Live AI Recognition (Camera Mode)
* **Dual Recognition Modes**:
    * **Grammar Mode**: Detects full words (My, Name, Need, Water, Help, etc.) based on hand shape and position. Features an **Active Anti-Spam** filter that ignores false tracking (`None`) and strictly prevents repetitive words from flooding the UI.
    * **Alphabet Mode (Fingerspelling)**: A custom-built 3D spatial algorithm using Binary Finger Encoding (BFE) to detect individual ASL letters (A-Z).
* **3-Second Confirmation Hold**: Recognizing letters requires the user to hold the sign steady for exactly 3 seconds, acting as an intentional confirmation mechanism before recording the text.
* **Animated Alphabet Master Guide**: In Alphabet Mode, a high-tech visual dashboard displays the ASL hand reference images. Cards feature a dynamic liquid-fill progress bar tracing the 3-second hold and a targeted "Properly Trained" badge (green pulse) highlighting fully stabilized signs algorithm limits.
* **Stealth Controls**: Use the **Enter** key to silently toggle between Grammar and Alphabet modes during live presentations.

### 2. Sentence Builder
* **Sequential Accumulation**: Automatically builds sentences from detected gestures.
* **Manual Interaction**: The animated dashboard also allows typing manually via clicking the letters, complete with `Space` and `Del` buttons.
* **Auto-Formatting**: Capitalizes the first word and adds user-selected punctuation.
* **Smart Voice**: Integrates high-fidelity Speech Synthesis to "speak" the built sentence aloud.
* **Playback Animation**: Replay your entire built sentence as a contiguous ASL animation sequence.

### 3. Text to Sign Translation
* **Avatar Simulation**: Type any sentence to see it translated into a sequence of ASL hand signs.
* **Dynamic Fingerspelling**: If a word is unknown, the system automatically breaks it down and fingerspells it using the correct hand shapes.

---

## 🕹️ Use the App
1. **Launch the Engine**: Go to the 'Live Recognition' page.
2. **Follow the UI**: Reference the dynamic 'Alphabet Master Guide' on the dashboard for current demo gestures. Look for the glowing green pulse to identify fully trained letters.
3. **Toggle Modes**: Use the **Enter** key to switch between Grammar and Alphabet modes.

---

## 🛠️ Technology Stack
* **Frontend**: React.js with Vite
* **AI Engine**: MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
* **Styling**: Vanilla CSS (Premium Glassmorphism Design System)
* **Icons**: Lucide React
* **Speech**: Native Web Speech API (TTS)

---

## 📦 Installation & Setup

1. **Clone the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run in development**:
   ```bash
   npm run dev
   ```
4. **Access the App**: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧭 Project Roadmap
- [x] Real-time 3D landmark tracking.
- [x] Multi-language support (English, Hindi, Kannada).
- [x] Stealth mode for seamless pitching.
- [x] Gestural timeout tracking (3-second holds).
- [x] Active anti-spam protections & Live UI validation.
- [ ] Integration with 3D Rigged Avatars (Three.js).
- [ ] Mobile App packaging (Capacitor/React Native).

**Developed with ❤️ for accessibility and inclusive communication.**
