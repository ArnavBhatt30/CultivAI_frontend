import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import cropImage from './homepage.png';
import { motion, AnimatePresence } from "framer-motion";
import { MdHeadsetMic, MdChat, MdEmail } from "react-icons/md";
import { FiChevronDown, FiChevronUp, FiCloud, FiMapPin, FiSun, FiCloudRain } from "react-icons/fi";
import { WiDaySunny, WiCloudy, WiRain, WiStrongWind } from "react-icons/wi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// WeatherSection Component
function WeatherSection() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState({ labels: [], data: [] });
  
  const getWeather = async () => {
    if (!city) return;

    try {
      setError("");
      setWeather(null);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=65db789d1b8b8caf2754b8a707dd85d9&units=metric`
      );

      if (!res.ok) {
        throw new Error("City not found");
      }

      const data = await res.json();
      setWeather({
        name: data.name,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        country: data.sys.country,
      });

      // Generate mock forecast data for the chart
      const mockForecastLabels = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5"];
      const mockForecastData = [
        data.main.temp,
        data.main.temp + Math.random() * 4 - 2,
        data.main.temp + Math.random() * 6 - 3,
        data.main.temp + Math.random() * 5 - 2.5,
        data.main.temp + Math.random() * 4 - 2
      ].map(temp => Math.round(temp));

      setForecast({
        labels: mockForecastLabels,
        data: mockForecastData
      });

    } catch (err) {
      setError(err.message || "Something went wrong");
      setWeather(null);
    }
  };

  // Get current date
  const getCurrentDate = () => {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const now = new Date();
    return `${days[now.getDay()]} | ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '5-Day Temperature Forecast',
        color: '#333',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(200,200,200,0.2)" },
        ticks: { color: "#555", font: { size: 12, weight: "500" } },
      },
      y: {
        grid: { color: "rgba(200,200,200,0.2)" },
        ticks: { 
          color: "#555", 
          font: { size: 12, weight: "500" },
          callback: function(value) {
            return value + '°C';
          }
        },
      },
    },
  };

  // Chart data for forecast
  const chartData = {
    labels: forecast?.labels || [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: forecast?.data || [],
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  return (
    <div className="weather-wrapper">
      <h1 className="title">Weather</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && getWeather()}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="result">
          <div className="weather-result-content">
            {/* Main Weather Display */}
            <div className="weather-main-display">
              <div className="weather-location-info">
                <h2>{weather.name}</h2>
                <div className="weather-condition">{weather.description}</div>
                <div className="weather-temp">{weather.temp}°C</div>
                <div className="weather-date">{getCurrentDate()}</div>
              </div>
              <div className="weather-icon-container">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                />
              </div>
            </div>

            {/* Weather Details */}
            <div className="weather-details-section">
              <div className="weather-details-title">Air Conditions</div>
              <div className="weather-details-grid">
                <div className="weather-detail-item">
                  <div className="weather-detail-icon">🌡️</div>
                  <div className="weather-detail-content">
                    <div className="weather-detail-label">Real Feel</div>
                    <div className="weather-detail-value">{weather.feelsLike}°C</div>
                  </div>
                </div>
                
                <div className="weather-detail-item">
                  <div className="weather-detail-icon">💨</div>
                  <div className="weather-detail-content">
                    <div className="weather-detail-label">Wind Speed</div>
                    <div className="weather-detail-value">{weather.windSpeed} m/s</div>
                  </div>
                </div>
                
                <div className="weather-detail-item">
                  <div className="weather-detail-icon">💧</div>
                  <div className="weather-detail-content">
                    <div className="weather-detail-label">Humidity</div>
                    <div className="weather-detail-value">{weather.humidity}%</div>
                  </div>
                </div>
                
                <div className="weather-detail-item">
                  <div className="weather-detail-icon">👁️</div>
                  <div className="weather-detail-content">
                    <div className="weather-detail-label">Visibility</div>
                    <div className="weather-detail-value">Good</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            {forecast.labels.length > 0 && (
              <div className="weather-chart-section">
                <div className="weather-chart-container">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const CultivAI = () => {
  // Main app states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeNav, setActiveNav] = useState("Home");

  // Refs for scrolling to sections
  const homeRef = useRef(null);
  const aiRef = useRef(null);
  const weatherRef = useRef(null);
  const contactRef = useRef(null);

  // FAQ and other states
  const faqs = [
    { q: "What are the key measurements I should take to determine my size?", a: "Measure your bust, waist, and hips for the most accurate sizing." },
    { q: "Is there a size chart available for reference?", a: "Yes, you can find our detailed size chart on the product page." },
    { q: "How do different brands compare in terms of sizing?", a: "Sizes may vary slightly across brands, so always check the chart." },
    { q: "What should I do if I'm between sizes?", a: "We recommend choosing the larger size for comfort." },
    { q: "Can I return or exchange if the size doesn't fit?", a: "Yes, you can exchange or return within 30 days." },
    { q: "What materials might affect the fit and feel of the clothing?", a: "Stretch fabrics like spandex provide more flexibility." },
    { q: "Are there customer reviews that mention sizing accuracy?", a: "Yes, customer reviews often provide insights into fit accuracy." },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  // FarmingAssistant states
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [listening, setListening] = useState(false);

  const mockResponse = {
    "mock data": "🌱 Mock Analysis: Your crops are healthy. Recommended fertilizer: NPK 20-20-20. Watering every 3 days is optimal."
  };

  // Pagination
  const start = (page - 1) * perPage;
  const pagedFaqs = faqs.slice(start, start + perPage);

  // Smooth scroll function with better positioning
  const scrollToSection = (ref, isHome = false) => {
    if (isHome) {
      // For home, scroll to the very top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (ref && ref.current) {
      // For other sections, account for header height
      const headerHeight = 80; // Adjust based on your header height
      const element = ref.current;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Navigation handler with smooth scrolling
  const handleNavClick = (item, e) => {
    e.preventDefault();
    setActiveNav(item);
    
    switch(item) {
      case "Home":
        scrollToSection(null, true); // true indicates this is home
        break;
      case "AI":
        scrollToSection(aiRef);
        break;
      case "Weather":
        scrollToSection(weatherRef);
        break;
      case "Contact us":
        scrollToSection(contactRef);
        break;
      default:
        break;
    }
  };

  // File Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis({
        crop: "Sugarcane",
        health: "Good",
        issues: ["Slight nutrient deficiency in lower leaves"],
        recommendations: [
          "Apply nitrogen-rich fertilizer",
          "Increase watering frequency",
          "Monitor for pest activity in next 2 weeks"
        ],
        confidence: "94%"
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setAnalysis(null);
    setIsAnalyzing(false);
  };

  // FarmingAssistant Functions
  const handleSearch = () => {
    if (mockResponse[query.toLowerCase()]) {
      setResult(mockResponse[query.toLowerCase()]);
    } else {
      setResult("No results found. Try typing 'mock data'.");
    }
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const voiceQuery = event.results[0][0].transcript;
      setQuery(voiceQuery);
      if (mockResponse[voiceQuery.toLowerCase()]) {
        setResult(mockResponse[voiceQuery.toLowerCase()]);
      } else {
        setResult(`Heard: "${voiceQuery}" but no mock analysis found.`);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div className="cultivai-container">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">CultivAI</span>
          </div>

          <nav className="nav-menu">
            {["Home", "AI", "Weather", "Contact us", "Language"].map((item) => (
              <a
                key={item}
                href="#"
                className={`nav-item ${activeNav === item ? "active" : ""}`}
                onClick={(e) => handleNavClick(item, e)}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="user-profile">
            <span className="user-name">CultivAI</span>
            <div className="avatar">
              <div className="avatar-placeholder"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Home Section */}
        <section ref={homeRef} className="content-container">
          {/* Left Side - Image / Uploaded Image */}
          <div className="image-section">
            <AnimatePresence mode="wait">
              {!uploadedImage ? (
                <motion.div
                  key="default-crop"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="crop-image">
                    <img src={cropImage} alt="Sugarcane field" className="crop-image-img" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="uploaded-image"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="crop-image">
                    <img src={uploadedImage} alt="Uploaded crop" className="crop-image-img" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side */}
          <div className="upload-section">
            <AnimatePresence mode="wait">
              {!uploadedImage ? (
                <motion.div
                  key="upload-instructions"
                  className="upload-box top-aligned"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <h5 className="main-title">Add files & get instant advice.</h5>
                  <p className="description">
                    Upload photos of your crops, pests, or field conditions to get
                    quick and reliable farming advice. Our AI system analyzes your
                    files and provides solutions tailored to your crop, location,
                    and season—helping you take the right action at the right time
                  </p>

                  <div
                    className={`upload-area ${isDragOver ? "drag-over" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="upload-text-line">
                      <label htmlFor="file-input" className="select-file-btn">
                        Select a file
                      </label>
                      <span className="or-text">or</span>
                      <span className="drag-text">Drag and drop a file here</span>
                    </div>
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="analysis-flow"
                  className={`upload-box ${!analysis && !isAnalyzing ? "centered" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {!analysis && !isAnalyzing && (
                    <button className="upload-btn" onClick={performAnalysis}>
                      Analyze Image
                    </button>
                  )}

                  {isAnalyzing && (
                    <div className="analyzing">
                      <div className="loader"></div>
                      <p>Analyzing your crop image...</p>
                    </div>
                  )}

                  {analysis && (
                    <div className="analysis-results">
                      <h3>Analysis Results</h3>
                      <div className="analysis-grid">
                        <div className="analysis-card">
                          <div className="analysis-card-label">Crop</div>
                          <div className="analysis-card-value">{analysis.crop}</div>
                        </div>
                        <div className="analysis-card">
                          <div className="analysis-card-label">Health</div>
                          <div className="analysis-card-value health-good">{analysis.health}</div>
                        </div>
                        <div className="analysis-card">
                          <div className="analysis-card-label">Confidence</div>
                          <div className="analysis-card-value confidence-high">{analysis.confidence}</div>
                        </div>
                      </div>

                      {analysis.issues.length > 0 && (
                        <div className="issues-section">
                          <div className="section-title">Issues Detected</div>
                          {analysis.issues.map((issue, idx) => (
                            <div key={idx} className="issue-item">{issue}</div>
                          ))}
                        </div>
                      )}

                      <div className="recommendations-section">
                        <div className="section-title">Recommendations</div>
                        {analysis.recommendations.map((rec, idx) => (
                          <div key={idx} className="recommendation-item">{rec}</div>
                        ))}
                      </div>

                      <button className="upload-btn" onClick={resetUpload}>
                        Upload New Image
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* AI Section - FarmingAssistant */}
        <section ref={aiRef} className="assistant-container">
          <h5 className="title" style={{ fontSize: "2rem" }}>
            Ask Your Farming Question?
          </h5>

          <p className="subtitle" lang="en">
            <em>
              Type your question, speak in your own language, or upload a photo of your crop. 
              Our AI will instantly give you clear, reliable farming advice—tailored to your crop, location, and season.
            </em>
          </p>

          {/* Search Bar */}
          <motion.div
            className="search-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <select className="dropdown">
              <option>GPT 4.0</option>
              <option>GPT 3.5</option>
            </select>
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </motion.div>

          {/* OR Divider */}
          <div className="divider">Or</div>

          {/* Buttons */}
          <div className="actions">
            <motion.button className="action-btn" whileTap={{ scale: 0.95 }}>
              <span className="icon">＋</span>
            </motion.button>

            <motion.button
              className={`action-btn mic ${listening ? "listening" : ""}`}
              onClick={handleVoice}
              whileTap={{ scale: 0.95 }}
            >
              <span className="icon">🎙️</span>
            </motion.button>
          </div>

          {/* Dropdowns */}
          <div className="inputs">
            <div className="input-group">
              <label>Enter Your Crop Name</label>
              <input
               type="text" placeholder="Type Here" />
            </div>

            <div className="input-group">
              <label>Location</label>
              <select>
                <option>Select your location</option>
                <option>India</option>
                <option>USA</option>
                <option>Africa</option>
              </select>
            </div>

            <div className="input-group">
              <label>Growth Stage</label>
              <select>
                <option>Select crop growth stage</option>
                <option>Seedling</option>
                <option>Vegetative</option>
                <option>Flowering</option>
                <option>Harvest</option>
              </select>
            </div>
          </div>

          {/* Result Box */}
          {result && (
            <motion.div
              className="result-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {result}
            </motion.div>
          )}
        </section>

        {/* Help Section */}
        <section className="help-section">
          <h2>How Can We Help?</h2>
          <p className="help-subtitle">
            Whether it's a question about your order, returns, sizing, or just fashion talk — we've got you covered. <br />
            Type in your query below and we'll point you in the right direction.
          </p>

          <div className="help-search">
            <input type="text" placeholder="Search for anything" />
            <button className="help-search-btn">Search</button>
          </div>

          <div className="help-icons">
            <div className="help-icon-box">
              <MdHeadsetMic className="help-icon" />
            </div>
            <div className="help-icon-box">
              <MdChat className="help-icon" />
            </div>
            <div className="help-icon-box">
              <MdEmail className="help-icon" />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <div className="faq-container">
          <h2 className="faq-title">Frequently Asked Question</h2>

          <div className="faq-list">
            {pagedFaqs.map((item, i) => (
              <div
                key={i}
                className="faq-item"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="faq-question">
                  <p>{item.q}</p>
                  {openIndex === i ? (
                    <FiChevronUp className="faq-icon" />
                  ) : (
                    <FiChevronDown className="faq-icon" />
                  )}
                </div>
                {openIndex === i && <p className="faq-answer">{item.a}</p>}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="faq-pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="faq-page-btn"
            >
              Previous
            </button>

            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`faq-page-num ${page === num ? "active" : ""}`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === 6}
              className="faq-page-btn"
            >
              Next
            </button>
          </div>
        </div>

        {/* Weather Section */}
        <section ref={weatherRef}>
          <WeatherSection />
        </section>
      </main>

      {/* Footer Section - Contact Us */}
      <footer ref={contactRef} className="footer">
        <div className="footer-container">
          {/* Left Side - Logo and Description */}
          <div className="footer-left">
            <div className="footer-logo">
              <span className="footer-logo-icon">🌱</span>
              <span className="footer-logo-text">CultivAI</span>
            </div>
            <p className="footer-description">
              For those who cultivate—CutivAI brings knowledge, innovation, and AI-driven farming support, always at your fingertips.
            </p>
            
            {/* Social Media */}
            <div className="social-section">
              <span className="social-title">Follow Us:</span>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Discord">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="newsletter-section">
              <div className="newsletter-input">
                <span className="newsletter-label">Get Farming Tips in Your Inbox:</span>
                <input 
                  type="email" 
                  placeholder="Enter Email Id:" 
                  className="newsletter-email"
                />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Right Side - Links */}
          <div className="footer-right">
            {/* Helpful Links */}
            <div className="footer-column">
              <h3 className="footer-column-title">Helpful Links</h3>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#ai">AI</a></li>
                <li><a href="#weather">Weather</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#language">Language</a></li>
              </ul>
            </div>

            {/* Accessibility */}
            <div className="footer-column">
              <h3 className="footer-column-title">Accessibility</h3>
              <ul className="footer-links">
                <li><a href="#language-support">Language Support</a></li>
                <li><a href="#voice-input">Voice Input</a></li>
                <li><a href="#text-to-speech">Text-to-Speech</a></li>
                <li><a href="#visual-assistance">Visual Assistance</a></li>
                <li><a href="#offline-mode">Offline Mode</a></li>
                <li><a href="#readability">Readability Settings</a></li>
                <li><a href="#quick-help">Quick Help</a></li>
              </ul>
            </div>

            {/* Legal Resources */}
            <div className="footer-column">
              <h3 className="footer-column-title">Legal Resources</h3>
              <ul className="footer-links">
                <li><a href="#user-agreement">User Agreement</a></li>
                <li><a href="#privacy-policy">Data Protection Policy</a></li>
                <li><a href="#about">About CutivAI</a></li>
                <li><a href="#navigation">Navigation Map</a></li>
              </ul>
              
              {/* Payment Icons */}
              <div className="payment-section">
                <div className="payment-title">100% Secure Payments</div>
                <div className="payment-icons">
                  <div className="payment-icon visa">VISA</div>
                  <div className="payment-icon apple">Pay</div>
                  <div className="payment-icon amazon">amazon</div>
                  <div className="payment-icon mastercard">mc</div>
                  <div className="payment-icon gpay">G Pay</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="privacy-text">We respect your privacy. No spam, just style.</p>
            <p className="copyright">© 2025 CultivAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CultivAI;
