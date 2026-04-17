"use client";

import React, { useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

type Alert = {
  _id: string;
  risk_level: string;
  created_at: string;
  adolescent_name?: string;
  adolescent_email?: string;
};

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const lastCheckedDate = useRef<string>(new Date().toISOString());

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

    const interval = setInterval(checkAlerts, 10000); // 10 seconds for real-time feel
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
