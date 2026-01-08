"use client";
import React from "react";
import { Inter } from 'next/font/google';
import Link from "next/link";

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const BlogCard = ({ blogs, loading, error }) => {
  // Helper function to process tags
  const processTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim());
    }
    return [];
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 ${inter.className}`}>
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-gray-600 text-lg mt-6 font-medium">Loading amazing content...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 ${inter.className}`}>
      <div className="bg-white p-8 rounded-2xl border border-red-100 max-w-md text-center shadow-xl">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    </div>
  );

  if (blogs.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 ${inter.className}`}>
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">No Stories Yet</h2>
          <p className="text-gray-500 text-lg mb-8">Be the first to share something amazing with the world!</p>
          <button
            onClick={() => window.location.href = '/create-blog'}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
          >
            Start Writing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`snap-container ${inter.className}`}>
      {blogs.map((blog, index) => {
        const tags = processTags(blog.BlogTags);
        const readingTime = calculateReadingTime(blog.BlogContent);
        const publishDate = blog.BlogPublishTime?.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        return (
          <section
            key={blog.id}
            className="h-screen w-full snap-start snap-always flex flex-col lg:flex-row bg-white relative overflow-hidden"
          >
            {/* Image Section - Better responsive handling */}
            <div className="w-full lg:w-1/2 xl:w-[55%] h-[35vh] sm:h-[40vh] lg:h-full relative">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>

              {/* Image */}
              <img
                src={blog.BlogImageLink || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                alt={blog.BlogTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop";
                }}
              />

              {/* Mobile Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 lg:hidden">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-2 mb-2">
                  {blog.BlogTitle}
                </h2>
              </div>

              {/* Scroll Indicator (First blog only) */}
              {index === 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center animate-bounce">
                  <span className="text-white/80 text-sm mb-2">Scroll to explore</span>
                  <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content Section - Enhanced for desktop */}
            <div className="w-full lg:w-1/2 xl:w-[45%] flex-1 lg:h-full flex items-start lg:items-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 bg-gradient-to-br from-white to-slate-50 overflow-y-auto">
              <div className="max-w-xl w-full mx-auto">
                {/* Tags - Desktop only */}
                <div className="hidden lg:flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-500 text-sm mb-4 lg:mb-6">
                  {blog?.AuthorName && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                        {blog.AuthorName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">{blog.AuthorName}</span>
                    </div>
                  )}
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <time className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {publishDate}
                  </time>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {readingTime} min read
                  </span>
                </div>

                {/* Title - Desktop only (hidden on mobile as it's in overlay) */}
                <h1 className="hidden lg:block text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  {blog.BlogTitle}
                </h1>

                {/* Content Preview */}
                <div className="prose prose-lg max-w-none text-gray-600 mb-6 lg:mb-8">
                  <p className="text-base sm:text-lg leading-relaxed line-clamp-4 lg:line-clamp-6">
                    {blog.BlogContent}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href={`/Blog/${blog.BlogId}`} className="flex-1">
                    <button className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 group">
                      Read Full Article
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: blog.BlogTitle, url: `/Blog/${blog.BlogId}` });
                      } else {
                        navigator.clipboard.writeText(window.location.origin + `/Blog/${blog.BlogId}`);
                        alert('Link copied!');
                      }
                    }}
                    className="px-6 py-3 sm:py-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Comments count if available */}
                {blog?.comments?.length > 0 && (
                  <div className="mt-4 lg:mt-6 flex items-center gap-2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{blog.comments.length} {blog.comments.length === 1 ? 'comment' : 'comments'}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default BlogCard;