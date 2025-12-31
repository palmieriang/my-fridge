// Jest setup file
// Add any global test setup here

// Mock expo module to prevent runtime issues
jest.mock("expo", () => ({}));

// Silence console warnings during tests (optional)
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Mock expo-localization
jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en" }],
}));

// Mock @react-native-firebase modules
jest.mock("@react-native-firebase/app", () => ({
  __esModule: true,
  default: () => ({
    apps: [],
  }),
}));

jest.mock("@react-native-firebase/auth", () => ({
  __esModule: true,
  default: () => ({
    currentUser: null,
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock("@react-native-firebase/firestore", () => ({
  __esModule: true,
  default: () => ({
    collection: jest.fn(),
  }),
}));

jest.mock("@react-native-firebase/storage", () => ({
  __esModule: true,
  default: () => ({
    ref: jest.fn(),
  }),
}));

jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(() => Promise.resolve("mock-token")),
    requestPermission: jest.fn(() => Promise.resolve(1)),
    onMessage: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
  }),
}));

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({ idToken: "mock-id-token" })),
    signOut: jest.fn(() => Promise.resolve()),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
    IN_PROGRESS: "IN_PROGRESS",
    PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
  },
}));

jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    }),
  ),
}));
