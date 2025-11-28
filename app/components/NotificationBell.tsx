"use client"
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setNotifications(data || []);
      } catch (e) {
        console.warn('Failed to fetch notifications', e);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();

    const iv = setInterval(fetchNotifications, 30_000); // poll every 30s
    return () => { mounted = false; clearInterval(iv); }
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <a href="/notifications" title="Notifications" className="p-2 rounded-full hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors">
        <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216Z" />
        </svg>
      </a>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {unread}
        </span>
      )}
    </div>
  )
}
