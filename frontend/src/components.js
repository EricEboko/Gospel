import React, { useState, useEffect } from 'react';

// Enhanced mock data with more content
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

// Extended language translations
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
    language: "Language",
    browseAll: "Browse all",
    searchResults: "Search results for",
    addToPlaylist: "Add to playlist",
    share: "Share",
    follow: "Follow",
    following: "Following",
    monthlyListeners: "monthly listeners",
    about: "About",
    discography: "Discography",
    appears: "Appears On",
    fans: "Fans also like",
    playlistName: "Playlist name",
    description: "Description",
    create: "Create",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    addSong: "Add song",
    removeSong: "Remove song",
    sharePlaylist: "Share playlist",
    makePublic: "Make public",
    makePrivate: "Make private",
    filter: "Filter",
    sortBy: "Sort by",
    artist: "Artist",
    album: "Album",
    genre: "Genre",
    year: "Year",
    duration: "Duration",
    tracks: "tracks",
    verified: "Verified Artist"
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
    language: "Idioma",
    browseAll: "Explorar todo",
    searchResults: "Resultados de búsqueda para",
    addToPlaylist: "Agregar a lista",
    share: "Compartir",
    follow: "Seguir",
    following: "Siguiendo",
    monthlyListeners: "oyentes mensuales",
    about: "Acerca de",
    discography: "Discografía",
    appears: "Aparece en",
    fans: "A los fans también les gusta",
    playlistName: "Nombre de la lista",
    description: "Descripción",
    create: "Crear",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    addSong: "Agregar canción",
    removeSong: "Quitar canción",
    sharePlaylist: "Compartir lista",
    makePublic: "Hacer pública",
    makePrivate: "Hacer privada",
    filter: "Filtrar",
    sortBy: "Ordenar por",
    artist: "Artista",
    album: "Álbum",
    genre: "Género",
    year: "Año",
    duration: "Duración",
    tracks: "pistas",
    verified: "Artista Verificado"
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
    language: "Idioma",
    browseAll: "Explorar tudo",
    searchResults: "Resultados da busca para",
    addToPlaylist: "Adicionar à playlist",
    share: "Compartilhar",
    follow: "Seguir",
    following: "Seguindo",
    monthlyListeners: "ouvintes mensais",
    about: "Sobre",
    discography: "Discografia",
    appears: "Aparece em",
    fans: "Fãs também gostam",
    playlistName: "Nome da playlist",
    description: "Descrição",
    create: "Criar",
    cancel: "Cancelar",
    save: "Salvar",
    delete: "Excluir",
    edit: "Editar",
    addSong: "Adicionar música",
    removeSong: "Remover música",
    sharePlaylist: "Compartilhar playlist",
    makePublic: "Tornar público",
    makePrivate: "Tornar privado",
    filter: "Filtrar",
    sortBy: "Ordenar por",
    artist: "Artista",
    album: "Álbum",
    genre: "Gênero",
    year: "Ano",
    duration: "Duração",
    tracks: "faixas",
    verified: "Artista Verificado"
  },
  fr: {
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
    addToPlaylist: "Ajouter à la playlist",
    share: "Partager",
    follow: "Suivre",
    following: "Abonné",
    monthlyListeners: "auditeurs mensuels",
    about: "À propos",
    discography: "Discographie",
    appears: "Apparaît sur",
    fans: "Les fans aiment aussi",
    playlistName: "Nom de la playlist",
    description: "Description",
    create: "Créer",
    cancel: "Annuler",
    save: "Sauvegarder",
    delete: "Supprimer",
    edit: "Modifier",
    addSong: "Ajouter une chanson",
    removeSong: "Retirer la chanson",
    sharePlaylist: "Partager la playlist",
    makePublic: "Rendre public",
    makePrivate: "Rendre privé",
    filter: "Filtrer",
    sortBy: "Trier par",
    artist: "Artiste",
    album: "Album",
    genre: "Genre",
    year: "Année",
    duration: "Durée",
    tracks: "pistes",
    verified: "Artiste Vérifié"
  },
  de: {
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
    addToPlaylist: "Zur Playlist hinzufügen",
    share: "Teilen",
    follow: "Folgen",
    following: "Folgend",
    monthlyListeners: "monatliche Hörer",
    about: "Über",
    discography: "Diskographie",
    appears: "Erscheint auf",
    fans: "Fans mögen auch",
    playlistName: "Playlist-Name",
    description: "Beschreibung",
    create: "Erstellen",
    cancel: "Abbrechen",
    save: "Speichern",
    delete: "Löschen",
    edit: "Bearbeiten",
    addSong: "Song hinzufügen",
    removeSong: "Song entfernen",
    sharePlaylist: "Playlist teilen",
    makePublic: "Öffentlich machen",
    makePrivate: "Privat machen",
    filter: "Filter",
    sortBy: "Sortieren nach",
    artist: "Künstler",
    album: "Album",
    genre: "Genre",
    year: "Jahr",
    duration: "Dauer",
    tracks: "Titel",
    verified: "Verifizierter Künstler"
  },
  it: {
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
    addToPlaylist: "Aggiungi alla playlist",
    share: "Condividi",
    follow: "Segui",
    following: "Seguendo",
    monthlyListeners: "ascoltatori mensili",
    about: "Informazioni",
    discography: "Discografia",
    appears: "Appare su",
    fans: "Piace anche ai fan",
    playlistName: "Nome playlist",
    description: "Descrizione",
    create: "Crea",
    cancel: "Annulla",
    save: "Salva",
    delete: "Elimina",
    edit: "Modifica",
    addSong: "Aggiungi brano",
    removeSong: "Rimuovi brano",
    sharePlaylist: "Condividi playlist",
    makePublic: "Rendi pubblica",
    makePrivate: "Rendi privata",
    filter: "Filtra",
    sortBy: "Ordina per",
    artist: "Artista",
    album: "Album",
    genre: "Genere",
    year: "Anno",
    duration: "Durata",
    tracks: "tracce",
    verified: "Artista Verificato"
  }
};

