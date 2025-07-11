// API utility for GospelSpot backend integration
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken = localStorage.getItem('gospelspot_token');

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('gospelspot_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('gospelspot_token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize token if it exists
if (authToken) {
  setAuthToken(authToken);
}

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      setAuthToken(response.data.access_token);
    }
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', null, {
      params: { email }
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      new_password: newPassword
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    setAuthToken(null);
  }
};

// User management APIs
export const userAPI = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, updateData) => {
    const response = await api.put(`/users/${userId}`, updateData);
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await api.post(`/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.post(`/users/${userId}/unblock`);
    return response.data;
  },

  deleteUser: async (userId, removeArtists = false) => {
    const response = await api.delete(`/users/${userId}`, {
      params: { remove_artists: removeArtists }
    });
    return response.data;
  },

  getLabelManagers: async () => {
    const response = await api.get('/users/labels/managers');
    return response.data;
  }
};

// Artist management APIs
export const artistAPI = {
  getArtists: async (params = {}) => {
    const response = await api.get('/artists', { params });
    return response.data;
  },

  createArtist: async (artistData) => {
    const response = await api.post('/artists', artistData);
    return response.data;
  },

  getArtist: async (artistId) => {
    const response = await api.get(`/artists/${artistId}`);
    return response.data;
  },

  updateArtist: async (artistId, updateData) => {
    const response = await api.put(`/artists/${artistId}`, updateData);
    return response.data;
  },

  deleteArtist: async (artistId) => {
    const response = await api.delete(`/artists/${artistId}`);
    return response.data;
  },

  getMyArtists: async () => {
    const response = await api.get('/artists/my/artists');
    return response.data;
  },

  getArtistStatistics: async (artistId) => {
    const response = await api.get(`/artists/${artistId}/statistics`);
    return response.data;
  },

  verifyArtist: async (artistId) => {
    const response = await api.post(`/artists/${artistId}/verify`);
    return response.data;
  },

  unverifyArtist: async (artistId) => {
    const response = await api.post(`/artists/${artistId}/unverify`);
    return response.data;
  }
};

// Song management APIs
export const songAPI = {
  getSongs: async (params = {}) => {
    const response = await api.get('/songs', { params });
    return response.data;
  },

  createSong: async (songData) => {
    const response = await api.post('/songs', songData);
    return response.data;
  },

  getSong: async (songId) => {
    const response = await api.get(`/songs/${songId}`);
    return response.data;
  },

  updateSong: async (songId, updateData) => {
    const response = await api.put(`/songs/${songId}`, updateData);
    return response.data;
  },

  deleteSong: async (songId) => {
    const response = await api.delete(`/songs/${songId}`);
    return response.data;
  },

  getMySongs: async () => {
    const response = await api.get('/songs/my/songs');
    return response.data;
  },

  playSong: async (songId) => {
    const response = await api.post(`/songs/${songId}/play`);
    return response.data;
  },

  getSongsByArtist: async (artistId) => {
    const response = await api.get(`/songs/artist/${artistId}`);
    return response.data;
  },

  searchSongs: async (query, limit = 50) => {
    const response = await api.get('/songs/search/', {
      params: { q: query, limit }
    });
    return response.data;
  },

  getTrendingSongs: async (limit = 50) => {
    const response = await api.get('/songs/trending/', {
      params: { limit }
    });
    return response.data;
  },

  getNewReleases: async (limit = 50) => {
    const response = await api.get('/songs/new-releases/', {
      params: { limit }
    });
    return response.data;
  }
};

// Statistics APIs
export const statisticsAPI = {
  getArtistStatistics: async (artistId) => {
    const response = await api.get(`/statistics/artist/${artistId}`);
    return response.data;
  },

  getLabelStatistics: async (labelId) => {
    const response = await api.get(`/statistics/label/${labelId}`);
    return response.data;
  },

  getMyLabelStatistics: async () => {
    const response = await api.get('/statistics/my/label');
    return response.data;
  },

  getPlatformStatistics: async () => {
    const response = await api.get('/statistics/platform');
    return response.data;
  },

  getDashboardStatistics: async () => {
    const response = await api.get('/statistics/dashboard');
    return response.data;
  },

  getAdsRevenue: async () => {
    const response = await api.get('/statistics/revenue/ads');
    return response.data;
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;