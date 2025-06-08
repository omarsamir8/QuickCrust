'use client';

import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }) {
  useEffect(() => {
    // نستدعي bootstrap JS فقط على المتصفح
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
