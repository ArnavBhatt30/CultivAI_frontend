// src/RoutesManager.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import App from './App';
import "./App.css";

const RoutesManager = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserSession = async () => {
    try {
      const session = await fetchAuthSession();
      console.log("SESSION:", session);

      try {
        const currentUser = await getCurrentUser();
        console.log("CURRENT USER:", currentUser);
        setUser(currentUser);  // store the logged-in user
      } catch {
        if (session.tokens?.idToken) {
          setUser({}); // fallback: tokens exist
        } else {
          setUser(null);
        }
      }

    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkUserSession();

    // ✅ Listen for Auth Hub events
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      console.log("Auth event:", payload.event);
      if (payload.event === "signedIn") {
        checkUserSession();   // refresh user immediately
      }
      if (payload.event === "signedOut") {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Login Page */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" />}
      />

      {/* Register Page */}
      <Route
        path="/register"
        element={!user ? <SignUpPage /> : <Navigate to="/dashboard" />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={user ? <App /> : <Navigate to="/login" />}
      />

      {/* Root */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default RoutesManager;
