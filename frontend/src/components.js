import React, { useState, useEffect } from 'react';

// Mock data for gospel and Christian music
const mockData = {
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
      ]
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
      ]
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
      ]
    }
  ],
  newReleases: [
    {
      id: 1,
      title: "King of Hearts",
      artist: "Brandon Lake",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      year: "2025",
      type: "Album"
    },
    {
      id: 2,
      title: "Sons of Sunday",
      artist: "Sons of Sunday",
      image: "https://images.unsplash.com/photo-1701427835787-2c2bb970d55e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      year: "2025",
      type: "Album"
    },
    {
      id: 3,
      title: "Child of God II",
      artist: "Forrest Frank",
      image: "https://images.unsplash.com/photo-1669198074199-5f58e548974e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwzfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85",
      year: "2025",
      type: "Album"
    },
    {
      id: 4,
      title: "No Fear",
      artist: "Jon Reddick",
      image: "https://images.pexels.com/photos/7520077/pexels-photo-7520077.jpeg",
      year: "2025",
      type: "Single"
    },
    {
      id: 5,
      title: "Wonder & Awe",
      artist: "MercyMe",
      image: "https://images.pexels.com/photos/7520079/pexels-photo-7520079.jpeg",
      year: "2025",
      type: "Album"
    },
    {
      id: 6,
      title: "Gospel Voices",
      artist: "Various Artists",
      image: "https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg",
      year: "2025",
      type: "Compilation"
    }
  ],
  topArtists: [
    {
      id: 1,
      name: "Brandon Lake",
      image: "https://images.unsplash.com/photo-1602022578288-5824e225738f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      followers: "2.4M",
      genre: "Contemporary Christian"
    },
    {
      id: 2,
      name: "MercyMe",
      image: "https://images.pexels.com/photos/54333/person-clinic-cross-religion-54333.jpeg",
      followers: "1.8M",
      genre: "Christian Rock"
    },
    {
      id: 3,
      name: "Sons of Sunday",
      image: "https://images.pexels.com/photos/415571/pexels-photo-415571.jpeg",
      followers: "892K",
      genre: "Worship"
    }
  ],
  recentlyPlayed: [
    { id: 1, title: "That's Who I Praise", artist: "Brandon Lake", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85", playedAt: "2 hours ago" },
    { id: 2, title: "No Fear", artist: "Jon Reddick", image: "https://images.pexels.com/photos/7520077/pexels-photo-7520077.jpeg", playedAt: "5 hours ago" },
    { id: 3, title: "God Did!", artist: "Sons of Sunday", image: "https://images.unsplash.com/photo-1701427835787-2c2bb970d55e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85", playedAt: "1 day ago" }
  ]
};

// Language translations
const translations = {
  en: {
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
    language: "Language"
  },
  es: {
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
    language: "Idioma"
  },
  pt: {
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
    language: "Idioma"
  }
};

// Icons
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

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
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

const LanguageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
  </svg>
);

