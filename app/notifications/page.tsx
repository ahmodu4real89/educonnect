"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data) => {
        // unwrap { data, error } shaped responses from server helpers
        let items = data?.data ?? data ?? [];
        // If API returned an object (error or single item), normalize to array
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
        if (mounted) setItems(items as any[]);
      })
      .catch((e) => console.warn(e));
    return () => { mounted = false }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">← Back</button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
      </div>
      {items.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id} className="p-3 border rounded">
              <div className="text-sm text-gray-700">
                {n.assignment?.title ? (
                  <div>
                    <div className="font-medium">{n.assignment.title}</div>
                    <div className="text-sm text-gray-700">{n.message}</div>
                  </div>
                ) : (
                  n.message
                )}
              </div>
              <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
