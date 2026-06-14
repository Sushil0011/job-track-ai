import { create } from "zustand";

// 1. Define the shape of your User
type User = {
  id: string;
  name: string;
  email: string;
}

// 2. Define the shape of your Store (State + Actions)
type UserState = {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (userData: User) => void;
  updateProfile: (name: string) => void;
  clearUser: () => void;
}

// 3. Create the actual store
export const userStore = create<UserState>((set) => ({
  // Initial State
  user: null,
  isAuthenticated: false,

  // Actions
  setUser: (userData) =>
    set({
      user: userData,
      isAuthenticated: true,
    }),

  updateProfile: (newName) =>
    set((state) => ({
      // Only update if a user exists, keep the rest of the user object intact
      user: state.user ? { ...state.user, name: newName } : null,
    })),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
