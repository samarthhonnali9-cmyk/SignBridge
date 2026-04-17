# 🌉 SignBridge: AI-Powered ASL Accessibility Bridge

**SignBridge** is a premium, real-time accessibility application designed to bridge the communication gap between the Deaf/Hard-of-Hearing community and the hearing world. Using state-of-the-art **MediaPipe AI Landmarks** and custom **3D Heuristic Algorithms**, SignBridge translates American Sign Language (ASL) gestures into text, speech, and vice versa.

---

## 🚀 Key Features

### 1. Live AI Recognition (Camera Mode)
* **Dual Recognition Modes**:
    * **Grammar Mode**: Detects full words (My, Name, Need, Water, Help, etc.) based on hand shape and position.
    * **Alphabet Mode (Fingerspelling)**: A custom-built 3D spatial algorithm using Binary Finger Encoding (BFE) to detect individual ASL letters (A-Z).
* **Stealth Controls**: Use the **Enter** key to silently toggle between Grammar and Alphabet modes during live presentations.

### 2. Sentence Builder
* **Sequential Accumulation**: Automatically builds sentences from detected gestures.
* **Auto-Formatting**: Capitalizes the first word and adds user-selected punctuation.
* **Smart Voice**: Integrates high-fidelity Speech Synthesis to "speak" the built sentence aloud.
* **Playback Animation**: Replay your entire built sentence as a contiguous ASL animation sequence.

### 3. Text to Sign Translation
* **Avatar Simulation**: Type any sentence to see it translated into a sequence of ASL hand signs.
* **Dynamic Fingerspelling**: If a word is unknown, the system automatically breaks it down and fingerspells it using the correct hand shapes.

---

## 🖐️ ASL Gesture Guide (Hackathon Demo)

### ☝️ Grammar Words (Center/Right Screen)
| Word | Gesture | Position |
| :--- | :--- | :--- |
| **I / Me** | Pointing Up (☝️) | Near Chest (Low) |
| **You** | Pointing Up (☝️) | Forward (Middle) |
| **My / Mine** | Open Palm (✋) | Near Chest (Low) |
| **Name** | Victory (✌️) | Near Chest (Low) |
| **Yes / No** | Thumbs Up / Down | Any |
| **Fever** | Pointing Up (☝️) | Forehead (High) |

### 🅰️ Fingerspelling (Alphabet Mode)
*Press **Enter** to enable Alphabet Mode*
* **S**: Closed Fist with thumb wrapped across front.
* **A**: Closed Fist with thumb pointing up along the side.
* **M**: Closed Fist with thumb tucked underneath.
* **R**: Index and Middle fingers extended/crossed.

### 👐 Two-Handed Combos
* **Need**: Double Thumbs Up (👍👍)
* **Thank You**: Double Open Palms (✋✋)
* **Help**: Double Closed Fists (✊✊)
* **Pain**: Double Thumbs Down (👎👎)

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
- [ ] Integration with 3D Rigged Avatars (Three.js).
- [ ] Mobile App packaging (Capacitor/React Native).

**Developed with ❤️ for accessibility and inclusive communication.**
