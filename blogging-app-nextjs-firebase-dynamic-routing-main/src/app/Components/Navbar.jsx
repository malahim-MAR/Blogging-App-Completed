'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiSearch, FiUser, FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('nav')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
    setSearchTerm("");
    setSearchOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Politics", path: "/PoliticalBlogs" },
    { name: "Travel & Tour", path: "/TravelBlogs" },
    { name: "Sports", path: "/SportsBlogs" },
    { name: "Technology & AI", path: "/TechBlogs" },
    { name: "Business & Corporates", path: "/BuisnessBlogs" },
    { name: "Lifestyle & Daily", path: "/LifestyleBlogs" },
    { name: "Health & Care", path: "/HealthBlogs" },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
            : "bg-white/80 backdrop-blur-sm py-3 sm:py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-lg sm:text-xl px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-md">
                BlogHub
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">
                Insights
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-lg hover:bg-blue-50 text-sm whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              {/* Profile */}
              <Link
                href="/profile"
                className="hidden sm:flex p-2 sm:p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                aria-label="Profile"
              >
                <FiUser className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar - Shows below nav */}
          <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20 mt-4' : 'max-h-0'}`}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles, topics, or authors..."
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
                autoFocus={searchOpen}
              />
              <FiSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 font-medium transition-all rounded-xl text-sm sm:text-base text-center"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Profile Link */}
            <div className="mt-4 pt-4 border-t border-gray-100 sm:hidden">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
              >
                <FiUser className="w-5 h-5" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className={`${scrolled ? 'h-14' : 'h-16 sm:h-18'}`}></div>
    </>
  );
};

export default Navbar;