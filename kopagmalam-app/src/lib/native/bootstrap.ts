import { Capacitor } from "@capacitor/core"
import { SplashScreen } from "@capacitor/splash-screen"
import { StatusBar, Style } from "@capacitor/status-bar"

export async function bootstrapNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return
  }

  try {
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: "#FFF8F5" })
  } catch {
    // Status bar tidak tersedia di semua perangkat.
  }

  try {
    await SplashScreen.hide()
  } catch {
    // Splash screen sudah tersembunyi.
  }
}
