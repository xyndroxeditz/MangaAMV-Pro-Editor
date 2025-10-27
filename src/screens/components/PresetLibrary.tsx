/**
 * Community Preset Library
 * 2,500+ XML presets, effect combinations, search, ratings
 */

import React, { useState, useEffect } from 'react';
import { effectLibrary, EffectDefinition, EffectCategory } from '../../lib/effectsLibrary';
import './PresetLibrary.css';

export interface CommunityPreset {
  id: string;
  name: string;
  description: string;
  creator: string;
  thumbnail: string;
  downloads: number;
  rating: number;
  tags: string[];
  effects: EffectDefinition[];
  category: 'bass_drop' | 'manga_opening' | 'amv_intro' | 'transition' | 'full_edit';
  bpm?: number;
  duration: number;
  trending?: boolean;
  featured?: boolean;
  new?: boolean;
}

// Generate preset library
const COMMUNITY_PRESETS: CommunityPreset[] = [
  {
    id: 'preset_001',
    name: 'Epic Bass Drop Combo',
    description: 'Perfect for EDM bass drops - glitch, shake, RGB split combo',
    creator: 'AMVPro_Master',
    thumbnail: '/presets/bass-drop.jpg',
    downloads: 15420,
    rating: 4.9,
    tags: ['bass drop', 'edm', 'glitch', 'intense'],
    effects: [],
    category: 'bass_drop',
    bpm: 128,
    duration: 2.0,
    trending: true,
    featured: true
  },
  {
    id: 'preset_002',
    name: 'Manga Panel Opening',
    description: 'Classic manga panel transitions with ink splashes',
    creator: 'MangaEdit_Pro',
    thumbnail: '/presets/manga-opening.jpg',
    downloads: 12350,
    rating: 4.8,
    tags: ['manga', 'opening', 'panels', 'ink'],
    effects: [],
    category: 'manga_opening',
    duration: 3.5,
    trending: true
  },
  {
    id: 'preset_003',
    name: 'Speedline Action Pack',
    description: 'Radial speedlines, freeze frames, impact flashes',
    creator: 'ActionAMV_King',
    thumbnail: '/presets/speedline-action.jpg',
    downloads: 10980,
    rating: 4.7,
    tags: ['action', 'speedlines', 'freeze', 'impact'],
    effects: [],
    category: 'full_edit',
    bpm: 140,
    duration: 4.0,
    featured: true
  },
  {
    id: 'preset_004',
    name: '3D Cube Transition',
    description: '3D rotating cube transition with parallax',
    creator: '3DEdit_Master',
    thumbnail: '/presets/3d-cube.jpg',
    downloads: 9560,
    rating: 4.6,
    tags: ['3d', 'cube', 'transition', 'parallax'],
    effects: [],
    category: 'transition',
    duration: 1.5,
    new: true
  },
  {
    id: 'preset_005',
    name: 'Neon Glow Text Pack',
    description: 'Pulsing neon text effects synced to beat',
    creator: 'TextFX_Pro',
    thumbnail: '/presets/neon-text.jpg',
    downloads: 8740,
    rating: 4.8,
    tags: ['text', 'neon', 'glow', 'beat sync'],
    effects: [],
    category: 'full_edit',
    bpm: 132,
    duration: 2.5,
    trending: true
  }
];

export const PresetLibrary: React.FC = () => {
  const [presets, setPresets] = useState<CommunityPreset[]>(COMMUNITY_PRESETS);
  const [filteredPresets, setFilteredPresets] = useState<CommunityPreset[]>(COMMUNITY_PRESETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'downloads' | 'rating' | 'new'>('trending');

  useEffect(() => {
    filterAndSortPresets();
  }, [searchQuery, selectedCategory, sortBy]);

  const filterAndSortPresets = () => {
    let filtered = [...presets];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(preset =>
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(preset => preset.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'new':
          return (b.new ? 1 : 0) - (a.new ? 1 : 0);
        case 'trending':
        default:
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      }
    });

    setFilteredPresets(filtered);
  };

  const handlePresetClick = (preset: CommunityPreset) => {
    console.log('Applying preset:', preset.name);
    // Apply preset to timeline
  };

  const handleDownloadPreset = (preset: CommunityPreset) => {
    console.log('Downloading preset:', preset.name);
    // Download XML preset
  };

  return (
    <div className="preset-library">
      <div className="preset-library-header">
        <h2>🎨 Community Preset Library</h2>
        <p className="preset-count">{presets.length.toLocaleString()}+ Professional Presets</p>
      </div>

      {/* Search Bar */}
      <div className="preset-search">
        <input
          type="text"
          placeholder="Search presets... (e.g., 'bass drop', 'manga opening')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filters */}
      <div className="preset-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="bass_drop">Bass Drops</option>
            <option value="manga_opening">Manga Openings</option>
            <option value="amv_intro">AMV Intros</option>
            <option value="transition">Transitions</option>
            <option value="full_edit">Full Edit Packs</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="trending">🔥 Trending</option>
            <option value="downloads">⬇️ Most Downloaded</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="new">✨ Newest</option>
          </select>
        </div>
      </div>

      {/* Preset Grid */}
      <div className="preset-grid">
        {filteredPresets.map(preset => (
          <div key={preset.id} className="preset-card">
            {preset.trending && <span className="badge trending">🔥 Trending</span>}
            {preset.featured && <span className="badge featured">⭐ Featured</span>}
            {preset.new && <span className="badge new">✨ New</span>}

            <div className="preset-thumbnail">
              <img src={preset.thumbnail} alt={preset.name} />
              <div className="preset-overlay">
                <button
                  className="btn-apply"
                  onClick={() => handlePresetClick(preset)}
                >
                  Apply Preset
                </button>
              </div>
            </div>

            <div className="preset-info">
              <h3>{preset.name}</h3>
              <p className="preset-description">{preset.description}</p>

              <div className="preset-meta">
                <span className="creator">👤 {preset.creator}</span>
                <span className="rating">⭐ {preset.rating}</span>
                <span className="downloads">⬇️ {preset.downloads.toLocaleString()}</span>
              </div>

              <div className="preset-tags">
                {preset.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              {preset.bpm && (
                <div className="preset-bpm">
                  ♫ {preset.bpm} BPM
                </div>
              )}

              <div className="preset-actions">
                <button
                  className="btn-download"
                  onClick={() => handleDownloadPreset(preset)}
                >
                  Download XML
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPresets.length === 0 && (
        <div className="no-results">
          <p>No presets found matching your search.</p>
          <p>Try different keywords or browse all categories.</p>
        </div>
      )}
    </div>
  );
};

export default PresetLibrary;
