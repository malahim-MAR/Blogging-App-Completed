"use client";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { FiSun, FiMoon, FiExternalLink, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const BlogPage = () => {
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState("light");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const notesQuery = query(
            collection(db, "MyBlogs"),
            orderBy("BlogPublishTime", "desc")
        );

        const unsubscribe = onSnapshot(
            notesQuery,
            (snapshot) => {
                const notes = [];
                snapshot.forEach((doc) => {
                    notes.push({ id: doc.id, ...doc.data() });
                });
                setBlogData(notes);
                setLoading(false);
            },
            (error) => {
                console.error("Firestore error:", error);
                setError("Failed to load blog posts");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    // Apply theme class to body
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const handleDelete = async (blogId) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this blog post?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        setDeletingId(blogId);
                        try {
                            await deleteDoc(doc(db, "MyBlogs", blogId));
                        } catch (error) {
                            console.error("Delete error:", error);
                            setError("Failed to delete blog post");
                        } finally {
                            setDeletingId(null);
                        }
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };
    const handleEdit = (blogId) => {
        console.log("Edit blog with ID:", blogId);
    }
    // Helper function to process tags
    const processTags = (tags) => {
        if (Array.isArray(tags)) return tags;
        if (typeof tags === 'string') {
            return tags.split(',').map(tag => tag.trim());
        }
        return [];
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading blogs...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-red-500 text-xl">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 max-w-md text-center">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {error}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-8">
                    <Link href={'/'} className="px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Website
                    </Link>

                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </button>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Blog Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Manage all your blog posts in one place
                        </p>
                    </div>
                    <Link href="/NewBlog" className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                        <FiPlus size={18} />
                        Create New Post
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
                        <div className="text-3xl font-bold">{blogData.length}</div>
                        <div className="text-blue-600 dark:text-blue-400">Total Posts</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-5 border border-green-100 dark:border-green-800">
                        <div className="text-3xl font-bold">
                            {blogData.filter(post => processTags(post.BlogTags).length > 0).length}
                        </div>
                        <div className="text-green-600 dark:text-green-400">Tagged Posts</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-5 border border-yellow-100 dark:border-yellow-800">
                        <div className="text-3xl font-bold">
                            {blogData.filter(post => post.BlogImageLink).length}
                        </div>
                        <div className="text-yellow-600 dark:text-yellow-400">With Images</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
                        <div className="text-3xl font-bold">
                            {new Set(blogData.flatMap(post => processTags(post.BlogTags))).size}
                        </div>
                        <div className="text-purple-600 dark:text-purple-400">Unique Tags</div>
                    </div>
                </div>

                {/* Blog Grid */}
                {blogData.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
                        <svg className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        <h2 className="text-2xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                            No blog posts yet
                        </h2>
                        <p className="text-gray-400 dark:text-gray-500 mb-6 text-center">
                            Create your first blog post to get started
                        </p>
                        <Link href="/create-blog" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                            <FiPlus size={18} />
                            Create First Post
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogData.map((blog) => {
                            const tags = processTags(blog.BlogTags);

                            return (
                                <div
                                    key={blog.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 relative"
                                >
                                    {deletingId === blog.id && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                        </div>
                                    )}

                                    <div className="relative h-auto">
                                        <img
                                            src={blog.BlogImageLink || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"}
                                            alt={blog.BlogTitle}
                                            className="w-full h-100 object-cover"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop";
                                            }}
                                        />
                                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                                            {tags.slice(0, 3).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-600 text-xs text-white rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {tags.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-800/80 text-xs text-white rounded-full">
                                                    +{tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>
                                                {blog.BlogPublishTime?.toDate().toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold mb-3 line-clamp-2 h-14">
                                            {blog.BlogTitle}
                                        </h2>

                                        <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 h-20">
                                            {blog.BlogContent}
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/blog/${blog.id}`}
                                                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <FiExternalLink size={16} />
                                                    <span>View</span>
                                                </Link>
                                                <Link
                                                    onClick={() => handleEdit(blog.id)}
                                                    href={`/EditBlog/${blog.id}`}
                                                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <FiEdit size={16} />
                                                    <span>Edit</span>
                                                </Link>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                disabled={deletingId === blog.id}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;