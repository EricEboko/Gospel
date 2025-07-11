import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const AuthComponent = ({ t, onLanguageChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { login, register, verifyEmail, resendVerification } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    country: '',
    language: 'en',
    role: 'user'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      setRegisteredEmail(formData.email);
      setShowEmailVerification(true);
      setMessage('Registration successful! Please check your email for verification.');
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyEmail(verificationToken);
      setMessage('Email verified successfully! You can now log in.');
      setShowEmailVerification(false);
      setIsLogin(true);
    } catch (error) {
      setError(error.response?.data?.detail || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');

    try {
      await resendVerification(registeredEmail);
      setMessage('Verification email sent!');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to resend verification');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      country: '',
      language: 'en',
      role: 'user'
    });
    setError('');
    setMessage('');
  };

  const switchToLogin = () => {
    setIsLogin(true);
    resetForm();
  };

  const switchToRegister = () => {
    setIsLogin(false);
    resetForm();
  };

  if (showEmailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-purple-500/20 w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-gray-300">
              We've sent a verification email to <span className="text-purple-400 font-medium">{registeredEmail}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleEmailVerification} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Verification Token
              </label>
              <input
                type="text"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter verification token"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm">
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="text-purple-400 hover:text-purple-300 disabled:opacity-50"
            >
              Resend verification email
            </button>
            <button
              onClick={switchToLogin}
              className="text-gray-400 hover:text-gray-300"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-purple-500/20 w-full max-w-md">
        
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <select
            value={formData.language}
            onChange={(e) => {
              setFormData({ ...formData, language: e.target.value });
              onLanguageChange(e.target.value);
            }}
            className="bg-white/10 border border-purple-500/30 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="pt">Português</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">GospelSpot</h1>
          <p className="text-gray-300">{isLogin ? t.login : t.register}</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {t.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={t.email}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              {t.password}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={t.password}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="user">Regular User</option>
                  <option value="artist">Artist</option>
                  <option value="label_manager">Label/Manager</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? t.login : t.register)}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isLogin ? (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={switchToRegister}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={switchToLogin}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};