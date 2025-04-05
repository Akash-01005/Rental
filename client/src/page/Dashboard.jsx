import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore, useAuthStore, useBookingStore } from '../store';
import { FaCheckCircle, FaClock, FaTimesCircle, FaMapMarkerAlt, FaCalendar, FaRupeeSign, FaBan } from 'react-icons/fa';

const Dashboard = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { userBookings, fetchBookingById, updateBookingStatus, loading: bookingsLoading } = useBookingStore();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setError(null);
        if (!user?.userId) {
          console.log('No user ID available');
          return;
        }
        console.log('Loading bookings for user:', user.userId);
        await fetchBookingById(user.userId);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load bookings. Please try again.');
      }
    };

    loadBookings();
  }, [user, fetchBookingById]);

  useEffect(() => {
    console.log('Current userBookings:', userBookings);
  }, [userBookings]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      setShowConfirmModal(true);
    } catch (error) {
      console.error('Error preparing to cancel booking:', error);
    }
  };

  const confirmCancelBooking = async () => {
    try {
      await updateBookingStatus(cancellingId, 'cancelled');
      setShowConfirmModal(false);
      setCancellingId(null);
      // Refresh bookings
      await fetchBookingById(user.userId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
        <h3 className="text-xl font-bold mb-4">Confirm Cancellation</h3>
        <p className="mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setShowConfirmModal(false);
              setCancellingId(null);
            }}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            No, Keep Booking
          </button>
          <button
            onClick={confirmCancelBooking}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
          >
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div key={booking._id} className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {booking.property?.images && booking.property.images[0] && (
        <div className="mb-6">
          <img
            src={booking.property.images[0]}
            alt={booking.property.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mb-4 ${getStatusColor(booking.status)}`}>
        {getStatusIcon(booking.status)}
        <span className="capitalize">{booking.status}</span>
      </div>

      <h3 className="text-xl font-bold mb-4">{booking.property?.title}</h3>

      <div className="space-y-3">
        {booking.property?.location && (
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            <span>{booking.property.location.city}, {booking.property.location.state}</span>
          </div>
        )}

        <div className="flex items-center">
          <FaCalendar className="mr-2 text-blue-500" />
          <span>Move-in: {new Date(booking.moveInDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}</span>
        </div>

        <div className="flex items-center">
          <FaRupeeSign className="mr-2 text-blue-500" />
          <span>₹{booking.monthlyRent?.toLocaleString('en-IN')}/month</span>
        </div>

        {booking.status === 'pending' && (
          <div className="mt-4 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
            Awaiting approval
          </div>
        )}
      </div>

      <div className="mt-4 border-t pt-4">
        {booking.status === 'pending' && (
          <button
            onClick={() => handleCancelBooking(booking._id)}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
            disabled={cancellingId === booking._id}
          >
            <FaBan className="mr-2" />
            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
        
        {booking.status === 'cancelled' && (
          <div className="text-center py-2 bg-red-50 text-red-600 rounded-lg">
            Booking Cancelled
          </div>
        )}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-4">Access Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view your bookings.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Browse Properties
          </button>
        </div>

        {bookingsLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : Array.isArray(userBookings) && userBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">No Bookings Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't made any bookings yet.
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Properties
            </button>
          </div>
        )}
      </div>

      {showConfirmModal && <ConfirmationModal />}
    </div>
  );
};

export default Dashboard;