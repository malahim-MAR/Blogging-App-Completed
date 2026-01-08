'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            let message = 'Login failed. Please try again.';

            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    message = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                case 'auth/too-many-requests':
                    message = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/invalid-credential':
                    message = 'Invalid email or password.';
                    break;
                default:
                    message = error.message;
            }

            return { success: false, error: message };
        }
    };

    const signup = async (email, password) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            let message = 'Signup failed. Please try again.';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'An account with this email already exists.';
                    break;
                case 'auth/weak-password':
                    message = 'Password should be at least 6 characters.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                default:
                    message = error.message;
            }

            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
