import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useThemeStore, usePropertyStore, useBookingStore, useAuthStore } from '../store';
import { FaCalendar, FaClock, FaRupeeSign, FaSpinner } from 'react-icons/fa';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { currentProperty, fetchPropertyById, loading: propertyLoading } = usePropertyStore();
  const { createBooking, loading: bookingLoading, error } = useBookingStore();
  
  const [bookingData, setBookingData] = useState({
    moveInDate: '',
    leaseDuration: 12,
    tenantDetails: {
      occupation: '',
      workplace: '',
      familySize: 1,
      idProof: 'AADHAAR',
      alternateMobile: ''
    },
    utilityIncluded: {
      electricity: false,
      water: false,
      maintenance: false
    },
    specialRequests: '',
    contactNumber: user?.contactNo || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProperty = async () => {
      try {
        await fetchPropertyById(id);
      } catch (err) {
        console.error('Error loading property:', err);
      }
    };

    loadProperty();
  }, [id, fetchPropertyById, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('tenantDetails.')) {
      const field = name.split('.')[1];
      setBookingData(prev => ({
        ...prev,
        tenantDetails: {
          ...prev.tenantDetails,
          [field]: value
        }
      }));
    } else if (name.includes('utilityIncluded.')) {
      const field = name.split('.')[1];
      setBookingData(prev => ({
        ...prev,
        utilityIncluded: {
          ...prev.utilityIncluded,
          [field]: checked
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createBooking({
        ...bookingData,
        property: id,
        user: user._id
      });
      navigate('/profile');
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  if (propertyLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!currentProperty) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-red-500">Property not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
          
          {/* Property Summary */}
          <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h2 className="text-xl font-semibold mb-2">{currentProperty.title}</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              {currentProperty.location.address}, {currentProperty.location.city}
            </p>
            <div className="flex items-center text-green-500">
              <FaRupeeSign />
              <span className="text-lg font-bold">{currentProperty.price.toLocaleString('en-IN')}/month</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Move-in Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Move-in Date</label>
                <div className="relative">
                  <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="moveInDate"
                    value={bookingData.moveInDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Lease Duration (months)</label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="leaseDuration"
                    value={bookingData.leaseDuration}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  >
                    <option value="11">11 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tenant Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Tenant Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Occupation</label>
                  <input
                    type="text"
                    name="tenantDetails.occupation"
                    value={bookingData.tenantDetails.occupation}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
                <div>
                  <label className="block mb-2">Workplace</label>
                  <input
                    type="text"
                    name="tenantDetails.workplace"
                    value={bookingData.tenantDetails.workplace}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2">Family Size</label>
                  <input
                    type="number"
                    name="tenantDetails.familySize"
                    value={bookingData.tenantDetails.familySize}
                    onChange={handleChange}
                    min="1"
                    required
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
                <div>
                  <label className="block mb-2">ID Proof</label>
                  <select
                    name="tenantDetails.idProof"
                    value={bookingData.tenantDetails.idProof}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  >
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Alternate Mobile</label>
                  <input
                    type="tel"
                    name="tenantDetails.alternateMobile"
                    value={bookingData.tenantDetails.alternateMobile}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
              </div>
            </div>

            {/* Utilities */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Utilities Required</h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="utilityIncluded.electricity"
                    checked={bookingData.utilityIncluded.electricity}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span>Electricity</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="utilityIncluded.water"
                    checked={bookingData.utilityIncluded.water}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span>Water</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="utilityIncluded.maintenance"
                    checked={bookingData.utilityIncluded.maintenance}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span>Maintenance</span>
                </label>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block mb-2 font-medium">Special Requests</label>
              <textarea
                name="specialRequests"
                value={bookingData.specialRequests}
                onChange={handleChange}
                rows="3"
                className={`w-full p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="Any special requirements or requests..."
              ></textarea>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block mb-2 font-medium">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={bookingData.contactNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className={`w-full p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="Enter your 10-digit mobile number"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={bookingLoading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Submit Booking Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;