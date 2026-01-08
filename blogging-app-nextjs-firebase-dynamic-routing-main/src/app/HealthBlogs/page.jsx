"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import BlogCard from "../Components/BlogCard";
import Navbar from "../Components/Navbar";

const Page = () => {
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const notesQuery = query(
            collection(db, "MyBlogs"),
            orderBy("BlogPublishTime", "desc")
        );

        const unsubscribe = onSnapshot(
            notesQuery,
            (snapshot) => {
                const notes = [];
                if (!snapshot.empty) {
                    snapshot.forEach((doc) => {
                        notes.push({ id: doc.id, ...doc.data() });
                    });
                }
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

    // Filter blogs with "Health" tag
    const filterHealthBlogs = () => {
        return blogData.filter(blog => {
            if (!blog.BlogTags) return false;

            // Handle both string and array formats
            const tags = typeof blog.BlogTags === 'string'
                ? [blog.BlogTags]  // Convert single string to array
                : Array.isArray(blog.BlogTags)
                    ? blog.BlogTags
                    : [];

            // Case-insensitive matching
            return tags.some(tag =>
                tag.trim().toLowerCase() === "health"
            );
        });
    };

    const healthBlogs = filterHealthBlogs();

    return (
        <div>
            <Navbar />
            <BlogCard
                blogs={healthBlogs}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default Page;