import React from 'react';
import { BookOpen, Users, Award, Heart, Star, Globe, Shield, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="mt-28 px-4 lg:px-24 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          About Enhanced Bookstore
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're passionate about connecting readers with their next favorite book. 
          Our platform brings together authors, publishers, and book lovers in a seamless digital experience.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            To democratize access to knowledge and literature by providing a comprehensive 
            platform where readers can discover, purchase, and engage with books from around the world.
          </p>
          <p className="text-lg text-gray-600">
            We believe that every book has the power to transform lives, and we're committed 
            to making that transformation accessible to everyone.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
          <BookOpen className="h-24 w-24 text-blue-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Knowledge for Everyone
          </h3>
          <p className="text-center text-gray-600">
            From classic literature to contemporary bestsellers, we curate a diverse 
            collection that caters to every reader's interests and needs.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Enhanced Bookstore?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Join a vibrant community of readers, authors, and book enthusiasts.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-gray-600">
              Every book is carefully selected and reviewed for quality and relevance.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
            <p className="text-gray-600">
              Access books from international authors and publishers worldwide.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Shopping</h3>
            <p className="text-gray-600">
              Your privacy and security are our top priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-16">
        <div className="grid md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-blue-100">Books Available</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-blue-100">Happy Readers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100+</div>
            <div className="text-blue-100">Authors</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-blue-100">Support</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Story
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How It All Started</h3>
            <p className="text-gray-600 mb-6">
              Enhanced Bookstore was born from a simple idea: making great books accessible to everyone. 
              What started as a small local bookstore has grown into a comprehensive digital platform 
              that serves readers worldwide.
            </p>
            <p className="text-gray-600">
              Our journey has been driven by our passion for literature and our commitment to 
              fostering a love of reading in communities everywhere.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Passion for Books</h4>
                <p className="text-gray-600">
                  Every member of our team shares a deep love for literature and storytelling.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Excellence in Service</h4>
                <p className="text-gray-600">
                  We're committed to providing the best possible experience for our customers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Innovation</h4>
                <p className="text-gray-600">
                  We continuously innovate to bring you the best reading experience possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Start Your Reading Journey?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of readers who have discovered their next favorite book with us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Explore Books
          </button>
          <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
