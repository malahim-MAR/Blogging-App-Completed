// "use client";
// import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import { Inter } from 'next/font/google';
// import { useParams, useRouter } from "next/navigation";

// const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// const Page = () => {
//   const params = useParams();
//   const router = useRouter();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [readingTime, setReadingTime] = useState(0);
//   const [latestBlogs, setLatestBlogs] = useState([]);
//   const [loadingLatest, setLoadingLatest] = useState(true);

//   const id = params?.id;
//   const blogId = parseInt(id);

//   // Helper function to calculate reading time
//   const calculateReadingTime = (content) => {
//     if (!content) return 0;
//     const wordsPerMinute = 200;
//     const words = content.trim().split(/\s+/).length;
//     return Math.ceil(words / wordsPerMinute);
//   };

//   useEffect(() => {
//     if (!blogId) {
//       setError("Missing blog ID in URL");
//       setLoading(false);
//       return;
//     }

//     const q = query(
//       collection(db, "MyBlogs"),
//       where("BlogId", "==", blogId)
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         if (!snapshot.empty) {
//           const doc = snapshot.docs[0];
//           const blogData = { id: doc.id, ...doc.data() };
//           setBlog(blogData);

//           // Calculate reading time
//           if (blogData?.BlogContent) {
//             const time = calculateReadingTime(blogData.BlogContent);
//             setReadingTime(time);
//           }
//         } else {
//           setError("No blog found with this ID.");
//         }
//         setLoading(false);
//       },
//       (err) => {
//         console.error("Firestore error:", err);
//         setError("Failed to fetch blog. Please try again later.");
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [blogId, router]);

//   // Fetch latest blogs
//   useEffect(() => {
//     if (!blogId) return;

//     const fetchLatestBlogs = async () => {
//       try {
//         const q = query(
//           collection(db, "MyBlogs"),
//           orderBy("BlogPublishTime", "desc"),
//           limit(4) // Fetch 4 to account for current blog exclusion
//         );

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//           const blogs = [];
//           snapshot.forEach((doc) => {
//             const blogData = { id: doc.id, ...doc.data() };
//             // Exclude current blog
//             if (blogData.BlogId !== blogId) {
//               blogs.push(blogData);
//             }
//           });
//           // Get top 3 excluding current blog
//           setLatestBlogs(blogs.slice(0, 3));
//           setLoadingLatest(false);
//         });

//         return () => unsubscribe();
//       } catch (err) {
//         console.error("Error fetching latest blogs:", err);
//         setLoadingLatest(false);
//       }
//     };

//     fetchLatestBlogs();
//   }, [blogId]);

