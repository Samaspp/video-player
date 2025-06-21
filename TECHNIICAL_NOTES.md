## Technical Notes

### Architecture Decisions

The application is structured using a **feature-based modular architecture**, with clear separation between concerns:

* **Screens** (`screens/`): Each screen (Settings, Player) encapsulates UI and logic for a distinct flow.
* **Components** (`components/`): Reusable visual building blocks, such as the `Watermark`.
* **Context** (`context/AppContext.tsx`): Global state management using React Context API for theme and secure mode toggles.
* **App Entry (`App.tsx`)**: Handles navigation and root layout using React Navigation with a type-safe stack navigator.

**Expo** was chosen for:

* Cross-platform development efficiency.
* Access to APIs like `expo-av` for media and `expo-screen-capture` for security.

The player logic is built on top of `expo-av`, handling custom controls like mute, speed, seek, and fullscreen. Secure mode enforces restrictions by propagating toggled state from the context.

### Security Approach

1. **Screenshot & Screen Recording Blocking**:

   * Uses `expo-screen-capture` to prevent screenshots when `securityEnabled` is true.
   * Attempts to log and count screenshots, though Expo's API does not currently support direct screenshot detection (this is acknowledged as a limitation).

2. **Watermark Protection**:

   * Dynamic watermark is displayed on top of the video.
   * Includes username and rounded timestamp.
   * Randomized safe positions ensure the watermark cannot be reliably cropped or masked.

3. **Playback Restrictions**:

   * In **secure mode**:

     * Max fast-forward speed limited to 2x.
     * Rewind and fast-forward buttons limited to 10s increments.
     * Disabling secure mode restores user control but disables watermark and screenshot blocking.

4. **Orientation & Fullscreen Handling**:

   * Based on video dimensions, the screen locks to appropriate orientation (portrait or landscape).
   * Native fullscreen (`presentFullscreenPlayer`) is used to maintain platform consistency.

### Improvements With More Time

* **Watermark visibility in fullscreen mode**
  Currently, the watermark is **not visible** when the video enters fullscreen using `presentFullscreenPlayer()` from `expo-av`. This happens because fullscreen playback is **handled natively** by the system, outside the React Native view tree. Since our watermark is rendered via React Native, it cannot overlay native fullscreen playback.
  **Fixing this would require** either:

  * Migrating from `expo-av` to [`react-native-video`](https://github.com/react-native-video/react-native-video) which allows embedding fullscreen video within the React Native tree, or
  * Building a custom fullscreen view to control the layout ourselves (e.g. via a modal-based fullscreen simulation).
    
* **Screenshot detection**
  Expo’s `ScreenCapture` API can prevent screenshots, but **does not allow reliable detection** of screenshot attempts. As a result, while screenshots are blocked, the app **cannot track screenshot attempts or pause playback** as specified.
  To implement this fully:

  * We'd need to eject from Expo and use platform-specific APIs (`UIContentDidChangeNotification` on iOS, `ContentObserver` on Android) via native modules or libraries like [`react-native-screenshot-detect`](https://github.com/barthap/react-native-screenshot-detect).


* **Switch from `expo-av` to `expo-video`**:

  * `expo-av` is deprecated. Migrating would enable futureproofing, better customization, and native player improvements (like overlaying UI in fullscreen).


* Add login and authorization to ensure watermarked videos are associated with verified users only.

* **Video Upload & Backend Integration**:

  * Upload video to secure backend and stream instead of using local file access.
  * Watermark generation and secure access can be managed server-side.

* **Unit & Integration Testing**:

  * Add proper testing with Jest and React Native Testing Library.

* **Better UX**:

  * Add tooltips for toggles, improved loading states, and haptic feedback for better user experience.

* **Accessibility**:

  * Improve font scaling, screen reader support, and contrast for accessibility compliance.

---

Let me know if you'd like this exported as a `PDF` or formatted for submission.
