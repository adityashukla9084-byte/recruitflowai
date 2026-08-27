"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Logo from "./Logo";

export default function NativeLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide initial hydration loader shortly after mounting
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    window.addEventListener("show-native-loader", showLoader);
    window.addEventListener("hide-native-loader", hideLoader);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("show-native-loader", showLoader);
      window.removeEventListener("hide-native-loader", hideLoader);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#060b18] z-[9999] flex flex-col items-center justify-center select-none"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Pulsing logo */}
            <motion.div
              animate={{ scale: [0.96, 1.04, 0.96] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="mb-2"
            >
              <Logo size={40} fontWeight="font-black" />
            </motion.div>

            {/* Premium Loader indicator */}
            <div className="flex items-center gap-2.5 mt-2">
              <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold">
                RecruitFlow AI
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
