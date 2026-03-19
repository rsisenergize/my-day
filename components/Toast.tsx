'use client';

import { useState, useEffect } from 'react';

export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-[#1a2140] border border-[rgba(232,201,122,0.3)] shadow-lg ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      <p className="text-sm text-[#e8c97a] font-medium whitespace-nowrap">{message}</p>
    </div>
  );
}
