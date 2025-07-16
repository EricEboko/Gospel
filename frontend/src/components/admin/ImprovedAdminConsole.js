import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, artistAPI, songAPI, statisticsAPI } from '../../utils/api';

const BackIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

export const ImprovedAdminConsole = ({ t, language, onLanguageChange, onReturnHome }) => {
  const { user, isSuperAdmin, isLabelManager } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateArtist, setShowCreateArtist] = useState(false);
  const [showCreateSong, setShowCreateSong] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    role: 'user'
  });

  const [newArtist, setNewArtist] = useState({
    name: '',
    bio: '',
    genre: '',
    country: '',
    image_base64: '',
    website: '',
    social_links: {}
  });

  const [newSong, setNewSong] = useState({
    title: '',
    artist_id: '',
    album: '',
    genre: '',
    duration: '',
    lyrics: '',
    youtube_url: '',
    image_base64: '',
    audio_file_base64: ''
  });

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      switch (activeTab) {
        case 'dashboard':
          const stats = await statisticsAPI.getDashboardStatistics();
          setStatistics(stats);
          break;
        case 'users':
          if (isSuperAdmin()) {
            const usersData = await userAPI.getUsers();
            setUsers(Array.isArray(usersData) ? usersData : []);
          }
          break;
        case 'artists':
          if (isLabelManager()) {
            const myArtists = await artistAPI.getMyArtists();
            setArtists(Array.isArray(myArtists) ? myArtists : []);
          } else if (isSuperAdmin()) {
            const allArtists = await artistAPI.getArtists();
            setArtists(Array.isArray(allArtists) ? allArtists : []);
          }
          break;
        case 'songs':
          if (isLabelManager()) {
            const mySongs = await songAPI.getMySongs();
            setSongs(Array.isArray(mySongs) ? mySongs : []);
          } else if (isSuperAdmin()) {
            const allSongs = await songAPI.getSongs();
            setSongs(Array.isArray(allSongs) ? allSongs : []);
          }
          break;
        case 'revenue':
          if (isSuperAdmin()) {
            const adsRevenue = await statisticsAPI.getAdsRevenue();
            setStatistics(prev => ({ ...prev, adsRevenue }));
          }
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, setState, state) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await userAPI.createUser(newUser);
      setShowCreateUser(false);
      setNewUser({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role: 'user'
      });
      loadDashboardData();
    } catch (error) {
      setError('Failed to create user: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArtist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await artistAPI.createArtist(newArtist);
      setShowCreateArtist(false);
      setNewArtist({
        name: '',
        bio: '',
        genre: '',
        country: '',
        image_base64: '',
        website: '',
        social_links: {}
      });
      loadDashboardData();
    } catch (error) {
      setError('Failed to create artist: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'block':
          await userAPI.blockUser(userId);
          break;
        case 'unblock':
          await userAPI.unblockUser(userId);
          break;
        case 'delete':
          setShowDeleteConfirm(userId);
          return;
      }
      loadDashboardData();
    } catch (error) {
      setError('Failed to perform action: ' + (error.response?.data?.detail || error.message));
    }
  };

  const confirmUserDeletion = async (removeArtists) => {
    if (!showDeleteConfirm) return;
    
    try {
      await userAPI.deleteUser(showDeleteConfirm, removeArtists);
      setShowDeleteConfirm(null);
      loadDashboardData();
    } catch (error) {
      setError('Failed to delete user: ' + (error.response?.data?.detail || error.message));
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isSuperAdmin() && (
          <>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{statistics.total_users || 0}</p>
              <p className="text-blue-200 text-sm">Active: {statistics.active_users || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Revenue</h3>
              <p className="text-3xl font-bold">${statistics.total_revenue || 0}</p>
              <p className="text-green-200 text-sm">Premium: {statistics.premium_users || 0}</p>
            </div>
          </>
        )}
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Total Artists</h3>
          <p className="text-3xl font-bold">{statistics.total_artists || 0}</p>
          <p className="text-purple-200 text-sm">Active</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Total Songs</h3>
          <p className="text-3xl font-bold">{statistics.total_songs || 0}</p>
          <p className="text-yellow-200 text-sm">Total streams: {statistics.total_streams || 0}</p>
        </div>
      </div>

      {statistics.top_genres && Array.isArray(statistics.top_genres) && (
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Top Genres</h3>
          <div className="space-y-3">
            {statistics.top_genres.map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{genre.genre}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (genre.streams / (statistics.total_streams || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-20 text-right">{genre.streams}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <button 
          onClick={() => setShowCreateUser(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Create User
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'label_manager' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'artist' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'block')}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'unblock')}
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          Unblock
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderArtists = () => (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Artists Management</h2>
      <p>Artists management panel - Coming soon...</p>
    </div>
  );

  const renderSongs = () => (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Songs Management</h2>
      <p>Songs management panel - Coming soon...</p>
    </div>
  );

  const renderRevenue = () => (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Revenue Analytics</h2>
      <p>Revenue analytics panel - Coming soon...</p>
    </div>
  );

  const renderMonetization = () => (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Monetization</h2>
      <p>Monetization panel - Coming soon...</p>
    </div>
  );

  const renderAdvertisement = () => (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Advertisement Management</h2>
      <p>Advertisement management panel - Coming soon...</p>
    </div>
  );

  const renderSettings = () => (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p>Settings panel - Coming soon...</p>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Profile</h2>
      
      <div className="bg-gray-800 p-6 rounded-xl">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={profileData.first_name}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profileData.last_name}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={(e) => handleInputChange(e, setProfileData, profileData)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={profileData.phone_number}
              onChange={(e) => handleInputChange(e, setProfileData, profileData)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div className="border-t border-gray-600 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  value={profileData.current_password}
                  onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={profileData.new_password}
                  onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={profileData.confirm_password}
                  onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowProfile(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Create User Modal
  const CreateUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Create New User</h3>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => handleInputChange(e, setNewUser, newUser)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => handleInputChange(e, setNewUser, newUser)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newUser.first_name}
            onChange={(e) => handleInputChange(e, setNewUser, newUser)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newUser.last_name}
            onChange={(e) => handleInputChange(e, setNewUser, newUser)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={newUser.phone_number}
            onChange={(e) => handleInputChange(e, setNewUser, newUser)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={(e) => handleInputChange(e, setNewUser, newUser)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="user">User</option>
            <option value="artist">Artist</option>
            <option value="label_manager">Label Manager</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateUser(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur-md border-r border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-white">Admin Console</h1>
              <button
                onClick={onReturnHome}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                title="Return to Home"
              >
                <BackIcon className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
              
              {isSuperAdmin() && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'users' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  User Management
                </button>
              )}
              
              {(isLabelManager() || isSuperAdmin()) && (
                <>
                  <button
                    onClick={() => setActiveTab('artists')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'artists' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Artists
                  </button>
                  <button
                    onClick={() => setActiveTab('songs')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'songs' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Songs
                  </button>
                </>
              )}
              
              {isSuperAdmin() && (
                <button
                  onClick={() => setActiveTab('revenue')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'revenue' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Ad Revenue
                </button>
              )}
              
              <button
                onClick={() => setShowProfile(true)}
                className="w-full text-left px-4 py-2 rounded-lg transition-colors text-gray-300 hover:bg-gray-700"
              >
                My Profile
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
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

          {loading && !error ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <>
              {!showProfile && activeTab === 'dashboard' && renderDashboard()}
              {!showProfile && activeTab === 'users' && renderUsers()}
              {!showProfile && activeTab === 'artists' && renderArtists()}
              {!showProfile && activeTab === 'songs' && renderSongs()}
              {!showProfile && activeTab === 'revenue' && renderRevenue()}
              {!showProfile && activeTab === 'monetization' && renderMonetization()}
              {!showProfile && activeTab === 'advertisement' && renderAdvertisement()}
              {!showProfile && activeTab === 'settings' && renderSettings()}
              {showProfile && renderProfile()}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateUser && <CreateUserModal />}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this user? If this user is a label manager, 
              what should happen to their artists?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => confirmUserDeletion(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete All
              </button>
              <button
                onClick={() => confirmUserDeletion(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Keep Artists
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};