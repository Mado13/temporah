// capacitor.config.ts
import type { CapacitorConfig } from "@capacitor/cli";

const isDev =
  process.env.CAPACITOR_DEV === "true" ||
  process.env.NODE_ENV === "development";

const config: CapacitorConfig = {
  appId: "com.example.tempi",
  appName: "Tempi",
  webDir: "../priv/static",

  ...(isDev && {
    server: {
      url: "http://localhost:4000",
      cleartext: true,
      allowNavigation: ["maps.googleapis.com", "places.googleapis.com"],
    },
  }),

  plugins: {
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
  },

  android: {
    allowMixedContent: isDev,
    captureInput: true,
  },

  ios: {
    contentInset: "automatic",
  },
};

export default config;
