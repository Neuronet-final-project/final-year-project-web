"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b", // dark zinc
            color: "#fff",
            borderRadius: "12px",
            border: "1px solid #3f3f46",
          },
          duration: 4000,
        }}
      />
    </>
  );
}
