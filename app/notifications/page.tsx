"use client"
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data) => { if (mounted) setItems(data || []) })
      .catch((e) => console.warn(e));
    return () => { mounted = false }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {items.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id} className="p-3 border rounded">
              <div className="text-sm text-gray-700">{n.message}</div>
              <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
