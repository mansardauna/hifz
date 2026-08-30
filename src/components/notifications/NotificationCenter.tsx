import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  CheckCheck,
  Sparkles,
  ExternalLink,
  Volume2,
  Users,
  CreditCard,
  BookOpen
} from 'lucide-react';
import { requestBrowserNotificationPermission, sendBrowserNotification } from '../ui/Toast';

export interface AppNotification {
  id: string;
  category: 'system' | 'submissions' | 'leads' | 'tuition';
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'leads',
    type: 'success',
    title: 'New Student Application',
    message: 'Fatima Zahra submitted an admission form for the Summer Memorization Track.',
    timestamp: '5 mins ago',
    read: false,
    linkTab: 'crm',
  },
  {
    id: 'notif-2',
    category: 'submissions',
    type: 'info',
    title: 'Audio Recitation Awaiting Review',
    message: 'Yusuf Mansoor recorded Surah Al-Mulk (Ayahs 1-10) for Tajweed grading.',
    timestamp: '25 mins ago',
    read: false,
    linkTab: 'curriculum',
  },
  {
    id: 'notif-3',
    category: 'tuition',
    type: 'success',
    title: 'Tuition Payment Received',
    message: '$65.00 payment received from Bilal Khan via Stripe for Tajweed Track.',
    timestamp: '2 hours ago',
    read: false,
    linkTab: 'pricing',
  },
  {
    id: 'notif-4',
    category: 'system',
    type: 'warning',
    title: 'Custom Domain SSL Renewal',
    message: 'Wildcard SSL certificate for academy.com is actively secured and validated.',
    timestamp: '1 day ago',
    read: true,
    linkTab: 'settings',
  },
];

interface NotificationCenterProps {
  onNavigateTab?: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigateTab }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'submissions' | 'leads'>('all');
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleEnablePush = async () => {
    const granted = await requestBrowserNotificationPermission();
    setPushEnabled(granted);
    if (granted) {
      sendBrowserNotification('Notifications Active', 'You will receive real-time updates for submissions and admissions.');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'submissions') return n.category === 'submissions';
    if (filter === 'leads') return n.category === 'leads';
    return true;
  });

  const getCategoryIcon = (category: AppNotification['category']) => {
    switch (category) {
      case 'submissions':
        return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
      case 'leads':
        return <Users className="w-3.5 h-3.5 text-emerald-500" />;
      case 'tuition':
        return <CreditCard className="w-3.5 h-3.5 text-amber-500" />;
      case 'system':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-900 text-white">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="p-1 text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-200/60 rounded px-2 py-0.5 transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-1 text-slate-400 hover:text-rose-600 text-[11px] rounded hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                filter === 'unread' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('submissions')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                filter === 'submissions' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setFilter('leads')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                filter === 'leads' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Admissions
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                <p className="text-xs font-semibold">No notifications in this view</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    handleMarkAsRead(n.id);
                    if (n.linkTab && onNavigateTab) {
                      onNavigateTab(n.linkTab);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !n.read ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs truncate ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Push Notification Footer Banner */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium">Browser Push Alerts</span>
            <button
              onClick={handleEnablePush}
              className="text-[11px] font-bold text-slate-900 hover:underline cursor-pointer"
            >
              {pushEnabled ? 'Enabled ✓' : 'Enable Push Alerts'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
