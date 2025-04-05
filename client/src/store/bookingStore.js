import { create } from 'zustand';
import { axiosConfig } from '../libs';

const useBookingStore = create((set, get) => ({
    userBookings: [],
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
            set({ 
                userBookings: response.data.bookings,
                totalPages: response.data.totalPages, 
                currentPage: response.data.currentPage, 
                total: response.data.total, 
                loading: false 
            });
        } catch (error) {
            set({   
                error: error.response?.data?.message || "Error fetching rental applications",
                loading: false 
            });
        }
    },

    fetchBookingById: async (userId) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.get(`/bookings/user?tenant=${userId}`);
            
            console.log('Booking Response:', response.data);
            
            if (response.data && response.data.bookings) {
                set({ 
                    userBookings: response.data.bookings,
                    loading: false 
                });
                return response.data.bookings;
            } else {
                set({
                    userBookings: [],
                    loading: false
                });
                return [];
            }
        } catch (error) {
            console.error('Fetch booking error:', error);
            set({ 
                error: error.message || "Error fetching bookings",
                loading: false,
                userBookings: [] 
            });
        }
    },

    createBooking: async (bookingData) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.post('/bookings/create', {
                property: bookingData.property,
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
                userBookings: state.userBookings.map(booking => 
                    booking._id === id ? { ...booking, status: 'cancelled' } : booking
                ),
                loading: false
            }));

            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error cancelling booking",
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
                userBookings: state.userBookings.filter(booking => booking._id !== id),
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
            userBookings: [],
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
