import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, artistAPI, songAPI, statisticsAPI } from '../../utils/api';

export const FixedAdminConsole = ({ t, language, onLanguageChange }) => {
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

  const handleCreateSong = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await songAPI.createSong(newSong);
      setShowCreateSong(false);
      setNewSong({
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
      loadDashboardData();
    } catch (error) {
      setError('Failed to create song: ' + (error.response?.data?.detail || error.message));
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
      {/* Language Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
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

      {/* Statistics Cards */}
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

      {/* Charts and Analytics */}
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

  const renderArtists = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Artist Management</h2>
        <button 
          onClick={() => setShowCreateArtist(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Create Artist
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-gray-800 p-6 rounded-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 overflow-hidden">
              {artist.image_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${artist.image_base64}`}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              )}
            </div>
            <h3 className="text-white font-semibold text-center mb-2">{artist.name}</h3>
            <p className="text-gray-400 text-sm text-center mb-4">{artist.genre || 'No genre'}</p>
            <div className="text-center space-y-2">
              <span className="text-yellow-400 text-sm block">{artist.total_streams || 0} streams</span>
              <span className="text-gray-400 text-sm block">{artist.total_songs || 0} songs</span>
              {artist.verified && (
                <span className="text-green-400 text-sm">✓ Verified</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSongs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Song Management</h2>
        <button 
          onClick={() => setShowCreateSong(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Create Song
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {songs.map((song) => (
          <div key={song.id} className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex-shrink-0 overflow-hidden">
              {song.image_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${song.image_base64}`}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-lg">🎵</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{song.title}</h3>
              <p className="text-gray-400 text-sm truncate">{song.artist_name || 'Unknown Artist'}</p>
            </div>
            <div className="text-gray-400 text-sm">
              {song.play_count || 0} plays
            </div>
          </div>
        ))}
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

  // Create User Modal
  const CreateUserModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Create New User</h3>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={newUser.first_name}
            onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newUser.last_name}
            onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newUser.phone_number}
            onChange={(e) => setNewUser({...newUser, phone_number: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
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
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateUser(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
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
            <h1 className="text-2xl font-bold text-white mb-8">Admin Console</h1>
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
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {loading && !error ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'artists' && renderArtists()}
              {activeTab === 'songs' && renderSongs()}
              {activeTab === 'revenue' && renderRevenue()}
            </>
          )}
        </div>
      </div>

      {/* Create User Modal */}
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