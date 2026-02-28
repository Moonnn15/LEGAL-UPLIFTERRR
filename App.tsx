import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components/LandingPage";
import { FloatingChatbot } from "./components/FloatingChatbot";
import { useState, useEffect } from "react";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Authenticated>
        <Dashboard isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <FloatingChatbot />
      </Authenticated>
      
      <Unauthenticated>
        <LandingPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </Unauthenticated>
      
      <Toaster theme={isDarkMode ? 'dark' : 'light'} />
    </div>
  );
}
