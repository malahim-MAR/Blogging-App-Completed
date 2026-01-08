"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, where, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

const TeamPage = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialTeamData = [
        {
            name: "Malahim Bin Haroon",
            role: "Founder",
            image: "https://ui-avatars.com/api/?name=Malahim+Bin+Haroon&background=4F46E5&color=fff&size=200",
            email: "malahim@admin.com",
            bio: "Visionary leader driving the future of digital content."
        },
        {
            name: "Aryan Farooq",
            role: "Co-Founder",
            image: "https://ui-avatars.com/api/?name=Aryan+Farooq&background=7C3AED&color=fff&size=200",
            email: "aryan@admin.com",
            bio: "Technical mastermind behind the platform's architecture."
        },
        {
            name: "Yasir Ghani",
            role: "Team Member",
            image: "https://ui-avatars.com/api/?name=Yasir+Ghani&background=2563EB&color=fff&size=200",
            email: "yasir@admin.com",
            bio: "Dedicated to excellence in content strategy."
        },
        {
            name: "Muzammil Ali Hussain",
            role: "Team Member",
            image: "https://ui-avatars.com/api/?name=Muzammil+Ali+Hussain&background=DB2777&color=fff&size=200",
            email: "muzammil@admin.com",
            bio: "Creative force ensuring top-notch user experiences."
        },
        {
            name: "Khawaja Wasay Ali",
            role: "Team Member",
            image: "https://ui-avatars.com/api/?name=Khawaja+Wasay+Ali&background=059669&color=fff&size=200",
            email: "wasay@admin.com",
            bio: "Expert in community engagement and growth."
        },
        {
            name: "Zaviar Zarhan",
            role: "Team Member",
            image: "https://ui-avatars.com/api/?name=Zaviar+Zarhan&background=D97706&color=fff&size=200",
            email: "zaviar@admin.com",
            bio: "Passionate about operational efficiency and innovation."
        }
    ];

    useEffect(() => {
        const fetchAndSeedTeam = async () => {
            try {
                const teamCollection = collection(db, "TeamMembers");
                const snapshot = await getDocs(teamCollection);

                if (snapshot.empty) {
                    // Seed the database if empty
                    console.log("Seeding database with team members...");
                    const batch = writeBatch(db);

                    initialTeamData.forEach((member) => {
                        const newDocRef = doc(teamCollection);
                        batch.set(newDocRef, member);
                    });

                    await batch.commit();
                    setTeamMembers(initialTeamData);
                } else {
                    // Load existing members
                    const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                    // Sort to ensure Malahim and Aryan are first
                    members.sort((a, b) => {
                        if (a.role === 'Founder') return -1;
                        if (b.role === 'Founder') return 1;
                        if (a.role === 'Co-Founder') return -1;
                        if (b.role === 'Co-Founder') return 1;
                        return 0;
                    });

                    setTeamMembers(members);
                }
            } catch (error) {
                console.error("Error fetching/seeding team:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndSeedTeam();
    }, []);

    return (
        <div className={`min-h-screen bg-slate-50 ${inter.className}`}>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 py-20 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                        Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Team</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                        The passionate minds behind the platform, dedicated to bringing you the best content and user experience.
                    </p>
                </div>
            </div>

            {/* Team Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col items-center text-center transform hover:-translate-y-2"
                            >
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 group-hover:opacity-20 transition-opacity"></div>

                                <div className="relative mt-8 mb-6">
                                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md ${member.role === 'Founder' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                                                member.role === 'Co-Founder' ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                                                    'bg-gradient-to-r from-blue-500 to-indigo-600'
                                            }`}>
                                            {member.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-6 pb-8 w-full">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-blue-600 font-medium mb-4 text-sm">{member.email}</p>

                                    <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                                        {member.bio || "Dedicated team member contributing to our success."}
                                    </p>

                                    {/* Social Links Placeholder */}
                                    <div className="flex justify-center gap-4 pt-4 border-t border-gray-100 w-full">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamPage;
