import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@constants/theme';
import { useEditorStore } from '@store/editorStore';

interface InspectorProps {
  onClose: () => void;
}

export const Inspector: React.FC<InspectorProps> = ({ onClose }) => {
  const { layers, selectedLayerIds, updateLayer } = useEditorStore();
  
  const selectedLayer = layers.find(l => l.id === selectedLayerIds[0]);

  if (!selectedLayer) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>INSPECTOR</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="information-circle-outline" size={48} color={COLORS.TEXT_DISABLED} />
          <Text style={styles.emptyText}>No layer selected</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>INSPECTOR</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Layer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layer</Text>
          <TextInput
            style={styles.input}
            value={selectedLayer.name}
            onChangeText={(text) => updateLayer(selectedLayer.id, { name: text })}
            placeholderTextColor={COLORS.TEXT_DISABLED}
          />
        </View>

        {/* Transform */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transform</Text>
          
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Position</Text>
            <View style={styles.propertyInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>X</Text>
                <TextInput
                  style={styles.propertyInput}
                  value={selectedLayer.transform.x.toString()}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Y</Text>
                <TextInput
                  style={styles.propertyInput}
                  value={selectedLayer.transform.y.toString()}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Z</Text>
                <TextInput
                  style={styles.propertyInput}
                  value={selectedLayer.transform.z.toString()}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                />
              </View>
            </View>
          </View>

          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Scale</Text>
            <View style={styles.propertyInputs}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.propertyInput}
                  value={`${Math.round(selectedLayer.transform.scaleX * 100)}%`}
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                />
              </View>
            </View>
          </View>

          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Rotation</Text>
            <View style={styles.propertyInputs}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.propertyInput}
                  value={`${selectedLayer.transform.rotationZ}°`}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Opacity</Text>
            <View style={styles.propertyInputs}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.propertyInput}
                  value={`${Math.round(selectedLayer.opacity * 100)}%`}
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                />
              </View>
            </View>
          </View>

          <View style={styles.propertyRow}>
            <Text style={styles.propertyLabel}>Blend Mode</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedLayer.blendMode}</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Effects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Effects</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle" size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>

          {selectedLayer.effects.length === 0 ? (
            <Text style={styles.emptyEffectsText}>No effects applied</Text>
          ) : (
            selectedLayer.effects.map((effect) => (
              <View key={effect.id} style={styles.effectItem}>
                <Ionicons name="star" size={16} color={COLORS.PRIMARY} />
                <Text style={styles.effectName}>{effect.name}</Text>
                <TouchableOpacity>
                  <Ionicons name="close-circle" size={16} color={COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Keyframes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Keyframes</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle" size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
          <Text style={styles.emptyEffectsText}>Add keyframes for animation</Text>
        </View>
      </ScrollView>
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
  section: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  input: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  propertyRow: {
    marginBottom: SPACING.MD,
  },
  propertyLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
    fontWeight: '600',
  },
  propertyInputs: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XS,
    color: COLORS.TEXT_DISABLED,
    marginBottom: SPACING.XS,
  },
  propertyInput: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.SM,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.SM,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  dropdownText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    textTransform: 'capitalize',
  },
  effectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    marginBottom: SPACING.SM,
    gap: SPACING.SM,
  },
  effectName: {
    flex: 1,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  emptyEffectsText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_DISABLED,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
  },
});
