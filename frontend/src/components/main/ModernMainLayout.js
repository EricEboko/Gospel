import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { songAPI, artistAPI } from '../../utils/api';
import { FixedAudioPlayer } from '../audio/FixedAudioPlayer';
import { ModernAdminConsole } from '../admin/ModernAdminConsole';
import { ArtistDashboard } from '../artist/ArtistDashboard';

// Modern Icons
const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const LibraryIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
  </svg>
);

const CrownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 1.4L12 8l-3.1 2-2.1-1.4L7.7 14z"/>
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

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const MusicIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const FilterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </svg>
);

export const ModernMainLayout = ({ t, language, onLanguageChange }) => {
  const { user, logout, isSuperAdmin, isLabelManager, isArtist } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    language: '',
    country: '',
    dateFrom: '',
    dateTo: '',
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    setError('');
    try {
      switch (activeTab) {
        case 'home':
          const trendingSongs = await songAPI.getTrendingSongs(20);
          setSongs(Array.isArray(trendingSongs) ? trendingSongs : []);
          break;
        case 'search':
          // Search results loaded when user types
          break;
        case 'library':
          if (isLabelManager()) {
            const myArtists = await artistAPI.getMyArtists();
            setArtists(Array.isArray(myArtists) ? myArtists : []);
            const mySongs = await songAPI.getMySongs();
            setSongs(Array.isArray(mySongs) ? mySongs : []);
          } else {
            // For regular users, show their playlists/liked songs
            const newReleases = await songAPI.getNewReleases(20);
            setSongs(Array.isArray(newReleases) ? newReleases : []);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const results = await songAPI.searchSongs(query);
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    // Record play count
    songAPI.playSong(song.id).catch(console.error);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    try {
      // Create playlist logic would go here
      setShowCreatePlaylist(false);
      setNewPlaylistName('');
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  // Show admin console
  if (activeTab === 'admin') {
    return (
      <ModernAdminConsole
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        onReturnHome={() => setActiveTab('home')}
      />
    );
  }

  // Show artist dashboard
  if (activeTab === 'artist') {
    return (
      <ArtistDashboard
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
        onReturnHome={() => setActiveTab('home')}
      />
    );
  }

  const renderHome = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to GospelSpot
        </h1>
        <p className="text-lg text-gray-600">
          Discover and enjoy Christian music from around the world
        </p>
      </div>

      {/* Quick Actions for Artists */}
      {isArtist() && (
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Artist Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('artist')}
              className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-lg text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">My Dashboard</h4>
              <p className="text-primary-100 text-sm">View your stats and manage your music</p>
            </button>
            <button
              onClick={() => setActiveTab('artist')}
              className="bg-gradient-to-r from-gold-500 to-gold-600 p-4 rounded-lg text-white hover:from-gold-600 hover:to-gold-700 transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Upload Songs</h4>
              <p className="text-gold-100 text-sm">Add new songs to your collection</p>
            </button>
            <button
              onClick={() => setActiveTab('artist')}
              className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Earnings</h4>
              <p className="text-green-100 text-sm">Track your revenue and statistics</p>
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions for Label Managers */}
      {isLabelManager() && (
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Manager Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('admin')}
              className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-lg text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Manage Artists</h4>
              <p className="text-primary-100 text-sm">Add and manage your artists</p>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="bg-gradient-to-r from-gold-500 to-gold-600 p-4 rounded-lg text-white hover:from-gold-600 hover:to-gold-700 transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">Upload Songs</h4>
              <p className="text-gold-100 text-sm">Add new songs with lyrics</p>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              <h4 className="font-semibold mb-2">View Analytics</h4>
              <p className="text-green-100 text-sm">Track artist performance and earnings</p>
            </button>
          </div>
        </div>
      )}

      {/* Trending Songs */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-modern transition-all duration-200 group cursor-pointer"
              onClick={() => handlePlaySong(song)}
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl overflow-hidden">
                  {song.image_base64 ? (
                    <img
                      src={song.image_base64}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MusicIcon className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <PlayIcon className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <h3 className="text-gray-800 font-semibold truncate">{song.title}</h3>
              <p className="text-gray-500 text-sm truncate">{song.artist_name || 'Unknown Artist'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-6">
      {/* Advanced Search Bar */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search artists, songs, albums, or release date..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
            >
              <FilterIcon className="w-4 h-4" />
              <span>Advanced Filters</span>
            </button>
            {(searchFilters.category || searchFilters.language || searchFilters.country || searchFilters.type) && (
              <button
                onClick={() => setSearchFilters({ category: '', language: '', country: '', dateFrom: '', dateTo: '', type: '' })}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={searchFilters.category}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Gospel">Gospel</option>
                  <option value="Contemporary Christian">Contemporary Christian</option>
                  <option value="Praise & Worship">Praise & Worship</option>
                  <option value="Celtic Gospel">Celtic Gospel</option>
                  <option value="Hip Hop Gospel">Hip Hop Gospel</option>
                  <option value="Country Gospel">Country Gospel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={searchFilters.language}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Korean">Korean</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={searchFilters.country}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  <option value="USA">United States</option>
                  <option value="Brazil">Brazil</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={searchFilters.type}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Single">Single</option>
                  <option value="EP">EP</option>
                  <option value="Album">Album</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={searchFilters.dateTo}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {(searchQuery || Object.values(searchFilters).some(filter => filter)) && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Search Results {searchQuery && `for "${searchQuery}"`}
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((song) => (
                <div
                  key={song.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer flex items-center space-x-4"
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex-shrink-0 overflow-hidden">
                    {song.image_base64 ? (
                      <img
                        src={song.image_base64}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MusicIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-medium">{song.title}</h3>
                    <p className="text-gray-500 text-sm">{song.artist_name || 'Unknown Artist'}</p>
                    <p className="text-gray-400 text-xs">{song.album} • {song.genre}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{song.duration}</p>
                    <p>{song.play_count} plays</p>
                  </div>
                  <button className="p-2 rounded-full bg-gold-500 hover:bg-gold-600 text-white transition-colors">
                    <PlayIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Default Search Suggestions */}
      {!searchQuery && !Object.values(searchFilters).some(filter => filter) && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Discover Music</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Gospel', 'Contemporary Christian', 'Praise & Worship', 'Celtic Gospel'].map(genre => (
              <button
                key={genre}
                onClick={() => setSearchFilters(prev => ({ ...prev, category: genre }))}
                className="p-4 bg-gradient-to-r from-primary-50 to-gold-50 rounded-lg hover:from-primary-100 hover:to-gold-100 transition-colors text-center"
              >
                <MusicIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">{genre}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLibrary = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Library</h2>
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        </div>

        {isLabelManager() && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">My Artists</h3>
              <p className="text-3xl font-bold">{artists.length}</p>
              <p className="text-primary-100 text-sm">Total managed artists</p>
            </div>
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-6 rounded-xl text-white">
              <h3 className="text-lg font-semibold mb-2">My Songs</h3>
              <p className="text-3xl font-bold">{songs.length}</p>
              <p className="text-gold-100 text-sm">Total songs uploaded</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Songs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex-shrink-0 overflow-hidden">
                    {song.image_base64 ? (
                      <img
                        src={song.image_base64}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MusicIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 font-medium truncate">{song.title}</h4>
                    <p className="text-gray-500 text-sm truncate">{song.artist_name || 'Unknown Artist'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-modern flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full flex items-center justify-center">
              <MusicIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">GospelSpot</h1>
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-4 border-b border-gray-200">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'home' ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <HomeIcon />
            <span>{t.home || 'Home'}</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'search' ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <SearchIcon />
            <span>{t.search || 'Search'}</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'library' ? 'bg-primary-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LibraryIcon />
            <span>{t.library || 'Your Library'}</span>
          </button>

          {isArtist() && (
            <button
              onClick={() => setActiveTab('artist')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'artist' ? 'bg-gold-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserIcon />
              <span>Artist Dashboard</span>
            </button>
          )}

          {(isSuperAdmin() || isLabelManager()) && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'admin' ? 'bg-gold-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CrownIcon />
              <span>{isSuperAdmin() ? 'Admin Console' : 'Manager Console'}</span>
            </button>
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-gold-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-gray-500 text-sm truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            {t.logout || 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'home' && renderHome()}
              {activeTab === 'search' && renderSearch()}
              {activeTab === 'library' && renderLibrary()}
            </>
          )}
        </div>

        {/* Audio Player */}
        <FixedAudioPlayer
          currentSong={currentSong}
          onSongEnd={() => setCurrentSong(null)}
          onClose={() => setCurrentSong(null)}
          t={t}
        />
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-modern p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleCreatePlaylist}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreatePlaylist(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition-colors"
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