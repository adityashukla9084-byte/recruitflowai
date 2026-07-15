"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sun, Moon, Bell, Check, Sparkles, Clock, User, Settings, LogOut, Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "match" | "interview" | "system";
  unread: boolean;
}

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "High ATS Match",
      desc: "Candidate resume scored 82% against Software Engineer job details.",
      time: "2 mins ago",
      type: "match",
      unread: true,
    },
    {
      id: "2",
      title: "Mock Interview Ready",
      desc: "Simulated practice questions generated for System Design prep.",
      time: "1 hour ago",
      type: "interview",
      unread: true,
    },
    {
      id: "3",
      title: "Engine Update",
      desc: "RecruitFlow matching algorithm upgraded to semantic parser v2.1.",
      time: "1 day ago",
      type: "system",
      unread: false,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center justify-between border-b border-theme-border/40 bg-theme-bg/75 backdrop-blur-md px-6 sm:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))}
          className="md:hidden p-2 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover transition-all duration-200 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu size={16} />
        </button>
        <h1 className="text-sm font-bold text-theme-text tracking-wider uppercase opacity-85 select-none">
          Workspace
        </h1>
      </div>

      <div className="flex items-center gap-1 relative" ref={dropdownRef}>
        {/* Notifications */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsUserOpen(false);
          }}
          className={`relative p-2 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-card-hover hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-2 ${isOpen ? "bg-theme-card-hover text-theme-text" : ""}`}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={2} />
          {unreadCount > 0 && (
            <span
              className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full border border-theme-bg bg-emerald-500 animate-pulse"
            />
          )}
        </button>

        {/* Notifications Dropdown Popover */}
        {isOpen && (
          <div className="absolute right-12 top-11 w-80 bg-theme-card border border-theme-border/60 rounded-2xl shadow-xl overflow-hidden z-40 animate-fade-in backdrop-blur-md">
            {/* Header */}
            <div className="p-3.5 border-b border-theme-border/40 flex items-center justify-between bg-theme-bg-secondary/15 select-none">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-theme-text uppercase tracking-wider">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-mono">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-sky-500 hover:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Check size={11} strokeWidth={2.5} />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-theme-border/30">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-theme-text-muted text-xs">
                  No notifications
                </div>
              ) : (
                notifications.map((item) => {
                  let typeColor = "bg-sky-500";
                  let Icon = Sparkles;
                  if (item.type === "match") {
                    typeColor = "bg-emerald-500";
                    Icon = Sparkles;
                  } else if (item.type === "interview") {
                    typeColor = "bg-amber-500";
                    Icon = Clock;
                  } else {
                    typeColor = "bg-purple-500";
                    Icon = Sun;
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleNotification(item.id)}
                      className={`p-3.5 flex gap-3 hover:bg-theme-bg-secondary/20 transition-colors duration-200 cursor-pointer ${
                        item.unread ? "bg-theme-bg-secondary/8" : ""
                      }`}
                    >
                      {/* Icon Badge */}
                      <div className="relative shrink-0 pt-0.5">
                        <div className={`w-6 h-6 rounded-lg ${typeColor}/10 flex items-center justify-center border border-${item.type === "match" ? "emerald" : item.type === "interview" ? "amber" : "purple"}-500/20`}>
                          <Icon size={12} className={item.type === "match" ? "text-emerald-500" : item.type === "interview" ? "text-amber-500" : "text-purple-500"} />
                        </div>
                        {item.unread && (
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-theme-card" />
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className={`text-xs truncate ${item.unread ? "font-bold text-theme-text" : "font-medium text-theme-text-secondary"}`}>
                            {item.title}
                          </h4>
                          <span className="text-[9px] font-mono text-theme-text-muted shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-theme-text-secondary leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* User avatar button trigger */}
        <button
          onClick={() => {
            setIsUserOpen(!isUserOpen);
            setIsOpen(false);
          }}
          className="ml-2 flex items-center gap-2 pl-3 border-l border-theme-border/50 hover:opacity-85 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="User menu"
        >
          <div className="bg-gradient-to-tr from-blue-500 via-sky-500 to-cyan-400 p-[1.5px] rounded-lg shadow-sm">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-theme-bg flex items-center justify-center text-[10px] font-bold text-theme-text select-none">
              RF
            </div>
          </div>
        </button>

        {/* User Profile Dropdown Popover */}
        {isUserOpen && (
          <div className="absolute right-0 top-11 w-52 bg-theme-card border border-theme-border/60 rounded-2xl shadow-xl overflow-hidden z-40 animate-fade-in backdrop-blur-md">
            {/* Header info */}
            <div className="p-3 border-b border-theme-border/30 bg-theme-bg-secondary/15 select-none text-left">
              <p className="text-xs font-bold text-theme-text">Aditya</p>
              <p className="text-[10px] text-theme-text-muted">aditya@recruitflow.ai</p>
            </div>

            {/* Menu options */}
            <div className="p-1 divide-y divide-theme-border/20 text-left">
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsUserOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-theme-text hover:bg-theme-bg-secondary/20 hover:text-theme-accent transition-colors duration-150"
                >
                  <User size={12} strokeWidth={2} />
                  My Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsUserOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-theme-text hover:bg-theme-bg-secondary/20 hover:text-theme-accent transition-colors duration-150"
                >
                  <Settings size={12} strokeWidth={2} />
                  Settings
                </Link>
              </div>

              <div className="py-1">
                <Link
                  href="/login"
                  onClick={() => setIsUserOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-500/10 transition-colors duration-150"
                >
                  <LogOut size={12} strokeWidth={2} />
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}