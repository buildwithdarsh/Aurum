'use client';

import { useEffect, type ReactNode } from 'react';
import { TZ } from '@/lib/tz';
import { useAuthStore } from '@/store/auth';
import { setAuthCookie, clearAuthCookie } from '@/lib/auth-cookie';
import { MotionProvider } from './MotionProvider';

export function Providers({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = TZ.client.getEndUserToken();
    if (token) {
      setAuthCookie(token);
      TZ.storefront.auth.me().then(setUser).catch(() => {
        clearAuthCookie();
        setUser(null);
      });
    }
  }, [setUser]);

  return <MotionProvider>{children}</MotionProvider>;
}
