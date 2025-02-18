import { useThemeStore } from '../store';
import { FaHandshake, FaPray, FaUtensils, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { theme } = useThemeStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  const features = [
    {
      icon: <FaHandshake className="text-4xl text-blue-500" />,
      title: "Cultural Harmony",
      description: "We bring together tenants and landlords who share similar cultural values and lifestyle preferences."
    },
    {
      icon: <FaUtensils className="text-4xl text-green-500" />,
      title: "Dietary Preferences",
      description: "Find homes that respect your food choices - whether you're vegetarian, non-vegetarian, or flexible."
    },
    {
      icon: <FaPray className="text-4xl text-purple-500" />,
      title: "Religious Respect",
      description: "Connect with properties that honor your religious practices and spiritual needs."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-red-500" />,
      title: "Verified Listings",
      description: "Every property is thoroughly verified to ensure a safe and trustworthy rental experience."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Tenant",
      content: "Found the perfect vegetarian-friendly apartment near our temple. The cultural compatibility made the transition so smooth.",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Fatima Ahmed",
      role: "Property Owner",
      content: "This platform helps me find tenants who respect and understand our cultural preferences. It's been a blessing!",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      name: "Sarah Thomas",
      role: "Tenant",
      content: "As a Christian family, we found a wonderful home near our church. The community here truly understands our needs.",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Finding Your Home, <span className="text-blue-500">Respecting Your Values</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            We're more than just a rental platform. We're building bridges between cultures, creating harmonious living spaces where your values are respected and celebrated.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                } transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              To create a rental ecosystem where cultural values, religious beliefs, and dietary preferences are not just accommodated, but celebrated. We're committed to making your house-hunting journey culturally sensitive and personally fulfilling.
            </p>
          </div>
        </div>
      </div>

      {/* Updated Testimonials Section with Carousel */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="relative max-w-3xl mx-auto">
            {/* Carousel Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>

            {/* Carousel Slides */}
            <div className="overflow-hidden relative">
              <div 
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div className="flex">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={index}
                      className="w-full flex-shrink-0"
                    >
                      <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg mx-4`}>
                        <div className="flex items-center mb-6">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                          />
                          <div>
                            <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide 
                      ? 'bg-blue-500' 
                      : theme === 'dark' 
                        ? 'bg-gray-600 hover:bg-gray-500' 
                        : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Join our community of culturally conscious renters and property owners.
          </p>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors cusror-pointer" onClick={() => navigate('/')}>
            Start Your Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
