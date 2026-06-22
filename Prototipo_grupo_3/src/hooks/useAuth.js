import { mockUser } from '../data/mockUser.js';
import { useLocalStorage } from './useLocalStorage.js';

const AUTH_KEY = 'contfia.auth.v1';

const initialAuth = {
  users: [mockUser],
  session: false,
  currentUserId: mockUser.id,
  profile: {
    name: mockUser.name,
    email: mockUser.email,
    businessName: mockUser.businessName,
    countryCode: mockUser.countryCode,
    whatsappNumber: mockUser.whatsappNumber,
    whatsappConnected: mockUser.whatsappConnected,
  },
};

export function useAuth() {
  const [auth, setAuth] = useLocalStorage(AUTH_KEY, initialAuth);

  function login(email, password) {
    const user = auth.users.find((item) => item.email === email && item.password === password);
    if (!user) return { ok: false, message: 'Correo o contraseña incorrectos.' };

    setAuth({
      ...auth,
      session: true,
      currentUserId: user.id,
      profile: {
        ...auth.profile,
        name: user.name,
        email: user.email,
        businessName: user.businessName,
      },
    });
    return { ok: true };
  }

  function register({ name, email, password }) {
    if (auth.users.some((user) => user.email === email)) {
      return { ok: false, message: 'Ya existe una cuenta con ese correo.' };
    }

    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      businessName: 'Mi negocio',
      countryCode: '+504',
      whatsappNumber: '',
      whatsappConnected: false,
    };

    setAuth({
      ...auth,
      users: [...auth.users, user],
      session: true,
      currentUserId: user.id,
      profile: {
        name,
        email,
        businessName: 'Mi negocio',
        countryCode: '+504',
        whatsappNumber: '',
        whatsappConnected: false,
      },
    });
    return { ok: true };
  }

  function updateProfile(profile) {
    setAuth({
      ...auth,
      profile,
      users: auth.users.map((user) =>
        user.id === auth.currentUserId
          ? {
              ...user,
              name: profile.name,
              email: profile.email,
              businessName: profile.businessName,
              countryCode: profile.countryCode,
              whatsappNumber: profile.whatsappNumber,
              whatsappConnected: profile.whatsappConnected,
            }
          : user,
      ),
    });
  }

  function updatePassword(password) {
    setAuth({
      ...auth,
      users: auth.users.map((user) =>
        user.id === auth.currentUserId ? { ...user, password } : user,
      ),
    });
  }

  function linkWhatsApp({ countryCode, whatsappNumber }) {
    setAuth({
      ...auth,
      profile: {
        ...auth.profile,
        countryCode,
        whatsappNumber,
        whatsappConnected: false,
      },
    });
  }

  function verifyWhatsApp() {
    setAuth({
      ...auth,
      profile: {
        ...auth.profile,
        whatsappConnected: true,
      },
    });
  }

  function logout() {
    setAuth({ ...auth, session: false });
  }

  return {
    auth,
    profile: auth.profile,
    login,
    register,
    updateProfile,
    updatePassword,
    linkWhatsApp,
    verifyWhatsApp,
    logout,
  };
}
