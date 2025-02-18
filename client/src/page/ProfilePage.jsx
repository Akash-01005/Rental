import { useState, useEffect } from 'react';
import { useThemeStore, useAuthStore } from '../store';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaSpinner } from 'react-icons/fa';
import { axiosConfig } from '../libs';

const ProfilePage = () => {
  const { theme } = useThemeStore();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    userName: '',
    email: '',
    contactNo: '',
    role: '',
    profilePic: null
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        userName: user.userName || '',
        email: user.email || '',
        contactNo: user.contactNo || '',
        role: user.role || 'user',
        profilePic: user.profilePic || null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profilePic', file);
        
        setLoading(true);
        const response = await axiosConfig.post('/upload-profile-pic', formData);
        setProfileData(prev => ({
          ...prev,
          profilePic: response.data.imageUrl
        }));
      } catch (err) {
        console.log(err);
        setError('Failed to upload image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await updateUser(profileData);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg ${
                isEditing 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img
                    src={profileData.profilePic || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                    <FaCamera className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  <FaUser className="inline-block mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={profileData.userName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none ${
                    !isEditing && 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  <FaEnvelope className="inline-block mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  } border opacity-75 cursor-not-allowed`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  <FaPhone className="inline-block mr-2" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNo"
                  value={profileData.contactNo}
                  onChange={handleChange}
                  disabled={!isEditing}
                  pattern="[0-9]{10}"
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none ${
                    !isEditing && 'opacity-75 cursor-not-allowed'
                  }`}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Role</label>
                <input
                  type="text"
                  value={profileData.role === 'owner' ? 'Property Owner' : 'Tenant'}
                  disabled
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  } border opacity-75 cursor-not-allowed capitalize`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;