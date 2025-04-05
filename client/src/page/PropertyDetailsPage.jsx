import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePropertyStore, useThemeStore, useAuthStore } from '../store';
import { useSocket } from '../hooks/useSocket';
import { FaBed, FaBath, FaRulerCombined, FaRupeeSign, FaPhoneAlt, FaEnvelope, FaMotorcycle, FaCar } from 'react-icons/fa';

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const { user } = useAuthStore();
    const { currentProperty, loading, error, fetchPropertyById } = usePropertyStore();
    const { joinPropertyRoom, onPropertyUpdate } = useSocket();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const initializeProperty = async () => {
            try {
                await fetchPropertyById(id);
                joinPropertyRoom(id);
            } catch (error) {
                console.error('Error fetching property:', error);
            }
        };

        initializeProperty();
    }, [id, fetchPropertyById, joinPropertyRoom]);

    useEffect(() => {
        onPropertyUpdate((data) => {
            if (data.type === 'availability_change') {
                fetchPropertyById(id);
            }
        });
    }, [id, onPropertyUpdate, fetchPropertyById]);
console.log(currentProperty)
    if (loading) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !currentProperty) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">
                            {error || "Property Not Found"}
                        </h2>
                        <button
                            onClick={() => navigate('/properties')}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Back to Properties
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{currentProperty.title}</h1>
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            currentProperty.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {currentProperty.status.charAt(0).toUpperCase() + currentProperty.status.slice(1)}
                        </span>
                        <span className="text-gray-500">
                            {currentProperty.location.address}, {currentProperty.location.city}
                        </span>
                        {currentProperty.foodPreference && (
                            <span className={`px-3 py-1 rounded-full text-sm ${currentProperty.foodPreference==="vegetarian"?'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'}`}>
                                {currentProperty.foodPreference.charAt(0).toUpperCase() + currentProperty.foodPreference.slice(1)}
                            </span>
                        )}
                        {currentProperty.religionPreference && (
                            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {currentProperty.religionPreference.charAt(0).toUpperCase()+currentProperty.religionPreference.slice(1)}
                            </span>
                        )}
                        {currentProperty.petsAllowed && (
                            <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                Pets Allowed
                            </span>
                        )}
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="relative h-[400px]">
                        <img
                            src={currentProperty.images[activeImageIndex]}
                            alt={`Property ${activeImageIndex + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {currentProperty.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Property ${index + 1}`}
                                className={`w-full h-24 object-cover rounded cursor-pointer ${
                                    index === activeImageIndex ? 'ring-2 ring-blue-500' : ''
                                }`}
                                onClick={() => setActiveImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Details */}
                    <div className="col-span-2">
                        {/* Specifications */}
                        <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <FaBed className="text-blue-500" />
                                    <span>{currentProperty.specifications.bedrooms} Bedrooms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaBath className="text-blue-500" />
                                    <span>{currentProperty.specifications.bathrooms} Bathrooms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaRulerCombined className="text-blue-500" />
                                    <span>{currentProperty.specifications.area} sq.ft</span>
                                </div>
                            </div>
                        </div>

                        {/* Parking Details */}
                        {(currentProperty.parking?.carParking?.available || currentProperty.parking?.bikeParking?.available) && (
                            <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <h2 className="text-xl font-semibold mb-4">Parking Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentProperty.parking.carParking?.available && (
                                        <div className="flex items-center gap-2">
                                            <FaCar className="text-blue-500" />
                                            <div>
                                                <p>Car Parking: {currentProperty.parking.carParking.covered ? 'Covered' : 'Open'}</p>
                                                <p className="text-sm text-gray-500">₹{currentProperty.parking.carParking.charges}/month</p>
                                            </div>
                                        </div>
                                    )}
                                    {currentProperty.parking.bikeParking?.available && (
                                        <div className="flex items-center gap-2">
                                            <FaMotorcycle className="text-blue-500" />
                                            <div>
                                                <p>Bike Parking: {currentProperty.parking.bikeParking.covered ? 'Covered' : 'Open'}</p>
                                                <p className="text-sm text-gray-500">₹{currentProperty.parking.bikeParking.charges}/month</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* House Rules */}
                        {currentProperty.rules && currentProperty.rules.length > 0 && (
                            <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <h2 className="text-xl font-semibold mb-4">House Rules</h2>
                                <ul className="list-disc list-inside space-y-2">
                                    {currentProperty.rules.map((rule, index) => (
                                        <li key={index} className={`${theme=="dark"?"text-gray-300":"text-gray-800"}`}>{rule}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <h2 className="text-xl font-semibold mb-4">Description</h2>
                            <p className={`${theme=="dark"?"text-gray-300":"text-gray-700"}`}>{currentProperty.description}</p>
                        </div>

                        {/* Amenities */}
                        <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {currentProperty.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            {/* Price Details */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Price Details</h3>
                                <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                                    <FaRupeeSign />
                                    <span>{currentProperty.price.toLocaleString('en-IN')}</span>
                                    <span className="text-sm font-normal">/month</span>
                                </div>
                            </div>


                            {currentProperty.ownerDetails && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Owner Details</h3>
                                    <div className="space-y-2">
                                        <p>{currentProperty.ownerDetails.name}</p>
                                        {user && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <FaPhoneAlt className="text-blue-500" />
                                                    <a href={`tel:${currentProperty.ownerDetails.phone}`} className={`${theme=="dark"?"text-gray-300":"text-gray-800"}`}>
                                                        {currentProperty.ownerDetails.phone}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-blue-500" />
                                                    <a href={`mailto:${currentProperty.ownerDetails.email}`} className={`${theme=="dark"?"text-gray-300":"text-gray-800"}`}>
                                                        {currentProperty.ownerDetails.email}
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Book Now Button */}
                            {currentProperty.status === 'available' && (
                                <button
                                    onClick={() => navigate(`/booking/${currentProperty._id}`)}
                                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Book Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailsPage;