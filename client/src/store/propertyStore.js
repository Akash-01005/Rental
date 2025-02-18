import { create } from 'zustand';
import { axiosConfig } from '../libs';

const usePropertyStore = create((set, get) => ({
    properties: [],
    currentProperty: null,
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    total: 0,

    filters: {
        search: '',
        minPrice: '',
        maxPrice: '',
        city: '',
        bedrooms: '',
        foodPreference: '',
        religionPreference: '',
        petsAllowed: undefined
    },

    setFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } });
        get().fetchProperties(1); // Reset to first page when filters change
    },

    fetchProperties: async (page = 1) => {
        try {
            set({ loading: true, error: null });
            const filters = get().filters;
            
            const queryParams = new URLSearchParams({
                page,
                limit: 10,
                ...(filters.search && { search: filters.search }),
                ...(filters.minPrice && { minPrice: filters.minPrice }),
                ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                ...(filters.city && { city: filters.city }),
                ...(filters.bedrooms && { bedrooms: filters.bedrooms }),
                ...(filters.foodPreference && { foodPreference: filters.foodPreference }),
                ...(filters.religionPreference && { religionPreference: filters.religionPreference }),
                ...(filters.petsAllowed !== undefined && { petsAllowed: filters.petsAllowed })
            });

            const response = await axiosConfig.get(`/properties/all?${queryParams}`);
            
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

    createProperty: async (formData) => {
        try {
            set({ loading: true, error: null });
            
            const response = await axiosConfig.post('/properties/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.property) {
                await get().fetchProperties();
                set({ loading: false });
                return response.data;
            } else {
                throw new Error('Failed to create property');
            }
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Failed to create property',
                loading: false 
            });
            throw error;
        }
    },

    updateProperty: async (id, updates) => {
        try {
            set({ loading: true, error: null });
            const formData = new FormData();
            
            Object.keys(updates).forEach(key => {
                if (key === 'images') {
                    updates.images.forEach(image => {
                        formData.append('images', image);
                    });
                } else if (typeof updates[key] === 'object') {
                    formData.append(key, JSON.stringify(updates[key]));
                } else {
                    formData.append(key, updates[key]);
                }
            });

            const response = await axiosConfig.put(`/properties/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (get().currentProperty?._id === id) {
                set({ currentProperty: response.data.property });
            }

            await get().fetchProperties();
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
            await axiosConfig.delete(`/properties/delete/${id}`);
            
            set(state => ({
                properties: state.properties.filter(prop => prop._id !== id),
                loading: false
            }));

            await get().fetchProperties();
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
                search: '',
                minPrice: '',
                maxPrice: '',
                city: '',
                bedrooms: '',
                foodPreference: '',
                religionPreference: '',
                petsAllowed: undefined
            }
        });
    }
}));

export default usePropertyStore;