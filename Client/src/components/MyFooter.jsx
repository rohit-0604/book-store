import React from 'react';
import { Facebook, Twitter, Instagram, Github, Dribbble } from 'lucide-react';

const MyFooter = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold text-blue-600">Enhanced Bookstore</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Facebook">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Twitter">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Github">
            <Github className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Dribbble">
            <Dribbble className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="text-center text-gray-400 text-sm py-4 border-t">
        &copy; {new Date().getFullYear()} Enhanced Bookstore. All rights reserved.
      </div>
    </footer>
  );
};

export default MyFooter;
