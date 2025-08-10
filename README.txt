LoopLab2025 Mobile App
Overview
LoopLab2025 is a comprehensive mobile learning and event management application designed for educational institutions. It offers a seamless experience for students, teachers, and administrators to manage courses, events, communication, and analytics—all from a single platform.
The app’s frontend is built with React Native using JSX for cross-platform mobile compatibility. The backend is powered by Strapi, a flexible headless CMS, and data persistence is handled using SQLite for offline capabilities. Together, these technologies enable a smooth, scalable, and secure learning environment.

Tech Stack
LayerTechnologyPurposeFrontendReact Native (with JSX)Cross-platform mobile UI developmentBackendStrapi (Node.js, REST API)Headless CMS and REST API serverDatabaseSQLiteLocal data storage on mobile devicesState MgmtReact hooks (useState, useEffect)Manage UI state and lifecycleNetworkingFetch APIREST API calls to backendImage UploadExpo Image PickerSelecting and uploading profile imagesUI StylingReact Native Stylesheets, LinearGradient, AnimatedStyling and animationsAuthenticationStrapi local authUser registration and loginNotificationsPush Notifications (planned)Event reminders and announcements
Installation & Setup
Backend (Strapi)
1. Clone the backend repository (or create a new Strapi project).
2. Configure your database (default: SQLite for development).
3. Define content types: Users, Courses, Events, Announcements, User Profiles.
4. Set up authentication via Strapi’s local strategy.
5. Configure API permissions for public and authenticated roles.
6. Run the backend server:
7. npm run develop
8. Note the backend URL (e.g., http://192.168.x.x:1337) for frontend API calls.
Frontend (React Native)
1. Clone the frontend repository.
2. Install dependencies:
3. npm install
4. Replace the backend URL constant in your app with your Strapi server IP address.
5. Run the app on your emulator or device:
6. npm start
7. Use Expo Go or React Native CLI to test the app on Android/iOS.


