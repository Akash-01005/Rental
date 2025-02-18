import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore, usePropertyStore, useAuthStore } from '../store';
import { FaSpinner, FaUpload, FaPlus, FaTrash } from 'react-icons/fa';

const PropertyRegistration = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { createProperty, loading, error } = usePropertyStore();

  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    price: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      furnished: false
    },
    ownerDetails: {
      name: '',
      phone: '',
      email: '',
      preferredContactMethod: 'both',
      availableTime: {
        from: '',
        to: ''
      }
    },
    parking: {
      bikeParking: {
        available: false,
        covered: false,
        charges: 0
      },
      carParking: {
        available: false,
        covered: false,
        charges: 0
      }
    },
    amenities: [],
    rules: [],
    images: [],
    status: 'Available',
    petsAllowed: false,
    foodPreference: 'Non-Vegetarian',
    religionPreference: 'Any-Religion',
    tenantType: 'Any-Tenant'
  });

  // State for new rule/amenity input
  const [newRule, setNewRule] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Handle adding new rule
  const handleAddRule = () => {
    if (newRule.trim()) {
      setPropertyData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  // Handle adding new amenity
  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setPropertyData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  // Handle removing rule
  const handleRemoveRule = (index) => {
    setPropertyData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  // Handle removing amenity
  const handleRemoveAmenity = (index) => {
    setPropertyData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setPropertyData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else if (name.includes('specifications.')) {
      const field = name.split('.')[1];
      setPropertyData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [field]: type === 'checkbox' ? checked : Number(value)
        }
      }));
    } else if (name.includes('parking.')) {
      const [, parkingType, field] = name.split('.');
      setPropertyData(prev => ({
        ...prev,
        parking: {
          ...prev.parking,
          [parkingType]: {
            ...prev.parking[parkingType],
            [field]: type === 'checkbox' ? checked : Number(value)
          }
        }
      }));
    } else if (name.includes('ownerDetails.')) {
      const parts = name.split('.');
      if (parts.length === 3) {
        // Handle nested ownerDetails.availableTime fields
        const [, , timeField] = parts;
        setPropertyData(prev => ({
          ...prev,
          ownerDetails: {
            ...prev.ownerDetails,
            availableTime: {
              ...prev.ownerDetails.availableTime,
              [timeField]: value
            }
          }
        }));
      } else {
        // Handle direct ownerDetails fields
        const [, field] = parts;
        setPropertyData(prev => ({
          ...prev,
          ownerDetails: {
            ...prev.ownerDetails,
            [field]: value
          }
        }));
      }
    } else {
      // Handle all other fields
      setPropertyData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      
      // Clean up the property data
      const cleanPropertyData = {
        ...propertyData,
        owner: user._id,
        // Add any required fields that might be missing
        status: 'Available',
        images: [] // This will be replaced by uploaded images
      };

      // Convert and append the property data
      formData.append('propertyData', JSON.stringify(cleanPropertyData));
      
      // Append each image file
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      console.log('Submitting property data:', cleanPropertyData);

      const response = await createProperty(formData);
      
      if (response.property) {
        console.log('Property created successfully:', response);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Property registration failed:', err);
    }
  };

  return (
    <div className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className="text-3xl font-bold mb-6">Register Your Property</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={propertyData.title}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none`}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Monthly Rent</label>
                <input
                  type="number"
                  name="price"
                  value={propertyData.price}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none`}
                />
              </div>
            </div>

            {/* Rules Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">House Rules</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add a new rule..."
                  className={`flex-1 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="space-y-2">
                {propertyData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span>{rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Amenities</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add an amenity..."
                  className={`flex-1 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none`}
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="space-y-2">
                {propertyData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span>{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

{/* Description */}
<div>
  <label className="block mb-2 font-medium">Description</label>
  <textarea
    name="description"
    value={propertyData.description}
    onChange={handleChange}
    required
    rows={4}
    className={`w-full p-3 rounded-lg ${
      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
    } border focus:ring-2 focus:ring-blue-500 outline-none`}
  />
</div>

