import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyStore, useThemeStore } from '../store';
import { FaHome, FaBed, FaFilter, FaSearch, FaRupeeSign } from 'react-icons/fa';
import PropTypes from 'prop-types';

// Define PropertyCard component with prop types
const PropertyCard = ({ property }) => {
    const { theme } = useThemeStore();
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/properties/${property._id}`)}
            className={`cursor-pointer rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
        >
            <img
                src={property.images[0] || '/default-property-image.jpg'}
                alt={property.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.target.src = '/default-property-image.jpg';
                }}
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{property.location.city}, {property.location.state}</p>
                
                <div className="flex items-center gap-2 mb-2">
                    <FaRupeeSign className="text-green-600" />
                    <span className="text-lg font-bold text-green-600">₹{property.price.toLocaleString('en-IN')}/month</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <FaBed className="text-gray-500" />
                        <span>{property.specifications.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaHome className="text-gray-500" />
                        <span>{property.specifications.area} sq.ft</span>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {property.foodPreference && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            property.foodPreference === 'vegetarian' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                        }`}>
                            {property.foodPreference.charAt(0).toUpperCase()+property.foodPreference.slice(1)}
                        </span>
                    )}
                    {property.religionPreference && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {property.religionPreference.charAt(0).toUpperCase()+property.religionPreference.slice(1)}
                        </span>
                    )}
                    {property.petsAllowed && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Pets Allowed
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Define prop types for PropertyCard
PropertyCard.propTypes = {
    property: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
        location: PropTypes.shape({
            city: PropTypes.string.isRequired,
            state: PropTypes.string.isRequired
        }).isRequired,
        price: PropTypes.number.isRequired,
        specifications: PropTypes.shape({
            bedrooms: PropTypes.number.isRequired,
            area: PropTypes.number.isRequired
        }).isRequired,
        foodPreference: PropTypes.string,
        religionPreference: PropTypes.string,
        petsAllowed: PropTypes.bool
    }).isRequired
};

const SearchBar = ({ onSearch }) => {
    const { theme } = useThemeStore();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="relative flex-1">
            <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={handleSearch}
                className={`w-full p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} pr-10`}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired
};

const FilterPanel = ({ filters, onFilterChange, onApply, onReset }) => {
    const { theme } = useThemeStore();

    return (
        <div className={`p-6 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                    <label className="block mb-2 font-medium">Price Range (₹/month)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={onFilterChange}
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={onFilterChange}
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block mb-2 font-medium">City</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={filters.city}
                        onChange={onFilterChange}
                        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    />
                </div>

                {/* Bedrooms */}
                <div>
                    <label className="block mb-2 font-medium">Bedrooms</label>
                    <select
                        name="bedrooms"
                        value={filters.bedrooms}
                        onChange={onFilterChange}
                        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                        <option value="">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>

                {/* Food Preference */}
                <div>
                    <label className="block mb-2 font-medium">Food Preference</label>
                    <select
                        name="foodPreference"
                        value={filters.foodPreference}
                        onChange={onFilterChange}
                        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                    <option value="">Any</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    </select>
                </div>

                {/* Religion Preference */}
                <div>
                    <label className="block mb-2 font-medium">Religion Preference</label>
                    <select
                        name="religionPreference"
                        value={filters.religionPreference}
                        onChange={onFilterChange}
                        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                        <option value="any-religion">Any Religion</option>
                        <option value="hindu">Hindu</option>
                        <option value="muslim">Muslim</option>
                        <option value="christian">Christian</option>
                        <option value="sikh">Sikh</option>
                    </select>
                </div>

                {/* Parking */}
                <div>
                    <label className="block mb-2 font-medium">Parking</label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="carParking"
                                checked={filters.carParking}
                                onChange={onFilterChange}
                                className="rounded"
                            />
                            <span>Car Parking</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="bikeParking"
                                checked={filters.bikeParking}
                                onChange={onFilterChange}
                                className="rounded"
                            />
                            <span>Bike Parking</span>
                        </label>
                    </div>
                </div>

                {/* Pets Allowed */}
                <div>
                    <label className="block mb-2 font-medium">Pets</label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="petsAllowed"
                            checked={filters.petsAllowed}
                            onChange={onFilterChange}
                            className="rounded"
                        />
                        <span>Pets Allowed</span>
                    </label>
                </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={onReset}
                    className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={onApply}
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

FilterPanel.propTypes = {
    filters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
};

const PropertiesPage = () => {
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const { 
        properties, 
        loading, 
        error, 
        totalPages, 
        currentPage,
        fetchProperties,
        filters,
        setFilters 
    } = usePropertyStore();

    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        fetchProperties(1);
    }, []);

    const handlePageChange = (newPage) => {
        fetchProperties(newPage);
        window.scrollTo(0, 0);
    };

    const handleSearch = (searchTerm) => {
        // Implement search functionality
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleApplyFilters = () => {
        setFilters(localFilters);
        fetchProperties(1);
    };

    const handleResetFilters = () => {
        setLocalFilters(filters);
        fetchProperties(1);
    };

    return (
        <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Search and Filters Section */}
            <div className="max-w-7xl mx-auto mt-8 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <SearchBar onSearch={handleSearch} />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 rounded-lg flex items-center gap-2 ${
                            theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                        <FaFilter />
                        Filters
                    </button>
                </div>

                {showFilters && (
                    <FilterPanel 
                        filters={localFilters}
                        onFilterChange={handleFilterChange}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                    />
                )}
            </div>

            {/* Properties Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">
                    <p className="text-xl font-semibold">Error loading properties</p>
                    <p className="text-sm mt-2">{error}</p>
                    <button 
                        onClick={() => fetchProperties(currentPage)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    {properties.length > 0 ? (
                        <>
                            {/* Properties Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map(property => (
                                    <PropertyCard 
                                        key={property._id} 
                                        property={property}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages >= 1 && (
                                <div className="flex justify-center mt-8 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded ${
                                            currentPage === 1 
                                            ? 'bg-gray-300 cursor-not-allowed' 
                                            : theme === 'dark' 
                                                ? 'bg-gray-700 hover:bg-gray-600' 
                                                : 'bg-white hover:bg-gray-100'
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-4 py-2 rounded ${
                                                    currentPage === pageNumber
                                                    ? 'bg-blue-500 text-white'
                                                    : theme === 'dark'
                                                        ? 'bg-gray-700 hover:bg-gray-600'
                                                        : 'bg-white hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded ${
                                            currentPage === totalPages 
                                            ? 'bg-gray-300 cursor-not-allowed' 
                                            : theme === 'dark' 
                                                ? 'bg-gray-700 hover:bg-gray-600' 
                                                : 'bg-white hover:bg-gray-100'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl font-semibold mb-4">No properties found</p>
                            <button 
                                onClick={handleResetFilters}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;