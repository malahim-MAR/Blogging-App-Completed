// components/AllBlogs.js
"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import BlogCard from "./BlogCard";

const AllBlogs = () => {
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

    return <BlogCard blogs={blogData} loading={loading} error={error} />;
};

export default AllBlogs;