// import type { CapacitorConfig } from "@capacitor/cli"

// const config: CapacitorConfig = {
//   appId: "id.kopagmalam.pos",
//   appName: "Kopag Malam POS",
//   webDir: "dist",
//   server: {
//     androidScheme: "https",
//     // Untuk development di device fisik, buka cleartext sementara:
//     // cleartext: true,
//   },
//   android: {
//     allowMixedContent: false,
//   },
//   plugins: {
//     SplashScreen: {
//       launchAutoHide: false,
//       backgroundColor: "#FFF8F5",
//       showSpinner: false,
//     },
//     StatusBar: {
//       style: "DARK",
//       backgroundColor: "#FFF8F5",
//     },
//     Keyboard: {
//       resize: "body",
//     },
//   },
// }

// export default config

import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "id.kopagmalam.pos",
  appName: "Kopag Malam POS",
  webDir: "dist",
  server: {
    androidScheme: "http",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FFF8F5",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#FFF8F5",
    },
    Keyboard: {
      resize: "body",
    },
  },
}

export default config