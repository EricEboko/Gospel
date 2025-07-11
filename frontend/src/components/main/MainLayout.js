import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { songAPI, artistAPI } from '../../utils/api';
import { AudioPlayer } from '../audio/AudioPlayer';
import { AdminConsole } from '../admin/AdminConsole';

// Icons
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

export const MainLayout = ({ t, language, onLanguageChange }) => {
  const { user, logout, isSuperAdmin, isLabelManager } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'home':
          const trendingSongs = await songAPI.getTrendingSongs(20);
          setSongs(trendingSongs);
          break;
        case 'search':
          // Search results loaded when user types
          break;
        case 'library':
          if (isLabelManager()) {
            const myArtists = await artistAPI.getMyArtists();
            setArtists(myArtists);
            const mySongs = await songAPI.getMySongs();
            setSongs(mySongs);
          } else {
            // For regular users, show their playlists/liked songs
            const newReleases = await songAPI.getNewReleases(20);
            setSongs(newReleases);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const results = await songAPI.searchSongs(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handlePlaySong = async (song) => {
    try {
      // Get full song data including audio
      const fullSong = await songAPI.getSong(song.id);
      setCurrentSong(fullSong);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const renderHome = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-600/20 to-purple-600/20 p-8 rounded-2xl border border-gold-500/20">
        <h1 className="text-4xl font-bold text-white mb-4">
          {new Date().getHours() < 12 ? t.goodMorning : 
           new Date().getHours() < 18 ? t.goodAfternoon : t.goodEvening}, 
          {user?.first_name || 'User'}!
        </h1>
        <p className="text-gray-300 text-lg">
          {isSuperAdmin() ? 'Manage your platform and view analytics' :
           isLabelManager() ? 'Manage your artists and track their performance' :
           'Discover amazing Gospel music'}
        </p>
      </div>

      {/* Quick Actions for Label Managers */}
      {isLabelManager() && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveTab('admin')}
            className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white hover:from-blue-700 hover:to-blue-900 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">Manage Artists</h3>
            <p className="text-blue-200">Add and manage your artists</p>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl text-white hover:from-purple-700 hover:to-purple-900 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">Upload Songs</h3>
            <p className="text-purple-200">Add new songs with lyrics</p>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className="bg-gradient-to-br from-gold-600 to-gold-800 p-6 rounded-xl text-white hover:from-gold-700 hover:to-gold-900 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold mb-2">View Statistics</h3>
            <p className="text-gold-200">Track artist performance</p>
          </button>
        </div>
      )}

      {/* Trending Songs */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer"
              onClick={() => handlePlaySong(song)}
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg overflow-hidden">
                  {song.image_base64 ? (
                    <img
                      src={`data:image/jpeg;base64,${song.image_base64}`}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🎵</span>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <PlayIcon className="w-5 h-5 ml-1" />
                </button>
              </div>
              <h3 className="text-white font-medium truncate">{song.title}</h3>
              <p className="text-gray-400 text-sm truncate">{song.artist_name || 'Unknown Artist'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-6">
      <div className="sticky top-0 bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-gray-700/50 z-10">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder || "Search for songs, artists..."}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          />
        </div>
      </div>

      {searchResults.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            {t.searchResults || "Search results for"} "{searchQuery}"
          </h2>
          <div className="space-y-2">
            {searchResults.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer flex items-center space-x-4"
                onClick={() => handlePlaySong(song)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex-shrink-0 overflow-hidden">
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
                <button className="w-10 h-10 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center text-black transition-colors duration-200">
                  <PlayIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLibrary = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">{t.library || 'Your Library'}</h1>
      
      {isLabelManager() && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Your Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mx-auto mb-4 overflow-hidden">
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
                <div className="text-center">
                  <span className="text-gold-400 text-sm">{artist.total_streams} streams</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          {isLabelManager() ? 'Your Songs' : 'Recently Added'}
        </h2>
        <div className="space-y-2">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer flex items-center space-x-4"
              onClick={() => handlePlaySong(song)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex-shrink-0 overflow-hidden">
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
                {song.duration || '0:00'}
              </div>
              <button className="w-10 h-10 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center text-black transition-colors duration-200">
                <PlayIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (activeTab === 'admin' && (isSuperAdmin() || isLabelManager())) {
    return <AdminConsole t={t} language={language} onLanguageChange={onLanguageChange} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-black/40 backdrop-blur-md border-r border-gray-700 flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎵</span>
            </div>
            <h1 className="text-xl font-bold text-white">GospelSpot</h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <HomeIcon />
              <span>{t.home || 'Home'}</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'search' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <SearchIcon />
              <span>{t.search || 'Search'}</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'library' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <LibraryIcon />
              <span>{t.library || 'Your Library'}</span>
            </button>

            {(isSuperAdmin() || isLabelManager()) && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'admin' ? 'bg-gold-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <CrownIcon />
                <span>{isSuperAdmin() ? 'Admin Console' : 'Manager Console'}</span>
              </button>
            )}
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto p-6 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.first_name?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-gray-400 text-sm truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            {t.logout || 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
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
        <AudioPlayer
          currentSong={currentSong}
          onSongEnd={() => setCurrentSong(null)}
          t={t}
        />
      </div>
    </div>
  );
};