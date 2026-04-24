"use client";

import React, { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

type Alert = {
  _id: string;
  risk_level: string;
  created_at: string;
  adolescent_name?: string;
  adolescent_email?: string;
};

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lastCheckedDate = useRef<string>(new Date().toISOString());
  const lastCallIdRef = useRef<string | null>(null);

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const res = await fetch("/api/proxy/backend/alerts/counselor/me", { cache: "no-store" });
        if (res.ok) {
          const alerts: Alert[] = await res.json();
          const newAlerts = alerts.filter(a => new Date(a.created_at) > new Date(lastCheckedDate.current));
          
          if (newAlerts.length > 0) {
            newAlerts.forEach(alert => {
              const name = alert.adolescent_name || alert.adolescent_email?.split('@')[0] || "an adolescent";
              
              toast(`New ${alert.risk_level} Risk Alert for ${name}`, {
                duration: 8000,
                position: "top-right",
                icon: alert.risk_level === "HIGH" ? "🚨" : "⚠️",
                style: {
                  borderRadius: '16px',
                  background: alert.risk_level === "HIGH" ? '#fff1f2' : '#fffbeb',
                  color: alert.risk_level === "HIGH" ? '#be123c' : '#b45309',
                  border: alert.risk_level === "HIGH" ? '1px solid #ffe4e6' : '1px solid #fef3c7',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
              });
            });
            
            const maxDate = new Date(Math.max(...newAlerts.map(a => new Date(a.created_at).getTime())));
            lastCheckedDate.current = maxDate.toISOString();
          }
        }
      } catch (err) {
        // Silent catch for background polling
      }
    };

    const checkCalls = async () => {
      try {
        const r = await fetch("/api/proxy/backend/messaging/calls/incoming", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          if (data.call && data.call.call_id !== lastCallIdRef.current) {
            // New incoming call detected globally
            lastCallIdRef.current = data.call.call_id;
            
            // If the user isn't already on the chat page, redirect them automatically
            if (!pathname?.includes('/chat')) {
               toast.loading('Incoming call detected. Redirecting to Secure Chat...', { duration: 3000 });
               router.push('/counselor/chat');
            }
          } else if (!data.call && lastCallIdRef.current) {
            // Caller hung up or was handled
            lastCallIdRef.current = null;
          }
        }
      } catch (err) {
        // Silent
      }
    };

    const interval = setInterval(checkAlerts, 10000); // 10 seconds for real-time alerts
    const callInterval = setInterval(checkCalls, 4000); // 4 seconds for fast call ring response

    return () => {
      clearInterval(interval);
      clearInterval(callInterval);
    };
  }, [pathname, router]);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
