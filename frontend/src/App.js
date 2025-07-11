import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpotifyClone } from './components';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpotifyClone />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;