import React, { useState, useEffect } from 'react';

// Enhanced mock data with more comprehensive features
const mockData = {
  subscriptionPlans: [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: [
        'Shuffle play only',
        'Ads between songs',
        '6 skips per hour',
        'Standard audio quality',
        'Basic playlists (5 max)',
        'Limited offline (0 songs)'
      ],
      limitations: {
        skipsPerHour: 6,
        maxPlaylists: 5,
        offlineDownloads: 0,
        audioQuality: 'standard',
        hasAds: true,
        shuffleOnly: true
      },
      color: 'gray',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Ad-free listening',
        'Unlimited skips',
        'High-quality audio',
        'Offline downloads (10,000 songs)',
        'Unlimited playlists',
        'Play any song on demand',
        'Lyrics display'
      ],
      limitations: {
        skipsPerHour: -1,
        maxPlaylists: -1,
        offlineDownloads: 10000,
        audioQuality: 'high',
        hasAds: false,
        shuffleOnly: false
      },
      color: 'blue',
      popular: true
    },
    {
      id: 'family',
      name: 'Family',
      price: 14.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'All Premium features',
        'Up to 6 family accounts',
        'Kid-safe mode',
        'Individual libraries',
        'Family sharing',
        'Parental controls',
        'Church event calendar'
      ],
      limitations: {
        skipsPerHour: -1,
        maxPlaylists: -1,
        offlineDownloads: 10000,
        audioQuality: 'high',
        hasAds: false,
        shuffleOnly: false,
        familyAccounts: 6
      },
      color: 'purple',
      popular: false
    },
    {
      id: 'student',
      name: 'Student',
      price: 4.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'All Premium features',
        'Student discount (50% off)',
        'Verification required',
        'Study playlists',
        'Focus mode',
        'Academic resources'
      ],
      limitations: {
        skipsPerHour: -1,
        maxPlaylists: -1,
        offlineDownloads: 10000,
        audioQuality: 'high',
        hasAds: false,
        shuffleOnly: false,
        requiresVerification: true
      },
      color: 'green',
      popular: false
    }
  ],
  users: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      password: 'hashed_password_123',
      subscription: 'premium',
      joinDate: '2024-01-15',
      lastActive: '2025-07-11',
      status: 'active',
      paymentMethod: 'Credit Card',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'user',
      language: 'en',
      country: 'USA',
      stats: {
        songsPlayed: 1250,
        playlistsCreated: 8,
        hoursListened: 89
      }
    },
    {
      id: 2,
      name: 'SuperAdmin',
      email: 'admin@gospelspot.com',
      password: 'admin123',
      subscription: 'premium',
      joinDate: '2023-01-01',
      lastActive: '2025-07-11',
      status: 'active',
      paymentMethod: null,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'superadmin',
      language: 'en',
      country: 'USA',
      stats: {
        songsPlayed: 0,
        playlistsCreated: 0,
        hoursListened: 0
      }
    },
    {
      id: 3,
      name: 'Brandon Lake',
      email: 'brandon@example.com',
      password: 'artist123',
      subscription: 'premium',
      joinDate: '2024-03-01',
      lastActive: '2025-07-11',
      status: 'active',
      paymentMethod: 'Credit Card',
      avatar: 'https://images.unsplash.com/photo-1602022578288-5824e225738f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85',
      role: 'artist',
      language: 'en',
      country: 'USA',
      stats: {
        songsPlayed: 0,
        playlistsCreated: 0,
        hoursListened: 0,
        artistStats: {
          totalStreams: 2400000,
          monthlyListeners: 450000,
          topSong: "That's Who I Praise",
          totalAlbums: 3,
          followers: 2400000
        }
      }
    }
  ],
  analytics: {
    totalUsers: 12543,
    premiumUsers: 4821,
    freeUsers: 7722,
    revenue: 52348.67,
    songsStreamed: 892145,
    hoursListened: 45623,
    topGenres: [
      { name: 'Contemporary Christian', percentage: 35, streams: 312051, countries: ['USA', 'Canada', 'UK'] },
      { name: 'Worship', percentage: 28, streams: 249881, countries: ['USA', 'Brazil', 'Australia'] },
      { name: 'Gospel', percentage: 22, streams: 196272, countries: ['USA', 'Nigeria', 'South Africa'] },
      { name: 'Christian Rock', percentage: 15, streams: 133822, countries: ['USA', 'Germany', 'Canada'] }
    ],
    revenueByPlan: [
      { plan: 'Premium', revenue: 28456.32, users: 2847 },
      { plan: 'Family', revenue: 19823.45, users: 1321 },
      { plan: 'Student', revenue: 4068.90, users: 815 }
    ],
    growthMetrics: {
      userGrowth: 15.2,
      revenueGrowth: 23.8,
      retentionRate: 87.5
    },
    usersByCountry: [
      { country: 'USA', users: 5234, percentage: 42 },
      { country: 'Brazil', users: 2156, percentage: 17 },
      { country: 'Nigeria', users: 1876, percentage: 15 },
      { country: 'UK', users: 1245, percentage: 10 },
      { country: 'Canada', users: 987, percentage: 8 },
      { country: 'Others', users: 1045, percentage: 8 }
    ]
  },
  featuredPlaylists: [
    {
      id: 1,
      name: "Contemporary Christian Hits",
      description: "The biggest contemporary Christian songs right now",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      songs: [
        { id: 1, title: "That's Who I Praise", artist: "Brandon Lake", album: "King of Hearts", duration: "3:45", language: "English", country: "USA" },
        { id: 2, title: "Hard Fought Hallelujah", artist: "Brandon Lake", album: "King of Hearts", duration: "4:12", language: "English", country: "USA" },
        { id: 3, title: "God Did!", artist: "Sons of Sunday", album: "Sons of Sunday", duration: "3:28", language: "English", country: "USA" }
      ],
      followers: 1250000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["contemporary", "worship", "praise"],
      language: "English",
      country: "USA",
      category: "Contemporary Christian"
    },
    {
      id: 2,
      name: "Worship Essentials",
      description: "Essential worship songs for your spiritual journey",
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      songs: [
        { id: 4, title: "No Fear", artist: "Jon Reddick", album: "No Fear", duration: "3:56", language: "English", country: "USA" },
        { id: 5, title: "Oh Death", artist: "MercyMe", album: "Wonder & Awe", duration: "4:23", language: "English", country: "USA" },
        { id: 6, title: "Sing (Like You've Already Won)", artist: "MercyMe", album: "Wonder & Awe", duration: "3:41", language: "English", country: "USA" }
      ],
      followers: 890000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["worship", "spiritual", "praise"],
      language: "English",
      country: "USA",
      category: "Worship"
    },
    {
      id: 3,
      name: "Gospel Classics",
      description: "Timeless gospel songs that never get old",
      image: "https://images.pexels.com/photos/8815036/pexels-photo-8815036.jpeg",
      songs: [
        { id: 7, title: "Amazing Grace", artist: "Traditional Gospel", album: "Gospel Classics", duration: "4:15", language: "English", country: "USA" },
        { id: 8, title: "How Great Thou Art", artist: "Traditional Gospel", album: "Gospel Classics", duration: "3:52", language: "English", country: "USA" },
        { id: 9, title: "Blessed Assurance", artist: "Traditional Gospel", album: "Gospel Classics", duration: "3:28", language: "English", country: "USA" }
      ],
      followers: 750000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["traditional", "gospel", "classic"],
      language: "English",
      country: "USA",
      category: "Gospel"
    },
    {
      id: 4,
      name: "Хвала и Поклонение",
      description: "Русские христианские песни для поклонения",
      image: "https://images.unsplash.com/photo-1602022578288-5824e225738f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      songs: [
        { id: 10, title: "Святой Бог", artist: "Hillsong на русском", album: "Поклонение", duration: "4:23", language: "Russian", country: "Russia" },
        { id: 11, title: "Великий Я Есть", artist: "Bethel на русском", album: "Величие", duration: "5:12", language: "Russian", country: "Russia" },
        { id: 12, title: "Иисус культура", artist: "Jesus Culture на русском", album: "Живая вода", duration: "4:45", language: "Russian", country: "Russia" }
      ],
      followers: 450000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["worship", "russian", "praise"],
      language: "Russian",
      country: "Russia",
      category: "Worship"
    }
  ],
  newReleases: [
    {
      id: 1,
      title: "King of Hearts",
      artist: "Brandon Lake",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      year: "2025",
      type: "Album",
      genre: "Contemporary Christian",
      description: "Brandon Lake's powerful new album featuring chart-topping hits",
      tracks: 12,
      duration: "45:30",
      language: "English",
      country: "USA",
      category: "Contemporary Christian"
    },
    {
      id: 2,
      title: "Sons of Sunday",
      artist: "Sons of Sunday",
      image: "https://images.unsplash.com/photo-1701427835787-2c2bb970d55e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      year: "2025",
      type: "Album",
      genre: "Worship",
      description: "Self-titled debut album by the worship collective",
      tracks: 10,
      duration: "38:45",
      language: "English",
      country: "USA",
      category: "Worship"
    },
    {
      id: 3,
      title: "Величие Христа",
      artist: "Bethel Русский",
      image: "https://images.unsplash.com/photo-1669198074199-5f58e548974e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      year: "2025",
      type: "Album",
      genre: "Worship",
      description: "Русскоязычный альбом прославления",
      tracks: 8,
      duration: "32:15",
      language: "Russian",
      country: "Russia",
      category: "Worship"
    }
  ],
  topArtists: [
    {
      id: 1,
      name: "Brandon Lake",
      image: "https://images.unsplash.com/photo-1602022578288-5824e225738f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      followers: "2.4M",
      genre: "Contemporary Christian",
      monthlyListeners: "5.2M",
      verified: true,
      bio: "Contemporary Christian music artist known for powerful worship songs",
      topSongs: ["That's Who I Praise", "Hard Fought Hallelujah", "Gratitude"],
      language: "English",
      country: "USA",
      category: "Contemporary Christian"
    },
    {
      id: 2,
      name: "MercyMe",
      image: "https://images.pexels.com/photos/54333/person-clinic-cross-religion-54333.jpeg",
      followers: "1.8M",
      genre: "Contemporary Christian",
      monthlyListeners: "3.9M",
      verified: true,
      bio: "Multi-platinum selling Christian rock band",
      topSongs: ["Oh Death", "Sing (Like You've Already Won)", "I Can Only Imagine"],
      language: "English",
      country: "USA",
      category: "Contemporary Christian"
    },
    {
      id: 3,
      name: "Hillsong Русский",
      image: "https://images.pexels.com/photos/415571/pexels-photo-415571.jpeg",
      followers: "892K",
      genre: "Worship",
      monthlyListeners: "1.7M",
      verified: true,
      bio: "Русскоязычное поклонение и прославление",
      topSongs: ["Святой Бог", "Великий Я Есть", "Иисус культура"],
      language: "Russian",
      country: "Russia",
      category: "Worship"
    }
  ],
  recentlyPlayed: [
    { id: 1, title: "That's Who I Praise", artist: "Brandon Lake", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85", playedAt: "2 hours ago", language: "English", country: "USA" },
    { id: 2, title: "No Fear", artist: "Jon Reddick", image: "https://images.pexels.com/photos/7520077/pexels-photo-7520077.jpeg", playedAt: "5 hours ago", language: "English", country: "USA" },
    { id: 3, title: "Святой Бог", artist: "Hillsong Русский", image: "https://images.unsplash.com/photo-1701427835787-2c2bb970d55e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85", playedAt: "1 day ago", language: "Russian", country: "Russia" }
  ],
  genres: [
    { id: 1, name: 'Contemporary Christian', color: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85' },
    { id: 2, name: 'Gospel', color: 'bg-yellow-600', image: 'https://images.pexels.com/photos/8815036/pexels-photo-8815036.jpeg' },
    { id: 3, name: 'Worship', color: 'bg-purple-600', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85' },
    { id: 4, name: 'Christian Rock', color: 'bg-red-600', image: 'https://images.unsplash.com/photo-1602022578288-5824e225738f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85' },
    { id: 5, name: 'Christian Hip-Hop', color: 'bg-green-600', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85' },
    { id: 6, name: 'Praise & Worship', color: 'bg-indigo-600', image: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg' },
    { id: 7, name: 'Southern Gospel', color: 'bg-orange-600', image: 'https://images.pexels.com/photos/7520079/pexels-photo-7520079.jpeg' },
    { id: 8, name: 'Christian Folk', color: 'bg-teal-600', image: 'https://images.pexels.com/photos/54333/person-clinic-cross-religion-54333.jpeg' },
    { id: 9, name: 'Christian Pop', color: 'bg-pink-600', image: 'https://images.pexels.com/photos/415571/pexels-photo-415571.jpeg' },
    { id: 10, name: 'Hymns', color: 'bg-gray-600', image: 'https://images.unsplash.com/photo-1669198074199-5f58e548974e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85' },
    { id: 11, name: 'Russian Worship', color: 'bg-red-800', image: 'https://images.unsplash.com/photo-1701427835787-2c2bb970d55e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85' },
    { id: 12, name: 'Christian Country', color: 'bg-amber-600', image: 'https://images.pexels.com/photos/7520077/pexels-photo-7520077.jpeg' }
  ],
  countries: ['USA', 'Brazil', 'Nigeria', 'UK', 'Canada', 'Russia', 'Germany', 'Australia', 'South Africa', 'Mexico'],
  languages: ['English', 'Spanish', 'Portuguese', 'Russian', 'French', 'German', 'Italian']
};

// Complete language translations including Russian
const translations = {
  en: {
    // Basic navigation
    home: "Home",
    search: "Search",
    library: "Your Library",
    createPlaylist: "Create Playlist",
    likedSongs: "Liked Songs",
    recentlyPlayed: "Recently played",
    madeForYou: "Made for you",
    newReleases: "New releases",
    topArtists: "Top artists",
    showAll: "Show all",
    playAll: "Play all",
    followers: "followers",
    play: "Play",
    pause: "Pause",
    next: "Next",
    previous: "Previous",
    shuffle: "Shuffle",
    repeat: "Repeat",
    volume: "Volume",
    currentlyPlaying: "Currently playing",
    goodEvening: "Good evening",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    language: "Language",
    browseAll: "Browse all",
    searchResults: "Search results for",
    
    // Authentication
    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    createAccount: "Create Account",
    checkEmail: "Check my email",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    
    // Subscription & Account
    subscription: "Subscription",
    premium: "Premium",
    family: "Family",
    student: "Student",
    free: "Free",
    upgrade: "Upgrade",
    manageSubscription: "Manage Subscription",
    billing: "Billing",
    paymentMethod: "Payment Method",
    accountSettings: "Account Settings",
    profile: "Profile",
    notifications: "Notifications",
    privacy: "Privacy",
    currentPlan: "Current Plan",
    changePlan: "Change Plan",
    cancelSubscription: "Cancel Subscription",
    renewSubscription: "Renew Subscription",
    freeTrial: "Free Trial",
    startFreeTrial: "Start Free Trial",
    
    // Admin Console
    adminConsole: "Admin Console",
    dashboard: "Dashboard",
    userManagement: "User Management",
    contentManagement: "Content Management",
    analytics: "Analytics",
    subscriptionManagement: "Subscription Management",
    reports: "Reports",
    settings: "Settings",
    totalUsers: "Total Users",
    premiumUsers: "Premium Users",
    revenue: "Revenue",
    growth: "Growth",
    downloadCSV: "Download CSV",
    
    // Content Management
    addArtist: "Add Artist",
    editArtist: "Edit Artist",
    deleteArtist: "Delete Artist",
    addAlbum: "Add Album",
    editAlbum: "Edit Album",
    deleteAlbum: "Delete Album",
    addSong: "Add Song",
    editSong: "Edit Song",
    deleteSong: "Delete Song",
    uploadImage: "Upload Image",
    category: "Category",
    country: "Country",
    
    // User Management
    viewUser: "View User",
    editUser: "Edit User",
    deleteUser: "Delete User",
    addUser: "Add User",
    banUser: "Ban User",
    unbanUser: "Unban User",
    userDetails: "User Details",
    subscriptionStatus: "Subscription Status",
    lastActive: "Last Active",
    joinDate: "Join Date",
    resetPassword: "Reset Password",
    
    // Common actions
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    create: "Create",
    update: "Update",
    view: "View",
    manage: "Manage",
    filter: "Filter",
    sort: "Sort",
    searchPlaceholder: "Search...",
    
    // Form fields
    name: "Name",
    title: "Title",
    artist: "Artist",
    album: "Album",
    genre: "Genre",
    duration: "Duration",
    year: "Year",
    status: "Status",
    description: "Description",
    image: "Image",
    
    // Status messages
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    loading: "Loading...",
    saving: "Saving...",
    deleting: "Deleting...",
    updating: "Updating...",
    
    // Subscription features
    adFree: "Ad-free listening",
    unlimitedSkips: "Unlimited skips",
    highQuality: "High-quality audio",
    offlineDownloads: "Offline downloads",
    unlimitedPlaylists: "Unlimited playlists",
    onDemand: "Play any song on demand",
    familyAccounts: "Family accounts",
    kidSafe: "Kid-safe mode",
    studentDiscount: "Student discount",
    
    // Analytics & Stats
    streams: "Streams",
    users: "Users",
    conversion: "Conversion",
    retention: "Retention",
    churn: "Churn",
    engagement: "Engagement",
    monthlyListeners: "monthly listeners",
    totalStreams: "Total Streams",
    artistStats: "Artist Statistics",
    
    // Time periods
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    allTime: "All Time",
    
    // Playlist management
    playlistName: "Playlist name",
    makePublic: "Make public",
    makePrivate: "Make private",
    sharePlaylist: "Share playlist",
    deletePlaylist: "Delete playlist",
    
    // Miscellaneous
    tracks: "tracks",
    verified: "Verified Artist",
    share: "Share",
    follow: "Follow",
    following: "Following",
    addToPlaylist: "Add to playlist"
  },
  es: {
    // Basic navigation
    home: "Inicio",
    search: "Buscar",
    library: "Tu biblioteca",
    createPlaylist: "Crear lista",
    likedSongs: "Canciones favoritas",
    recentlyPlayed: "Reproducido recientemente",
    madeForYou: "Hecho para ti",
    newReleases: "Nuevos lanzamientos",
    topArtists: "Artistas principales",
    showAll: "Mostrar todo",
    playAll: "Reproducir todo",
    followers: "seguidores",
    play: "Reproducir",
    pause: "Pausa",
    next: "Siguiente",
    previous: "Anterior",
    shuffle: "Aleatorio",
    repeat: "Repetir",
    volume: "Volumen",
    currentlyPlaying: "Reproduciendo",
    goodEvening: "Buenas tardes",
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    language: "Idioma",
    browseAll: "Explorar todo",
    searchResults: "Resultados de búsqueda para",
    
    // Authentication
    login: "Iniciar sesión",
    register: "Registrarse",
    logout: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    createAccount: "Crear cuenta",
    checkEmail: "Verificar mi correo",
    changePassword: "Cambiar contraseña",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    
    // Subscription & Account
    subscription: "Suscripción",
    premium: "Premium",
    family: "Familiar",
    student: "Estudiante",
    free: "Gratis",
    upgrade: "Actualizar",
    manageSubscription: "Gestionar Suscripción",
    billing: "Facturación",
    paymentMethod: "Método de Pago",
    accountSettings: "Configuración de Cuenta",
    profile: "Perfil",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    currentPlan: "Plan Actual",
    changePlan: "Cambiar Plan",
    cancelSubscription: "Cancelar Suscripción",
    renewSubscription: "Renovar Suscripción",
    freeTrial: "Prueba Gratuita",
    startFreeTrial: "Iniciar Prueba Gratuita",
    
    // Admin Console
    adminConsole: "Consola de Administración",
    dashboard: "Panel de Control",
    userManagement: "Gestión de Usuarios",
    contentManagement: "Gestión de Contenido",
    analytics: "Análisis",
    subscriptionManagement: "Gestión de Suscripciones",
    reports: "Informes",
    settings: "Configuración",
    totalUsers: "Usuarios Totales",
    premiumUsers: "Usuarios Premium",
    revenue: "Ingresos",
    growth: "Crecimiento",
    downloadCSV: "Descargar CSV",
    
    // Content Management
    addArtist: "Agregar Artista",
    editArtist: "Editar Artista",
    deleteArtist: "Eliminar Artista",
    addAlbum: "Agregar Álbum",
    editAlbum: "Editar Álbum",
    deleteAlbum: "Eliminar Álbum",
    addSong: "Agregar Canción",
    editSong: "Editar Canción",
    deleteSong: "Eliminar Canción",
    uploadImage: "Subir Imagen",
    category: "Categoría",
    country: "País",
    
    // User Management
    viewUser: "Ver Usuario",
    editUser: "Editar Usuario",
    deleteUser: "Eliminar Usuario",
    addUser: "Agregar Usuario",
    banUser: "Banear Usuario",
    unbanUser: "Desbanear Usuario",
    userDetails: "Detalles del Usuario",
    subscriptionStatus: "Estado de Suscripción",
    lastActive: "Última Actividad",
    joinDate: "Fecha de Registro",
    resetPassword: "Restablecer Contraseña",
    
    // Common actions
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    create: "Crear",
    update: "Actualizar",
    view: "Ver",
    manage: "Gestionar",
    filter: "Filtrar",
    sort: "Ordenar",
    searchPlaceholder: "Buscar...",
    
    // Form fields
    name: "Nombre",
    title: "Título",
    artist: "Artista",
    album: "Álbum",
    genre: "Género",
    duration: "Duración",
    year: "Año",
    status: "Estado",
    description: "Descripción",
    image: "Imagen",
    
    // Status messages
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
    loading: "Cargando...",
    saving: "Guardando...",
    deleting: "Eliminando...",
    updating: "Actualizando...",
    
    tracks: "pistas",
    verified: "Artista Verificado",
    share: "Compartir",
    follow: "Seguir",
    following: "Siguiendo",
    monthlyListeners: "oyentes mensuales",
    totalStreams: "Reproducciones Totales",
    artistStats: "Estadísticas del Artista",
    playlistName: "Nombre de la lista",
    makePublic: "Hacer pública",
    makePrivate: "Hacer privada"
  },
  pt: {
    // Basic navigation
    home: "Início",
    search: "Buscar",
    library: "Sua biblioteca",
    createPlaylist: "Criar playlist",
    likedSongs: "Músicas curtidas",
    recentlyPlayed: "Tocado recentemente",
    madeForYou: "Feito para você",
    newReleases: "Novos lançamentos",
    topArtists: "Principais artistas",
    showAll: "Mostrar tudo",
    playAll: "Tocar tudo",
    followers: "seguidores",
    play: "Tocar",
    pause: "Pausar",
    next: "Próximo",
    previous: "Anterior",
    shuffle: "Aleatório",
    repeat: "Repetir",
    volume: "Volume",
    currentlyPlaying: "Tocando agora",
    goodEvening: "Boa noite",
    goodMorning: "Bom dia",
    goodAfternoon: "Boa tarde",
    language: "Idioma",
    browseAll: "Explorar tudo",
    searchResults: "Resultados da busca para",
    
    // Authentication
    login: "Entrar",
    register: "Registrar",
    logout: "Sair",
    email: "E-mail",
    password: "Senha",
    confirmPassword: "Confirmar senha",
    forgotPassword: "Esqueceu a senha?",
    createAccount: "Criar conta",
    checkEmail: "Verificar meu e-mail",
    changePassword: "Alterar senha",
    currentPassword: "Senha atual",
    newPassword: "Nova senha",
    
    // Subscription & Account
    subscription: "Assinatura",
    premium: "Premium",
    family: "Família",
    student: "Estudante",
    free: "Gratuito",
    upgrade: "Fazer upgrade",
    manageSubscription: "Gerenciar Assinatura",
    billing: "Cobrança",
    paymentMethod: "Método de Pagamento",
    accountSettings: "Configurações da Conta",
    profile: "Perfil",
    notifications: "Notificações",
    privacy: "Privacidade",
    currentPlan: "Plano Atual",
    changePlan: "Alterar Plano",
    cancelSubscription: "Cancelar Assinatura",
    renewSubscription: "Renovar Assinatura",
    freeTrial: "Teste Gratuito",
    startFreeTrial: "Iniciar Teste Gratuito",
    
    tracks: "faixas",
    verified: "Artista Verificado",
    monthlyListeners: "ouvintes mensais",
    playlistName: "Nome da playlist"
  },
  fr: {
    // Basic navigation
    home: "Accueil",
    search: "Rechercher",
    library: "Votre bibliothèque",
    createPlaylist: "Créer une playlist",
    likedSongs: "Titres likés",
    recentlyPlayed: "Écouté récemment",
    madeForYou: "Fait pour vous",
    newReleases: "Nouveautés",
    topArtists: "Artistes populaires",
    showAll: "Tout afficher",
    playAll: "Tout lire",
    followers: "abonnés",
    play: "Lire",
    pause: "Pause",
    next: "Suivant",
    previous: "Précédent",
    shuffle: "Aléatoire",
    repeat: "Répéter",
    volume: "Volume",
    currentlyPlaying: "En cours de lecture",
    goodEvening: "Bonsoir",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    language: "Langue",
    browseAll: "Parcourir tout",
    searchResults: "Résultats de recherche pour",
    
    // Authentication
    login: "Se connecter",
    register: "S'inscrire",
    logout: "Se déconnecter",
    email: "E-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié?",
    createAccount: "Créer un compte",
    checkEmail: "Vérifier mon e-mail",
    changePassword: "Changer le mot de passe",
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    
    tracks: "pistes",
    verified: "Artiste Vérifié",
    monthlyListeners: "auditeurs mensuels",
    playlistName: "Nom de la playlist"
  },
  de: {
    // Basic navigation
    home: "Startseite",
    search: "Suchen",
    library: "Deine Bibliothek",
    createPlaylist: "Playlist erstellen",
    likedSongs: "Gelikte Songs",
    recentlyPlayed: "Kürzlich gespielt",
    madeForYou: "Für dich gemacht",
    newReleases: "Neue Veröffentlichungen",
    topArtists: "Top-Künstler",
    showAll: "Alle anzeigen",
    playAll: "Alle abspielen",
    followers: "Follower",
    play: "Abspielen",
    pause: "Pause",
    next: "Nächster",
    previous: "Vorheriger",
    shuffle: "Zufällig",
    repeat: "Wiederholen",
    volume: "Lautstärke",
    currentlyPlaying: "Wird gerade gespielt",
    goodEvening: "Guten Abend",
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    language: "Sprache",
    browseAll: "Alle durchsuchen",
    searchResults: "Suchergebnisse für",
    
    // Authentication
    login: "Anmelden",
    register: "Registrieren",
    logout: "Abmelden",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort bestätigen",
    forgotPassword: "Passwort vergessen?",
    createAccount: "Konto erstellen",
    checkEmail: "Meine E-Mail überprüfen",
    changePassword: "Passwort ändern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    
    tracks: "Titel",
    verified: "Verifizierter Künstler",
    monthlyListeners: "monatliche Hörer",
    playlistName: "Playlist-Name"
  },
  it: {
    // Basic navigation
    home: "Home",
    search: "Cerca",
    library: "La tua libreria",
    createPlaylist: "Crea playlist",
    likedSongs: "Brani che ti piacciono",
    recentlyPlayed: "Riprodotto di recente",
    madeForYou: "Fatto per te",
    newReleases: "Nuove uscite",
    topArtists: "Artisti più ascoltati",
    showAll: "Mostra tutto",
    playAll: "Riproduci tutto",
    followers: "follower",
    play: "Riproduci",
    pause: "Pausa",
    next: "Successivo",
    previous: "Precedente",
    shuffle: "Casuale",
    repeat: "Ripeti",
    volume: "Volume",
    currentlyPlaying: "In riproduzione",
    goodEvening: "Buonasera",
    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio",
    language: "Lingua",
    browseAll: "Sfoglia tutto",
    searchResults: "Risultati della ricerca per",
    
    // Authentication
    login: "Accedi",
    register: "Registrati",
    logout: "Esci",
    email: "E-mail",
    password: "Password",
    confirmPassword: "Conferma password",
    forgotPassword: "Password dimenticata?",
    createAccount: "Crea account",
    checkEmail: "Controlla la mia e-mail",
    changePassword: "Cambia password",
    currentPassword: "Password attuale",
    newPassword: "Nuova password",
    
    tracks: "tracce",
    verified: "Artista Verificato",
    monthlyListeners: "ascoltatori mensili",
    playlistName: "Nome playlist"
  },
  ru: {
    // Basic navigation
    home: "Главная",
    search: "Поиск",
    library: "Ваша библиотека",
    createPlaylist: "Создать плейлист",
    likedSongs: "Любимые песни",
    recentlyPlayed: "Недавно прослушанное",
    madeForYou: "Сделано для вас",
    newReleases: "Новые релизы",
    topArtists: "Топ исполнители",
    showAll: "Показать все",
    playAll: "Воспроизвести все",
    followers: "подписчики",
    play: "Воспроизвести",
    pause: "Пауза",
    next: "Следующий",
    previous: "Предыдущий",
    shuffle: "Перемешать",
    repeat: "Повторить",
    volume: "Громкость",
    currentlyPlaying: "Сейчас играет",
    goodEvening: "Добрый вечер",
    goodMorning: "Доброе утро",
    goodAfternoon: "Добрый день",
    language: "Язык",
    browseAll: "Обзор всего",
    searchResults: "Результаты поиска для",
    
    // Authentication
    login: "Войти",
    register: "Регистрация",
    logout: "Выйти",
    email: "Эл. почта",
    password: "Пароль",
    confirmPassword: "Подтвердить пароль",
    forgotPassword: "Забыли пароль?",
    createAccount: "Создать аккаунт",
    checkEmail: "Проверить мою почту",
    changePassword: "Сменить пароль",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    
    // Subscription & Account
    subscription: "Подписка",
    premium: "Премиум",
    family: "Семейная",
    student: "Студенческая",
    free: "Бесплатная",
    upgrade: "Обновить",
    manageSubscription: "Управление подпиской",
    billing: "Оплата",
    paymentMethod: "Способ оплаты",
    accountSettings: "Настройки аккаунта",
    profile: "Профиль",
    notifications: "Уведомления",
    privacy: "Конфиденциальность",
    currentPlan: "Текущий план",
    changePlan: "Сменить план",
    cancelSubscription: "Отменить подписку",
    renewSubscription: "Продлить подписку",
    freeTrial: "Бесплатный пробный период",
    startFreeTrial: "Начать пробный период",
    
    // Admin Console
    adminConsole: "Консоль администратора",
    dashboard: "Панель управления",
    userManagement: "Управление пользователями",
    contentManagement: "Управление контентом",
    analytics: "Аналитика",
    subscriptionManagement: "Управление подписками",
    reports: "Отчеты",
    settings: "Настройки",
    totalUsers: "Всего пользователей",
    premiumUsers: "Премиум пользователи",
    revenue: "Доходы",
    growth: "Рост",
    downloadCSV: "Скачать CSV",
    
    // Content Management
    addArtist: "Добавить исполнителя",
    editArtist: "Редактировать исполнителя",
    deleteArtist: "Удалить исполнителя",
    addAlbum: "Добавить альбом",
    editAlbum: "Редактировать альбом",
    deleteAlbum: "Удалить альбом",
    addSong: "Добавить песню",
    editSong: "Редактировать песню",
    deleteSong: "Удалить песню",
    uploadImage: "Загрузить изображение",
    category: "Категория",
    country: "Страна",
    
    // User Management
    viewUser: "Просмотр пользователя",
    editUser: "Редактировать пользователя",
    deleteUser: "Удалить пользователя",
    addUser: "Добавить пользователя",
    banUser: "Заблокировать пользователя",
    unbanUser: "Разблокировать пользователя",
    userDetails: "Детали пользователя",
    subscriptionStatus: "Статус подписки",
    lastActive: "Последняя активность",
    joinDate: "Дата регистрации",
    resetPassword: "Сбросить пароль",
    
    // Common actions
    add: "Добавить",
    edit: "Редактировать",
    delete: "Удалить",
    save: "Сохранить",
    cancel: "Отменить",
    confirm: "Подтвердить",
    create: "Создать",
    update: "Обновить",
    view: "Просмотр",
    manage: "Управлять",
    filter: "Фильтр",
    sort: "Сортировать",
    searchPlaceholder: "Поиск...",
    
    // Form fields
    name: "Имя",
    title: "Название",
    artist: "Исполнитель",
    album: "Альбом",
    genre: "Жанр",
    duration: "Длительность",
    year: "Год",
    status: "Статус",
    description: "Описание",
    image: "Изображение",
    
    // Status messages
    success: "Успех",
    error: "Ошибка",
    warning: "Предупреждение",
    info: "Информация",
    loading: "Загрузка...",
    saving: "Сохранение...",
    deleting: "Удаление...",
    updating: "Обновление...",
    
    // Subscription features
    adFree: "Прослушивание без рекламы",
    unlimitedSkips: "Неограниченные пропуски",
    highQuality: "Высокое качество звука",
    offlineDownloads: "Загрузки для офлайн",
    unlimitedPlaylists: "Неограниченные плейлисты",
    onDemand: "Воспроизведение любой песни по требованию",
    familyAccounts: "Семейные аккаунты",
    kidSafe: "Детский режим",
    studentDiscount: "Студенческая скидка",
    
    // Analytics & Stats
    streams: "Прослушивания",
    users: "Пользователи",
    conversion: "Конверсия",
    retention: "Удержание",
    churn: "Отток",
    engagement: "Вовлеченность",
    monthlyListeners: "месячные слушатели",
    totalStreams: "Всего прослушиваний",
    artistStats: "Статистика исполнителя",
    
    // Time periods
    today: "Сегодня",
    thisWeek: "На этой неделе",
    thisMonth: "В этом месяце",
    thisYear: "В этом году",
    allTime: "За все время",
    
    // Playlist management
    playlistName: "Название плейлиста",
    makePublic: "Сделать публичным",
    makePrivate: "Сделать приватным",
    sharePlaylist: "Поделиться плейлистом",
    deletePlaylist: "Удалить плейлист",
    
    // Miscellaneous
    tracks: "треки",
    verified: "Верифицированный исполнитель",
    share: "Поделиться",
    follow: "Подписаться",
    following: "Подписан",
    addToPlaylist: "Добавить в плейлист"
  }
};

// Icons (all the existing icons plus new ones)
const PlayIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);

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

const HeartIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const CrownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l.9-5.4-2.1 1.4L12 8l-3.1 2-2.1-1.4L7.7 14z"/>
  </svg>
);

const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3.72 5.02A1.5 1.5 0 0 0 11.5 15H12v7h8zm-12.5-11L8 10l3-1 1 1h2V8.5L12 7l-1-1-3 1-1.5 1zM6 22H0v-6c0-.8.37-1.54 1-2l2.28-1.58A1.5 1.5 0 0 1 4.72 12H8l1 1v2H7l-1 7z"/>
  </svg>
);

const AnalyticsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg>
);

