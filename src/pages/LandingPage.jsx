"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [jobCount, setJobCount] = useState(0)
  const [successRate, setSuccessRate] = useState(0)

  const words = ["Kecerdasan Buatan", "Teknologi AI", "Machine Learning", "Smart Analysis"]

  // Typing animation effect
  useEffect(() => {
    const currentWord = words[currentWordIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setTypedText(currentWord.substring(0, typedText.length + 1))
          if (typedText === currentWord) {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          setTypedText(currentWord.substring(0, typedText.length - 1))
          if (typedText === "") {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentWordIndex, words])

  // Counter animations
  useEffect(() => {
    const animateCounter = (setter, target, duration = 2000) => {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(start))
        }
      }, 16)
    }

    const timer = setTimeout(() => {
      animateCounter(setUserCount, 15000)
      animateCounter(setJobCount, 2500)
      animateCounter(setSuccessRate, 94)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Scroll animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Navigation with Slide Down Animation */}
      <nav
        className={`relative z-10 px-6 py-4 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-pulse-gentle">
              <svg
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
              MatchCV
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {["About", "Features", "How It Works"].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium relative group transform hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Enhanced Main Content with Staggered Animations */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4">
        {/* Hero Section with Enhanced Animations */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Animated Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 border border-blue-200 transform transition-all duration-1000 hover:scale-105 animate-bounce-in ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered CV Analysis
          </div>

          {/* Enhanced Main Heading with Typing Effect */}
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transform transition-all duration-1200 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent animate-gradient-x">
              Analisis CV Anda dengan
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent relative">
              {typedText}
              <span className="animate-blink">|</span>
            </span>
          </h1>

          {/* Animated Subtitle */}
          <p
            className={`text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto transform transition-all duration-1400 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            Dapatkan rekomendasi pekerjaan yang tepat, analisis mendalam tentang CV Anda, dan tips untuk meningkatkan
            peluang karir Anda.
          </p>

          {/* Enhanced Feature Highlights with Stagger Animation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: "🎯", text: "Analisis Akurat" },
              { icon: "💼", text: "Rekomendasi Job" },
              { icon: "📈", text: "Tips Improvement" },
              { icon: "⚡", text: "Hasil Instan" },
            ].map((feature, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-slide-up ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ animationDelay: `${800 + index * 150}ms` }}
              >
                <span className="text-lg animate-bounce-gentle" style={{ animationDelay: `${index * 200}ms` }}>
                  {feature.icon}
                </span>
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Animated Stats */}
          <div
            className={`grid grid-cols-3 gap-8 mb-12 transform transition-all duration-1600 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 transform transition-all duration-300 group-hover:scale-110">
                {userCount.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Pengguna Aktif</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2 transform transition-all duration-300 group-hover:scale-110">
                {jobCount.toLocaleString()}+
              </div>
              <div className="text-sm text-gray-600">Job Matches</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 transform transition-all duration-300 group-hover:scale-110">
                {successRate}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons with Advanced Animations */}
        <div
          className={`w-full max-w-md space-y-4 transform transition-all duration-1800 delay-1200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          {/* Primary CTA with Multiple Animation Layers */}
          <Link
            to="/upload"
            className="group relative w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.05] active:scale-[0.98] overflow-hidden animate-pulse-button"
          >
            {/* Multiple Animated Backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

            {/* Floating Particles */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-float-up"
                  style={{
                    left: `${20 + i * 10}%`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>

            <div className="relative flex items-center space-x-3 z-10">
              <svg className="w-6 h-6 animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-lg font-semibold">Analisis CV Sekarang</span>
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>

          {/* Enhanced Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                to: "/login",
                text: "Masuk",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              },
              {
                to: "/register",
                text: "Daftar",
                icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
              },
            ].map((button, index) => (
              <Link
                key={button.text}
                to={button.to}
                className="group flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.05] hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${1400 + index * 200}ms` }}
              >
                <svg
                  className="w-5 h-5 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={button.icon} />
                </svg>
                <span className="font-medium">{button.text}</span>
              </Link>
            ))}
          </div>

          {/* Enhanced Trust Indicators with Animation */}
          <div
            className={`text-center pt-6 transform transition-all duration-2000 delay-1600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <p className="text-sm text-gray-500 mb-3 animate-fade-in">Dipercaya oleh ribuan profesional</p>
            <div className="flex justify-center items-center space-x-6 opacity-60">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded animate-pulse-gentle hover:scale-110 transition-transform duration-300"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* MATCH Acronym Section */}
        <div id="about" className="relative z-10 py-20 px-4 bg-white/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
                What Does <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MATCH</span> Mean?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "200ms" }}>
                Every letter represents our commitment to your career success
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {[
                {
                  letter: "M",
                  word: "Measured",
                  description: "Your CV is measured and processed intelligently using advanced AI algorithms",
                  color: "from-blue-500 to-indigo-600",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  letter: "A",
                  word: "Analyzed",
                  description: "Your CV data is analyzed in depth to extract meaningful insights and patterns",
                  color: "from-indigo-500 to-indigo-600",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  letter: "T",
                  word: "Talent-driven",
                  description: "We focus on your unique talents and potential to unlock career opportunities",
                  color: "from-purple-500 to-purple-600",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )
                },
                {
                  letter: "C",
                  word: "Connected",
                  description: "We connect your talents with the right opportunities and career paths",
                  color: "from-pink-500 to-pink-600",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  letter: "H",
                  word: "Hired",
                  description: "Our ultimate goal is to help you get hired in your dream job and advance your career",
                  color: "from-green-500 to-green-600",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <div
                  key={item.letter}
                  className="group text-center animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Letter Circle */}
                  <div className="relative mb-6 mx-auto">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 mx-auto`}
                    >
                      <span className="text-3xl font-bold text-white animate-pulse-gentle">
                        {item.letter}
                      </span>
                    </div>
                    
                    {/* Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150`}
                    ></div>
                    
                    {/* Floating Icon */}
                    <div
                      className={`absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 group-hover:scale-110 transition-all duration-300 z-20`}
                    >
                      <div className="animate-bounce-gentle">
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* Word */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {item.word}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed px-2">
                    {item.description}
                  </p>

                  {/* Animated Underline */}
                  <div className={`mt-4 mx-auto w-0 h-0.5 bg-gradient-to-r ${item.color} group-hover:w-16 transition-all duration-500`}></div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "800ms" }}>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5 text-blue-600 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-blue-700 font-medium">Experience the MATCH difference today</span>
              </div>
            </div>
          </div>
        </div>

      {/* Enhanced Features Section with Scroll Animations */}
      <div id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              Why Choose MatchCV?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "200ms" }}>
              Leading AI platform for personalized CV analysis and career recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                ),
                title: "Analisis AI Mendalam",
                description:
                  "Teknologi machine learning menganalisis CV Anda secara komprehensif untuk memberikan insight yang akurat.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                ),
                title: "Rekomendasi Personal",
                description:
                  "Dapatkan saran pekerjaan yang sesuai dengan skill, pengalaman, dan preferensi karir Anda.",
                color: "from-indigo-500 to-purple-600",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Hasil Instan",
                description:
                  "Proses analisis yang cepat dengan hasil yang dapat langsung Anda gunakan untuk meningkatkan CV.",
                color: "from-purple-500 to-pink-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 animate-slide-up relative overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Animated Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                {/* Floating Icon Container */}
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg relative z-10`}
                >
                  <div className="animate-pulse-gentle">{feature.icon}</div>

                  {/* Icon Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-150`}
                  ></div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed relative z-10">{feature.description}</p>

                {/* Hover Border Animation */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced How It Works Section */}
      <div id="how-it-works" className="relative z-10 py-20 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cara Kerja MatchCV</h2>
            <p className="text-xl text-gray-600">
              Tiga langkah sederhana untuk mendapatkan analisis CV yang komprehensif
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Upload CV Anda",
                description:
                  "Upload file CV dalam format PDF. Sistem kami akan memproses dokumen Anda dengan aman dan terjamin.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                ),
                color: "from-blue-500 to-indigo-600",
              },
              {
                step: "02",
                title: "AI Menganalisis",
                description:
                  "Teknologi AI kami menganalisis skill, pengalaman, dan kualifikasi Anda untuk memberikan insight mendalam.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                color: "from-indigo-500 to-purple-600",
              },
              {
                step: "03",
                title: "Terima Rekomendasi",
                description:
                  "Dapatkan rekomendasi pekerjaan yang sesuai, tips improvement, dan saran untuk meningkatkan CV Anda.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                color: "from-purple-500 to-pink-600",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-center space-x-8 group animate-slide-in-right"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="flex-shrink-0 relative">
                  {/* Animated Step Container */}
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}
                  >
                    <div className="animate-pulse-gentle">{step.icon}</div>
                  </div>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150`}
                  ></div>

                  {/* Connection Line */}
                  {index < 2 && (
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent animate-draw-line"
                      style={{ animationDelay: `${index * 300 + 500}ms` }}
                    ></div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span
                      className={`text-3xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent animate-number-pop`}
                      style={{ animationDelay: `${index * 300 + 200}ms` }}
                    >
                      {step.step}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Footer with Animation */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-200/50 animate-fade-in-up">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MatchCV
            </h3>
          </div>
          <p className="text-gray-600 mb-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Platform AI terdepan untuk analisis CV dan rekomendasi karir yang personal
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500 mb-6">
            {["Privacy Policy", "Terms of Service", "Contact"].map((link, index) => (
              <a
                key={link}
                href="#"
                className="hover:text-blue-600 transition-all duration-300 transform hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                {link}
              </a>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200/50 animate-fade-in" style={{ animationDelay: "600ms" }}>
            <p className="text-gray-500 text-sm">© 2024 MatchCV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </div>
  )
}
export default LandingPage
