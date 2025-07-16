import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { artistAPI, songAPI, statisticsAPI } from '../../utils/api';

const StatsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
);

const MusicIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const DollarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 15h2c0 1.08 1.37 2 3 2s3-.92 3-2c0-1.1-1.04-1.5-3.24-2.03C9.64 12.44 7 11.78 7 9c0-1.79 1.79-3 4-3s4 1.21 4 3h2c0-2.72-2.56-4.81-6-4.96V3h-2v1.04C6.56 4.19 5 6.28 5 9c0 3.73 3.6 4.47 6.36 5.27C13.76 14.77 15 15.08 15 17c0 1.08-1.37 2-3 2s-3-.92-3-2H7v2h2v1h2v-1c2.44-.15 6-2.24 6-4.96 0-3.73-3.6-4.47-6.36-5.27z"/>
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const BackIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

export const ArtistDashboard = ({ t, language, onLanguageChange, onReturnHome }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [artistProfile, setArtistProfile] = useState(null);
  const [songs, setSongs] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [newSong, setNewSong] = useState({
    title: '',
    album: '',
    genre: '',
    duration: '',
    lyrics: '',
    youtube_url: '',
    image_base64: '',
    audio_file_base64: '',
    language: 'en',
    country: ''
  });

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    genre: '',
    country: '',
    website: '',
    social_links: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    }
  });

  useEffect(() => {
    loadArtistData();
  }, []);

  const loadArtistData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Find artist profile for current user
      const allArtists = await artistAPI.getArtists();
      const userArtist = allArtists.find(artist => artist.user_id === user.id);
      
      if (userArtist) {
        setArtistProfile(userArtist);
        setProfileData({
          name: userArtist.name || '',
          bio: userArtist.bio || '',
          genre: userArtist.genre || '',
          country: userArtist.country || '',
          website: userArtist.website || '',
          social_links: userArtist.social_links || {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: ''
          }
        });
        
        // Load songs for this artist
        const artistSongs = await songAPI.getSongsByArtist(userArtist.id);
        setSongs(Array.isArray(artistSongs) ? artistSongs : []);
        
        // Load statistics
        const stats = await statisticsAPI.getArtistStatistics(userArtist.id);
        setStatistics(stats);
      } else {
        setError('Artist profile not found. Please contact support.');
      }
    } catch (error) {
      console.error('Error loading artist data:', error);
      setError('Failed to load artist data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, setState, state) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setState(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setState(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!artistProfile) return;
    
    setLoading(true);
    setError('');
    
    try {
      const songData = {
        ...newSong,
        artist_id: artistProfile.id
      };
      
      await songAPI.createSong(songData);
      setShowAddSong(false);
      setNewSong({
        title: '',
        album: '',
        genre: '',
        duration: '',
        lyrics: '',
        youtube_url: '',
        image_base64: '',
        audio_file_base64: '',
        language: 'en',
        country: ''
      });
      
      // Reload data
      loadArtistData();
    } catch (error) {
      setError('Failed to add song: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!artistProfile) return;
    
    setLoading(true);
    setError('');
    
    try {
      await artistAPI.updateArtist(artistProfile.id, profileData);
      setShowProfile(false);
      loadArtistData();
    } catch (error) {
      setError('Failed to update profile: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/20 to-yellow-600/20 p-8 rounded-2xl border border-yellow-500/20">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {artistProfile?.name || user?.first_name}!
        </h1>
        <p className="text-gray-300">Track your music performance and manage your songs</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Streams</h3>
              <p className="text-3xl font-bold">{statistics.total_streams || 0}</p>
            </div>
            <StatsIcon className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Songs</h3>
              <p className="text-3xl font-bold">{statistics.total_songs || 0}</p>
            </div>
            <MusicIcon className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Monthly Listeners</h3>
              <p className="text-3xl font-bold">{statistics.monthly_listeners || 0}</p>
            </div>
            <StatsIcon className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Estimated Earnings</h3>
              <p className="text-3xl font-bold">${((statistics.total_streams || 0) * 0.004).toFixed(2)}</p>
            </div>
            <DollarIcon className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Top Songs */}
      {statistics.top_songs && statistics.top_songs.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Top Songs</h3>
          <div className="space-y-3">
            {statistics.top_songs.map((song, index) => (
              <div key={song.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400 font-bold">#{index + 1}</span>
                  <span className="text-white">{song.title}</span>
                </div>
                <span className="text-gray-400">{song.play_count} plays</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSongs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Songs</h2>
        <button
          onClick={() => setShowAddSong(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Song</span>
        </button>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-12">
          <MusicIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No songs yet. Add your first song!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <div key={song.id} className="bg-gray-800 p-6 rounded-xl">
              <div className="w-full aspect-square bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-4 overflow-hidden">
                {song.image_base64 ? (
                  <img
                    src={`data:image/jpeg;base64,${song.image_base64}`}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MusicIcon className="w-12 h-12 text-black" />
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold mb-2">{song.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{song.genre || 'No genre'}</p>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Plays: {song.play_count || 0}</span>
                <span>Likes: {song.likes || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Artist Profile</h2>
      
      <div className="bg-gray-800 p-6 rounded-xl">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Stage Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={(e) => handleInputChange(e, setProfileData, profileData)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange(e, setProfileData, profileData)}
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Genre</label>
              <input
                type="text"
                name="genre"
                value={profileData.genre}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={profileData.country}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={profileData.website}
              onChange={(e) => handleInputChange(e, setProfileData, profileData)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="https://your-website.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Social Links</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="url"
                name="social_links.facebook"
                value={profileData.social_links.facebook}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Facebook URL"
              />
              <input
                type="url"
                name="social_links.instagram"
                value={profileData.social_links.instagram}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Instagram URL"
              />
              <input
                type="url"
                name="social_links.twitter"
                value={profileData.social_links.twitter}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Twitter URL"
              />
              <input
                type="url"
                name="social_links.youtube"
                value={profileData.social_links.youtube}
                onChange={(e) => handleInputChange(e, setProfileData, profileData)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="YouTube URL"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur-md border-r border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-white">Artist Dashboard</h1>
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
              
              <button
                onClick={() => setActiveTab('songs')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'songs' ? 'bg-yellow-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                My Songs
              </button>
              
              <button
                onClick={() => setShowProfile(true)}
                className="w-full text-left px-4 py-2 rounded-lg transition-colors text-gray-300 hover:bg-gray-700"
              >
                Edit Profile
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

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <>
              {!showProfile && activeTab === 'dashboard' && renderDashboard()}
              {!showProfile && activeTab === 'songs' && renderSongs()}
              {showProfile && renderProfile()}
            </>
          )}
        </div>
      </div>

      {/* Add Song Modal */}
      {showAddSong && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Add New Song</h3>
            <form onSubmit={handleAddSong} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Song Title"
                value={newSong.title}
                onChange={(e) => handleInputChange(e, setNewSong, newSong)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <input
                type="text"
                name="album"
                placeholder="Album (optional)"
                value={newSong.album}
                onChange={(e) => handleInputChange(e, setNewSong, newSong)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={newSong.genre}
                onChange={(e) => handleInputChange(e, setNewSong, newSong)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g., 3:45)"
                value={newSong.duration}
                onChange={(e) => handleInputChange(e, setNewSong, newSong)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                name="lyrics"
                placeholder="Song lyrics (optional)"
                value={newSong.lyrics}
                onChange={(e) => handleInputChange(e, setNewSong, newSong)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="url"
                name="youtube_url"
                placeholder="YouTube URL (optional)"
                value={newSong.youtube_url}
                onChange={(e) => handleInputChange(e, setNewSong, newSong)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Song'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSong(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};