// Icons (same as before but with updated colors)
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

// Components
const Sidebar = ({ activeTab, setActiveTab, language, setLanguage, translations, userPlaylists, setShowCreatePlaylist }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
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
      
      <div className="mt-auto">
        <div className="relative">
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
              <button
                onClick={() => { setLanguage('pt'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${language === 'pt' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                Português
              </button>
              <button
                onClick={() => { setLanguage('fr'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${language === 'fr' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                Français
              </button>
              <button
                onClick={() => { setLanguage('de'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${language === 'de' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                Deutsch
              </button>
              <button
                onClick={() => { setLanguage('it'); setShowLanguageDropdown(false); }}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${language === 'it' ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                Italiano
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlaylistCard = ({ playlist, onPlay, onShare, language, translations }) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = translations[language];
  
  return (
    <div 
      className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer"
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
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onShare(playlist); }}
              className="bg-white text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-md"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg">
              <PlayIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <h3 className="font-bold text-gray-800 mb-2">{playlist.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{playlist.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{playlist.followers?.toLocaleString()} {t.followers}</span>
        <span>{playlist.songs?.length} {t.tracks}</span>
      </div>
    </div>
  );
};

const AlbumCard = ({ album, onPlay, onShare, language, translations }) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = translations[language];
  
  return (
    <div 
      className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer"
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
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onShare(album); }}
              className="bg-white text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-md"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg">
              <PlayIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <h3 className="font-bold text-gray-800 mb-1">{album.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{album.year} • {album.artist}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{album.genre}</span>
        <span>{album.tracks} {t.tracks}</span>
      </div>
    </div>
  );
};

const ArtistCard = ({ artist, onPlay, onFollow, language, translations }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const t = translations[language];
  
  return (
    <div 
      className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer"
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
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFollowing(!isFollowing); onFollow(artist); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isFollowing 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {isFollowing ? t.following : t.follow}
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg">
              <PlayIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center mb-2">
        <h3 className="font-bold text-gray-800 mr-2">{artist.name}</h3>
        {artist.verified && (
          <VerifiedIcon className="w-5 h-5 text-blue-600" />
        )}
      </div>
      <p className="text-gray-600 text-sm text-center mb-2">{artist.genre}</p>
      <div className="text-xs text-gray-500 text-center space-y-1">
        <div>{artist.followers} {t.followers}</div>
        <div>{artist.monthlyListeners} {t.monthlyListeners}</div>
      </div>
    </div>
  );
};

const CreatePlaylistModal = ({ isOpen, onClose, onCreatePlaylist, language, translations }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const t = translations[language];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (playlistName.trim()) {
      onCreatePlaylist({
        name: playlistName,
        description,
        isPublic,
        songs: [],
        createdAt: new Date().toISOString()
      });
      setPlaylistName('');
      setDescription('');
      setIsPublic(true);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.createPlaylist}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playlist-name" className="block text-sm font-medium text-gray-700 mb-1">
              {t.playlistName}
            </label>
            <input
              id="playlist-name"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.playlistName}
              required
            />
          </div>
          <div>
            <label htmlFor="playlist-description" className="block text-sm font-medium text-gray-700 mb-1">
              {t.description}
            </label>
            <textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t.description}
              rows="3"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="playlist-public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="playlist-public" className="text-sm text-gray-700">
              {t.makePublic}
            </label>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              {t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const HomeView = ({ language, translations, onPlay, onShare, onFollow }) => {
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
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{greeting}</h1>
      
      {/* Recently Played */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.recentlyPlayed}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockData.recentlyPlayed.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
              <img src={item.image} alt={item.title} className="w-16 h-16 rounded-md" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.artist}</p>
                <p className="text-gray-500 text-xs">{item.playedAt}</p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all">
                <PlayIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Made for you */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t.madeForYou}</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">{t.showAll}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockData.featuredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} onPlay={onPlay} onShare={onShare} language={language} translations={translations} />
          ))}
        </div>
      </div>
      
      {/* New Releases */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t.newReleases}</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">{t.showAll}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockData.newReleases.map((album) => (
            <AlbumCard key={album.id} album={album} onPlay={onPlay} onShare={onShare} language={language} translations={translations} />
          ))}
        </div>
      </div>
      
      {/* Top Artists */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t.topArtists}</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">{t.showAll}</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mockData.topArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onPlay={onPlay} onFollow={onFollow} language={language} translations={translations} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchView = ({ language, translations, onPlay, onShare, onFollow }) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    let results = [
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
    
    if (selectedGenre) {
      results = results.filter(item => 
        item.genre === selectedGenre || 
        (item.tags && item.tags.includes(selectedGenre.toLowerCase()))
      );
    }
    
    setSearchResults(results);
  };
  
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, selectedGenre]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`${t.search}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FilterIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.genre}</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t.filter}</option>
                  {mockData.genres.map(genre => (
                    <option key={genre.id} value={genre.name}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.sortBy}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {searchQuery === '' ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.browseAll}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockData.genres.map((genre) => (
              <div key={genre.id} className={`${genre.color} rounded-lg p-4 h-32 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}>
                <h3 className="text-white text-lg font-bold mb-2">{genre.name}</h3>
                <img src={genre.image} alt={genre.name} className="absolute -bottom-2 -right-2 w-20 h-20 object-cover rounded-lg transform rotate-12" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.searchResults} "{searchQuery}"</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {searchResults.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer">
                <img src={item.image} alt={item.title || item.name} className="w-full aspect-square object-cover rounded-md mb-4" />
                <h3 className="font-bold text-gray-800 mb-1">{item.title || item.name}</h3>
                <p className="text-gray-600 text-sm">{item.artist || item.genre || 'Playlist'}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{item.type || 'Artist'}</span>
                  <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all">
                    <PlayIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LibraryView = ({ language, translations, userPlaylists, onPlay, onShare }) => {
  const t = translations[language];
  
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{t.library}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer">
          <div className="w-full aspect-square bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md mb-4 flex items-center justify-center">
            <HeartIcon className="w-12 h-12 text-white" />
          </div>
          <h3 className="font-bold text-gray-800 mb-1">{t.likedSongs}</h3>
          <p className="text-gray-600 text-sm">42 {t.tracks}</p>
        </div>
        
        {mockData.featuredPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} onPlay={onPlay} onShare={onShare} language={language} translations={translations} />
        ))}
        
        {userPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} onPlay={onPlay} onShare={onShare} language={language} translations={translations} />
        ))}
      </div>
    </div>
  );
};

