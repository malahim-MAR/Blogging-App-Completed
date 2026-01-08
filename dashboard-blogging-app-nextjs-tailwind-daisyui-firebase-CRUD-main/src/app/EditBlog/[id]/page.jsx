"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const Page = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    imageLink: "",
    tags: "", // Changed to string
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Available tags for selection
  const availableTags = [
    "Politics", "Sports", "Technology & AI", "Business", "Lifestyle", "Travel", "Health"
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "MyBlogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlogData({
            title: data.BlogTitle || "",
            content: data.BlogContent || "",
            imageLink: data.BlogImageLink || "",
            // Handle both array and string formats
            tags: Array.isArray(data.BlogTags)
              ? data.BlogTags[0] || "" // Take first element if array
              : data.BlogTags || "",
          });
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        console.error("Error fetching document: ", err);
        setError("Failed to load blog data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!blogData.title.trim()) {
      setError("Blog title is required");
      return;
    }

    if (!blogData.content.trim()) {
      setError("Blog content is required");
      return;
    }

    // Updated validation for single tag
    if (!blogData.tags) {
      setError("Please select a tag");
      return;
    }

    try {
      const docRef = doc(db, "MyBlogs", id);
      await updateDoc(docRef, {
        BlogTitle: blogData.title,
        BlogContent: blogData.content,
        BlogImageLink: blogData.imageLink,
        BlogTags: blogData.tags, // Save as string
        BlogPublishTime: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating document: ", err);
      setError("Failed to update blog post");
    }
  };

  const selectTag = (tag) => {
    // Toggle selection: select if not selected, deselect if same tag clicked
    setBlogData(prev => ({
      ...prev,
      tags: prev.tags === tag ? "" : tag
    }));
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/AllBlogs"
            className="flex items-center gap-2 group text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Editing Blog Post
          </h1>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 md:p-8 shadow-xl">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Success message */}
              {success && (
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Blog updated successfully!
                </div>
              )}

              {/* Blog ID */}
              <div className="flex items-center text-sm text-gray-400">
                <span className="bg-gray-700 px-3 py-1 rounded-full">Blog ID: {id}</span>
              </div>

              {/* Title Input */}
              <div className="space-y-3">
                <label className="block text-lg font-medium text-gray-300">
                  Blog Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
                  value={blogData.title}
                  onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                  placeholder="Enter a compelling blog title..."
                />
              </div>

              {/* Image Input */}
              <div className="space-y-3">
                <label className="block text-lg font-medium text-gray-300">
                  Featured Image URL
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
                    value={blogData.imageLink}
                    onChange={(e) => setBlogData({ ...blogData, imageLink: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  {blogData.imageLink && (
                    <div className="aspect-video w-full md:w-64 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                      <img
                        src={blogData.imageLink}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Section - Updated with selected category display */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-lg font-medium text-gray-300">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {blogData.tags ? "1 selected" : "0 selected"}
                  </span>
                </div>

                {/* Show selected category */}
                {blogData.tags && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-1">Selected Category:</p>
                    <div className="inline-flex items-center bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-lg">
                      {blogData.tags}
                      <button
                        type="button"
                        className="ml-2 text-indigo-400 hover:text-white"
                        onClick={() => setBlogData(prev => ({ ...prev, tags: "" }))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${blogData.tags === tag
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      onClick={() => selectTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Textarea */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-lg font-medium text-gray-300">
                    Blog Content <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-sm ${blogData.content.length < 300 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                    {blogData.content.length} characters
                  </span>
                </div>
                <textarea
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-200 placeholder-gray-500 h-64"
                  value={blogData.content}
                  onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                  placeholder="Write your blog content here..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium text-lg transition-all shadow-lg ${loading
                      ? 'bg-indigo-800 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
                    }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Update Blog Post
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;