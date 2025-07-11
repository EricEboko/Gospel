import React, { useState, useEffect } from 'react';

// Enhanced mock data with subscription and admin features
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
      subscription: 'premium',
      joinDate: '2024-01-15',
      lastActive: '2025-07-11',
      status: 'active',
      paymentMethod: 'Credit Card',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      stats: {
        songsPlayed: 1250,
        playlistsCreated: 8,
        hoursListened: 89
      }
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      subscription: 'family',
      joinDate: '2024-03-22',
      lastActive: '2025-07-10',
      status: 'active',
      paymentMethod: 'PayPal',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4db?w=150&h=150&fit=crop&crop=face',
      stats: {
        songsPlayed: 2100,
        playlistsCreated: 15,
        hoursListened: 156
      }
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      subscription: 'student',
      joinDate: '2024-09-10',
      lastActive: '2025-07-09',
      status: 'active',
      paymentMethod: 'Credit Card',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      stats: {
        songsPlayed: 850,
        playlistsCreated: 4,
        hoursListened: 62
      }
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma@example.com',
      subscription: 'free',
      joinDate: '2025-01-05',
      lastActive: '2025-07-11',
      status: 'active',
      paymentMethod: null,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      stats: {
        songsPlayed: 320,
        playlistsCreated: 2,
        hoursListened: 28
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
      { name: 'Contemporary Christian', percentage: 35, streams: 312051 },
      { name: 'Worship', percentage: 28, streams: 249881 },
      { name: 'Gospel', percentage: 22, streams: 196272 },
      { name: 'Christian Rock', percentage: 15, streams: 133822 }
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
    }
  },
  featuredPlaylists: [
    {
      id: 1,
      name: "Contemporary Christian Hits",
      description: "The biggest contemporary Christian songs right now",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      songs: [
        { id: 1, title: "That's Who I Praise", artist: "Brandon Lake", album: "King of Hearts", duration: "3:45" },
        { id: 2, title: "Hard Fought Hallelujah", artist: "Brandon Lake", album: "King of Hearts", duration: "4:12" },
        { id: 3, title: "God Did!", artist: "Sons of Sunday", album: "Sons of Sunday", duration: "3:28" }
      ],
      followers: 1250000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["contemporary", "worship", "praise"]
    },
    {
      id: 2,
      name: "Worship Essentials",
      description: "Essential worship songs for your spiritual journey",
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      songs: [
        { id: 4, title: "No Fear", artist: "Jon Reddick", album: "No Fear", duration: "3:56" },
        { id: 5, title: "Oh Death", artist: "MercyMe", album: "Wonder & Awe", duration: "4:23" },
        { id: 6, title: "Sing (Like You've Already Won)", artist: "MercyMe", album: "Wonder & Awe", duration: "3:41" }
      ],
      followers: 890000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["worship", "spiritual", "praise"]
    },
    {
      id: 3,
      name: "Gospel Classics",
      description: "Timeless gospel songs that never get old",
      image: "https://images.pexels.com/photos/8815036/pexels-photo-8815036.jpeg",
      songs: [
        { id: 7, title: "Amazing Grace", artist: "Traditional Gospel", album: "Gospel Classics", duration: "4:15" },
        { id: 8, title: "How Great Thou Art", artist: "Traditional Gospel", album: "Gospel Classics", duration: "3:52" },
        { id: 9, title: "Blessed Assurance", artist: "Traditional Gospel", album: "Gospel Classics", duration: "3:28" }
      ],
      followers: 750000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["traditional", "gospel", "classic"]
    },
    {
      id: 4,
      name: "Christian Rock Anthems",
      description: "Powerful Christian rock songs to energize your faith",
      image: "https://images.unsplash.com/photo-1602022578288-5824e225738f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      songs: [
        { id: 10, title: "Monster", artist: "Skillet", album: "Awake", duration: "2:59" },
        { id: 11, title: "Victorious", artist: "Skillet", album: "Unleashed", duration: "3:43" },
        { id: 12, title: "Reborn", artist: "Skillet", album: "Collide", duration: "3:52" }
      ],
      followers: 950000,
      isPublic: true,
      createdBy: "GospelSpot",
      tags: ["rock", "contemporary", "energetic"]
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
      duration: "45:30"
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
      duration: "38:45"
    },
    {
      id: 3,
      title: "Child of God II",
      artist: "Forrest Frank",
      image: "https://images.unsplash.com/photo-1669198074199-5f58e548974e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      year: "2025",
      type: "Album",
      genre: "Contemporary Christian",
      description: "Diverse sound blending various genres with Christian themes",
      tracks: 14,
      duration: "52:15"
    },
    {
      id: 4,
      title: "No Fear",
      artist: "Jon Reddick",
      image: "https://images.pexels.com/photos/7520077/pexels-photo-7520077.jpeg",
      year: "2025",
      type: "Single",
      genre: "Contemporary Christian",
      description: "Jon Reddick's first No. 1 hit on Christian Airplay",
      tracks: 1,
      duration: "3:56"
    },
    {
      id: 5,
      title: "Wonder & Awe",
      artist: "MercyMe",
      image: "https://images.pexels.com/photos/7520079/pexels-photo-7520079.jpeg",
      year: "2025",
      type: "Album",
      genre: "Contemporary Christian",
      description: "MercyMe's latest inspirational album",
      tracks: 11,
      duration: "42:18"
    },
    {
      id: 6,
      title: "Gospel Voices",
      artist: "Various Artists",
      image: "https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg",
      year: "2025",
      type: "Compilation",
      genre: "Gospel",
      description: "Collection of powerful gospel voices",
      tracks: 18,
      duration: "67:22"
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
      topSongs: ["That's Who I Praise", "Hard Fought Hallelujah", "Gratitude"]
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
      topSongs: ["Oh Death", "Sing (Like You've Already Won)", "I Can Only Imagine"]
    },
    {
      id: 3,
      name: "Sons of Sunday",
      image: "https://images.pexels.com/photos/415571/pexels-photo-415571.jpeg",
      followers: "892K",
      genre: "Worship",
      monthlyListeners: "1.7M",
      verified: true,
      bio: "Worship collective creating authentic worship experiences",
      topSongs: ["God Did!", "Sunday Morning", "Praise the Lord"]
    },
    {
      id: 4,
      name: "Jon Reddick",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      followers: "654K",
      genre: "Contemporary Christian",
      monthlyListeners: "1.3M",
      verified: true,
      bio: "Worship leader and songwriter",
      topSongs: ["No Fear", "Light the Way", "Freedom"]
    }
  ],
  recentlyPlayed: [
    { id: 1, title: "That's Who I Praise", artist: "Brandon Lake", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85", playedAt: "2 hours ago" },
    { id: 2, title: "No Fear", artist: "Jon Reddick", image: "https://images.pexels.com/photos/7520077/pexels-photo-7520077.jpeg", playedAt: "5 hours ago" },
    { id: 3, title: "God Did!", artist: "Sons of Sunday", image: "https://images.unsplash.com/photo-1701427835787-2c2bb970d55e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85", playedAt: "1 day ago" }
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
    { id: 11, name: 'Christian Metal', color: 'bg-black', image: 'https://images.unsplash.com/photo-1701427835787-2c2bb970d55e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85' },
    { id: 12, name: 'Christian Country', color: 'bg-amber-600', image: 'https://images.pexels.com/photos/7520077/pexels-photo-7520077.jpeg' }
  ]
};

