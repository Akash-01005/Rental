import { create } from 'zustand';
import { axiosConfig } from '../libs';

const usePropertyStore = create((set) => ({
    properties: [],
    currentProperty: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0,
    filters: {
        minPrice: '',
        maxPrice: '',
        city: '',
        bedrooms: '',
        foodPreference: '',
        religionPreference: '',
        petsAllowed: false,
        carParking: false,
        bikeParking: false
    },

    setFilters: (newFilters) => {
        set({ filters: newFilters });
    },

    fetchProperties: async (page = 1) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.get(`/properties?page=${page}`);
            set({ 
                properties: response.data.properties,
                totalPages: response.data.totalPages, 
                currentPage: response.data.currentPage, 
                total: response.data.total,
                loading: false 
            });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error fetching properties",
                loading: false 
            });
        }
    },

    fetchPropertyById: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.get(`/properties/${id}`);
            set({ currentProperty: response.data.property, loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error fetching property",
                loading: false 
            });
        }
    },

    createProperty: async (propertyData) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.post('/properties/create', propertyData);
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error creating property",
                loading: false 
            });
            throw error;
        }
    },

    updateProperty: async (id, propertyData) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosConfig.put(`/properties/${id}`, propertyData);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error updating property",
                loading: false 
            });
            throw error;
        }
    },

    deleteProperty: async (id) => {
        try {
            set({ loading: true, error: null });
            await axiosConfig.delete(`/properties/${id}`);
            set(state => ({
                properties: state.properties.filter(property => property._id !== id),
                loading: false
            }));
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error deleting property",
                loading: false 
            });
            throw error;
        }
    },

    resetStore: () => {
        set({
            properties: [],
            currentProperty: null,
            loading: false,
            error: null,
            totalPages: 0,
            currentPage: 1,
            total: 0,
            filters: {
                minPrice: '',
                maxPrice: '',
                city: '',
                bedrooms: '',
                foodPreference: '',
                religionPreference: '',
                petsAllowed: false,
                carParking: false,
                bikeParking: false
            }
        });
    }
}));

export default usePropertyStore;