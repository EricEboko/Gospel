import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, artistAPI, songAPI, statisticsAPI } from '../../utils/api';

export const AdminConsole = ({ t, language, onLanguageChange }) => {
  const { user, isSuperAdmin, isLabelManager } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showArtistRemovalConfirm, setShowArtistRemovalConfirm] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'dashboard':
          const stats = await statisticsAPI.getDashboardStatistics();
          setStatistics(stats);
          break;
        case 'users':
          if (isSuperAdmin()) {
            const usersData = await userAPI.getUsers();
            setUsers(usersData);
          }
          break;
        case 'artists':
          if (isLabelManager()) {
            const myArtists = await artistAPI.getMyArtists();
            setArtists(myArtists);
          } else if (isSuperAdmin()) {
            const allArtists = await artistAPI.getArtists();
            setArtists(allArtists);
          }
          break;
        case 'songs':
          if (isLabelManager()) {
            const mySongs = await songAPI.getMySongs();
            setSongs(mySongs);
          } else if (isSuperAdmin()) {
            const allSongs = await songAPI.getSongs();
            setSongs(allSongs);
          }
          break;
        case 'revenue':
          if (isSuperAdmin()) {
            const adsRevenue = await statisticsAPI.getAdsRevenue();
            setStatistics({ ...statistics, adsRevenue });
          }
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
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
      console.error('Error performing user action:', error);
    }
  };

  const confirmUserDeletion = async (removeArtists) => {
    if (!showDeleteConfirm) return;
    
    try {
      await userAPI.deleteUser(showDeleteConfirm, removeArtists);
      setShowDeleteConfirm(null);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{t.dashboard}</h2>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isSuperAdmin() && (
          <>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">{t.totalUsers}</h3>
              <p className="text-3xl font-bold">{statistics.total_users || 0}</p>
              <p className="text-blue-200 text-sm">+{statistics.user_growth || 0}% this month</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">{t.revenue}</h3>
              <p className="text-3xl font-bold">${statistics.total_revenue || 0}</p>
              <p className="text-green-200 text-sm">+{statistics.revenue_growth || 0}% this month</p>
            </div>
          </>
        )}
        
        {(isLabelManager() || isSuperAdmin()) && (
          <>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Total Artists</h3>
              <p className="text-3xl font-bold">{statistics.total_artists || 0}</p>
              <p className="text-purple-200 text-sm">Under management</p>
            </div>
            <div className="bg-gradient-to-br from-gold-600 to-gold-800 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">Total Streams</h3>
              <p className="text-3xl font-bold">{statistics.total_streams || 0}</p>
              <p className="text-gold-200 text-sm">All time</p>
            </div>
          </>
        )}
      </div>

      {/* Charts and Analytics */}
      {statistics.top_genres && (
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Top Genres</h3>
          <div className="space-y-3">
            {statistics.top_genres.map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{genre.genre}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full"
                      style={{ width: `${(genre.streams / statistics.total_streams) * 100}%` }}
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
        <button className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-lg">
          Create User
        </button>
      </div>

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
                          className="text-red-400 hover:text-red-300"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'unblock')}
                          className="text-green-400 hover:text-green-300"
                        >
                          Unblock
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-400 hover:text-red-300"
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

  const renderRevenue = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Google Ads Revenue</h2>
      
      {statistics.adsRevenue && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">${statistics.adsRevenue.total_revenue || 0}</p>
            <p className="text-green-200 text-sm">+{statistics.adsRevenue.revenue_growth || 0}% growth</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Total Impressions</h3>
            <p className="text-3xl font-bold">{statistics.adsRevenue.total_impressions || 0}</p>
            <p className="text-blue-200 text-sm">Average CTR: {statistics.adsRevenue.average_ctr || 0}%</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl text-white">
            <h3 className="text-lg font-semibold mb-2">Projected Monthly</h3>
            <p className="text-3xl font-bold">${statistics.adsRevenue.projected_monthly_revenue || 0}</p>
            <p className="text-purple-200 text-sm">Based on current performance</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur-md border-r border-gray-700 min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-8">Admin Console</h1>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
              
              {isSuperAdmin() && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'users' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
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
                      activeTab === 'artists' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Artists
                  </button>
                  <button
                    onClick={() => setActiveTab('songs')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'songs' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
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
                    activeTab === 'revenue' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Ad Revenue
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'revenue' && renderRevenue()}
            </>
          )}
        </div>
      </div>

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
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              >
                Delete All
              </button>
              <button
                onClick={() => confirmUserDeletion(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Keep Artists
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
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