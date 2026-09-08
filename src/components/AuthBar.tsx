import React from 'react';
import { User, LogOut, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { googleSignIn, logout } from '../lib/auth';
import { AccessTokenState } from '../types';

interface AuthBarProps {
  authState: AccessTokenState;
  onAuthStateChange: (state: AccessTokenState) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  onRequestLoginModal?: () => void;
}

export const AuthBar: React.FC<AuthBarProps> = ({
  authState,
  onAuthStateChange,
  isLoading,
  setIsLoading
}) => {
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await googleSignIn();
      if (res) {
        onAuthStateChange({
          userEmail: res.user.email,
          userName: res.user.displayName,
          userPhoto: res.user.photoURL,
          accessToken: res.accessToken,
          isAuthenticated: true
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      onAuthStateChange({
        userEmail: null,
        userName: null,
        userPhoto: null,
        accessToken: null,
        isAuthenticated: false
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-bar-container" className="flex items-center gap-3">
      {authState.isAuthenticated && authState.userEmail ? (
        <div id="user-profile-badge" className="flex items-center gap-3 bg-slate-100 border border-slate-200/80 rounded-full py-1.5 px-3">
          {authState.userPhoto ? (
            <img
              src={authState.userPhoto}
              alt={authState.userName || 'Usuario'}
              className="w-7 h-7 rounded-full object-cover border border-slate-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
              <User className="w-4 h-4" />
            </div>
          )}
          <div className="text-left hidden sm:block leading-tight">
            <p className="text-xs font-semibold text-slate-800 line-clamp-1">
              {authState.userName || 'Usuario Activo'}
            </p>
            <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-emerald-600 inline" />
              {authState.userEmail}
            </p>
          </div>
          <button
            id="btn-user-logout"
            onClick={handleLogout}
            disabled={isLoading}
            title="Cerrar sesión"
            className="text-slate-400 hover:text-rose-600 p-1 rounded-full hover:bg-slate-200/60 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          id="btn-google-sign-in"
          onClick={handleSignIn}
          disabled={isLoading}
          className="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-xs active:scale-[0.99]"
        >
          <svg
            className="w-4 h-4 shrink-0"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span className="whitespace-nowrap">
            {isLoading ? 'Conectando...' : 'Acceder con Google'}
          </span>
        </button>
      )}
    </div>
  );
};
