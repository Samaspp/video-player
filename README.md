
```markdown
# React Native Video Player

This is a secure, customizable video player application built with React Native and Expo. It provides advanced content protection and playback controls suitable for educational and enterprise use cases.

## Features

### Core Functionality
- Play local or uploaded video files
- Fullscreen playback with automatic orientation handling
- Light and dark theme support with toggle

### Security
- Optional screenshot and screen recording prevention
- Dynamic watermark containing username and timestamp
- Screenshot attempt logging with display

### Playback Controls
- Play, pause, seek
- Rewind and fast-forward (10-second increments)
- Mute and unmute
- Playback speed control (from 0.25x to 2x, capped at 2x)
- Maximum fast-forward capped at 2x in secure mode

### Configuration
- Secure Mode toggle: Enforces watermark, screenshot blocking, and playback restrictions
- Advanced Settings: Optional granular control over watermark and screenshot blocking

## Project Structure

```

.
├── App.tsx                      # Entry point with navigation
├── components/
│   └── Watermark.tsx           # Renders dynamic watermark on video
├── context/
│   └── AppContext.tsx          # Global state for theme and secure mode
├── screens/
│   ├── SettingsScreen.tsx      # Home/configuration screen
│   ├── UploadScreen.tsx        # Optional screen for uploads (if implemented)
│   └── PlayerScreen.tsx        # Main video player with security logic
├── assets/
│   └── Video/                  # Sample or uploaded video files
└── README.md

````

## Getting Started

### Prerequisites
- Node.js
- Expo CLI
- Android/iOS device or emulator

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Samaspp/video-player.git
cd video-player
````

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npx expo start
```

4. Launch on device using the Expo Go app or an emulator.

## Technologies Used

* React Native
* Expo
* TypeScript (optional)
* React Navigation
* Expo AV (`expo-av`) for video
* Expo Screen Capture (`expo-screen-capture`) for screenshot prevention
* Custom hooks and context for global state management

## Known Limitations

* Expo's `preventScreenCaptureAsync` does not detect screenshot attempts. Logging is approximated and may not be 100% reliable.
* Fullscreen watermark visibility is constrained due to native player limitations in `expo-av`.

## License

This project is licensed under the MIT License.

## Author

Developed by \ Samassya P Pramod

```

---
