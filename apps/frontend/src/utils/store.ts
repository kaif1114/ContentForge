import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User{
    id: string,
    email: string,
    name: string,
}

interface AuthStore{
    accessToken: string,
    user: User,
    isAuthenticated: boolean,
    setAccessToken: (accessToken: string) => void,
    setUser: (user: User) => void,
    logout: () => void,
    checkAuth: () => boolean,
    initializeAuth: () => void,
}

const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: '',
      user: {
        id: '',
        email: '',
        name: '',
      },
      isAuthenticated: false,
      
      setAccessToken: (accessToken: string) => {
        set({ accessToken, isAuthenticated: !!accessToken });
        // Also store in localStorage for axios interceptor
        if (accessToken) {
          localStorage.setItem("access", accessToken);
        }
      },
      
      setUser: (user: User) => set({ user }),
      
      logout: () => {
        set({ 
          accessToken: '', 
          user: { id: '', email: '', name: '' },
          isAuthenticated: false 
        });
        localStorage.removeItem("access");
      },
      
      checkAuth: () => {
        const { accessToken } = get();
        if (!accessToken) {
          // Check localStorage as fallback
          const storedToken = localStorage.getItem("access");
          if (storedToken) {
            get().setAccessToken(storedToken);
            return true;
          }
          return false;
        }
        
        try {
          // Decode JWT to check expiration
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();
          
          if (isExpired) {
            get().logout();
            return false;
          }
          
          return true;
        } catch {
          get().logout();
          return false;
        }
      },
      
      initializeAuth: () => {
        const storedToken = localStorage.getItem("access");
        if (storedToken) {
          try {
            // Check if token is valid before setting it
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const isExpired = payload.exp * 1000 < Date.now();
            
            if (!isExpired) {
              get().setAccessToken(storedToken);
            } else {
              // Token is expired, clear it
              localStorage.removeItem("access");
              get().logout();
            }
          } catch (error) {
            // Invalid token format, clear it
            localStorage.removeItem("access");
            get().logout();
          }
        } else {
          // No token found, ensure we're logged out
          set({ 
            accessToken: '', 
            user: { id: '', email: '', name: '' },
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