{/* Owner Details */}
<div>
  <h3 className="text-xl font-semibold mb-4">Owner Details</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block mb-2">Name</label>
      <input
        type="text"
        name="ownerDetails.name"
        value={propertyData.ownerDetails.name}
        onChange={handleChange}
        required
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      />
    </div>
    <div>
      <label className="block mb-2">Phone</label>
      <input
        type="tel"
        name="ownerDetails.phone"
        value={propertyData.ownerDetails.phone}
        onChange={handleChange}
        required
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      />
    </div>
    <div>
      <label className="block mb-2">Email</label>
      <input
        type="email"
        name="ownerDetails.email"
        value={propertyData.ownerDetails.email}
        onChange={handleChange}
        required
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      />
    </div>
    <div>
      <label className="block mb-2">Preferred Contact Method</label>
      <select
        name="ownerDetails.preferredContactMethod"
        value={propertyData.ownerDetails.preferredContactMethod}
        onChange={handleChange}
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      >
        <option value="phone">Phone</option>
        <option value="email">Email</option>
        <option value="both">Both</option>
      </select>
    </div>
    <div>
      <label className="block mb-2">Available From</label>
      <input
        type="time"
        name="ownerDetails.availableTime.from"
        value={propertyData.ownerDetails.availableTime.from}
        onChange={handleChange}
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      />
    </div>
    <div>
      <label className="block mb-2">Available To</label>
      <input
        type="time"
        name="ownerDetails.availableTime.to"
        value={propertyData.ownerDetails.availableTime.to}
        onChange={handleChange}
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      />
    </div>
  </div>
</div>

{/* Preferences */}
<div>
  <h3 className="text-xl font-semibold mb-4">Preferences</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block mb-2">Food Preference</label>
      <select
        name="foodPreference"
        value={propertyData.foodPreference}
        onChange={handleChange}
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      >
        <option value="vegetarian">Vegetarian</option>
        <option value="Non-Vegetarian">Non-Vegetarian</option>
      </select>
    </div>
    <div>
      <label className="block mb-2">Religion Preference</label>
      <select
        name="religionPreference"
        value={propertyData.religionPreference}
        onChange={handleChange}
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      >
        <option value="Any-Religion">Any Religion</option>
        <option value="Hindu">Hindu</option>
        <option value="Muslim">Muslim</option>
        <option value="Christian">Christian</option>
      </select>
    </div>
    <div>
      <label className="block mb-2">Tenant Type</label>
      <select
        name="tenantType"
        value={propertyData.tenantType}
        onChange={handleChange}
        className={`w-full p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        } border focus:ring-2 focus:ring-blue-500 outline-none`}
      >
        <option value="Any-Tenant">Any Tenant</option>
        <option value="Bachelors Only">Bachelors Only</option>
        <option value="Family Only">Family Only</option>
      </select>
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        name="petsAllowed"
        checked={propertyData.petsAllowed}
        onChange={handleChange}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <label className="ml-2">Pets Allowed</label>
    </div>
  </div>
</div>

{/* Parking Details */}
<div>
  <h3 className="text-xl font-semibold mb-4">Parking Details</h3>
  
  {/* Bike Parking */}
  <div className="mb-6">
    <h4 className="font-medium mb-3">Bike Parking</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          name="parking.bikeParking.available"
          checked={propertyData.parking.bikeParking.available}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="ml-2">Available</label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="parking.bikeParking.covered"
          checked={propertyData.parking.bikeParking.covered}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="ml-2">Covered Parking</label>
      </div>
      <div>
        <label className="block mb-2">Monthly Charges (₹)</label>
        <input
          type="number"
          name="parking.bikeParking.charges"
          onChange={handleChange}
          className={`w-full p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          } border focus:ring-2 focus:ring-blue-500 outline-none`}
        />
      </div>
    </div>
  </div>

  {/* Car Parking */}
  <div>
    <h4 className="font-medium mb-3">Car Parking</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          name="parking.carParking.available"
          checked={propertyData.parking.carParking.available}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="ml-2">Available</label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="parking.carParking.covered"
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="ml-2">Covered Parking</label>
      </div>
      <div>
        <label className="block mb-2">Monthly Charges (₹)</label>
        <input
          type="number"
          name="parking.carParking.charges"
          onChange={handleChange}
          className={`w-full p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          } border focus:ring-2 focus:ring-blue-500 outline-none`}
        />
      </div>
    </div>
  </div>
</div>

{/* Images Section */}
<div>
  <label className="block mb-2 font-medium">Property Images</label>
  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
    <div className="space-y-1 text-center">
      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
      <div className="flex text-sm">
        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
          <span>Upload images</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
        </label>
      </div>
      <p className="text-xs">PNG, JPG, GIF up to 10MB each</p>
    </div>
  </div>

  {previewUrls.length > 0 && (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {previewUrls.map((url, index) => (
        <div key={index} className="relative">
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  )}
</div>

{/* Submit Button */}
<div className="flex justify-end">
  <button
    type="submit"
    disabled={loading}
    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? (
      <>
        <FaSpinner className="animate-spin" />
        <span>Processing...</span>
      </>
    ) : (
      'Register Property'
    )}
  </button>
</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyRegistration;
