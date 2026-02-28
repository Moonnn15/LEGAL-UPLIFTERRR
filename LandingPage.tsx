import { SignInForm } from "../SignInForm";
import { useState } from "react";

interface LandingPageProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export function LandingPage({ isDarkMode, setIsDarkMode }: LandingPageProps) {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LU</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Legal Uplifter
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              <button
                onClick={() => setShowSignIn(true)}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 dark:from-teal-500/5 dark:to-cyan-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Legal Uplifter
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered legal document analysis for <span className="text-teal-500 font-semibold">Business</span>, 
              <span className="text-cyan-500 font-semibold"> Citizens</span>, and 
              <span className="text-teal-500 font-semibold"> Students</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowSignIn(true)}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Analyzing Documents
              </button>
              <button className="px-8 py-4 border-2 border-teal-500 text-teal-500 dark:text-teal-400 rounded-xl font-semibold text-lg hover:bg-teal-500 hover:text-white transition-all duration-200">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful AI Legal Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Upload, analyze, and understand your legal documents with AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📄",
                title: "Smart Document Analysis",
                description: "Multi-stage AI analysis breaks down complex legal documents into understandable summaries"
              },
              {
                icon: "🤖",
                title: "AI Legal Assistant",
                description: "24/7 chatbot provides instant answers to your legal questions with document context"
              },
              {
                icon: "⚡",
                title: "Risk Assessment",
                description: "Automated risk scoring and highlighting of critical clauses and terms"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gradient-to-br hover:from-teal-50 hover:to-cyan-50 dark:hover:from-gray-600 dark:hover:to-gray-600 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tailored for Your Needs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: "Business",
                icon: "🏢",
                color: "from-blue-500 to-blue-600",
                features: ["Contract Analysis", "Partnership Agreements", "Employment Contracts", "Compliance Review"]
              },
              {
                category: "Citizens",
                icon: "👥",
                color: "from-green-500 to-green-600",
                features: ["Consumer Rights", "Lease Agreements", "Insurance Policies", "Legal Notices"]
              },
              {
                category: "Students",
                icon: "🎓",
                color: "from-purple-500 to-purple-600",
                features: ["Housing Contracts", "Academic Policies", "Loan Agreements", "University Terms"]
              }
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-2xl mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.category}
                </h3>
                <ul className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Get Started
              </h2>
              <button
                onClick={() => setShowSignIn(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <SignInForm />
          </div>
        </div>
      )}
    </div>
  );
}
