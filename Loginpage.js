// src/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithRedirect } from 'aws-amplify/auth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import './Loginpage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Email/Password Login
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn({ username: email, password });
      navigate("/dashboard"); // ✅ redirect once logged in
    } catch (err) {
      if (err.name === "UserAlreadyAuthenticatedException") {
        navigate("/dashboard"); // already logged in, just redirect
      } else {
        setError(err.message);
      }
    }
  };

  // Google Federated Login
  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: "Google" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* ✅ Left Side – Brand */}
        <div className="brand-section">
          <div className="brand-content">
            <span className="logo-text">CultivAI</span>
            <div className="logo">
              <img src="/logomain.png" alt="CultivAI Logo" className="logo-icon" />
              
            </div>
            <div className="brand-text">
              <h1>Smart Farming <br/> Smarter Future</h1>
              <p>
                Get AI-powered insights for crops, pests, and soil health.  
                CultivAI helps farmers boost productivity, reduce risks, and grow sustainably.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Right Side – Login Form */}
        <div className="form-section">
          <div className="form-content route-animate">
            <div className="form-header">
              <h2>Sign in</h2>
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="register-link"
                  style={{ cursor: "pointer" }}
                >
                  Register here!
                </span>
              </p>
            </div>

            <form onSubmit={handleEmailSignIn} className="login-form">
              {/* Email */}
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message (hide "oauth param not configured.") */}
              {error && error !== "oauth param not configured." && (
                <p className="error-message">{error}</p>
              )}

              {/* Submit */}
              <button type="submit" className="login-button">
                Login
              </button>

              <p className="login-disclaimer">
                🔑 Google Login option is coming soon! For now, please use your account credentials.
              </p>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;