// Extended language translations with admin and subscription terms
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
    logout: "Logout",
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
    
    // User Management
    viewUser: "View User",
    editUser: "Edit User",
    deleteUser: "Delete User",
    banUser: "Ban User",
    unbanUser: "Unban User",
    userDetails: "User Details",
    subscriptionStatus: "Subscription Status",
    lastActive: "Last Active",
    joinDate: "Join Date",
    
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
    search: "Search",
    
    // Form fields
    name: "Name",
    email: "Email",
    password: "Password",
    description: "Description",
    image: "Image",
    title: "Title",
    artist: "Artist",
    album: "Album",
    genre: "Genre",
    duration: "Duration",
    year: "Year",
    status: "Status",
    
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
    
    // Analytics
    streams: "Streams",
    users: "Users",
    revenue: "Revenue",
    conversion: "Conversion",
    retention: "Retention",
    churn: "Churn",
    engagement: "Engagement",
    
    // Time periods
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    allTime: "All Time"
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
    logout: "Cerrar Sesión",
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
    
    // User Management
    viewUser: "Ver Usuario",
    editUser: "Editar Usuario",
    deleteUser: "Eliminar Usuario",
    banUser: "Banear Usuario",
    unbanUser: "Desbanear Usuario",
    userDetails: "Detalles del Usuario",
    subscriptionStatus: "Estado de Suscripción",
    lastActive: "Última Actividad",
    joinDate: "Fecha de Registro",
    
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
    search: "Buscar"
  }
};

