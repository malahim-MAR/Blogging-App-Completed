'use client';
import React, { useState, useEffect } from 'react';
import { FiActivity, FiFileText, FiDollarSign, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { countVisit, getVisitCount, getTotalBlogs, getRecentBlogs } from '../lib/firebase';

const AdminDashboard = () => {
    const [totalVisits, setTotalVisits] = useState(0);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState({
        visits: true,
        blogs: true,
        chart: true
    });

    useEffect(() => {
        // Track visit
        countVisit();

        // Fetch all data
        const fetchData = async () => {
            try {
                // Fetch visit count
                const visits = await getVisitCount();
                setTotalVisits(visits);
                setLoading(prev => ({ ...prev, visits: false }));
                
                // Fetch blog data
                const [blogsCount, recent] = await Promise.all([
                    getTotalBlogs(),
                    getRecentBlogs(4)
                ]);
                
                setTotalBlogs(blogsCount);
                setRecentBlogs(recent);
                setLoading(prev => ({ ...prev, blogs: false, chart: false }));
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading({ visits: false, blogs: false, chart: false });
            }
        };

        fetchData();
    }, []);

    // Stats data with real metrics
    const stats = [
        { 
            title: "Total Visitors", 
            value: loading.visits ? "Loading..." : totalVisits.toLocaleString(), 
            change: "+12%", 
            icon: <FiActivity className="text-blue-400" />, 
            color: "bg-blue-900/30" 
        },
        { 
            title: "Blog Posts", 
            value: loading.blogs ? "Loading..." : totalBlogs.toString(), 
            change: "+24%", 
            icon: <FiFileText className="text-green-400" />, 
            color: "bg-green-900/30" 
        },
        { 
            title: "Revenue", 
            value: "$14,280", 
            change: "+18.5%", 
            icon: <FiDollarSign className="text-amber-400" />, 
            color: "bg-amber-900/30" 
        }
    ];

    // Generate realistic chart data
    const generateChartData = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const maxValue = Math.max(1, totalVisits);
        
        return days.map((day, index) => {
            // Create a wave pattern with peaks on Tue and Thu
            const base = 0.3 + (0.6 * index / days.length);
            const wave = Math.sin(index * 0.9) * 0.2;
            const visits = Math.round(totalVisits * (base + wave));
            
            return {
                day,
                visits,
                height: Math.round((base + wave) * 100)
            };
        });
    };

    const chartData = generateChartData();
    const maxVisits = Math.max(...chartData.map(d => d.visits), 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
            <div className="max-w-full mx-auto">
                {/* Header - Simplified */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                        <p className="text-gray-400 mt-2">Welcome back, Admin! Here's what's happening today.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">A</div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className={`${stat.color} p-5 rounded-xl border border-gray-800`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                                </div>
                                <div className="p-3 rounded-lg bg-gray-800/50">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-green-400 text-sm flex items-center">
                                    <FiTrendingUp className="mr-1" /> {stat.change} from last month
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Traffic Overview</h2>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 text-sm bg-indigo-600 rounded-lg text-white">Month</button>
                            </div>
                        </div>

                        {/* Chart Visualization */}
                        <div className="h-80">
                            {loading.chart ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-48 h-48 rounded-full border-8 border-dashed border-gray-700 animate-spin-slow" />
                                            </div>
                                            <FiBarChart2 className="w-16 h-16 mx-auto text-indigo-500" />
                                        </div>
                                        <p className="mt-4 text-gray-400">Loading traffic data...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-end justify-between h-full pt-8 px-4">
                                    {chartData.map((data, index) => (
                                        <div key={index} className="flex flex-col items-center flex-1 mx-1">
                                            <div className="text-gray-500 text-sm mb-2">{data.day}</div>
                                            <div
                                                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-700 ease-out"
                                                style={{
                                                    height: `${(data.visits / maxVisits) * 70}%`,
                                                    minHeight: '10px'
                                                }}
                                            ></div>
                                            <div className="text-gray-400 text-xs mt-2">{data.visits.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Blogs */}
                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Recent Blogs</h2>
                            <button className="text-indigo-400 hover:text-indigo-300 text-sm">View All</button>
                        </div>

                        <div className="space-y-4">
                            {loading.blogs ? (
                                Array(4).fill(0).map((_, index) => (
                                    <div key={index} className="p-4 bg-gray-800/20 rounded-lg">
                                        <div className="animate-pulse space-y-3">
                                            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                            <div className="flex justify-between">
                                                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : recentBlogs.length > 0 ? (
                                recentBlogs.map((blog) => (
                                    <div key={blog.id} className="p-4 bg-gray-800/20 rounded-lg hover:bg-gray-800/40 transition">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium text-white line-clamp-1">{blog.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${blog.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'}`}>
                                                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between mt-3">
                                            <div className="flex items-center text-gray-400 text-sm">
                                                <FiActivity className="mr-1" /> {blog.views.toLocaleString()} views
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                {new Date(blog.createdAt?.seconds * 1000).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-4">No blogs found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;