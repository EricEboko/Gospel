import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const FixedSimplifiedAuth = ({ t, onLanguageChange }) => {
  const [step, setStep] = useState(1); // 1: login, 2: register-step1, 3: register-step2
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    country: '',
    language: 'en',
    role: 'user'
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');

    // Real-time password validation
    if (name === 'password') {
      setPasswordCriteria({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
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

  const handleRegisterStep1 = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone_number || !formData.first_name || !formData.last_name) {
      setError('All fields are required');
      return;
    }
    setStep(3); // Go to password creation
  };

  const handleRegisterStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password criteria
    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
    if (!allCriteriaMet) {
      setError('Password does not meet all criteria');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        ...formData,
        email_verified: true
      });
      
      // Auto-login after registration
      await login({
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
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
    setStep(1);
    resetForm();
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setStep(2);
    resetForm();
  };

  const CriteriaItem = ({ met, text }) => (
    <div className={`flex items-center space-x-2 ${met ? 'text-green-600' : 'text-red-600'}`}>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        met ? 'bg-green-500 border-green-500' : 'border-red-400'
      }`}>
        {met && <span className="text-white text-xs">✓</span>}
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-modern border border-white/20 w-full max-w-md">
        
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <select
            value={formData.language}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, language: e.target.value }));
              onLanguageChange(e.target.value);
            }}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">GospelSpot</h1>
          <p className="text-gray-600">
            {isLogin ? t.login : (step === 2 ? 'Create Account' : 'Set Password')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* Login Form */}
        {isLogin && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Register Step 1: Email & Phone */}
        {!isLogin && step === 2 && (
          <form onSubmit={handleRegisterStep1} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="user">Regular User</option>
                <option value="artist">Artist</option>
                <option value="label_manager">Label/Manager</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
            >
              Send
            </button>
          </form>
        )}

        {/* Register Step 2: Password Creation */}
        {!isLogin && step === 3 && (
          <form onSubmit={handleRegisterStep2} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Create password"
                required
              />
            </div>

            {/* Password Criteria */}
            <div className="space-y-2">
              <CriteriaItem met={passwordCriteria.length} text="At least 8 characters" />
              <CriteriaItem met={passwordCriteria.uppercase} text="At least 1 uppercase letter" />
              <CriteriaItem met={passwordCriteria.lowercase} text="At least 1 lowercase letter" />
              <CriteriaItem met={passwordCriteria.number} text="At least 1 number" />
              <CriteriaItem met={passwordCriteria.special} text="At least 1 special character" />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  formData.confirmPassword && formData.password === formData.confirmPassword
                    ? 'border-green-500/50'
                    : formData.confirmPassword
                    ? 'border-red-500/50'
                    : 'border-purple-500/30'
                }`}
                placeholder="Confirm password"
                required
              />
              {formData.confirmPassword && (
                <p className={`text-sm mt-1 ${
                  formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !Object.values(passwordCriteria).every(Boolean) || formData.password !== formData.confirmPassword}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Creating account...' : 'Confirm Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          {isLogin ? (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={switchToRegister}
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={switchToLogin}
                className="text-yellow-400 hover:text-yellow-300 font-medium"
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