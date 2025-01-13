import { useEffect, ReactNode } from 'react';
import { Outlet, redirect, useFetcher } from 'react-router';
import { isAuth } from '~/services/auth';
import Logout from './logout/logout';
import AuthProvider from '~/contexts/auth/authProvider';
import fbAuth from '~/firebase/firebaseConfig';

export async function clientLoader() {
  const isLogged = await isAuth();
  if (!isLogged) {
    throw redirect('/');
  }
}

export default function LoggedWrapper({ children }: { children: ReactNode }) {
  const fetcher = useFetcher();

  useEffect(() => {
    const unsubscribe = fbAuth.onAuthStateChanged((newuser) => {
      if (!newuser) {
        const f = new FormData();
        f.append("action", "logout");
        fetcher.submit(f, { method: 'POST'});
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-bold mb-4">Logged Wrapper</div>
        <Outlet />
        <div className="mt-4">
          <Logout />
        </div>
      </div>
      {children}
    </AuthProvider>
  );
}
