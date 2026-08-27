"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export default function MobileNativeManager() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let active = true;
    let backListenerHandle: any = null;

    const initNative = async () => {
      try {
        const { App } = await import("@capacitor/app");
        const { SplashScreen } = await import("@capacitor/splash-screen");
        const { StatusBar, Style } = await import("@capacitor/status-bar");

        if (!active) return;

        // 1. Configure Status Bar to match dark theme
        try {
          await StatusBar.setBackgroundColor({ color: "#060B18" });
          await StatusBar.setStyle({ style: Style.Dark });
        } catch (barErr) {
          console.warn("StatusBar plugin error:", barErr);
        }

        // 2. Hide Native Splash Screen programmatically once app loads
        try {
          await SplashScreen.hide();
        } catch (splashErr) {
          console.warn("SplashScreen hide error:", splashErr);
        }

        // 3. Register Android back button listener
        try {
          // Clean up old listener if active
          if (backListenerHandle) {
            backListenerHandle.remove();
          }

          backListenerHandle = await App.addListener("backButton", (data) => {
            // If on main entry screens, exit app
            if (
              pathname === "/dashboard" ||
              pathname === "/login" ||
              pathname === "/signup" ||
              pathname === "/" ||
              !data.canGoBack
            ) {
              App.exitApp();
            } else {
              router.back();
            }
          });
        } catch (appErr) {
          console.warn("App listener error:", appErr);
        }
      } catch (err) {
        console.error("Failed to load Capacitor plugins dynamically:", err);
      }
    };

    initNative();

    return () => {
      active = false;
      if (backListenerHandle) {
        backListenerHandle.remove();
      }
    };
  }, [pathname, router]);

  return null;
}