// Icons (keeping the same ones as before plus new admin icons)
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

// Admin Sidebar Component
const AdminSidebar = ({ activeTab, setActiveTab, language, translations }) => {
  const t = translations[language];
  
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg mr-3">
          A
        </div>
        <h1 className="text-xl font-bold">Admin Console</h1>
      </div>
      
      <nav className="flex-1">
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('admin-dashboard')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'admin-dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <DashboardIcon className="w-6 h-6" />
            <span className="font-medium">{t.dashboard}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('admin-users')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'admin-users' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <UsersIcon className="w-6 h-6" />
            <span className="font-medium">{t.userManagement}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('admin-content')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'admin-content' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <LibraryIcon className="w-6 h-6" />
            <span className="font-medium">{t.contentManagement}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('admin-subscriptions')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'admin-subscriptions' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <CrownIcon className="w-6 h-6" />
            <span className="font-medium">{t.subscriptionManagement}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('admin-analytics')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'admin-analytics' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <AnalyticsIcon className="w-6 h-6" />
            <span className="font-medium">{t.analytics}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('admin-settings')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'admin-settings' ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="font-medium">{t.settings}</span>
          </button>
        </div>
      </nav>
      
      <button
        onClick={() => setActiveTab('home')}
        className="mt-auto bg-blue-700 hover:bg-blue-600 p-3 rounded-lg transition-colors"
      >
        Back to App
      </button>
    </div>
  );
};

