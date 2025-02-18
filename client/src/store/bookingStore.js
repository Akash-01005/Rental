import { create } from 'zustand';
import { axiosConfig } from '../libs';

const useBookingStore = create((set, get) => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0,

    fetchUserBookings: async (page = 1, status = '') => {
        try {
            set({ loading: true, error: null });
            const queryParams = new URLSearchParams({ page, limit: 10, ...(status && { status })});

            const response = await axiosConfig.get(`/bookings/user?${queryParams}`);
            set({ bookings: response.data.bookings, totalPages: response.data.totalPages, currentPage: response.data.currentPage, total: response.data.total, loading: false });
        } catch (error) {
            set({   error: error.response?.data?.message || "Error fetching rental applications",loading: false });
        }
    },

    fetchBookingById: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.get(`/bookings/${id}`);
            set({ currentBooking: response.data.booking, loading: false  });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching rental application",loading: false });
        }
    },

    createBooking: async (bookingData) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.post('/bookings/create', {
                propertyId: bookingData.propertyId,
                moveInDate: bookingData.moveInDate,
                leaseDuration: bookingData.leaseDuration,
                monthlyRent: bookingData.monthlyRent,
                securityDeposit: bookingData.securityDeposit,
                tenantDetails: bookingData.tenantDetails,
                specialRequests: bookingData.specialRequests,
                contactNumber: bookingData.contactNumber,
                utilityIncluded: bookingData.utilityIncluded
            });

            await get().fetchUserBookings();
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error creating rental application",
                loading: false 
            });
            throw error;
        }
    },

    updateBookingStatus: async (id, status) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.put(`/bookings/status/${id}`, { status });

            set(state => ({
                bookings: state.bookings.map(booking => 
                    booking._id === id ? response.data.booking : booking
                ),
                currentBooking: state.currentBooking?._id === id ? 
                    response.data.booking : state.currentBooking,
                loading: false
            }));

            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error updating rental application status",
                loading: false 
            });
            throw error;
        }
    },

    deleteBooking: async (id) => {
        try {
            set({ loading: true, error: null });
            await axiosConfig.delete(`/bookings/delete/${id}`);
            
            set(state => ({
                bookings: state.bookings.filter(booking => booking._id !== id),
                currentBooking: state.currentBooking?._id === id ? null : state.currentBooking,
                loading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error deleting rental application",
                loading: false 
            });
            throw error;
        }
    },

    resetStore: () => {
        set({
            bookings: [],
            currentBooking: null,
            loading: false,
            error: null,
            totalPages: 0,
            currentPage: 1,
            total: 0
        });
    }
}));

export default useBookingStore;
