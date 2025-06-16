import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from './axios'

interface User{
    id: string,
    email: string,
    name: string,
}

interface AuthStore{
    user: User,
    accessToken: string,
    isAuthenticated: boolean,
    setUser: (user: User) => void,
    setAccessToken: (token: string) => void,
    logout: () => void,
    checkAuth: () => Promise<boolean>,
    initializeAuth: () => void,
}

const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: {
        id: '',
        email: '',
        name: '',
      },
      accessToken: '',
      isAuthenticated: false,
      
      setUser: (user: User) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      setAccessToken: (token: string) => {
        localStorage.setItem("access", token);
        set({ accessToken: token });
      },
      
      logout: () => {
        set({ 
          user: { id: '', email: '', name: '' },
          accessToken: '',
          isAuthenticated: false 
        });
        localStorage.removeItem("access");
      },
      
      checkAuth: async () => {
        const storedToken = localStorage.getItem("access");
        if (!storedToken) {
          get().logout();
          return false;
        }

        try {
          const response = await api.get("/auth/verify");
          if (response.data?.authenticated) {
            set({ 
              isAuthenticated: true,
              accessToken: storedToken 
            });
            return true;
          }

          get().logout();
          return false;
        } catch (error) {
          get().logout();
          return false;
        }
      },
      
      initializeAuth: async () => {
        const storedToken = localStorage.getItem("access");

        if (storedToken) {
          try {
            const response = await api.get("/auth/verify");
            if (response.data?.authenticated) {
              set({ 
                isAuthenticated: true,
                accessToken: storedToken 
              });
              return true;
            } else {
              localStorage.removeItem("access");
              get().logout();
            }
          } catch (error) {
            localStorage.removeItem("access");
            get().logout();
          }
        } else {
          set({ 
            user: { id: '', email: '', name: '' },
            accessToken: '',
            isAuthenticated: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default authStore;