// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  limit as limitQuery,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  getCountFromServer,
} from "firebase/firestore";

// Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase safely to prevent build crashes
let app;
try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  } else {
    console.warn("Firebase configuration is missing. This may cause errors during runtime.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// Safe exports (will be null if config is missing)
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// 🔢 Get total blog count from Firestore
export const getTotalBlogs = async () => {
  if (!db) return 0;
  try {
    const blogsRef = collection(db, "MyBlogs");
    const snapshot = await getCountFromServer(blogsRef);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting blog count:", error);
    return 0;
  }
};

// 🕒 Get most recent blogs with limit
export const getRecentBlogs = async (limit = 4) => {
  if (!db) return [];
  try {
    const blogsRef = collection(db, "MyBlogs");
    const q = query(blogsRef, orderBy("createdAt", "desc"), limitQuery(limit));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        views: data.views || 0,
        status: data.status || "draft",
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
    console.error("Error getting recent blogs:", error);
    return [];
  }
};

// 👀 Count a unique visit (per session)
export const countVisit = async () => {
  if (typeof window === "undefined" || !db) return; // Avoid on server or if db missing

  if (!sessionStorage.getItem("visitCounted")) {
    const docRef = doc(db, "metrics", "visits");
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, { count: increment(1) });
      } else {
        await setDoc(docRef, { count: 1 });
      }

      sessionStorage.setItem("visitCounted", "true");
    } catch (error) {
      console.error("Visit count error:", error);
    }
  }
};

// 🔄 Get the total visit count
export const getVisitCount = async () => {
  if (!db) return 0;
  try {
    const docSnap = await getDoc(doc(db, "metrics", "visits"));
    return docSnap.exists() ? docSnap.data().count : 0;
  } catch (error) {
    console.error("Error fetching visit count:", error);
    return 0;
  }
};
