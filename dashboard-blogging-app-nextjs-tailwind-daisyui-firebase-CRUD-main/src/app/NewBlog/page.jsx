"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../lib/firebase";
import { Inter } from 'next/font/google';
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const Page = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [imageLink, setImageLink] = useState("");
    const [selectedTag, setSelectedTag] = useState(""); // Changed to string instead of array
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const availableTags = ["Politics", "Sports", "Technology & AI", "Business", "Lifestyle", "Travel", "Health"];

    const handleTagSelection = (tag) => {
        if (selectedTag === tag) {
            // Deselect if same tag is clicked again
            setSelectedTag("");
        } else {
            // Select new tag
            setSelectedTag(tag);
        }
    };

    // Get author name from user's displayName or email
    const getAuthorName = () => {
        if (user?.displayName) {
            return user.displayName;
        }
        if (user?.email) {
            // Extract name from email (e.g., "malahim@admin.com" -> "Malahim")
            const emailName = user.email.split('@')[0];
            return emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }
        return "Anonymous";
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!title.trim() || !selectedTag || !content.trim()) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "MyBlogs"), {
                BlogId: Math.floor(Math.random() * 1000000) + 1,
                BlogTitle: title,
                BlogImageLink: imageLink,
                BlogTags: selectedTag, // Now storing a single string
                BlogContent: content,
                BlogPublishTime: serverTimestamp(),
                // Author information
                AuthorName: getAuthorName(),
                AuthorEmail: user?.email || "anonymous@blog.com",
                AuthorId: user?.uid || null,
                // Initialize comments array
                comments: []
            });
            setTitle("");
            setImageLink("");
            setSelectedTag("");
            setContent("");
            setError(""); // Clear any previous errors
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Failed to publish blog. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 ${inter.className}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header with back button and title */}
                <div className="flex items-center justify-between mb-10">
                    <Link href={'/'} className="flex items-center gap-2 group">
                        <div className="bg-indigo-900 group-hover:bg-indigo-800 p-2 rounded-lg transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-indigo-300 group-hover:text-indigo-200 transition-colors">Back to Website</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Create New Blog Post
                    </h1>
                </div>

                {/* Main card */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                    {/* Card header */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-3 h-8 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-200">Blog Details</h2>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">Fill in the details below to create your new blog post</p>
                    </div>

                    {/* Form content */}
                    <div className="p-6 sm:p-8">
                        {/* Author Info Banner */}
                        <div className="bg-indigo-900/30 border border-indigo-700 text-indigo-300 p-4 rounded-lg mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {getAuthorName().charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm text-indigo-400">Publishing as</p>
                                <p className="font-semibold text-white">{getAuthorName()}</p>
                            </div>
                        </div>

                        {success && (
                            <div className="bg-green-900/30 border border-green-700 text-green-300 p-4 rounded-lg mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Blog published successfully!
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePublish} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-base font-medium text-gray-300">
                                    Blog Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter a compelling blog title..."
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-base font-medium text-gray-300">
                                    Featured Image URL
                                </label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-200 placeholder-gray-500"
                                        value={imageLink}
                                        onChange={(e) => setImageLink(e.target.value)}
                                    />
                                    {imageLink && (
                                        <div className="aspect-video h-24 rounded-lg overflow-hidden border border-gray-700">
                                            <img
                                                src={imageLink}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-base font-medium text-gray-300">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTag === tag
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                            onClick={() => handleTagSelection(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>

                                {/* Show selected tag */}
                                {selectedTag && (
                                    <div className="mt-3">
                                        <p className="text-gray-400 text-sm mb-1">Selected Category:</p>
                                        <div className="inline-flex items-center bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-lg">
                                            {selectedTag}
                                            <button
                                                type="button"
                                                className="ml-2 text-indigo-400 hover:text-white"
                                                onClick={() => setSelectedTag("")}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="block text-base font-medium text-gray-300">
                                        Blog Content <span className="text-red-400">*</span>
                                    </label>
                                    <span className={`text-xs ${content.length < 300 ? 'text-amber-400' : 'text-green-400'}`}>
                                        {content.length} characters
                                    </span>
                                </div>
                                <textarea
                                    placeholder="Write your blog content here..."
                                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-200 placeholder-gray-500 h-64"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span>Changes will be saved automatically</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`py-3 px-8 rounded-lg font-medium text-white transition-all shadow-lg ${loading
                                        ? 'bg-indigo-800 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Publishing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Publish Post
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;