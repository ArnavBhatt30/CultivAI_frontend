import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginPage from "./Loginpage";
import CultivAI from "./App";
import "./App.css"; // Import CSS here too

const RoutesManager = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white' // Ensure loading has proper background
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-wrapper"> {/* Add wrapper div */}
      <Routes>
        <Route path="/" element={isAuthenticated ? <CultivAI /> : <LoginPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default RoutesManager;