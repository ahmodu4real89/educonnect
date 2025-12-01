"use client"
import { useEffect, useState, useRef } from "react";

type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = await res.json();
        // unwrap { data, error } responses
        let items = data?.data ?? data ?? [];
        if (!Array.isArray(items)) {
          if (items && typeof items === 'object' && 'error' in items) {
            console.warn('Notifications API returned error:', items.error);
            items = [];
          } else if (items) {
            items = [items];
          } else {
            items = [];
          }
        }
        if (mounted) setNotifications(items as any[]);
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

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => setOpen(v => !v)} title="Notifications" className="p-2 rounded-full hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors">
        <svg fill="currentColor" height="20" width="20" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216Z" />
        </svg>
      </button>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {unread}
        </span>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border rounded shadow-lg z-50">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">Notifications</div>
            <div className="max-h-64 overflow-auto">
              {notifications.length === 0 ? (
                <div className="text-sm text-gray-500 p-2">No notifications</div>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div key={n.id} className={`p-2 border-b last:border-b-0 ${n.isRead ? 'opacity-80' : 'bg-slate-50 dark:bg-slate-700'}`}>
                    <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                    <div className="text-sm font-medium">{n.assignment?.title ?? n.message}</div>
                    {n.assignment?.title && <div className="text-xs text-gray-600">{n.message}</div>}
                  </div>
                ))
              )}
            </div>
            <div className="text-right mt-2">
              <a href="/notifications" className="text-sm text-blue-600 hover:underline">View all</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
