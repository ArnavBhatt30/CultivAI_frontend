import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import './Loginpage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Manual login submitted:', { email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side - Brand */}
        <div className="brand-section">
          <div className="brand-content">
            <div className="logo">
              <span className="logo-icon">🌱</span>
              <span className="logo-text">CultivAI</span>
            </div>
            
            <div className="brand-text">
              <h1>Smart Farming <br/>Smarter Future</h1>
              <p>Get AI-powered insights for crops, pests, and soil health. CultivAI helps farmers boost productivity, reduce risks, and grow sustainably.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="form-content">
            <div className="form-header">
              <h2>Sign in</h2>
              <p>
                If you don't have an account register<br />
                You can <a href="#" className="register-link">Register here !</a>
              </p>
            </div>

            {/* If user is logged in, show greeting */}
            {isAuthenticated ? (
              <div>
                <h3>Welcome, {user.name}</h3>
                <button onClick={() => logout({ returnTo: window.location.origin })}>
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot Password ?</a>
                </div>

                <button type="submit" className="login-button">
                  Login
                </button>

                <div className="divider">
                  <span>or continue with</span>
                </div>

                <div className="social-buttons">
                  <button
                    type="button"
                    className="social-btn google"
                    onClick={() => loginWithRedirect({ connection: "google-oauth2" })}
                  >
                    <img src="/google.png" alt="Google" width="20" height="20" />
                  </button>
                  <button
                    type="button"
                    className="social-btn facebook"
                    onClick={() => loginWithRedirect({ connection: "facebook" })}
                  >
                    <img src="/Facebook.png" alt="Facebook" width="20" height="20" />
                  </button>
                  <button
                    type="button"
                    className="social-btn appple"
                    onClick={() => loginWithRedirect({ connection: "windowslive" })}
                  >
                    <img src="/apple.png" alt="Microsoft" width="20" height="20" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
