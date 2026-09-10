import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTenant } from './TenantContext';
import { useToast } from './ToastContext';
import {
  sendBrowserNotification,
  requestBrowserNotificationPermission,
  ToastAction,
} from '../components/ui/Toast';

export type NotificationCategory = 'leads' | 'submissions' | 'tuition' | 'classroom' | 'system';
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AppNotificationItem {
  id: string;
  category: NotificationCategory;
  type: NotificationSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: string;
  actionUrl?: string;
}

interface AddNotificationOptions {
  category: NotificationCategory;
  type?: NotificationSeverity;
  title: string;
  message: string;
  linkTab?: string;
  showToast?: boolean;
  action?: ToastAction;
}

interface NotificationContextType {
  notifications: AppNotificationItem[];
  unreadCount: number;
  addNotification: (options: AddNotificationOptions) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  enablePushNotifications: () => Promise<boolean>;
  pushEnabled: boolean;
  triggerEventNotification: (
    event: 'lead_submitted' | 'recitation_submitted' | 'feedback_graded' | 'payment_received' | 'live_class_start' | 'settings_saved' | 'plan_upgraded',
    data?: any
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS: AppNotificationItem[] = [
  {
    id: 'notif-default-1',
    category: 'leads',
    type: 'success',
    title: 'New Student Application',
    message: 'Fatima Zahra submitted an admission application for the Summer Tajweed Track.',
    timestamp: '5 mins ago',
    read: false,
    linkTab: 'crm',
  },
  {
    id: 'notif-default-2',
    category: 'submissions',
    type: 'info',
    title: 'Audio Recitation Awaiting Review',
    message: 'Yusuf Mansoor uploaded Surah Al-Mulk (Ayahs 1-10) for audio grading.',
    timestamp: '25 mins ago',
    read: false,
    linkTab: 'curriculum',
  },
  {
    id: 'notif-default-3',
    category: 'tuition',
    type: 'success',
    title: 'Tuition Payment Received',
    message: '$65.00 payment received from Bilal Khan via Stripe for Tajweed Track.',
    timestamp: '2 hours ago',
    read: false,
    linkTab: 'pricing',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useTenant();
  const { addToast } = useToast();
  const tenantKey = tenant?.subdomain || 'global';
  const storageKey = `ankabit_notifications_${tenantKey}`;

  const [notifications, setNotifications] = useState<AppNotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [pushEnabled, setPushEnabled] = useState(false);

  // Sync to localStorage whenever notifications change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(notifications));
      } catch (e) {}
    }
  }, [notifications, storageKey]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = ({
    category,
    type = 'info',
    title,
    message,
    linkTab,
    showToast = true,
    action,
  }: AddNotificationOptions) => {
    const newNotif: AppNotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      linkTab,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Show interactive popup toast
    if (showToast) {
      addToast({
        type,
        title,
        message,
        action,
      });
    }

    // Trigger browser push notification if enabled
    if (pushEnabled) {
      sendBrowserNotification(title, message);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const enablePushNotifications = async () => {
    const granted = await requestBrowserNotificationPermission();
    setPushEnabled(granted);
    if (granted) {
      sendBrowserNotification('Notifications Active 🔔', 'You will receive real-time updates for submissions, admissions, and halaqahs.');
    }
    return granted;
  };

  const triggerEventNotification = (
    event: 'lead_submitted' | 'recitation_submitted' | 'feedback_graded' | 'payment_received' | 'live_class_start' | 'settings_saved' | 'plan_upgraded',
    data?: any
  ) => {
    switch (event) {
      case 'lead_submitted':
        addNotification({
          category: 'leads',
          type: 'success',
          title: 'New Student Admission Applied 🎉',
          message: `${data?.name || 'A new student'} submitted an application for "${data?.courseTitle || 'Quran Studies'}".`,
          linkTab: 'crm',
          showToast: true,
          action: data?.onView ? { label: 'View Application', onClick: data.onView } : undefined,
        });
        break;

      case 'recitation_submitted':
        addNotification({
          category: 'submissions',
          type: 'info',
          title: 'New Audio Recitation Submitted 🎙️',
          message: `${data?.studentName || 'Student'} recorded a new recitation for Surah ${data?.surahName || 'Maryam'} (Ayahs ${data?.ayahStart || 1}-${data?.ayahEnd || 10}).`,
          linkTab: 'curriculum',
          showToast: true,
          action: data?.onReview ? { label: 'Grade Recitation', onClick: data.onReview } : undefined,
        });
        break;

      case 'feedback_graded':
        addNotification({
          category: 'submissions',
          type: 'success',
          title: 'Recitation Reviewed & Graded ⭐',
          message: `Ustadh ${data?.teacherName || 'Sheikh'} graded recitation with score ${data?.score || 95}/100: "${data?.comments || 'Excellent Tajweed and Makharij!'}".`,
          linkTab: 'curriculum',
          showToast: true,
          action: data?.onViewFeedback ? { label: 'Listen to Ustadh Feedback', onClick: data.onViewFeedback } : undefined,
        });
        break;

      case 'payment_received':
        addNotification({
          category: 'tuition',
          type: 'success',
          title: 'Tuition Payment Confirmed 💳',
          message: `Received ${data?.amount || '$65.00'} tuition fee from ${data?.payerName || 'Parent'} via ${data?.gateway || 'Stripe'}.`,
          linkTab: 'pricing',
          showToast: true,
          action: data?.onViewInvoice ? { label: 'View Receipt', onClick: data.onViewInvoice } : undefined,
        });
        break;

      case 'live_class_start':
        addNotification({
          category: 'classroom',
          type: 'info',
          title: 'Live Halaqah Session Starting 🔔',
          message: `Your live class "${data?.courseTitle || 'Advanced Tajweed'}" is starting now with ${data?.teacherName || 'Ustadh'}.`,
          linkTab: 'classroom',
          showToast: true,
          action: data?.onJoin ? { label: 'Join Classroom', onClick: data.onJoin } : undefined,
        });
        break;

      case 'settings_saved':
        addNotification({
          category: 'system',
          type: 'success',
          title: 'Academy Settings Saved ⚙️',
          message: 'Your logo, branding colors, domain preferences, and preloader have been published.',
          linkTab: 'settings',
          showToast: true,
        });
        break;

      case 'plan_upgraded':
        addNotification({
          category: 'system',
          type: 'success',
          title: 'Subscription Tier Upgraded 🚀',
          message: `Your academy has been upgraded to ${data?.planName || 'Growth'} plan with capacity for ${data?.capacity || '350'} active students.`,
          showToast: true,
        });
        break;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        enablePushNotifications,
        pushEnabled,
        triggerEventNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
