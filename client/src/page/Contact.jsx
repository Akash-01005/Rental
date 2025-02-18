import { useState } from 'react';
import { useThemeStore } from '../store';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaCheckCircle } from 'react-icons/fa';

const Contact = () => {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-blue-500" />,
      title: "Phone",
      details: [
        "+91 98765 43210",
        "+91 98765 43211"
      ]
    },
    {
      icon: <FaEnvelope className="text-2xl text-green-500" />,
      title: "Email",
      details: [
        "support@rentalharmony.com",
        "info@rentalharmony.com"
      ]
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-red-500" />,
      title: "Office Address",
      details: [
        "No.12, Thiruppathi Street,",
        "Ambasamudram, Tirunelveli - 627401"
      ]
    },
    {
      icon: <FaClock className="text-2xl text-purple-500" />,
      title: "Business Hours",
      details: [
        "Mon - Sat: 9:00 AM - 7:00 PM",
        "Sunday: 10:00 AM - 2:00 PM"
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch with <span className="text-blue-500">Rental Harmony</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Have questions about finding your culturally compatible home? We&apos;re here to help!
          </p>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                } shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-center mb-4">
                  {info.icon}
                  <h3 className="text-xl font-semibold ml-3">{info.title}</h3>
                </div>
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="mb-1">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className="text-3xl font-bold mb-6 text-center">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className={`w-full p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none`}
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  {submitted ? (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* WhatsApp Support */}
      <div className="fixed bottom-8 right-8">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
        >
          <FaWhatsapp className="text-3xl" />
        </a>
      </div>
    </div>
  );
};

export default Contact;