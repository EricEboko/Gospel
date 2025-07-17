import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { songAPI, artistAPI, statisticsAPI } from '../../utils/api';

// Icons
const MusicIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const StatsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

const DollarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 15h2c0 1.08.81 2 2 2h2c1.08 0 2-.81 2-2s-.81-2-2-2h-2c-1.08 0-2-.81-2-2s.81-2 2-2h2c1.08 0 2 .81 2 2h2c0-1.08-.81-2-2-2V9h-2v2c-1.08 0-2 .81-2 2s.81 2 2 2h2c1.08 0 2 .81 2 2s-.81 2-2 2h-2c-1.08 0-2-.81-2-2H7v2h2z"/>
  </svg>
);

const PlayIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const EditIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export const ArtistDashboard = ({ t, language, onLanguageChange, onReturnHome }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({});
  const [songs, setSongs] = useState([]);
  const [artistProfile, setArtistProfile] = useState(null);
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddSong, setShowAddSong] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [newSong, setNewSong] = useState({
    title: '',
    album: '',
    genre: '',
    duration: '',
    lyrics: '',
    youtube_url: '',
    image_base64: '',
    audio_file_base64: ''
  });

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    genre: '',
    country: '',
    website: '',
    image_base64: ''
  });

  useEffect(() => {
    loadArtistData();
  }, []);

  // Close modals when navigating between tabs
  useEffect(() => {
    setShowEditProfile(false);
  }, [activeTab]);

  const loadArtistData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Find artist profile for current user
      const artists = await artistAPI.getArtists();
      const userArtist = artists.find(artist => artist.user_id === user.id);
      
      if (userArtist) {
        setArtistProfile(userArtist);
        
        // Load dashboard data
        const dashboard = await statisticsAPI.getArtistDashboard(userArtist.id);
        setDashboardData(dashboard);
        
        // Load songs
        const artistSongs = await songAPI.getSongsByArtist(userArtist.id);
        setSongs(artistSongs);
        
        // Load earnings
        const earningsData = await statisticsAPI.getArtistEarnings(userArtist.id);
        setEarnings(earningsData);
        
        // Set profile data
        setProfileData({
          name: userArtist.name || '',
          bio: userArtist.bio || '',
          genre: userArtist.genre || '',
          country: userArtist.country || '',
          website: userArtist.website || '',
          image_base64: userArtist.image_base64 || ''
        });
      }
    } catch (error) {
      console.error('Error loading artist data:', error);
      setError('Failed to load artist data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!artistProfile) return;
    
    setLoading(true);
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
        audio_file_base64: ''
      });
      
      // Reload songs
      const updatedSongs = await songAPI.getSongsByArtist(artistProfile.id);
      setSongs(updatedSongs);
    } catch (error) {
      console.error('Error adding song:', error);
      setError('Failed to add song');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!artistProfile) {
      // Create new artist profile
      try {
        const newArtist = await artistAPI.createArtist({
          ...profileData,
          user_id: user.id
        });
        setArtistProfile(newArtist);
        setShowEditProfile(false);
        await loadArtistData();
      } catch (error) {
        console.error('Error creating artist profile:', error);
        setError('Failed to create artist profile');
      }
      return;
    }
    
    setLoading(true);
    try {
      await artistAPI.updateArtist(artistProfile.id, profileData);
      setShowEditProfile(false);
      await loadArtistData();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'profile_image') {
          setProfileData(prev => ({ ...prev, image_base64: reader.result }));
        } else if (field === 'song_image') {
          setNewSong(prev => ({ ...prev, image_base64: reader.result }));
        } else if (field === 'audio_file') {
          setNewSong(prev => ({ ...prev, audio_file_base64: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white shadow-modern border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onReturnHome}
                className="text-primary-600 hover:text-primary-800 transition-colors mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-xl font-bold text-gray-800">Artist Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                <span>My Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: StatsIcon },
              { key: 'songs', label: 'My Songs', icon: MusicIcon },
              { key: 'earnings', label: 'Earnings', icon: DollarIcon },
              { key: 'profile', label: 'Profile', icon: UserIcon }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <MusicIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Songs</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardData.total_songs || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gold-100 rounded-lg">
                    <PlayIcon className="w-6 h-6 text-gold-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Streams</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardData.total_streams || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <UserIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Monthly Listeners</p>
                    <p className="text-2xl font-bold text-gray-800">{dashboardData.monthly_listeners || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gold-100 rounded-lg">
                    <DollarIcon className="w-6 h-6 text-gold-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">${dashboardData.total_revenue || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Songs */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Songs</h3>
              <div className="space-y-3">
                {dashboardData.top_songs && dashboardData.top_songs.length > 0 ? (
                  dashboardData.top_songs.map((song, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <MusicIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{song.title}</p>
                          <p className="text-sm text-gray-500">{song.streams} streams</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">#{index + 1}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No songs available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'songs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">My Songs</h2>
              <button
                onClick={() => setShowAddSong(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add New Song</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs.map(song => (
                <div key={song.id} className="bg-white rounded-xl shadow-card p-6">
                  {song.image_base64 && (
                    <img
                      src={song.image_base64}
                      alt={song.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-gray-800 mb-2">{song.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{song.album}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{song.play_count} plays</span>
                    <button className="text-primary-600 hover:text-primary-800 transition-colors">
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Earnings</h2>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Earnings</h3>
              <div className="text-3xl font-bold text-gold-600 mb-4">
                ${earnings.total_earnings || 0}
              </div>
              
              {earnings.earnings && earnings.earnings.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-800 mb-3">Daily Earnings (Last 30 Days)</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {earnings.earnings.map((earning, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">{earning.date}</span>
                        <span className="text-sm font-medium text-gray-800">${earning.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
              <button
                onClick={() => setShowEditProfile(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <EditIcon className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center space-x-6 mb-6">
                {artistProfile.image_base64 ? (
                  <img
                    src={artistProfile.image_base64}
                    alt={artistProfile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{artistProfile.name}</h3>
                  <p className="text-gray-600">{artistProfile.genre}</p>
                  <p className="text-sm text-gray-500">{artistProfile.country}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Bio</h4>
                  <p className="text-gray-600">{artistProfile.bio || 'No bio available'}</p>
                </div>
                
                {artistProfile.website && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Website</h4>
                    <a href={artistProfile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 transition-colors">
                      {artistProfile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Song Modal */}
      {showAddSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Song</h3>
                <button
                  onClick={() => setShowAddSong(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddSong} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newSong.title}
                    onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Album</label>
                  <input
                    type="text"
                    value={newSong.album}
                    onChange={(e) => setNewSong({...newSong, album: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <input
                    type="text"
                    value={newSong.genre}
                    onChange={(e) => setNewSong({...newSong, genre: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 3:45)</label>
                  <input
                    type="text"
                    value={newSong.duration}
                    onChange={(e) => setNewSong({...newSong, duration: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={newSong.youtube_url}
                    onChange={(e) => setNewSong({...newSong, youtube_url: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Song Cover</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'song_image')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audio File
                    <span className="text-primary-600 ml-2">(MP3 or WAV format only)</span>
                  </label>
                  <input
                    type="file"
                    accept="audio/mp3,audio/wav,.mp3,.wav"
                    onChange={(e) => handleFileUpload(e, 'audio_file')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Please upload your song file in MP3 or WAV format</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lyrics</label>
                  <textarea
                    value={newSong.lyrics}
                    onChange={(e) => setNewSong({...newSong, lyrics: e.target.value})}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add Song'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSong(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal - Only show when explicitly requested */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {artistProfile ? 'Edit Profile' : 'Create Artist Profile'}
                </h3>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <input
                    type="text"
                    value={profileData.genre}
                    onChange={(e) => setProfileData({...profileData, genre: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profile_image')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};