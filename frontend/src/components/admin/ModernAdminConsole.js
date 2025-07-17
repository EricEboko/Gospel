import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, artistAPI, songAPI, statisticsAPI, advertisementAPI } from '../../utils/api';

// Icons
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

const DeleteIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
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

const StatsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

const MoneyIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 15h2c0 1.08.81 2 2 2h2c1.08 0 2-.81 2-2s-.81-2-2-2h-2c-1.08 0-2-.81-2-2s.81-2 2-2h2c1.08 0 2 .81 2 2h2c0-1.08-.81-2-2-2V9h-2v2c-1.08 0-2 .81-2 2s.81 2 2 2h2c1.08 0 2 .81 2 2s-.81 2-2 2h-2c-1.08 0-2-.81-2-2H7v2h2z"/>
  </svg>
);

const AdsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
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

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export const ModernAdminConsole = ({ t, language, onLanguageChange, onReturnHome }) => {
  const { user, isSuperAdmin, isLabelManager } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [advertisements, setAdvertisements] = useState([]);
  const [adSettings, setAdSettings] = useState({});
  const [labelManagers, setLabelManagers] = useState([]);
  
  // Modal states
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateArtist, setShowCreateArtist] = useState(false);
  const [showCreateSong, setShowCreateSong] = useState(false);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [showCreateManager, setShowCreateManager] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Filter states
  const [artistFilter, setArtistFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  
  // Form states
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
    first_name: '',
    last_name: '',
    stage_name: '',
    date_of_birth: '',
    country: '',
    email: '',
    phone_number: '',
    bio: '',
    genre: '',
    image_base64: ''
  });
  
  const [newSong, setNewSong] = useState({
    title: '',
    artist_id: '',
    album: '',
    type: 'single',
    album_name: '',
    is_featuring: false,
    featuring_artists: '',
    genre: '',
    duration: '',
    lyrics: '',
    youtube_url: '',
    image_base64: '',
    audio_file_base64: ''
  });
  
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    file_type: 'video',
    file_base64: '',
    duration: 30,
    skip_after: 5
  });
  
  const [newManager, setNewManager] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    company_name: ''
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
  
  const [settingsData, setSettingsData] = useState({
    ad_frequency: 3,
    min_stream_length: 30,
    min_ad_duration: 5,
    max_ad_duration: 60
  });

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  useEffect(() => {
    // Close profile modal when navigating
    setShowProfile(false);
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
          const artistsData = isLabelManager() 
            ? await artistAPI.getMyArtists()
            : await artistAPI.getArtists();
          setArtists(Array.isArray(artistsData) ? artistsData : []);
          break;
          
        case 'songs':
          const songsData = isLabelManager()
            ? await songAPI.getMySongs()
            : await songAPI.getSongs();
          setSongs(Array.isArray(songsData) ? songsData : []);
          break;
          
        case 'advertisements':
          if (isSuperAdmin()) {
            const adsData = await advertisementAPI.getAdvertisements();
            setAdvertisements(Array.isArray(adsData) ? adsData : []);
          }
          break;
          
        case 'monetization':
          if (isSuperAdmin()) {
            const settings = await advertisementAPI.getAdSettings();
            setAdSettings(settings);
          }
          break;
          
        case 'labels':
          if (isSuperAdmin()) {
            const managersData = await userAPI.getLabelManagers();
            setLabelManagers(Array.isArray(managersData) ? managersData : []);
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

  const handleInputChange = (e, setState) => {
    const { name, value, type, checked } = e.target;
    setState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (name === 'is_featuring' ? value === 'true' : value)
    }));
  };

  const handleFileUpload = (e, field, setState) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setState(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
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
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
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
        first_name: '',
        last_name: '',
        stage_name: '',
        date_of_birth: '',
        country: '',
        email: '',
        phone_number: '',
        bio: '',
        genre: '',
        image_base64: ''
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating artist:', error);
      setError('Failed to create artist');
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
        type: 'single',
        album_name: '',
        is_featuring: false,
        featuring_artists: '',
        genre: '',
        duration: '',
        lyrics: '',
        youtube_url: '',
        image_base64: '',
        audio_file_base64: ''
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating song:', error);
      setError('Failed to create song');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await advertisementAPI.createAdvertisement(newAd);
      setShowCreateAd(false);
      setNewAd({
        title: '',
        description: '',
        file_type: 'video',
        file_base64: '',
        duration: 30,
        skip_after: 5
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating advertisement:', error);
      setError('Failed to create advertisement');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await userAPI.createUser({
        ...newManager,
        role: 'label_manager'
      });
      setShowCreateManager(false);
      setNewManager({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        company_name: ''
      });
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating manager:', error);
      setError('Failed to create manager');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await advertisementAPI.updateAdSettings(settingsData);
      setShowSettings(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error updating settings:', error);
      setError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id, type) => {
    setLoading(true);
    setError('');
    
    try {
      switch (type) {
        case 'user':
          await userAPI.deleteUser(id);
          break;
        case 'artist':
          await artistAPI.deleteArtist(id);
          break;
        case 'song':
          await songAPI.deleteSong(id);
          break;
        case 'ad':
          await advertisementAPI.deleteAdvertisement(id);
          break;
      }
      setShowDeleteConfirm(null);
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    if (isLabelManager()) {
      return (
        <div className="space-y-6">
          {/* Earnings Filter */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artist Filter</label>
                <select
                  value={artistFilter}
                  onChange={(e) => setArtistFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Artists</option>
                  {artists.map(artist => (
                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <UserIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Artists</p>
                  <p className="text-2xl font-bold text-gray-800">{statistics.total_artists || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gold-100 rounded-lg">
                  <MusicIcon className="w-6 h-6 text-gold-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Songs</p>
                  <p className="text-2xl font-bold text-gray-800">{statistics.total_songs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <StatsIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Streams</p>
                  <p className="text-2xl font-bold text-gray-800">{statistics.total_streams || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gold-100 rounded-lg">
                  <MoneyIcon className="w-6 h-6 text-gold-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">${statistics.total_revenue || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Artists */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Artists</h3>
            <div className="space-y-3">
              {statistics.top_artists && statistics.top_artists.length > 0 ? (
                statistics.top_artists.map((artist, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{artist.artist_name}</p>
                        <p className="text-sm text-gray-500">{artist.streams} streams</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">${artist.revenue}</p>
                      <p className="text-sm text-gray-500">#{index + 1}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No artists data available</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Super Admin Dashboard
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.total_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gold-100 rounded-lg">
                <MusicIcon className="w-6 h-6 text-gold-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Songs</p>
                <p className="text-2xl font-bold text-gray-800">{statistics.total_songs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <StatsIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${statistics.revenue || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gold-100 rounded-lg">
                <MoneyIcon className="w-6 h-6 text-gold-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Ad Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${statistics.ad_revenue || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        <button
          onClick={() => setShowCreateUser(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {user.first_name?.[0] || user.email?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-500">{user.phone_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-800">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'label_manager' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'artist' ? 'bg-gold-100 text-gold-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowDeleteConfirm({ id: user.id, type: 'user' })}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <DeleteIcon className="w-4 h-4" />
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Artists</h2>
        <button
          onClick={() => setShowCreateArtist(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Artist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map(artist => (
          <div key={artist.id} className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center space-x-4 mb-4">
              {artist.image_base64 ? (
                <img
                  src={artist.image_base64}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800">{artist.name}</h3>
                <p className="text-sm text-gray-500">{artist.genre}</p>
                <p className="text-sm text-gray-500">{artist.country}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Email: {artist.email}</p>
                <p>Phone: {artist.phone_number}</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm({ id: artist.id, type: 'artist' })}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSongs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Songs</h2>
        <button
          onClick={() => setShowCreateSong(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Song</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map(song => (
          <div key={song.id} className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center space-x-4 mb-4">
              {song.image_base64 ? (
                <img
                  src={song.image_base64}
                  alt={song.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MusicIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist_name}</p>
                <p className="text-sm text-gray-500">{song.album}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Plays: {song.play_count}</p>
                <p>Genre: {song.genre}</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm({ id: song.id, type: 'song' })}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdvertisements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Advertisements</h2>
        <button
          onClick={() => setShowCreateAd(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Advertisement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map(ad => (
          <div key={ad.id} className="bg-white rounded-xl shadow-card p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{ad.title}</h3>
              <p className="text-sm text-gray-600">{ad.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Type: {ad.file_type}</p>
                <p>Duration: {ad.duration}s</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm({ id: ad.id, type: 'ad' })}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <DeleteIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMonetization = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Monetization Settings</h2>
        <button
          onClick={() => setShowSettings(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Edit Settings</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Ad Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Frequency</label>
            <p className="text-gray-800">Every {adSettings.ad_frequency || 3} songs</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stream Length</label>
            <p className="text-gray-800">{adSettings.min_stream_length || 30} seconds</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Ad Duration</label>
            <p className="text-gray-800">{adSettings.min_ad_duration || 5} seconds</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Ad Duration</label>
            <p className="text-gray-800">{adSettings.max_ad_duration || 60} seconds</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLabels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Label Managers</h2>
        <button
          onClick={() => setShowCreateManager(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Manager</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Manager</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Company</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Artists</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {labelManagers.map(manager => (
                <tr key={manager.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {manager.first_name?.[0] || manager.email?.[0] || 'M'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{manager.first_name} {manager.last_name}</p>
                        <p className="text-sm text-gray-500">{manager.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-800">{manager.company_name || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-800">{manager.artist_count || 0}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      manager.status === 'active' ? 'bg-green-100 text-green-800' :
                      manager.status === 'blocked' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {manager.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowDeleteConfirm({ id: manager.id, type: 'user' })}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <DeleteIcon className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
      {/* Header */}
      <div className="bg-white shadow-modern border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onReturnHome}
                className="text-primary-600 hover:text-primary-800 transition-colors mr-4"
              >
                <BackIcon className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {isSuperAdmin() ? 'Admin Console' : 'Manager Console'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowProfile(true)}
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
              ...(isSuperAdmin() ? [
                { key: 'users', label: 'Users', icon: UserIcon },
                { key: 'labels', label: 'Labels/Managers', icon: CrownIcon }
              ] : []),
              { key: 'artists', label: 'Artists', icon: UserIcon },
              { key: 'songs', label: 'Songs', icon: MusicIcon },
              ...(isSuperAdmin() ? [
                { key: 'advertisements', label: 'Advertisements', icon: AdsIcon },
                { key: 'monetization', label: 'Monetization', icon: MoneyIcon }
              ] : [])
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

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'artists' && renderArtists()}
            {activeTab === 'songs' && renderSongs()}
            {activeTab === 'advertisements' && renderAdvertisements()}
            {activeTab === 'monetization' && renderMonetization()}
            {activeTab === 'labels' && renderLabels()}
          </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">My Profile</h3>
                <button
                  onClick={() => setShowProfile(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xl">
                      {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{user?.first_name} {user?.last_name}</h4>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-sm text-gray-500">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-800 mb-2">Account Details</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Phone:</span> {user?.phone_number || 'Not provided'}</p>
                    <p><span className="text-gray-500">Country:</span> {user?.country || 'Not provided'}</p>
                    <p><span className="text-gray-500">Status:</span> {user?.status}</p>
                    <p><span className="text-gray-500">Member since:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New User</h3>
                <button
                  onClick={() => setShowCreateUser(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => handleInputChange(e, setNewUser)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={(e) => handleInputChange(e, setNewUser)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={newUser.first_name}
                    onChange={(e) => handleInputChange(e, setNewUser)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={newUser.last_name}
                    onChange={(e) => handleInputChange(e, setNewUser)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={newUser.phone_number}
                    onChange={(e) => handleInputChange(e, setNewUser)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={(e) => handleInputChange(e, setNewUser)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="artist">Artist</option>
                    <option value="label_manager">Label Manager</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateUser(false)}
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

      {/* Create Artist Modal */}
      {showCreateArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Artist</h3>
                <button
                  onClick={() => setShowCreateArtist(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateArtist} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={newArtist.first_name}
                    onChange={(e) => handleInputChange(e, setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={newArtist.last_name}
                    onChange={(e) => handleInputChange(e, setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage Name</label>
                  <input
                    type="text"
                    name="stage_name"
                    value={newArtist.stage_name}
                    onChange={(e) => handleInputChange(e, setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={newArtist.date_of_birth}
                    onChange={(e) => handleInputChange(e, setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={newArtist.country}
                    onChange={(e) => handleInputChange(e, setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newArtist.email}
                    onChange={(e) => handleInputChange(e, setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={newArtist.phone_number}
                    onChange={(e) => handleInputChange(e, setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image_base64', setNewArtist)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Artist'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateArtist(false)}
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

      {/* Create Song Modal */}
      {showCreateSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Song</h3>
                <button
                  onClick={() => setShowCreateSong(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateSong} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newSong.title}
                    onChange={(e) => handleInputChange(e, setNewSong)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                  <select
                    name="artist_id"
                    value={newSong.artist_id}
                    onChange={(e) => handleInputChange(e, setNewSong)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an artist</option>
                    {artists.map(artist => (
                      <option key={artist.id} value={artist.id}>{artist.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="single"
                        checked={newSong.type === 'single'}
                        onChange={(e) => handleInputChange(e, setNewSong)}
                        className="mr-2"
                      />
                      Single
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="album"
                        checked={newSong.type === 'album'}
                        onChange={(e) => handleInputChange(e, setNewSong)}
                        className="mr-2"
                      />
                      Album
                    </label>
                  </div>
                </div>

                {newSong.type === 'album' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Album Name</label>
                    <input
                      type="text"
                      name="album_name"
                      value={newSong.album_name}
                      onChange={(e) => handleInputChange(e, setNewSong)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="No album is added for this artist"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Is this a featuring?</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="is_featuring"
                        value={false}
                        checked={!newSong.is_featuring}
                        onChange={(e) => handleInputChange(e, setNewSong)}
                        className="mr-2"
                      />
                      No
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="is_featuring"
                        value={true}
                        checked={newSong.is_featuring}
                        onChange={(e) => handleInputChange(e, setNewSong)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                  </div>
                </div>

                {newSong.is_featuring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featuring Artists</label>
                    <input
                      type="text"
                      name="featuring_artists"
                      value={newSong.featuring_artists}
                      onChange={(e) => handleInputChange(e, setNewSong)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Separate multiple artists with commas"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Song Cover</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image_base64', setNewSong)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Song'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateSong(false)}
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

      {/* Create Advertisement Modal */}
      {showCreateAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Advertisement</h3>
                <button
                  onClick={() => setShowCreateAd(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateAd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newAd.title}
                    onChange={(e) => handleInputChange(e, setNewAd)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newAd.description}
                    onChange={(e) => handleInputChange(e, setNewAd)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                  <select
                    name="file_type"
                    value={newAd.file_type}
                    onChange={(e) => handleInputChange(e, setNewAd)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="video">Video (MP4)</option>
                    <option value="audio">Audio (MP3/WAV)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad File</label>
                  <input
                    type="file"
                    accept={newAd.file_type === 'video' ? 'video/mp4' : 'audio/*'}
                    onChange={(e) => handleFileUpload(e, 'file_base64', setNewAd)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                  <input
                    type="number"
                    name="duration"
                    value={newAd.duration}
                    onChange={(e) => handleInputChange(e, setNewAd)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="5"
                    max="60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skip After (seconds)</label>
                  <input
                    type="number"
                    name="skip_after"
                    value={newAd.skip_after}
                    onChange={(e) => handleInputChange(e, setNewAd)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="3"
                    max="30"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Ad'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateAd(false)}
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

      {/* Create Manager Modal */}
      {showCreateManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Manager</h3>
                <button
                  onClick={() => setShowCreateManager(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateManager} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newManager.email}
                    onChange={(e) => handleInputChange(e, setNewManager)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newManager.password}
                    onChange={(e) => handleInputChange(e, setNewManager)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={newManager.first_name}
                    onChange={(e) => handleInputChange(e, setNewManager)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={newManager.last_name}
                    onChange={(e) => handleInputChange(e, setNewManager)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={newManager.phone_number}
                    onChange={(e) => handleInputChange(e, setNewManager)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={newManager.company_name}
                    onChange={(e) => handleInputChange(e, setNewManager)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Manager'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateManager(false)}
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Ad Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Frequency</label>
                  <input
                    type="number"
                    name="ad_frequency"
                    value={settingsData.ad_frequency}
                    onChange={(e) => handleInputChange(e, setSettingsData)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="1"
                    max="10"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Show ad every N songs</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stream Length (seconds)</label>
                  <input
                    type="number"
                    name="min_stream_length"
                    value={settingsData.min_stream_length}
                    onChange={(e) => handleInputChange(e, setSettingsData)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="10"
                    max="120"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimum time user must listen before ad</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Ad Duration (seconds)</label>
                  <input
                    type="number"
                    name="min_ad_duration"
                    value={settingsData.min_ad_duration}
                    onChange={(e) => handleInputChange(e, setSettingsData)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="3"
                    max="30"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimum time before skip button appears</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Ad Duration (seconds)</label>
                  <input
                    type="number"
                    name="max_ad_duration"
                    value={settingsData.max_ad_duration}
                    onChange={(e) => handleInputChange(e, setSettingsData)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="15"
                    max="120"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Maximum allowed ad duration</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Updating...' : 'Update Settings'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeleteItem(showDeleteConfirm.id, showDeleteConfirm.type)}
                  disabled={loading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};