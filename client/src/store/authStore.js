import { create } from "zustand";
import { axiosConfig } from "../libs";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  

  login: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosConfig.post("/auth/login", formData);
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axiosConfig.delete("/auth/logout");
      set({ user: null, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosConfig.get("/auth/check");
      set({ user: res.data, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
      console.log(err)
    }
  },

  resetPassword: async (formData) => {
    set({ loading: true, error: null });
    try {
      await axiosConfig.post("/auth/reset-password", formData);
      set({ loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await axiosConfig.put(`/auth/forgot-password/${email}`);
      set({ loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  updateUser: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosConfig.put('/api/auth/profile', userData);
      if (response.data?.user) {
        set({ user: response.data.user });
        return response.data.user;
      }
      throw new Error('Failed to update user');
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;