"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { motion, useAnimation } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
}

export default function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const PULL_THRESHOLD = 80; // Distance in pixels to trigger refresh
  const MAX_PULL = 120; // Maximum drag distance

  const handleTouchStart = (e: React.TouchEvent) => {
    if (refreshing) return;
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (refreshing || startY === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0) {
      // Apply quadratic resistance
      const pull = Math.min(MAX_PULL, Math.pow(diff, 0.85));
      setPullDistance(pull);

      // Prevent default browser rubber-banding/scroll behavior
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (refreshing || pullDistance === 0) return;

    if (pullDistance >= PULL_THRESHOLD) {
      setRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      try {
        await onRefresh();
      } catch (err) {
        console.error("Refresh failed:", err);
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    setStartY(0);
  };

  useEffect(() => {
    controls.start({
      y: pullDistance,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    });
  }, [pullDistance, controls]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex-1 flex flex-col overflow-y-auto no-scrollbar"
      style={{ height: "100%" }}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center items-center pointer-events-none z-40 transition-all duration-200"
        style={{
          top: 0,
          height: `${PULL_THRESHOLD}px`,
          transform: `translateY(${pullDistance - PULL_THRESHOLD}px)`,
          opacity: pullDistance > 10 ? Math.min(1, pullDistance / PULL_THRESHOLD) : 0,
        }}
      >
        <div className="bg-slate-900/90 border border-white/[0.08] backdrop-blur-md p-2.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-center">
          {refreshing ? (
            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
          ) : (
            <motion.div
              style={{ rotate: (pullDistance / PULL_THRESHOLD) * 360 }}
              className="text-teal-400 flex items-center justify-center"
            >
              <Loader2 className="w-5 h-5" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Main page content wrapper */}
      <motion.div animate={controls} className="flex-1 flex flex-col">
        {children}
      </motion.div>
    </div>
  );
}
