import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '@constants/theme';

interface ToolbarProps {
  onLayerPress: () => void;
  onInspectorPress: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onLayerPress, onInspectorPress }) => {
  const tools = [
    { id: 'cut', icon: 'cut', label: 'Cut', color: COLORS.TEXT_PRIMARY },
    { id: 'link', icon: 'link', label: 'Link', color: COLORS.TEXT_PRIMARY },
    { id: '3d', icon: 'cube', label: '3D', color: COLORS.PURPLE },
    { id: 'xml', icon: 'code', label: 'XML', color: COLORS.CYAN },
    { id: 'fx', icon: 'sparkles', label: 'FX', color: COLORS.PRIMARY },
    { id: 'rotate', icon: 'sync', label: 'Rotate', color: COLORS.TEXT_PRIMARY },
    { id: 'text', icon: 'text', label: 'Text', color: COLORS.YELLOW },
    { id: 'music', icon: 'musical-notes', label: 'Music', color: COLORS.GREEN },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.toolsContainer}>
        {tools.map((tool) => (
          <TouchableOpacity key={tool.id} style={styles.toolButton}>
            <Ionicons name={tool.icon as any} size={20} color={tool.color} />
            <Text style={styles.toolLabel}>{tool.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Access Buttons */}
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity style={styles.quickAccessButton} onPress={onLayerPress}>
          <Ionicons name="layers" size={20} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessButton} onPress={onInspectorPress}>
          <Ionicons name="information-circle" size={20} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.SM,
    backgroundColor: COLORS.SURFACE,
  },
  toolsContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: SPACING.XS,
  },
  toolButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.SM,
  },
  toolLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  quickAccessContainer: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginLeft: SPACING.SM,
  },
  quickAccessButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.BACKGROUND_TERTIARY,
    borderRadius: SPACING.SM,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
