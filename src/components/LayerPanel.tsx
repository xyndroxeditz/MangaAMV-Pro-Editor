import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@constants/theme';
import { useEditorStore } from '@store/editorStore';

interface LayerPanelProps {
  onClose: () => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ onClose }) => {
  const { layers, selectedLayerIds, selectLayer, deleteLayer, duplicateLayer } = useEditorStore();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LAYERS</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Layer List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {layers.map((layer) => (
          <View
            key={layer.id}
            style={[
              styles.layerItem,
              selectedLayerIds.includes(layer.id) && styles.layerItemSelected,
            ]}
          >
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => {}}
            >
              <Ionicons
                name={layer.visible ? 'eye' : 'eye-off'}
                size={20}
                color={layer.visible ? COLORS.PRIMARY : COLORS.TEXT_DISABLED}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.layerContent}
              onPress={() => selectLayer(layer.id)}
            >
              <Ionicons name="layers" size={20} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.layerName}>{layer.name}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.lockButton}
              onPress={() => {}}
            >
              <Ionicons
                name={layer.locked ? 'lock-closed' : 'lock-open'}
                size={16}
                color={layer.locked ? COLORS.ORANGE : COLORS.TEXT_DISABLED}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {}}
            >
              <Ionicons name="ellipsis-vertical" size={16} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>
        ))}

        {layers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="layers-outline" size={48} color={COLORS.TEXT_DISABLED} />
            <Text style={styles.emptyText}>No layers yet</Text>
            <Text style={styles.emptySubtext}>Add media to create layers</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Layer Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={24} color={COLORS.PRIMARY} />
        <Text style={styles.addButtonText}>Add Layer</Text>
      </TouchableOpacity>
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
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  layerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  layerItemSelected: {
    backgroundColor: COLORS.SURFACE,
  },
  visibilityButton: {
    padding: SPACING.XS,
    marginRight: SPACING.SM,
  },
  layerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  layerName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  lockButton: {
    padding: SPACING.XS,
    marginLeft: SPACING.SM,
  },
  menuButton: {
    padding: SPACING.XS,
    marginLeft: SPACING.SM,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XXL * 2,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
    marginBottom: SPACING.XS,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_DISABLED,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    gap: SPACING.SM,
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
});