//   const processTags = (tags) => {
//     if (Array.isArray(tags)) return tags;
//     if (typeof tags === 'string') {
//       return tags.split(',').map(tag => tag.trim());
//     }
//     return [];
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: blog?.BlogTitle || "Blog Post",
//         url: window.location.href
//       }).catch(console.error);
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   if (loading) return (
//     <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${inter.className}`}>
//       <div className="text-center">
//         <div className="animate-pulse">
//           <div className="h-64 w-full max-w-3xl bg-gray-200 rounded-lg mb-8 mx-auto"></div>
//           <div className="flex flex-wrap gap-2 justify-center mb-6">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
//             ))}
//           </div>
//           <div className="h-10 w-64 bg-gray-200 rounded-lg mb-6 mx-auto"></div>
//           <div className="space-y-4 max-w-3xl mx-auto">
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${inter.className}`}>
//       <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-red-100">
//         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         </div>
//         <h2 className="text-xl font-bold text-gray-800 mb-2">Blog Not Found</h2>
//         <p className="text-gray-600 mb-6">{error}</p>
//         <button
//           onClick={() => router.push('/Blog')}
//           className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center gap-2 w-full"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           Browse All Blogs
//         </button>
//       </div>
//     </div>
//   );

//   const tags = processTags(blog?.BlogTags || []);
//   const publishDate = blog?.BlogPublishTime?.toDate().toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   return (

//     <div className={`min-h-screen bg-white ${inter.className}`}>
//       {/* Header Section with Cover Image */}
//       <div className="relative w-full h-[60vh] md:h-[100vh]">
//         <button
//           onClick={() => router.back()}
//           className="fixed m-3  px-5 z-100 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition duration-300 flex items-center gap-2"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           Go Back
//         </button>
//         <img
//           src={blog?.BlogImageLink || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070"}
//           alt={blog?.BlogTitle || "Blog cover image"}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070";
//           }}
//         />
//         {/* Glassmorphism Overlay */}
//         <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-8 pb-12 md:pb-16 max-w-6xl mx-auto">
//           <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
//             <div className="flex flex-wrap gap-2 mb-4">
//               {tags.map((tag, index) => (
//                 <span
//                   key={index}
//                   className="px-3 py-1 bg-white text-blue-800 text-sm font-medium rounded-full border border-blue-100 shadow-sm"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>

//             <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
//               {blog?.BlogTitle || "Untitled Blog"}
//             </h1>

//             <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-600">
//               <span className="flex items-center gap-1">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 {publishDate || "Unknown date"}
//               </span>
//               {readingTime > 0 && (
//                 <span className="flex items-center gap-1">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   {readingTime} min read
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="max-w-full mt-1 mx-auto px-4 md:px-8 py-10 md:py-16 -mt-16 relative z-30">
//         <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100">
//           {/* Blog Content */}

//           <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
//             {blog?.BlogTitle || "Untitled Blog"}
//           </h1>
//           <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">

//             <p className="" style={{ fontSize: '1.125rem', lineHeight: '1.95rem', letterSpacing: '0.01em' }}>
//               {blog?.BlogContent || "No content available"}
//             </p>
//           </div>

//           {/* Interaction Buttons */}
//           <div className="mt-12 flex flex-wrap gap-4 border-t border-gray-100 pt-8">
//             <button
//               onClick={() => router.back()}
//               className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition duration-300 flex items-center gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//               </svg>
//               Go Back
//             </button>

//             {/* <button
//               onClick={handleShare}
//               className="px-5 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition duration-300 flex items-center gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
//               </svg>
//               {copied ? "Link Copied!" : "Share Article"}
//             </button> */}

//             {/* <button
//               className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition duration-300 flex items-center gap-2 ml-auto"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
//               </svg>
//               Save for Later
//             </button> */}
//           </div>
//         </div>
//       </div>

//       {/* "Read Next" Section */}
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
//         <div className="flex items-center justify-between mb-8">
//           <h2 className="text-2xl font-bold text-gray-800">Read Next</h2>
//           <button
//             onClick={() => router.push('/')}
//             className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
//           >
//             View all
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {loadingLatest ? (
//             // Loading skeleton
//             [1, 2, 3].map((item) => (
//               <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//                 <div className="h-48 bg-gray-200 animate-pulse"></div>
//                 <div className="p-5">
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     <span className="px-2 py-1 bg-gray-200 rounded-full w-16 h-6 animate-pulse"></span>
//                     <span className="px-2 py-1 bg-gray-200 rounded-full w-16 h-6 animate-pulse"></span>
//                   </div>
//                   <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
//                 </div>
//               </div>
//             ))
//           ) : latestBlogs.length > 0 ? (
//             // Actual blog cards
//             latestBlogs.map((nextBlog) => {
//               const nextTags = processTags(nextBlog.BlogTags || []);
//               const nextPublishDate = nextBlog.BlogPublishTime?.toDate().toLocaleDateString('en-US', {
//                 month: 'short',
//                 day: 'numeric',
//                 year: 'numeric'
//               });
//               const nextReadingTime = calculateReadingTime(nextBlog.BlogContent);

//               return (
//                 <div
//                   key={nextBlog.id}
//                   className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
//                   onClick={() => router.push(`/Blog/${nextBlog.BlogId}`)}
//                 >
//                   <img
//                     src={nextBlog.BlogImageLink || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070"}
//                     alt={nextBlog.BlogTitle || "Blog cover"}
//                     className="h-48 w-full object-cover"
//                     onError={(e) => {
//                       e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070";
//                     }}
//                   />
//                   <div className="p-5">
//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {nextTags.slice(0, 2).map((tag, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                     <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
//                       {nextBlog.BlogTitle || "Untitled Blog"}
//                     </h3>
//                     <p className="text-sm text-gray-500">
//                       {nextPublishDate || "Unknown date"} • {nextReadingTime} min read
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             // No blogs found
//             <div className="col-span-3 text-center py-10">
//               <p className="text-gray-500">No other blogs found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Floating Scroll-to-Top Button */}
//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//         className="fixed bottom-8 right-8 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors duration-200"
//         aria-label="Scroll to top"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
//           <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
//         </svg>
//       </button>
//     </div>
//   );
// };

// export default Page;
import DynamicBlog from '@/app/Components/DynamicBlog'
import Navbar from '@/app/Components/Navbar'
import React from 'react'

const Page = () => {
  return (
    <>
      <Navbar />
      <DynamicBlog />
    </>
  )
}

export default Page