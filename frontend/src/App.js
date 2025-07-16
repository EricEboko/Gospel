import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FixedSimplifiedAuth } from './components/auth/FixedSimplifiedAuth';
import { FixedMainLayout } from './components/main/FixedMainLayout';
import { getTranslations } from './utils/translations';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [language, setLanguage] = useState(
    localStorage.getItem('gospelspot_language') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('gospelspot_language', language);
  }, [language]);

  const t = getTranslations(language);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SimplifiedAuthComponent 
        t={t} 
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <FixedMainLayout 
      t={t} 
      language={language}
      onLanguageChange={handleLanguageChange}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;