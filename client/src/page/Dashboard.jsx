import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore, useAuthStore, usePropertyStore, useBookingStore } from '../store';
import { FaHome, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Dashboard = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { userProperties, fetchUserProperties, deleteProperty, loading: propertiesLoading } = usePropertyStore();
  const { userBookings, fetchUserBookings, loading: bookingsLoading } = useBookingStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(user?.role === 'owner' ? 'properties' : 'bookings');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        if (user?.role === 'owner') {
          await fetchUserProperties();
        }
        await fetchUserBookings();
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Dashboard loading error:', err);
      }
    };

    if (user) {
      loadData();
    }
  }, [fetchUserProperties, fetchUserBookings, user]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-500',
      approved: 'text-green-500',
      rejected: 'text-red-500'
    };
    return colors[status] || 'text-gray-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="mr-2" />;
      case 'approved':
        return <FaCheckCircle className="mr-2" />;
      case 'rejected':
        return <FaTimesCircle className="mr-2" />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl">Please log in to access the dashboard.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const PropertyCard = ({ property }) => (
    <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="relative h-48 mb-4">
        <img
          src={property.images[0] || '/default-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-sm ${
          property.status === 'available' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {property.status}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
      <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {property.location.city}, {property.location.state}
      </p>
      <p className="text-green-500 font-bold mb-4">
        ₹{property.price.toLocaleString('en-IN')}/month
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => navigate(`/edit-property/${property._id}`)}
          className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => deleteProperty(property._id)}
          className="p-2 text-red-500 hover:bg-red-100 rounded-full"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );

  PropertyCard.propTypes = {
    property: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      status: PropTypes.string.isRequired,
      location: PropTypes.shape({
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired
      }).isRequired,
      price: PropTypes.number.isRequired
    }).isRequired
  };

  const BookingCard = ({ booking }) => (
    <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{booking.property.title}</h3>
        <div className={`flex items-center ${getStatusColor(booking.status)}`}>
          {getStatusIcon(booking.status)}
          <span className="capitalize">{booking.status}</span>
        </div>
      </div>
      <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} space-y-2`}>
        <p>Move-in Date: {new Date(booking.moveInDate).toLocaleDateString()}</p>
        <p>Lease Duration: {booking.leaseDuration} months</p>
        <p>Monthly Rent: ₹{booking.monthlyRent.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );

  BookingCard.propTypes = {
    booking: PropTypes.shape({
      property: PropTypes.shape({
        title: PropTypes.string.isRequired
      }).isRequired,
      status: PropTypes.string.isRequired,
      moveInDate: PropTypes.string.isRequired,
      leaseDuration: PropTypes.number.isRequired,
      monthlyRent: PropTypes.number.isRequired
    }).isRequired
  };

  const AddPropertyBanner = () => (
    <div className={`p-6 rounded-lg shadow-md mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Have a Property to Rent?</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            List your property and find culturally compatible tenants.
          </p>
        </div>
        <button
          onClick={() => navigate('/add-property')}
          className="mt-4 md:mt-0 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Property
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex space-x-4">
            {user.role === 'owner' && (
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'properties'
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <FaHome className="inline-block mr-2" />
                Properties
              </button>
            )}
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'bookings'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <FaClock className="inline-block mr-2" />
              Bookings
            </button>
          </div>
        </div>

        {user.role === 'owner' && <AddPropertyBanner />}

        {activeTab === 'properties' && user.role === 'owner' ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Properties</h2>
            {propertiesLoading ? (
              <LoadingSpinner />
            ) : userProperties?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProperties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl mb-4">You haven&apos;t listed any properties yet.</p>
                <button
                  onClick={() => navigate('/add-property')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  List Your First Property
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
            {bookingsLoading ? (
              <LoadingSpinner />
            ) : userBookings?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBookings.map(booking => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl mb-4">No booking history found.</p>
                <button
                  onClick={() => navigate('/properties')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;