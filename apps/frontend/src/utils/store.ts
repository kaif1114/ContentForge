import { create } from 'zustand'

interface User{
    id: string,
    email: string,
    name: string,
}

interface AuthStore{
    accessToken: string,
    user: User,
    setAccessToken: (accessToken: string) => void,
    setUser: (user: User) => void,
    logout: () => void,
}

const authStore = create<AuthStore>((set: (partial: Partial<AuthStore>) => void) => ({
    accessToken: '',
    user: {
        id: '',
        email: '',
        name: '',
    },
    setAccessToken: (accessToken: string) => set({ accessToken }),
    setUser: (user: User) => set({ user }),
    logout: () => set({ accessToken: '', user: { id: '', email: '', name: '' } }),
}))

export default authStore;