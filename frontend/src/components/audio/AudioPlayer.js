import React, { useState, useRef, useEffect } from 'react';
import { songAPI } from '../../utils/api';

export const AudioPlayer = ({ currentSong, onSongEnd, t }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioData, setAudioData] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (currentSong?.audio_file_base64) {
      loadAudio();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentSong]);

  const loadAudio = () => {
    if (!currentSong?.audio_file_base64) return;

    try {
      // Convert base64 to blob URL
      const byteCharacters = atob(currentSong.audio_file_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        setupAudioContext();
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      // Fallback to URL if base64 fails
      if (currentSong.audioUrl && audioRef.current) {
        audioRef.current.src = currentSong.audioUrl;
        setupAudioContext();
      }
    }
  };

  const setupAudioContext = () => {
    if (!audioRef.current) return;

    try {
      // Create audio context for visualization
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }

      startVisualization();
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  };

  const startVisualization = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gold waveform
      const barWidth = canvas.width / bufferLength * 2;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        // Create gradient for gold effect
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#FFD700'); // Gold
        gradient.addColorStop(0.3, '#FFA500'); // Orange
        gradient.addColorStop(0.7, '#FFB347'); // Light orange
        gradient.addColorStop(1, '#FFEF94'); // Light gold
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
        
        x += barWidth;
      }
    };

    if (isPlaying) {
      draw();
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        await audioRef.current.play();
        setIsPlaying(true);
        startVisualization();
        
        // Record play in backend
        if (currentSong?.id) {
          try {
            await songAPI.playSong(currentSong.id);
          } catch (error) {
            console.error('Error recording play:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (onSongEnd) {
      onSongEnd();
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 border-t border-gold-500/30 p-4 shadow-2xl backdrop-blur-md">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex-shrink-0 overflow-hidden">
              {currentSong.image_base64 ? (
                <img
                  src={`data:image/jpeg;base64,${currentSong.image_base64}`}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-medium truncate">{currentSong.title}</h3>
              <p className="text-gray-400 text-sm truncate">{currentSong.artist_name || 'Unknown Artist'}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center text-black transition-colors duration-200"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <div 
                className="flex-1 h-2 bg-gray-700 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-100"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
                <div className="absolute inset-0 bg-gold-400/20 opacity-0 hover:opacity-100 transition-opacity duration-200" />
              </div>
              <span className="text-gray-400 text-sm w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume and Visualization */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {/* Gold Waveform Visualization */}
            <div className="hidden md:block">
              <canvas
                ref={canvasRef}
                width={200}
                height={40}
                className="bg-black/20 rounded border border-gold-500/20"
              />
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FFD700;
          cursor: pointer;
          border: 2px solid #000;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #FFD700;
          cursor: pointer;
          border: 2px solid #000;
        }
      `}</style>
    </div>
  );
};