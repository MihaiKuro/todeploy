import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useEffect } from "react";
import { useCategoryStore } from "../stores/useCategoryStore";

const Footer = () => {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <footer className="bg-[#0B0F17] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* AutoParts Column */}
          <div>
            <h3 className="mb-4">
              <span className="text-[#FF3B30] text-xl font-bold">Auto</span>
              <span className="text-[#367BF5] text-xl font-bold">Parts</span>
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted source for quality auto parts and professional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories Column */}
          <div>
            <h3 className="text-white font-medium mb-4">Product Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category._id}>
                  <Link 
                    to={`/category/${category.slug}`} 
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/categories" 
                  className="text-[#2B4EE6] hover:text-blue-400 transition-colors"
                >
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h3 className="text-white font-medium mb-4">Contact Information</h3>
            <ul className="space-y-2 text-gray-400">
              <li>123 Auto Center Drive</li>
              <li>Anytown, ST 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@autoparts.example</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-[#1A1F2B]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2025 AutoParts. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-gray-500 hover:text-gray-300 transition-colors">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 