const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

const LanguageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
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

const MoneyIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11,8c0,2.21 -1.79,4 -4,4s-4,-1.79 -4,-4 1.79,-4 4,-4 4,1.79 4,4zM7,6c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2zM13,8c0,-2.21 1.79,-4 4,-4s4,1.79 4,4 -1.79,4 -4,4 -4,-1.79 -4,-4zM17,6c-1.1,0 -2,0.9 -2,2s0.9,2 2,2 2,-0.9 2,-2 -0.9,-2 -2,-2zM12,20c-4.42,0 -8,-3.58 -8,-8s3.58,-8 8,-8 8,3.58 8,8 -3.58,8 -8,8zM12,2c-5.52,0 -10,4.48 -10,10s4.48,10 10,10 10,-4.48 10,-10 -4.48,-10 -10,-10z"/>
  </svg>
);

const ShareIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
  </svg>
);

const FilterIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
  </svg>
);

const VerifiedIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const MoreIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

const BackIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const DownloadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const LoginIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
  </svg>
);

const SkipPreviousIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);

const SkipNextIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);

const ShuffleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
  </svg>
);

const RepeatIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
  </svg>
);

const VolumeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

// Authentication Component
const AuthenticationPage = ({ onLogin, language, translations }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const t = translations[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Handle login
      if (email === 'admin@gospelspot.com' && password === 'admin123') {
        onLogin(mockData.users[1]); // SuperAdmin
      } else if (email === 'brandon@example.com' && password === 'artist123') {
        onLogin(mockData.users[2]); // Artist
      } else {
        onLogin(mockData.users[0]); // Regular user
      }
    } else if (isRegister) {
      // Handle registration
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      // Show email verification step
      setShowEmailVerification(true);
    } else if (showEmailVerification) {
      // Handle email verification completion
      const newUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        password: password,
        subscription: 'free',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        status: 'active',
        paymentMethod: null,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'user',
        language: language,
        country: 'USA',
        stats: {
          songsPlayed: 0,
          playlistsCreated: 0,
          hoursListened: 0
        }
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            G
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            GospelSpot
          </h1>
          <p className="text-gray-600 mt-2">
            {showEmailVerification ? t.checkEmail : isLogin ? t.login : t.createAccount}
          </p>
        </div>

        {showEmailVerification ? (
          <div className="text-center">
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                ✓
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Account Created!</h3>
              <p className="text-gray-600 mb-4">
                Your account has been created successfully. Password: <strong>{password}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please save your password securely.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all font-medium"
            >
              {t.checkEmail}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.email}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t.password}
                required
              />
            </div>

            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.confirmPassword}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t.confirmPassword}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all font-medium"
            >
              {isLogin ? t.login : t.createAccount}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setIsRegister(!isRegister); }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {isLogin ? t.createAccount : t.login}
              </button>
            </div>

            {isLogin && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Demo Credentials:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>SuperAdmin:</strong> admin@gospelspot.com / admin123</div>
                  <div><strong>Artist:</strong> brandon@example.com / artist123</div>
                  <div><strong>User:</strong> Any other email / any password</div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

// Continue with rest of components...