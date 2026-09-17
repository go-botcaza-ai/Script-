import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase App instance safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const ADMIN_OWNER_EMAIL = 'go.botcaza.ai@gmail.com';

/**
 * Checks if a given email has administrative/owner privileges
 */
export const isAppAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return (
    lower === ADMIN_OWNER_EMAIL.toLowerCase() ||
    lower.startsWith('admin@') ||
    lower.includes('botcaza.ai')
  );
};

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly'
];

const googleProvider = new GoogleAuthProvider();
SCOPES.forEach((scope) => googleProvider.addScope(scope));

const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

/**
 * Detects the active cloud provider (Google, Microsoft, Facebook)
 */
export const detectProviderId = (user?: User | null): 'google' | 'microsoft' | 'facebook' => {
  if (!user) return 'google';
  const pId = user.providerData[0]?.providerId || '';
  if (pId.includes('microsoft')) return 'microsoft';
  if (pId.includes('facebook')) return 'facebook';
  return 'google';
};

// In-memory token storage (Do NOT store in localStorage per guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initializes auth listener. Sets state or invokes callbacks.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string, provider: 'google' | 'microsoft' | 'facebook') => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const provider = detectProviderId(user);
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken, provider);
      } else if (!isSigningIn) {
        const dummyToken = 'session-active-token';
        cachedAccessToken = dummyToken;
        if (onAuthSuccess) onAuthSuccess(user, dummyToken, provider);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Google Sign-In with popup
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string; provider: 'google' } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || 'google-token-cached';
    return { user: result.user, accessToken: cachedAccessToken, provider: 'google' };
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Trigger Microsoft Sign-In with popup
 */
export const microsoftSignIn = async (): Promise<{ user: User; accessToken: string; provider: 'microsoft' } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, microsoftProvider);
    const credential = OAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || 'microsoft-token-cached';
    return { user: result.user, accessToken: cachedAccessToken, provider: 'microsoft' };
  } catch (error) {
    console.error('Error al iniciar sesión con Microsoft:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Trigger Facebook Business Sign-In with popup
 */
export const facebookSignIn = async (): Promise<{ user: User; accessToken: string; provider: 'facebook' } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, facebookProvider);
    const credential = FacebookAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || 'facebook-token-cached';
    return { user: result.user, accessToken: cachedAccessToken, provider: 'facebook' };
  } catch (error) {
    console.error('Error al iniciar sesión con Facebook Business:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
