import React from "react";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiMail, FiPhone, FiMapPin, FiGithub } from "react-icons/fi";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "Politics", path: "/category/politics" },
    { name: "Sports", path: "/category/sports" },
    { name: "Technology", path: "/category/technology" },
    { name: "Lifestyle", path: "/category/lifestyle" },
    { name: "Entertainment", path: "/category/entertainment" },
  ];

  const usefulLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Write for Us", path: "/contribute" },
  ];

  const socialLinks = [
    { icon: <FiFacebook size={20} />, url: "#", label: "Facebook" },
    { icon: <FiTwitter size={20} />, url: "#", label: "Twitter" },
    { icon: <FiInstagram size={20} />, url: "#", label: "Instagram" },
    { icon: <FiLinkedin size={20} />, url: "#", label: "LinkedIn" },
    { icon: <FiYoutube size={20} />, url: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 pt-16 pb-8 border-t mt-10 border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xl p-2 rounded-lg mr-2">
                BH
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                BlogHub
              </span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Bringing you the latest insights on technology, design, and business.
              We publish fresh content daily to keep you informed and inspired.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="bg-white hover:bg-blue-100 border border-gray-300 transition-all p-3 rounded-full shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-300">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.path}
                    className="text-gray-600 hover:text-indigo-700 transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-300">Quick Links</h3>
            <ul className="space-y-3">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-gray-600 hover:text-indigo-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-300">Stay Updated</h3>

            <div className="mb-6 space-y-4">
              <div className="flex items-start">
                <FiMail className="text-blue-600 mt-1 mr-3" size={20} />
                <span className="text-gray-600">contact@bloghub.com</span>
              </div>
              <div className="flex items-start">
                <FiPhone className="text-blue-600 mt-1 mr-3" size={20} />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <FiMapPin className="text-blue-600 mt-1 mr-3" size={20} />
                <span className="text-gray-600">New York, NY 10001, USA</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Subscribe to Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 w-full rounded-l-lg focus:outline-none text-gray-800 border border-gray-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-4 py-3 rounded-r-lg font-medium text-white transition-all"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Developer Credits */}
        <div className="border-t border-gray-300 pt-8 pb-6 text-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-600 mb-4">
              Developed by <span className="font-semibold text-indigo-700">Sardar MalaHim</span>
            </p>
            <div className="flex space-x-4 justify-center">
              <a 
                href="https://instagram.com/malahim.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white hover:bg-pink-50 border border-gray-300 transition-all p-3 rounded-full shadow-sm flex items-center"
                aria-label="Instagram"
              >
                <FiInstagram className="text-pink-600" size={18} />
              </a>
              <a 
                href="https://github.com/Malahim-MAR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-100 border border-gray-300 transition-all p-3 rounded-full shadow-sm flex items-center"
                aria-label="GitHub"
              >
                <FiGithub className="text-gray-800" size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-gray-600">
            © {currentYear} BlogHub. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Designed and built with ❤️ for content creators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;