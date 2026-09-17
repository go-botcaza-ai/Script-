import React from 'react';
import { User, LogOut, CheckCircle2, ShieldCheck, Mail, Crown, Briefcase, Server } from 'lucide-react';
import { googleSignIn, microsoftSignIn, facebookSignIn, logout, isAppAdmin } from '../lib/auth';
import { AccessTokenState } from '../types';

interface AuthBarProps {
  authState: AccessTokenState;
  onAuthStateChange: (state: AccessTokenState) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  onRequestLoginModal?: () => void;
  onOpenCloudConfig?: () => void;
}

export const AuthBar: React.FC<AuthBarProps> = ({
  authState,
  onAuthStateChange,
  isLoading,
  setIsLoading,
  onOpenCloudConfig
}) => {
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await googleSignIn();
      if (res) {
        onAuthStateChange({
          userEmail: res.user.email,
          userName: res.user.displayName,
          userPhoto: res.user.photoURL,
          accessToken: res.accessToken,
          isAuthenticated: true,
          authProvider: 'google'
        });
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-blocked') {
        alert('El navegador bloqueó la ventana emergente de Google. Por favor, permite ventanas emergentes (popups) en este sitio para iniciar sesión.');
      } else if (code === 'auth/unauthorized-domain') {
        alert('Dominio no autorizado en Firebase Console. Asegúrate de agregar este dominio en Firebase > Authentication > Settings > Authorized Domains.');
      } else if (code === 'auth/popup-closed-by-user') {
        // User closed popup
      } else {
        alert(err?.message || 'Error al conectar con Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await microsoftSignIn();
      if (res) {
        onAuthStateChange({
          userEmail: res.user.email,
          userName: res.user.displayName,
          userPhoto: res.user.photoURL,
          accessToken: res.accessToken,
          isAuthenticated: true,
          authProvider: 'microsoft'
        });
      }
    } catch (err: any) {
      console.error('Microsoft login error:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-blocked') {
        alert('El navegador bloqueó la ventana emergente de Microsoft. Por favor, permite popups para completar el inicio.');
      } else if (code === 'auth/unauthorized-domain') {
        alert('Dominio no autorizado en Firebase Console. Agrega tu dominio en Firebase > Authentication > Settings > Authorized Domains.');
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        alert('El proveedor Microsoft aún no está habilitado en tu consola de Firebase. Ve a Firebase Console > Authentication > Sign-in method > Microsoft y actívalo con tu Application (client) ID de Azure.');
      } else if (code === 'auth/popup-closed-by-user') {
        // User closed popup
      } else {
        alert(err?.message || 'Error al conectar con Microsoft.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true);
      const res = await facebookSignIn();
      if (res) {
        onAuthStateChange({
          userEmail: res.user.email,
          userName: res.user.displayName,
          userPhoto: res.user.photoURL,
          accessToken: res.accessToken,
          isAuthenticated: true,
          authProvider: 'facebook'
        });
      }
    } catch (err: any) {
      console.error('Facebook login error:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-blocked') {
        alert('El navegador bloqueó la ventana emergente de Facebook. Por favor, permite ventanas emergentes (popups) para completar el inicio.');
      } else if (code === 'auth/unauthorized-domain') {
        alert('Dominio no autorizado en Firebase Console. Agrega este dominio en Firebase > Authentication > Settings > Authorized Domains.');
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        alert('El proveedor Facebook aún no está activado en tu Firebase Console. Ve a Firebase Console > Authentication > Sign-in method > Facebook y agrega tu App ID y Secreto de developers.facebook.com.');
      } else if (code === 'auth/popup-closed-by-user') {
        // User closed popup
      } else {
        alert(err?.message || 'Error al conectar con Facebook Business.');
      }
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
        isAuthenticated: false,
        authProvider: null
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = isAppAdmin(authState.userEmail);

  return (
    <div id="auth-bar-container" className="flex items-center gap-2 sm:gap-2.5">
      {/* Botón de configuración de servidores multi-cloud */}
      {onOpenCloudConfig && (
        <button
          id="btn-open-cloud-servers-config"
          onClick={onOpenCloudConfig}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors cursor-pointer"
          title="Ver infraestructura de Servidores Multi-Cloud & APIs"
        >
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline text-[11px]">Servidores</span>
        </button>
      )}

      {authState.isAuthenticated && authState.userEmail ? (
        <div id="user-profile-badge" className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 text-white rounded-full py-1 px-2.5 shadow-sm">
          {authState.userPhoto ? (
            <img
              src={authState.userPhoto}
              alt={authState.userName || 'Usuario'}
              className="w-6 h-6 rounded-full object-cover border border-slate-500 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="text-left hidden sm:block leading-tight">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-slate-100 line-clamp-1">
                {authState.userName || 'Usuario Conectado'}
              </p>
              {isAdmin ? (
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 text-amber-400" /> PROPIETARIO
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-0.5">
                  <Briefcase className="w-2.5 h-2.5 text-emerald-400" /> AFILIADO
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-1 flex items-center gap-1">
              <Mail className="w-2.5 h-2.5 text-emerald-400 inline" />
              {authState.userEmail}
            </p>
          </div>
          <button
            id="btn-user-logout"
            onClick={handleLogout}
            disabled={isLoading}
            title="Cerrar sesión"
            className="text-slate-400 hover:text-rose-400 p-1 rounded-full hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botón Iniciar con Google */}
          <button
            id="btn-google-sign-in"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 px-2.5 py-1.5 rounded-lg font-medium text-xs transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            title="Iniciar sesión con suite Google (Gemini &amp; AdSense)"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="whitespace-nowrap hidden sm:inline">Google</span>
          </button>

          {/* Botón Iniciar con Microsoft */}
          <button
            id="btn-microsoft-sign-in"
            onClick={handleMicrosoftSignIn}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-[#2f2f2f] hover:bg-[#3b3b3b] text-white border border-zinc-700 px-2.5 py-1.5 rounded-lg font-medium text-xs transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            title="Iniciar sesión con suite Microsoft (Azure &amp; Bing)"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              viewBox="0 0 21 21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            <span className="whitespace-nowrap hidden sm:inline">Microsoft</span>
          </button>

          {/* Botón Iniciar con Facebook Business */}
          <button
            id="btn-facebook-sign-in"
            onClick={handleFacebookSignIn}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white border border-blue-600 px-2.5 py-1.5 rounded-lg font-medium text-xs transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            title="Iniciar sesión con Facebook Business (Meta Suite)"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="whitespace-nowrap hidden sm:inline">Facebook</span>
          </button>
        </div>
      )}
    </div>
  );
};

