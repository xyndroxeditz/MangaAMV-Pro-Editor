import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@constants/theme';
import { useEditorStore } from '@store/editorStore';

const { width } = Dimensions.get('window');
const TRACK_HEIGHT = 40;
const SECOND_WIDTH = 100;

export const Timeline = () => {
  const {
    timeline,
    layers,
    setCurrentTime,
    setIsPlaying,
    setZoom,
    selectedLayerIds,
    selectLayer,
  } = useEditorStore();

  const tracks = [
    { name: 'Panels', color: COLORS.PRIMARY, layers: layers.filter(l => l.trackIndex === 0) },
    { name: 'Video', color: COLORS.CYAN, layers: layers.filter(l => l.trackIndex === 1) },
    { name: 'Audio', color: COLORS.GREEN, layers: layers.filter(l => l.trackIndex === 2) },
    { name: '3D Objects', color: COLORS.PURPLE, layers: layers.filter(l => l.trackIndex === 3) },
    { name: 'Text', color: COLORS.YELLOW, layers: layers.filter(l => l.trackIndex === 4) },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Timeline Header */}
      <View style={styles.header}>
        <View style={styles.playbackControls}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => setIsPlaying(!timeline.isPlaying)}
          >
            <Ionicons
              name={timeline.isPlaying ? 'pause' : 'play'}
              size={20}
              color={COLORS.TEXT_PRIMARY}
            />
          </TouchableOpacity>
          <Text style={styles.timeDisplay}>
            {formatTime(timeline.currentTime)} / {formatTime(timeline.duration)}
          </Text>
          <View style={styles.bpmDisplay}>
            <Ionicons name="musical-note" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.bpmText}>BPM: {timeline.bpm}</Text>
          </View>
        </View>

        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setZoom(Math.max(0.5, timeline.zoom - 0.25))}
          >
            <Ionicons name="remove" size={16} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.zoomText}>{Math.round(timeline.zoom * 100)}%</Text>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={() => setZoom(Math.min(4, timeline.zoom + 0.25))}
          >
            <Ionicons name="add" size={16} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Timeline Tracks */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.tracksContainer}
      >
        <View style={styles.tracks}>
          {tracks.map((track, index) => (
            <View key={index} style={styles.track}>
              <View style={styles.trackHeader}>
                <View style={[styles.trackColorIndicator, { backgroundColor: track.color }]} />
                <Text style={styles.trackName}>{track.name}</Text>
                <TouchableOpacity style={styles.trackMenuButton}>
                  <Ionicons name="ellipsis-horizontal" size={16} color={COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
              <View style={styles.trackContent}>
                {track.layers.map((layer) => (
                  <TouchableOpacity
                    key={layer.id}
                    style={[
                      styles.layerClip,
                      {
                        left: layer.startTime * SECOND_WIDTH * timeline.zoom,
                        width: layer.duration * SECOND_WIDTH * timeline.zoom,
                        backgroundColor: track.color,
                      },
                      selectedLayerIds.includes(layer.id) && styles.layerClipSelected,
                    ]}
                    onPress={() => selectLayer(layer.id)}
                  >
                    <Text style={styles.layerClipText} numberOfLines={1}>
                      {layer.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Playhead */}
      <View
        style={[
          styles.playhead,
          { left: timeline.currentTime * SECOND_WIDTH * timeline.zoom + 120 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  playButton: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.ROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    fontVariant: ['tabular-nums'],
  },
  bpmDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    gap: SPACING.XS,
  },
  bpmText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.SM,
    padding: 2,
  },
  zoomButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    minWidth: 40,
    textAlign: 'center',
  },
  tracksContainer: {
    flex: 1,
  },
  tracks: {
    minWidth: width - SPACING.MD * 2,
  },
  track: {
    height: TRACK_HEIGHT + SPACING.SM,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  trackHeader: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.SM,
    backgroundColor: COLORS.SURFACE,
    borderRightWidth: 1,
    borderRightColor: COLORS.BORDER,
  },
  trackColorIndicator: {
    width: 3,
    height: 20,
    borderRadius: 2,
    marginRight: SPACING.SM,
  },
  trackName: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  trackMenuButton: {
    padding: SPACING.XS,
  },
  trackContent: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.BACKGROUND_TERTIARY,
  },
  layerClip: {
    position: 'absolute',
    height: TRACK_HEIGHT - 8,
    top: 4,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.SM,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  layerClipSelected: {
    borderWidth: 2,
    borderColor: COLORS.TEXT_PRIMARY,
  },
  layerClipText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  playhead: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.PRIMARY,
  },
});