const ArtistDetailView = ({ artist, language, translations, onBack, onPlay, onFollow }) => {
  const t = translations[language];
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-4"
        >
          <BackIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{artist.name}</h1>
        {artist.verified && (
          <VerifiedIcon className="w-6 h-6 text-blue-600 ml-2" />
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <img src={artist.image} alt={artist.name} className="w-full aspect-square object-cover rounded-lg mb-4" />
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => { setIsFollowing(!isFollowing); onFollow(artist); }}
                className={`flex-1 px-4 py-2 rounded-full font-medium transition-all ${
                  isFollowing 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900'
                }`}
              >
                {isFollowing ? t.following : t.follow}
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
                <ShareIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>{artist.followers} {t.followers}</div>
              <div>{artist.monthlyListeners} {t.monthlyListeners}</div>
              <div>{artist.genre}</div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.about}</h2>
            <p className="text-gray-600">{artist.bio}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular</h2>
            <div className="space-y-3">
              {artist.topSongs.map((song, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="w-6 text-gray-500 text-sm">{index + 1}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{song}</h4>
                    <p className="text-sm text-gray-600">{artist.name}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.discography}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockData.newReleases.filter(album => album.artist === artist.name).map((album) => (
                <div key={album.id} className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer">
                  <img src={album.image} alt={album.title} className="w-full aspect-square object-cover rounded-md mb-3" />
                  <h4 className="font-medium text-gray-800">{album.title}</h4>
                  <p className="text-sm text-gray-600">{album.year} • {album.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NowPlayingBar = ({ currentSong, isPlaying, setIsPlaying, language, translations }) => {
  const t = translations[language];
  
  if (!currentSong) return null;
  
  return (
    <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <img src={currentSong.image} alt={currentSong.title} className="w-14 h-14 rounded-md" />
        <div>
          <h4 className="text-gray-800 font-medium">{currentSong.title}</h4>
          <p className="text-gray-600 text-sm">{currentSong.artist}</p>
        </div>
        <button className="text-gray-400 hover:text-yellow-500 ml-4">
          <HeartIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-col items-center space-y-2 flex-1">
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-600">
            <ShuffleIcon className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <SkipPreviousIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all"
          >
            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <SkipNextIcon className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <RepeatIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2 w-full max-w-md">
          <span className="text-xs text-gray-500">1:23</span>
          <div className="flex-1 bg-gray-300 h-1 rounded-full">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-1 rounded-full w-1/3"></div>
          </div>
          <span className="text-xs text-gray-500">3:45</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 flex-1 justify-end">
        <button className="text-gray-400 hover:text-gray-600">
          <VolumeIcon className="w-5 h-5" />
        </button>
        <div className="w-24 bg-gray-300 h-1 rounded-full">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-1 rounded-full w-3/4"></div>
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
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  
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
  
  const handleCreatePlaylist = (playlistData) => {
    const newPlaylist = {
      id: Date.now(),
      ...playlistData,
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b3JzaGlwfGVufDB8fHx8MTc1MjIxNzM2Mnww&ixlib=rb-4.1.0&q=85",
      followers: 0
    };
    setUserPlaylists([...userPlaylists, newPlaylist]);
  };
  
  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    setActiveTab('artist-detail');
  };
  
  const handleBackToHome = () => {
    setSelectedArtist(null);
    setActiveTab('home');
  };
  
  const renderContent = () => {
    if (activeTab === 'artist-detail' && selectedArtist) {
      return <ArtistDetailView artist={selectedArtist} language={language} translations={translations} onBack={handleBackToHome} onPlay={handlePlay} onFollow={handleFollow} />;
    }
    
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
  
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          language={language} 
          setLanguage={setLanguage} 
          translations={translations}
          userPlaylists={userPlaylists}
          setShowCreatePlaylist={setShowCreatePlaylist}
        />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
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
      <CreatePlaylistModal
        isOpen={showCreatePlaylist}
        onClose={() => setShowCreatePlaylist(false)}
        onCreatePlaylist={handleCreatePlaylist}
        language={language}
        translations={translations}
      />
    </div>
  );
};