// Regular User Sidebar Component (updated with subscription access)
const Sidebar = ({ activeTab, setActiveTab, language, setLanguage, translations, userPlaylists, setShowCreatePlaylist, currentUser }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const t = translations[language];

  return (
    <div className="w-64 bg-white text-gray-800 p-6 flex flex-col border-r border-gray-200">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
          G
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">GospelSpot</h1>
      </div>
      
      <nav className="flex-1">
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="font-medium">{t.home}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'search' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <SearchIcon className="w-6 h-6" />
            <span className="font-medium">{t.search}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'library' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <LibraryIcon className="w-6 h-6" />
            <span className="font-medium">{t.library}</span>
          </button>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => setShowCreatePlaylist(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <PlusIcon className="w-6 h-6" />
            <span className="font-medium">{t.createPlaylist}</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <HeartIcon className="w-6 h-6 text-yellow-500" />
            <span className="font-medium">{t.likedSongs}</span>
          </button>
          
          {userPlaylists.length > 0 && (
            <div className="mt-4 space-y-1">
              {userPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => setActiveTab(`playlist-${playlist.id}`)}
                  className={`w-full text-left p-2 rounded hover:bg-gray-100 transition-colors ${
                    activeTab === `playlist-${playlist.id}` ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      
      {/* Subscription Status */}
      <div className="mt-auto">
        {currentUser?.subscription !== 'premium' && currentUser?.subscription !== 'family' && (
          <button
            onClick={() => setActiveTab('subscription')}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all mb-4 flex items-center justify-center space-x-2"
          >
            <CrownIcon className="w-5 h-5" />
            <span className="font-medium">{t.upgrade}</span>
          </button>
        )}
        
        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} alt="Profile" className="w-8 h-8 rounded-full" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">{currentUser?.name || "User"}</div>
              <div className="text-xs text-gray-500 capitalize">{currentUser?.subscription || "free"}</div>
            </div>
          </button>
          
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg p-2 mb-2 shadow-lg">
              <button
                onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                className="w-full text-left p-2 rounded hover:bg-gray-100"
              >
                {t.profile}
              </button>
              <button
                onClick={() => { setActiveTab('subscription'); setShowUserMenu(false); }}
                className="w-full text-left p-2 rounded hover:bg-gray-100"
              >
                {t.subscription}
              </button>
              <button
                onClick={() => { setActiveTab('admin-dashboard'); setShowUserMenu(false); }}
                className="w-full text-left p-2 rounded hover:bg-gray-100 text-blue-600"
              >
                {t.adminConsole}
              </button>
            </div>
          )}
        </div>
        
        {/* Language Selector */}
        <div className="relative mt-2">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LanguageIcon className="w-6 h-6" />
            <span className="font-medium">{t.language}</span>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-lg p-2 mb-2 shadow-lg">
              <button
                onClick={() => { setLanguage('en'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${language === 'en' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                English
              </button>
              <button
                onClick={() => { setLanguage('es'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${language === 'es' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                Español
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Subscription Plans Component
const SubscriptionPlansView = ({ language, translations, currentUser, onUpgrade }) => {
  const t = translations[language];
  
  return (
    <div className="p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600">Get the most out of your gospel music experience</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {mockData.subscriptionPlans.map((plan) => (
          <div key={plan.id} className={`relative bg-white border-2 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl ${
            plan.popular ? 'border-blue-600 scale-105' : 'border-gray-200'
          } ${currentUser?.subscription === plan.id ? 'ring-2 ring-green-500' : ''}`}>
            
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            {currentUser?.subscription === plan.id && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-800">${plan.price}</span>
                <span className="text-gray-600">/{plan.interval}</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => onUpgrade(plan)}
              disabled={currentUser?.subscription === plan.id}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                currentUser?.subscription === plan.id
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              {currentUser?.subscription === plan.id ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">All plans include a 30-day free trial</p>
        <p className="text-sm text-gray-500">Cancel anytime. No questions asked.</p>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ language, translations }) => {
  const t = translations[language];
  const analytics = mockData.analytics;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{analytics.totalUsers.toLocaleString()}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+{analytics.growthMetrics.userGrowth}% this month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Premium Users</p>
              <p className="text-3xl font-bold text-gray-800">{analytics.premiumUsers.toLocaleString()}</p>
            </div>
            <CrownIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">{((analytics.premiumUsers / analytics.totalUsers) * 100).toFixed(1)}% conversion</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-800">${analytics.revenue.toLocaleString()}</p>
            </div>
            <MoneyIcon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">+{analytics.growthMetrics.revenueGrowth}% this month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Songs Streamed</p>
              <p className="text-3xl font-bold text-gray-800">{(analytics.songsStreamed / 1000).toFixed(0)}K</p>
            </div>
            <PlayIcon className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">{analytics.hoursListened.toLocaleString()} hours total</p>
        </div>
      </div>
      
      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Genres */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Top Genres</h3>
          <div className="space-y-4">
            {analytics.topGenres.map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800">{genre.name}</span>
                    <span className="text-sm text-gray-600">{genre.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-blue-800 h-2 rounded-full" 
                      style={{ width: `${genre.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Revenue by Plan */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {analytics.revenueByPlan.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{plan.plan}</h4>
                  <p className="text-sm text-gray-600">{plan.users.toLocaleString()} users</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">${plan.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">monthly</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-800">User</th>
                <th className="text-left p-4 font-medium text-gray-800">Subscription</th>
                <th className="text-left p-4 font-medium text-gray-800">Join Date</th>
                <th className="text-left p-4 font-medium text-gray-800">Last Active</th>
                <th className="text-left p-4 font-medium text-gray-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockData.users.slice(0, 5).map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      user.subscription === 'premium' ? 'bg-blue-100 text-blue-800' :
                      user.subscription === 'family' ? 'bg-purple-100 text-purple-800' :
                      user.subscription === 'student' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.joinDate}</td>
                  <td className="p-4 text-gray-600">{user.lastActive}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = ({ language, translations }) => {
  const t = translations[language];
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubscription, setFilterSubscription] = useState('all');
  
  const filteredUsers = mockData.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSubscription === 'all' || user.subscription === filterSubscription;
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all">
          <PlusIcon className="w-5 h-5 inline mr-2" />
          Add User
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterSubscription}
            onChange={(e) => setFilterSubscription(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subscriptions</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="family">Family</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-800">User</th>
                <th className="text-left p-4 font-medium text-gray-800">Subscription</th>
                <th className="text-left p-4 font-medium text-gray-800">Stats</th>
                <th className="text-left p-4 font-medium text-gray-800">Join Date</th>
                <th className="text-left p-4 font-medium text-gray-800">Status</th>
                <th className="text-left p-4 font-medium text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      user.subscription === 'premium' ? 'bg-blue-100 text-blue-800' :
                      user.subscription === 'family' ? 'bg-purple-100 text-purple-800' :
                      user.subscription === 'student' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">
                      <div>{user.stats.songsPlayed} songs</div>
                      <div>{user.stats.hoursListened}h listened</div>
                      <div>{user.stats.playlistsCreated} playlists</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{user.joinDate}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
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
      
      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-24 h-24 rounded-full mb-4" />
                <h3 className="text-xl font-bold text-gray-800">{selectedUser.name}</h3>
                <p className="text-gray-600 mb-4">{selectedUser.email}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subscription:</span>
                    <span className="font-medium capitalize">{selectedUser.subscription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Join Date:</span>
                    <span className="font-medium">{selectedUser.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Active:</span>
                    <span className="font-medium">{selectedUser.lastActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{selectedUser.status}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Statistics</h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedUser.stats.songsPlayed}</div>
                    <div className="text-sm text-gray-600">Songs Played</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedUser.stats.hoursListened}</div>
                    <div className="text-sm text-gray-600">Hours Listened</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{selectedUser.stats.playlistsCreated}</div>
                    <div className="text-sm text-gray-600">Playlists Created</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Edit User
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Content Management Component  
const ContentManagement = ({ language, translations }) => {
  const t = translations[language];
  const [activeContentTab, setActiveContentTab] = useState('artists');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all"
        >
          <PlusIcon className="w-5 h-5 inline mr-2" />
          Add {activeContentTab.slice(0, -1)}
        </button>
      </div>
      
      {/* Content Type Tabs */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveContentTab('artists')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeContentTab === 'artists' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Artists ({mockData.topArtists.length})
          </button>
          <button
            onClick={() => setActiveContentTab('albums')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeContentTab === 'albums' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Albums ({mockData.newReleases.length})
          </button>
          <button
            onClick={() => setActiveContentTab('playlists')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeContentTab === 'playlists' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Playlists ({mockData.featuredPlaylists.length})
          </button>
          <button
            onClick={() => setActiveContentTab('genres')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeContentTab === 'genres' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Genres ({mockData.genres.length})
          </button>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeContentTab === 'artists' && mockData.topArtists.map((artist) => (
          <div key={artist.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <img src={artist.image} alt={artist.name} className="w-full aspect-square object-cover rounded-lg mb-4" />
            <h3 className="font-bold text-gray-800 mb-2">{artist.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{artist.genre}</p>
            <p className="text-sm text-gray-500 mb-4">{artist.followers} followers</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedItem(artist)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {activeContentTab === 'albums' && mockData.newReleases.map((album) => (
          <div key={album.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <img src={album.image} alt={album.title} className="w-full aspect-square object-cover rounded-lg mb-4" />
            <h3 className="font-bold text-gray-800 mb-2">{album.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{album.artist}</p>
            <p className="text-sm text-gray-500 mb-4">{album.year} • {album.tracks} tracks</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedItem(album)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {activeContentTab === 'playlists' && mockData.featuredPlaylists.map((playlist) => (
          <div key={playlist.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <img src={playlist.image} alt={playlist.name} className="w-full aspect-square object-cover rounded-lg mb-4" />
            <h3 className="font-bold text-gray-800 mb-2">{playlist.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{playlist.description}</p>
            <p className="text-sm text-gray-500 mb-4">{playlist.followers.toLocaleString()} followers</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedItem(playlist)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {activeContentTab === 'genres' && mockData.genres.map((genre) => (
          <div key={genre.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className={`${genre.color} h-32 rounded-lg mb-4 relative overflow-hidden`}>
              <img src={genre.image} alt={genre.name} className="absolute -bottom-2 -right-2 w-20 h-20 object-cover rounded-lg transform rotate-12" />
            </div>
            <h3 className="font-bold text-gray-800 mb-4">{genre.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedItem(genre)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add/Edit Modal */}
      {(showAddModal || selectedItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedItem ? 'Edit' : 'Add'} {activeContentTab.slice(0, -1)}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setSelectedItem(null); }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name/Title</label>
                <input
                  type="text"
                  defaultValue={selectedItem?.name || selectedItem?.title || ''}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name/title..."
                />
              </div>
              
              {activeContentTab !== 'genres' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    defaultValue={selectedItem?.description || selectedItem?.bio || ''}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter description..."
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  defaultValue={selectedItem?.image || ''}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL..."
                />
              </div>
              
              {activeContentTab === 'artists' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {mockData.genres.map(genre => (
                      <option key={genre.id} value={genre.name}>{genre.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {activeContentTab === 'albums' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {mockData.topArtists.map(artist => (
                        <option key={artist.id} value={artist.name}>{artist.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="number"
                        defaultValue={selectedItem?.year || new Date().getFullYear()}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tracks</label>
                      <input
                        type="number"
                        defaultValue={selectedItem?.tracks || 10}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setSelectedItem(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all"
                >
                  {selectedItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
export const SpotifyClone = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [currentUser, setCurrentUser] = useState(mockData.users[0]); // Simulate logged in user
  
  const handlePlay = (item) => {
    if (item.songs && item.songs.length > 0) {
      setCurrentSong({
        title: item.songs[0].title,
        artist: item.songs[0].artist,
        image: item.image
      });
    } else if (item.title) {
      setCurrentSong({
        title: item.title,
        artist: item.artist,
        image: item.image
      });
    } else if (item.name) {
      setCurrentSong({
        title: "Top Song",
        artist: item.name,
        image: item.image
      });
    }
    setIsPlaying(true);
  };
  
  const handleShare = (item) => {
    const shareText = `Check out ${item.title || item.name} on GospelSpot!`;
    if (navigator.share) {
      navigator.share({
        title: item.title || item.name,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard!');
    }
  };
  
  const handleFollow = (artist) => {
    console.log('Following artist:', artist.name);
  };
  
  const handleUpgrade = (plan) => {
    setCurrentUser({ ...currentUser, subscription: plan.id });
    alert(`Upgraded to ${plan.name} plan!`);
    setActiveTab('home');
  };
  
  const handleCreatePlaylist = (playlistData) => {
    const newPlaylist = {
      id: Date.now(),
      ...playlistData,
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      followers: 0
    };
    setUserPlaylists([...userPlaylists, newPlaylist]);
  };
  
  const renderContent = () => {
    // Admin views
    if (activeTab === 'admin-dashboard') {
      return <AdminDashboard language={language} translations={translations} />;
    }
    if (activeTab === 'admin-users') {
      return <UserManagement language={language} translations={translations} />;
    }
    if (activeTab === 'admin-content') {
      return <ContentManagement language={language} translations={translations} />;
    }
    if (activeTab === 'admin-subscriptions' || activeTab === 'admin-analytics' || activeTab === 'admin-settings') {
      return (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {activeTab.replace('admin-', '').charAt(0).toUpperCase() + activeTab.replace('admin-', '').slice(1)}
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
            <p className="text-gray-600">This section is under development.</p>
          </div>
        </div>
      );
    }
    
    // Subscription view
    if (activeTab === 'subscription') {
      return <SubscriptionPlansView language={language} translations={translations} currentUser={currentUser} onUpgrade={handleUpgrade} />;
    }
    
    // Main music interface views
    switch (activeTab) {
      case 'home':
        return <HomeView language={language} translations={translations} onPlay={handlePlay} onShare={handleShare} onFollow={handleFollow} />;
      case 'search':
        return <SearchView language={language} translations={translations} onPlay={handlePlay} onShare={handleShare} onFollow={handleFollow} />;
      case 'library':
        return <LibraryView language={language} translations={translations} userPlaylists={userPlaylists} onPlay={handlePlay} onShare={handleShare} />;
      default:
        return <HomeView language={language} translations={translations} onPlay={handlePlay} onShare={handleShare} onFollow={handleFollow} />;
    }
  };
  
  const isAdminView = activeTab.startsWith('admin-');
  
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {isAdminView ? (
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} translations={translations} />
        ) : (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            language={language} 
            setLanguage={setLanguage} 
            translations={translations}
            userPlaylists={userPlaylists}
            setShowCreatePlaylist={setShowCreatePlaylist}
            currentUser={currentUser}
          />
        )}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
          {renderContent()}
        </main>
      </div>
      
      {!isAdminView && currentSong && (
        <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <img src={currentSong.image} alt={currentSong.title} className="w-14 h-14 rounded-md" />
            <div>
              <h4 className="text-gray-800 font-medium">{currentSong.title}</h4>
              <p className="text-gray-600 text-sm">{currentSong.artist}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};