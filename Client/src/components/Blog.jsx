import React from 'react';
import { FaCalendar, FaUser, FaArrowRight } from 'react-icons/fa';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Rise of Digital Reading: Embracing Technology in Literature",
      excerpt: "Explore how digital platforms are transforming the way we consume literature and what this means for traditional bookstores.",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Must-Read Classics: Timeless Books That Shaped Literature",
      excerpt: "Discover the essential classics that every reader should experience at least once in their lifetime.",
      author: "Michael Chen",
      date: "March 10, 2024",
      category: "Classics",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Building Your Personal Library: Tips for Book Collectors",
      excerpt: "Learn how to curate a meaningful personal library that reflects your interests and grows with you over time.",
      author: "Emma Rodriguez",
      date: "March 5, 2024",
      category: "Collecting",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "The Art of Reading: Developing Better Reading Habits",
      excerpt: "Practical strategies to improve your reading speed, comprehension, and overall reading experience.",
      author: "David Thompson",
      date: "February 28, 2024",
      category: "Self-Improvement",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Children's Literature: Nurturing the Next Generation of Readers",
      excerpt: "How to choose the right books for children and foster a lifelong love of reading from an early age.",
      author: "Lisa Park",
      date: "February 20, 2024",
      category: "Children's Books",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "The Future of Independent Bookstores in the Digital Age",
      excerpt: "How independent bookstores are adapting to compete with online retailers and maintain their unique value.",
      author: "Robert Wilson",
      date: "February 15, 2024",
      category: "Industry",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bookstore Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insights, recommendations, and stories from the world of books and reading.
          </p>
        </div>

        {/* Featured Post */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={blogPosts[0].image} 
                alt={blogPosts[0].title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  {blogPosts[0].category}
                </span>
                <span className="mx-2">•</span>
                <FaCalendar className="mr-1" />
                {blogPosts[0].date}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {blogPosts[0].title}
              </h2>
              <p className="text-gray-600 mb-4">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <FaUser className="mr-1" />
                  {blogPosts[0].author}
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Read More
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="mx-2">•</span>
                  <FaCalendar className="mr-1" />
                  {post.date}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUser className="mr-1" />
                    {post.author}
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Read More
                    <FaArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-blue-600 rounded-lg p-8 mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest book recommendations, author interviews, and reading tips.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
