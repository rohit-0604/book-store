import React from 'react';
import { FaBook, FaUsers, FaShippingFast, FaHeadset } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Our Bookstore
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about connecting readers with their next favorite book. 
            Our curated collection spans across all genres, from timeless classics to contemporary bestsellers.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            To inspire and empower readers by providing access to quality literature, 
            fostering a love for reading, and building a community of book enthusiasts. 
            We believe that every book has the power to transform lives and open new worlds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaBook className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Extensive Collection
            </h3>
            <p className="text-gray-600">
              Thousands of carefully curated books across all genres and categories.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Community Driven
            </h3>
            <p className="text-gray-600">
              Built by readers, for readers. Join our growing community of book lovers.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaShippingFast className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Quick and reliable shipping to get your books to you as soon as possible.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaHeadset className="text-2xl text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Expert Support
            </h3>
            <p className="text-gray-600">
              Our team of book enthusiasts is here to help you find your next read.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              Founded with a simple yet powerful vision, our bookstore began as a small 
              local shop with a big dream: to make quality literature accessible to everyone. 
              What started as a modest collection has grown into a comprehensive online platform 
              serving readers worldwide.
            </p>
            <p>
              Today, we continue to uphold our founding principles while embracing modern 
              technology to enhance the reading experience. Our team of passionate bibliophiles 
              works tirelessly to curate collections that inspire, educate, and entertain.
            </p>
            <p>
              We believe that books have the unique ability to transport us to different worlds, 
              expand our horizons, and connect us with others across time and space. 
              That's why we're committed to being more than just a bookstore – we're a gateway 
              to endless possibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
