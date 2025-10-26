/**
 * Advanced Features Panel
 * UI for accessing Phase 2-5 features
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  BG: '#0A0A0F',
  BG_LIGHT: '#151520',
  PRIMARY: '#FF2D95',
  SECONDARY: '#9D4EDD',
  ACCENT: '#00F5FF',
  TEXT: '#FFFFFF',
  TEXT_DIM: '#A0A0B0',
  SUCCESS: '#00FF88',
  WARNING: '#FFB800',
};

interface AdvancedFeaturesPanelProps {
  onClose: () => void;
}

export const AdvancedFeaturesPanel: React.FC<AdvancedFeaturesPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'effects' | 'audio' | 'ai' | 'cloud'>('effects');

  // Phase 2: Advanced Effects States
  const [motionBlur, setMotionBlur] = useState(false);
  const [chromaticAberration, setChromaticAberration] = useState(false);
  const [particleSystem, setParticleSystem] = useState(false);

  // Phase 3: Audio Reactive States
  const [audioReactive, setAudioReactive] = useState(false);
  const [beatSync, setBeatSync] = useState(false);
  const [spectrumAnalyzer, setSpectrumAnalyzer] = useState(false);

  // Phase 4: AI Tools States
  const [autoSceneDetect, setAutoSceneDetect] = useState(false);
  const [styleTransfer, setStyleTransfer] = useState(false);
  const [objectTracking, setObjectTracking] = useState(false);

  // Phase 5: Cloud States
  const [cloudSync, setCloudSync] = useState(false);
  const [collaboration, setCollaboration] = useState(false);

  const renderEffectsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🎨 Advanced Effects</Text>

      {/* Motion Blur */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="flash" size={24} color={COLORS.PRIMARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Motion Blur</Text>
            <Text style={styles.featureDesc}>Cinematic motion blur with multi-sample blending</Text>
          </View>
          <Switch
            value={motionBlur}
            onValueChange={setMotionBlur}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.PRIMARY }}
          />
        </View>
        {motionBlur && (
          <View style={styles.featureSettings}>
            <Text style={styles.settingLabel}>Samples: 8</Text>
            <Text style={styles.settingLabel}>Intensity: 75%</Text>
          </View>
        )}
      </View>

      {/* Chromatic Aberration */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="color-filter" size={24} color={COLORS.SECONDARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Chromatic Aberration</Text>
            <Text style={styles.featureDesc}>RGB channel separation for retro/glitch effect</Text>
          </View>
          <Switch
            value={chromaticAberration}
            onValueChange={setChromaticAberration}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.SECONDARY }}
          />
        </View>
      </View>

      {/* Particle System */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="snow" size={24} color={COLORS.ACCENT} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Particle Engine</Text>
            <Text style={styles.featureDesc}>10,000+ particles - Fire, Snow, Sparks, Hearts</Text>
          </View>
          <Switch
            value={particleSystem}
            onValueChange={setParticleSystem}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.ACCENT }}
          />
        </View>
        {particleSystem && (
          <View style={styles.presetGrid}>
            {['Fire', 'Snow', 'Sparks', 'Hearts', 'Confetti', 'Speed Lines'].map(preset => (
              <TouchableOpacity key={preset} style={styles.presetButton}>
                <Text style={styles.presetText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 3D Transforms */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="cube" size={24} color={COLORS.PRIMARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>3D Transforms</Text>
            <Text style={styles.featureDesc}>Full 3D rotation, perspective, and depth</Text>
          </View>
          <TouchableOpacity style={styles.configButton}>
            <Ionicons name="settings" size={20} color={COLORS.TEXT} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Color Grading & LUTs */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="color-palette" size={24} color={COLORS.WARNING} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Advanced Color Grading</Text>
            <Text style={styles.featureDesc}>15+ LUT presets + custom LUT support</Text>
          </View>
        </View>
        <View style={styles.lutGrid}>
          {['Cinematic', 'Anime', 'Cyberpunk', 'Vintage', 'B&W'].map(lut => (
            <TouchableOpacity key={lut} style={styles.lutCard}>
              <View style={[styles.lutPreview, { backgroundColor: COLORS.BG_LIGHT }]} />
              <Text style={styles.lutName}>{lut}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderAudioTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🎵 Audio Reactive</Text>

      {/* Real-time Spectrum */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="bar-chart" size={24} color={COLORS.PRIMARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Real-time Spectrum Analysis</Text>
            <Text style={styles.featureDesc}>8192 FFT size for precise frequency analysis</Text>
          </View>
          <Switch
            value={spectrumAnalyzer}
            onValueChange={setSpectrumAnalyzer}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.PRIMARY }}
          />
        </View>
      </View>

      {/* Audio Reactive Parameters */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="musical-notes" size={24} color={COLORS.ACCENT} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Audio Reactive System</Text>
            <Text style={styles.featureDesc}>Link any property to audio frequencies</Text>
          </View>
          <Switch
            value={audioReactive}
            onValueChange={setAudioReactive}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.ACCENT }}
          />
        </View>
        {audioReactive && (
          <View style={styles.audioReactiveSettings}>
            <TouchableOpacity style={styles.paramButton}>
              <Text style={styles.paramText}>Scale → Bass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paramButton}>
              <Text style={styles.paramText}>Opacity → Volume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paramButton}>
              <Text style={styles.paramText}>Rotation → Treble</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addParamButton}>
              <Ionicons name="add-circle" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.addParamText}>Add Parameter</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Beat Sync */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="pulse" size={24} color={COLORS.SUCCESS} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Beat Sync & Detection</Text>
            <Text style={styles.featureDesc}>Auto-detect BPM and snap to beats</Text>
          </View>
          <Switch
            value={beatSync}
            onValueChange={setBeatSync}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.SUCCESS }}
          />
        </View>
      </View>

      {/* Frequency Bands */}
      <View style={styles.featureCard}>
        <Text style={styles.featureName}>Frequency Isolation</Text>
        <View style={styles.frequencyBands}>
          <View style={styles.bandItem}>
            <Text style={styles.bandLabel}>Sub-Bass</Text>
            <View style={[styles.bandBar, { width: '60%', backgroundColor: COLORS.PRIMARY }]} />
          </View>
          <View style={styles.bandItem}>
            <Text style={styles.bandLabel}>Bass</Text>
            <View style={[styles.bandBar, { width: '80%', backgroundColor: COLORS.PRIMARY }]} />
          </View>
          <View style={styles.bandItem}>
            <Text style={styles.bandLabel}>Mid</Text>
            <View style={[styles.bandBar, { width: '50%', backgroundColor: COLORS.SECONDARY }]} />
          </View>
          <View style={styles.bandItem}>
            <Text style={styles.bandLabel}>Treble</Text>
            <View style={[styles.bandBar, { width: '40%', backgroundColor: COLORS.ACCENT }]} />
          </View>
        </View>
      </View>

      {/* Voice Activity Detection */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="mic" size={24} color={COLORS.WARNING} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Voice Activity Detection</Text>
            <Text style={styles.featureDesc}>Auto-detect speech vs music</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderAITab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🤖 AI-Powered Tools</Text>

      {/* Auto Scene Detection */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="film" size={24} color={COLORS.PRIMARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Auto Scene Detection</Text>
            <Text style={styles.featureDesc}>AI identifies scene changes and cuts</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Detect</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Smart Transitions */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="swap-horizontal" size={24} color={COLORS.SECONDARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Smart Transition Suggestions</Text>
            <Text style={styles.featureDesc}>AI suggests best transitions based on context</Text>
          </View>
        </View>
      </View>

      {/* Style Transfer */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="brush" size={24} color={COLORS.ACCENT} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>AI Style Transfer</Text>
            <Text style={styles.featureDesc}>15+ anime & manga art styles</Text>
          </View>
        </View>
        <View style={styles.styleGrid}>
          {['Anime', 'Manga B&W', 'Ghibli', 'Cyberpunk', 'JoJo', 'Demon Slayer'].map(style => (
            <TouchableOpacity key={style} style={styles.styleCard}>
              <View style={[styles.stylePreview, { backgroundColor: COLORS.BG_LIGHT }]} />
              <Text style={styles.styleName}>{style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Object Tracking */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="locate" size={24} color={COLORS.SUCCESS} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Object Tracking</Text>
            <Text style={styles.featureDesc}>Track faces, objects, or custom regions</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Track</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Beat Drop Detection */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="analytics" size={24} color={COLORS.WARNING} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Beat Drop Detection</Text>
            <Text style={styles.featureDesc}>AI finds drop, buildup, and breakdown moments</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Analyze</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Auto Color Correction */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="color-wand" size={24} color={COLORS.PRIMARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Auto Color Correction</Text>
            <Text style={styles.featureDesc}>AI white balance & contrast adjustment</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Auto Fix</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Smart Crop */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="crop" size={24} color={COLORS.SECONDARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Smart Crop</Text>
            <Text style={styles.featureDesc}>AI-powered subject-aware cropping</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderCloudTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>☁️ Cloud & Collaboration</Text>

      {/* Cloud Sync */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="cloud-upload" size={24} color={COLORS.PRIMARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Cloud Storage</Text>
            <Text style={styles.featureDesc}>Auto-save projects to cloud</Text>
          </View>
          <Switch
            value={cloudSync}
            onValueChange={setCloudSync}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.PRIMARY }}
          />
        </View>
        <View style={styles.cloudStats}>
          <Text style={styles.statText}>💾 Storage: 2.5 GB / 10 GB</Text>
          <Text style={styles.statText}>📁 Projects: 12</Text>
        </View>
      </View>

      {/* Real-time Collaboration */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="people" size={24} color={COLORS.ACCENT} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Real-time Collaboration</Text>
            <Text style={styles.featureDesc}>Edit together with your team</Text>
          </View>
          <Switch
            value={collaboration}
            onValueChange={setCollaboration}
            trackColor={{ false: COLORS.BG_LIGHT, true: COLORS.ACCENT }}
          />
        </View>
        {collaboration && (
          <View style={styles.collaborators}>
            <Text style={styles.collaboratorText}>👤 You (Owner)</Text>
            <Text style={styles.collaboratorText}>🟢 Sarah (Editor)</Text>
            <TouchableOpacity style={styles.inviteButton}>
              <Ionicons name="add" size={16} color={COLORS.PRIMARY} />
              <Text style={styles.inviteText}>Invite Collaborators</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Version Control */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="git-branch" size={24} color={COLORS.SUCCESS} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Version Control</Text>
            <Text style={styles.featureDesc}>Unlimited undo & version history</Text>
          </View>
        </View>
        <View style={styles.versionList}>
          <Text style={styles.versionItem}>v1.5 - Added particle effects (2 hrs ago)</Text>
          <Text style={styles.versionItem}>v1.4 - Beat sync animation (5 hrs ago)</Text>
          <Text style={styles.versionItem}>v1.3 - Color grading (1 day ago)</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all versions →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Asset Library */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="images" size={24} color={COLORS.WARNING} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Asset Library</Text>
            <Text style={styles.featureDesc}>1000+ effects, transitions, templates</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Browse</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Template Marketplace */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="cart" size={24} color={COLORS.SECONDARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Template Marketplace</Text>
            <Text style={styles.featureDesc}>Premium templates & effects</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.marketplaceHighlight}>
          <Text style={styles.highlightText}>🔥 Trending: AMV Intro Pack - 25K downloads</Text>
        </View>
      </View>

      {/* Comments & Feedback */}
      <View style={styles.featureCard}>
        <View style={styles.featureHeader}>
          <Ionicons name="chatbubbles" size={24} color={COLORS.PRIMARY} />
          <View style={styles.featureInfo}>
            <Text style={styles.featureName}>Comments & Feedback</Text>
            <Text style={styles.featureDesc}>Leave feedback on specific frames/layers</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Advanced Features</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color={COLORS.TEXT} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'effects' && styles.activeTab]}
          onPress={() => setActiveTab('effects')}
        >
          <Text style={[styles.tabText, activeTab === 'effects' && styles.activeTabText]}>
            Effects
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'audio' && styles.activeTab]}
          onPress={() => setActiveTab('audio')}
        >
          <Text style={[styles.tabText, activeTab === 'audio' && styles.activeTabText]}>
            Audio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ai' && styles.activeTab]}
          onPress={() => setActiveTab('ai')}
        >
          <Text style={[styles.tabText, activeTab === 'ai' && styles.activeTabText]}>AI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cloud' && styles.activeTab]}
          onPress={() => setActiveTab('cloud')}
        >
          <Text style={[styles.tabText, activeTab === 'cloud' && styles.activeTabText]}>
            Cloud
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'effects' && renderEffectsTab()}
      {activeTab === 'audio' && renderAudioTab()}
      {activeTab === 'ai' && renderAITab()}
      {activeTab === 'cloud' && renderCloudTab()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BG_LIGHT,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BG_LIGHT,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.TEXT_DIM,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    padding: 16,
  },
  featureCard: {
    backgroundColor: COLORS.BG_LIGHT,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
    marginLeft: 12,
  },
  featureName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.TEXT_DIM,
  },
  featureSettings: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BG,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  settingLabel: {
    fontSize: 12,
    color: COLORS.TEXT_DIM,
  },
  configButton: {
    padding: 8,
  },
  actionButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: 'bold',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  presetButton: {
    backgroundColor: COLORS.BG,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  presetText: {
    color: COLORS.TEXT,
    fontSize: 12,
  },
  lutGrid: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  lutCard: {
    alignItems: 'center',
    flex: 1,
  },
  lutPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: 4,
  },
  lutName: {
    fontSize: 10,
    color: COLORS.TEXT_DIM,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  styleCard: {
    width: '30%',
    alignItems: 'center',
  },
  stylePreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: 4,
  },
  styleName: {
    fontSize: 10,
    color: COLORS.TEXT_DIM,
    textAlign: 'center',
  },
  audioReactiveSettings: {
    marginTop: 12,
    gap: 8,
  },
  paramButton: {
    backgroundColor: COLORS.BG,
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY,
  },
  paramText: {
    color: COLORS.TEXT,
    fontSize: 12,
  },
  addParamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
    gap: 6,
  },
  addParamText: {
    color: COLORS.PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
  },
  frequencyBands: {
    marginTop: 12,
    gap: 8,
  },
  bandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bandLabel: {
    width: 70,
    fontSize: 12,
    color: COLORS.TEXT_DIM,
  },
  bandBar: {
    height: 6,
    borderRadius: 3,
  },
  cloudStats: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BG,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.TEXT_DIM,
  },
  collaborators: {
    marginTop: 12,
    gap: 6,
  },
  collaboratorText: {
    fontSize: 12,
    color: COLORS.TEXT_DIM,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  inviteText: {
    color: COLORS.PRIMARY,
    fontSize: 12,
    fontWeight: 'bold',
  },
  versionList: {
    marginTop: 12,
    gap: 6,
  },
  versionItem: {
    fontSize: 11,
    color: COLORS.TEXT_DIM,
  },
  viewAllText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginTop: 4,
  },
  marketplaceHighlight: {
    marginTop: 12,
    padding: 10,
    backgroundColor: COLORS.BG,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.WARNING,
  },
  highlightText: {
    fontSize: 11,
    color: COLORS.TEXT,
  },
});
