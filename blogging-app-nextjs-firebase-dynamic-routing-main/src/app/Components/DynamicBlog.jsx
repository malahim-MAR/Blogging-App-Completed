"use client";
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc, arrayUnion } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { Inter } from 'next/font/google';
import { useParams, useRouter } from "next/navigation";

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const DynamicBlog = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  // Simplified Comment form state - just title and message
  const [commentTitle, setCommentTitle] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState("");

  const id = params?.id;
  const blogId = parseInt(id);

  // Helper function to calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  useEffect(() => {
    if (!blogId) {
      setError("Missing blog ID in URL");
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "MyBlogs"),
      where("BlogId", "==", blogId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          const blogData = { id: docData.id, ...docData.data() };
          setBlog(blogData);

          // Calculate reading time
          if (blogData?.BlogContent) {
            const time = calculateReadingTime(blogData.BlogContent);
            setReadingTime(time);
          }
        } else {
          setError("No blog found with this ID.");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to fetch blog. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [blogId, router]);

  // Fetch latest blogs
  useEffect(() => {
    if (!blogId) return;

    const fetchLatestBlogs = async () => {
      try {
        const q = query(
          collection(db, "MyBlogs"),
          orderBy("BlogPublishTime", "desc"),
          limit(4)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const blogs = [];
          snapshot.forEach((doc) => {
            const blogData = { id: doc.id, ...doc.data() };
            if (blogData.BlogId !== blogId) {
              blogs.push(blogData);
            }
          });
          setLatestBlogs(blogs.slice(0, 3));
          setLoadingLatest(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching latest blogs:", err);
        setLoadingLatest(false);
      }
    };

    fetchLatestBlogs();
  }, [blogId]);

  const processTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim());
    }
    return [];
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.BlogTitle || "Blog Post",
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle simplified comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess(false);

    if (!commentTitle.trim() || !commentText.trim()) {
      setCommentError("Please fill in all fields");
      return;
    }

    setSubmittingComment(true);

    try {
      const blogRef = doc(db, "MyBlogs", blog.id);
      const newComment = {
        id: Date.now().toString(),
        title: commentTitle.trim(),
        message: commentText.trim(),
        createdAt: new Date().toISOString(),
      };

      await updateDoc(blogRef, {
        comments: arrayUnion(newComment)
      });

      // Clear form
      setCommentTitle("");
      setCommentText("");
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding comment:", err);
      setCommentError("Failed to submit. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
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
        <p className="text-gray-600 text-lg mt-6 font-medium">Loading article...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 p-4 ${inter.className}`}>
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Article Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  );

  const tags = processTags(blog?.BlogTags || []);
  const publishDate = blog?.BlogPublishTime?.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const comments = blog?.comments || [];

  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      {/* Hero Section with Cover Image */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[80vh]">
        <img
          src={blog?.BlogImageLink || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070"}
          alt={blog?.BlogTitle || "Blog cover image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070";
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="max-w-5xl mx-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              {blog?.BlogTitle || "Untitled Blog"}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90 text-sm sm:text-base">
              {/* Author */}
              {blog?.AuthorName && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base sm:text-lg font-bold ring-2 ring-white/30">
                    {blog.AuthorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{blog.AuthorName}</p>
                    <p className="text-white/70 text-xs sm:text-sm">Author</p>
                  </div>
                </div>
              )}
              <span className="hidden sm:inline text-white/40">|</span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {publishDate || "Unknown date"}
              </span>
              <span className="hidden sm:inline text-white/40">|</span>
              {readingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime} min read
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 lg:py-16">
        {/* Blog Content */}
        <article className="prose prose-lg lg:prose-xl max-w-none">
          <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-loose whitespace-pre-line">
            {blog?.BlogContent || "No content available"}
          </p>
        </article>

        {/* Author Card */}
        {blog?.AuthorName && (
          <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                {blog.AuthorName.charAt(0).toUpperCase()}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 mb-1">Written by</p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{blog.AuthorName}</h3>
                {blog?.AuthorEmail && (
                  <p className="text-gray-500 mt-1">{blog.AuthorEmail}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Back
          </button>

          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            {copied ? "Link Copied!" : "Share Article"}
          </button>
        </div>
      </div>

      {/* Comments Section - Table Layout */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

          {/* Section 1: Discussion Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <h2 className="text-xl font-bold text-white">Discussion</h2>
              </div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>

            <div className="overflow-x-auto">
              {comments.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No comments yet</p>
                  <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 w-16 text-center">User</th>
                      <th className="px-6 py-4">Comment</th>
                      <th className="px-6 py-4 w-40">Date</th>
                      <th className="px-6 py-4 w-24 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => (
                      <tr key={comment.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 align-top text-center w-16">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm mx-auto">
                            {(comment.title || "U").charAt(0).toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <h4 className="font-bold text-gray-900 mb-1">{comment.title}</h4>
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{comment.message || comment.text}</p>
                        </td>
                        <td className="px-6 py-5 align-top whitespace-nowrap">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-5 align-top text-center">
                          <button
                            onClick={() => {
                              document.getElementById('reply-form').scrollIntoView({ behavior: 'smooth' });
                              setCommentTitle(`Re: ${comment.title}`);
                              const msgInput = document.getElementById('comment-title-input');
                              if (msgInput) msgInput.focus();
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Reply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Section 2: Reply Form */}
          <div id="reply-form" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Leave a Reply
              </h3>
            </div>

            <form onSubmit={handleCommentSubmit} className="p-6 sm:p-8">
              <div className="space-y-4 sm:space-y-5">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    id="comment-title-input"
                    type="text"
                    value={commentTitle}
                    onChange={(e) => setCommentTitle(e.target.value)}
                    placeholder="Give your comment a title..."
                    maxLength={100}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 shadow-sm"
                    required
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your comment here..."
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-800 placeholder-gray-400 shadow-sm"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{commentText.length}/1000</p>
                </div>
              </div>

              {/* Error/Success Messages */}
              {commentError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {commentError}
                </div>
              )}

              {commentSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your comment has been posted successfully!
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingComment}
                className={`w-full sm:w-auto px-8 mt-6 py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${submittingComment
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  }`}
              >
                {submittingComment ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Comment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Read Next Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Read Next</h2>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm sm:text-base"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingLatest ? (
            [1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-200 rounded-full w-16 h-6 animate-pulse"></span>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : latestBlogs.length > 0 ? (
            latestBlogs.map((nextBlog) => {
              const nextTags = processTags(nextBlog.BlogTags || []);
              const nextPublishDate = nextBlog.BlogPublishTime?.toDate().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const nextReadingTime = calculateReadingTime(nextBlog.BlogContent);

              return (
                <div
                  key={nextBlog.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/Blog/${nextBlog.BlogId}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={nextBlog.BlogImageLink || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070"}
                      alt={nextBlog.BlogTitle || "Blog cover"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {nextTags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {nextBlog.BlogTitle || "Untitled Blog"}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {nextBlog?.AuthorName && (
                        <>
                          <span className="font-medium text-gray-700">{nextBlog.AuthorName}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{nextPublishDate}</span>
                      <span>•</span>
                      <span>{nextReadingTime} min</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No other articles found</p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center z-50"
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default DynamicBlog;