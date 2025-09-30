import React, { useState } from "react";
import { signUp, confirmSignUp, getCurrentUser, fetchAuthSession, signOut } from "aws-amplify/auth";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './Loginpage.css';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState("signup"); 
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } }
      });
      setStage("confirm");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      await fetchAuthSession();
      await getCurrentUser();
      navigate("/dashboard");
    } catch {
      await signOut();
      navigate("/login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* ✅ Left Brand Section (same as Login) */}
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

        {/* ✅ Right Form Section */}
        <div className="form-section">
          <div className="form-content">
            <div className="form-header">
              <h2>{stage === "signup" ? "Create Your Account" : "Confirm Your Email"}</h2>
              {stage === "signup" && (
                <p>
                  Already have an account?{" "}
                  <span 
                    onClick={() => navigate("/login")} 
                    className="register-link" 
                    style={{ cursor: "pointer" }}
                  >
                    Sign in here!
                  </span>
                </p>
              )}
            </div>

            {stage === "signup" ? (
              <form onSubmit={handleSignUp} className="login-form">
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

                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Register</button>
              </form>
            ) : (
              <form onSubmit={handleConfirm} className="login-form">
                <div className="form-group">
                  <label>Confirmation Code</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter the code sent to your email"
                      required
                    />
                  </div>
                </div>

                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Confirm & Continue</button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;