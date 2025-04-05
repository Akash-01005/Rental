import { useAuthStore, useThemeStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaBed, FaRupeeSign } from 'react-icons/fa';
import { useState } from 'react';

const HomePage = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const { user } = useAuthStore();
  console.log(user);

  const handleSearch = () => {
    if (searchLocation.trim()) {
      navigate(`/properties?city=${searchLocation.trim()}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const featuredProperties = [
    {
      id: 1,
      title: "Modern Hindu Villa",
      location: "Malleshwaram, Bangalore",
      price: 15000,
      beds: 3,
      type: "vegetarian",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
    },
    {
      id: 2,
      title: "Muslim Family Apartment",
      location: "Shivajinagar, Bangalore",
      price: 12000,
      beds: 2,
      type: "non-vegetarian",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233"
    },
    {
      id: 3,
      title: "Interfaith Luxury Home",
      location: "HSR Layout, Bangalore",
      price: 18000,
      beds: 3,
      type: "both",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    }
  ];

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      {/* Hero Section */}
      <div className="h-[500px] mt-2">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" 
            alt="hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find Your Perfect Home with Cultural Harmony
          </h1>
          <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
            Discover rental properties that respect your cultural preferences and dietary choices
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center">
              <div className="flex-1 flex items-center">
                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Enter city name..." 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full text-gray-800 focus:outline-none"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaSearch className="inline-block mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <Link key={property.id} to={`/properties/${property.id}`} className="group">
              <div className={`rounded-lg overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="relative">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-sm ${
                    property.type === 'vegetarian' 
                      ? 'bg-green-100 text-green-800'
                      : property.type === 'non-vegetarian'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {property.location}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-green-600">
                      <FaRupeeSign className="text-sm" />
                      <span className="font-bold">{property.price.toLocaleString('en-IN')}/month</span>
                    </div>
                    <div className="flex items-center">
                      <FaBed className="mr-1" />
                      <span>{property.beds} beds</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Verified Properties', description: 'All our properties are thoroughly verified' },
              { title: 'Easy Booking', description: 'Simple and secure booking process' },
              { title: '24/7 Support', description: 'Round the clock customer support' }
            ].map((item, index) => (
              <div key={index} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;