// Components
const Sidebar = ({ activeTab, setActiveTab, language, setLanguage, translations }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const t = translations[language];

  return (
    <div className="w-64 bg-black text-white p-6 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-lg mr-3">
          G
        </div>
        <h1 className="text-xl font-bold">GospelSpot</h1>
      </div>
      
      <nav className="flex-1">
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'home' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="font-medium">{t.home}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'search' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <SearchIcon className="w-6 h-6" />
            <span className="font-medium">{t.search}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              activeTab === 'library' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <LibraryIcon className="w-6 h-6" />
            <span className="font-medium">{t.library}</span>
          </button>
        </div>
        
        <div className="mt-8">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <PlusIcon className="w-6 h-6" />
            <span className="font-medium">{t.createPlaylist}</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <HeartIcon className="w-6 h-6" />
            <span className="font-medium">{t.likedSongs}</span>
          </button>
        </div>
      </nav>
      
      <div className="mt-auto">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <LanguageIcon className="w-6 h-6" />
            <span className="font-medium">{t.language}</span>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute bottom-full left-0 right-0 bg-gray-800 rounded-lg p-2 mb-2">
              <button
                onClick={() => { setLanguage('en'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-700 ${language === 'en' ? 'bg-gray-700' : ''}`}
              >
                English
              </button>
              <button
                onClick={() => { setLanguage('es'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-700 ${language === 'es' ? 'bg-gray-700' : ''}`}
              >
                Español
              </button>
              <button
                onClick={() => { setLanguage('pt'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-700 ${language === 'pt' ? 'bg-gray-700' : ''}`}
              >
                Português
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlaylistCard = ({ playlist, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(playlist)}
    >
      <div className="relative">
        <img 
          src={playlist.image} 
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-md mb-4"
        />
        {isHovered && (
          <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full hover:bg-green-400 transition-colors">
            <PlayIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <h3 className="font-bold text-white mb-2">{playlist.name}</h3>
      <p className="text-gray-400 text-sm">{playlist.description}</p>
    </div>
  );
};

const AlbumCard = ({ album, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(album)}
    >
      <div className="relative">
        <img 
          src={album.image} 
          alt={album.title}
          className="w-full aspect-square object-cover rounded-md mb-4"
        />
        {isHovered && (
          <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full hover:bg-green-400 transition-colors">
            <PlayIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <h3 className="font-bold text-white mb-1">{album.title}</h3>
      <p className="text-gray-400 text-sm">{album.year} • {album.artist}</p>
    </div>
  );
};

const ArtistCard = ({ artist, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(artist)}
    >
      <div className="relative">
        <img 
          src={artist.image} 
          alt={artist.name}
          className="w-full aspect-square object-cover rounded-full mb-4"
        />
        {isHovered && (
          <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full hover:bg-green-400 transition-colors">
            <PlayIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <h3 className="font-bold text-white mb-1">{artist.name}</h3>
      <p className="text-gray-400 text-sm">{artist.genre}</p>
    </div>
  );
};

const HomeView = ({ language, translations, onPlay }) => {
  const t = translations[language];
  const currentHour = new Date().getHours();
  let greeting = t.goodEvening;
  
  if (currentHour < 12) {
    greeting = t.goodMorning;
  } else if (currentHour < 18) {
    greeting = t.goodAfternoon;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">{greeting}</h1>
      
      {/* Recently Played */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{t.recentlyPlayed}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockData.recentlyPlayed.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-700 transition-colors cursor-pointer">
              <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md" />
              <div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Made for you */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{t.madeForYou}</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">{t.showAll}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockData.featuredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} onPlay={onPlay} />
          ))}
        </div>
      </div>
      
      {/* New Releases */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{t.newReleases}</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">{t.showAll}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockData.newReleases.map((album) => (
            <AlbumCard key={album.id} album={album} onPlay={onPlay} />
          ))}
        </div>
      </div>
      
      {/* Top Artists */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{t.topArtists}</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">{t.showAll}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockData.topArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onPlay={onPlay} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchView = ({ language, translations }) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const genres = [
    { name: 'Contemporary Christian', color: 'bg-purple-600', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85' },
    { name: 'Gospel', color: 'bg-orange-600', image: 'https://images.pexels.com/photos/8815036/pexels-photo-8815036.jpeg' },
    { name: 'Worship', color: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85' },
    { name: 'Christian Rock', color: 'bg-red-600', image: 'https://images.unsplash.com/photo-1602022578288-5824e225738f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85' },
    { name: 'Christian Hip-Hop', color: 'bg-green-600', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxnb3NwZWwlMjBtdXNpY3xlbnwwfHx8fDE3NTIyMTczNTZ8MA&ixlib=rb-4.1.0&q=85' },
    { name: 'Praise & Worship', color: 'bg-yellow-600', image: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg' }
  ];
  
  const handleSearch = (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Mock search results
    const mockResults = [
      ...mockData.newReleases.filter(album => 
        album.title.toLowerCase().includes(query.toLowerCase()) ||
        album.artist.toLowerCase().includes(query.toLowerCase())
      ),
      ...mockData.topArtists.filter(artist => 
        artist.name.toLowerCase().includes(query.toLowerCase())
      ),
      ...mockData.featuredPlaylists.filter(playlist => 
        playlist.name.toLowerCase().includes(query.toLowerCase())
      )
    ];
    
    setSearchResults(mockResults);
  };
  
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`${t.search}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-3 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      {searchQuery === '' ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {genres.map((genre, index) => (
              <div key={index} className={`${genre.color} rounded-lg p-4 h-32 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}>
                <h3 className="text-white text-lg font-bold mb-2">{genre.name}</h3>
                <img src={genre.image} alt={genre.name} className="absolute -bottom-2 -right-2 w-20 h-20 object-cover rounded-lg transform rotate-12" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Search results for "{searchQuery}"</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {searchResults.map((item, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <img src={item.image} alt={item.title || item.name} className="w-full aspect-square object-cover rounded-md mb-4" />
                <h3 className="font-bold text-white mb-1">{item.title || item.name}</h3>
                <p className="text-gray-400 text-sm">{item.artist || item.genre || 'Playlist'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LibraryView = ({ language, translations }) => {
  const t = translations[language];
  
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">{t.library}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
          <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-md mb-4 flex items-center justify-center">
            <HeartIcon className="w-12 h-12 text-white" />
          </div>
          <h3 className="font-bold text-white mb-1">{t.likedSongs}</h3>
          <p className="text-gray-400 text-sm">42 songs</p>
        </div>
        
        {mockData.featuredPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

const NowPlayingBar = ({ currentSong, isPlaying, setIsPlaying, language, translations }) => {
  const t = translations[language];
  
  if (!currentSong) return null;
  
  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <img src={currentSong.image} alt={currentSong.title} className="w-14 h-14 rounded-md" />
        <div>
          <h4 className="text-white font-medium">{currentSong.title}</h4>
          <p className="text-gray-400 text-sm">{currentSong.artist}</p>
        </div>
        <button className="text-gray-400 hover:text-white ml-4">
          <HeartIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-col items-center space-y-2 flex-1">
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <ShuffleIcon className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <SkipPreviousIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <button className="text-gray-400 hover:text-white">
            <SkipNextIcon className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <RepeatIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2 w-full max-w-md">
          <span className="text-xs text-gray-400">1:23</span>
          <div className="flex-1 bg-gray-600 h-1 rounded-full">
            <div className="bg-white h-1 rounded-full w-1/3"></div>
          </div>
          <span className="text-xs text-gray-400">3:45</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 flex-1 justify-end">
        <button className="text-gray-400 hover:text-white">
          <VolumeIcon className="w-5 h-5" />
        </button>
        <div className="w-24 bg-gray-600 h-1 rounded-full">
          <div className="bg-white h-1 rounded-full w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export const SpotifyClone = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = (item) => {
    // Handle playing songs, albums, or playlists
    if (item.songs && item.songs.length > 0) {
      // It's a playlist
      setCurrentSong({
        title: item.songs[0].title,
        artist: item.songs[0].artist,
        image: item.image
      });
    } else if (item.title) {
      // It's an album
      setCurrentSong({
        title: item.title,
        artist: item.artist,
        image: item.image
      });
    } else if (item.name) {
      // It's an artist
      setCurrentSong({
        title: "Top Song",
        artist: item.name,
        image: item.image
      });
    }
    setIsPlaying(true);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView language={language} translations={translations} onPlay={handlePlay} />;
      case 'search':
        return <SearchView language={language} translations={translations} />;
      case 'library':
        return <LibraryView language={language} translations={translations} />;
      default:
        return <HomeView language={language} translations={translations} onPlay={handlePlay} />;
    }
  };
  
  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          language={language} 
          setLanguage={setLanguage} 
          translations={translations}
        />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-800 to-gray-900">
          {renderContent()}
        </main>
      </div>
      <NowPlayingBar 
        currentSong={currentSong} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        language={language}
        translations={translations}
      />
    </div>
  );
};