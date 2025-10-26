import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';

const { width, height } = Dimensions.get('window');

export const PreviewCanvas = () => {
  return (
    <View style={styles.container}>
      <View style={styles.canvas}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>16:9 Preview Canvas</Text>
          <Text style={styles.placeholderSubtext}>
            Drag media here or tap + to add layers
          </Text>
        </View>
      </View>

      {/* Grid Overlay */}
      <View style={styles.gridOverlay}>
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineVertical]} />
      </View>

      {/* Aspect Ratio Selector */}
      <View style={styles.aspectRatioSelector}>
        <Text style={styles.aspectRatioText}>16:9</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  canvas: {
    width: width - SPACING.LG * 2,
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.BACKGROUND_TERTIARY,
    borderRadius: SPACING.SM,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  placeholderSubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_DISABLED,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  gridLine: {
    width: '60%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gridLineVertical: {
    width: 1,
    height: '60%',
    position: 'absolute',
  },
  aspectRatioSelector: {
    position: 'absolute',
    top: SPACING.MD,
    right: SPACING.MD,
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: SPACING.SM,
  },
  aspectRatioText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
});
