import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, FileCode } from 'lucide-react-native';
import { useColor } from '@/hooks/useColor';
import { ComponentItem } from './registry';

interface ComponentPreviewModalProps {
  component: ComponentItem | null;
  visible: boolean;
  onClose: () => void;
}

export function ComponentPreviewModal({
  component,
  visible,
  onClose,
}: ComponentPreviewModalProps) {
  const textColor = useColor('text');
  const mutedColor = useColor('mutedForeground');
  const cardColor = useColor('card');
  const borderColor = useColor('border');

  if (!component) return null;

  const PreviewComponent = component.Preview;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: cardColor }]}>
        {/* Modal Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: textColor }]}>
                {component.name}
              </Text>
              <Badge variant="secondary" style={styles.tagBadge}>
                <Text style={styles.tagText}>{component.tag}</Text>
              </Badge>
            </View>
            <View style={styles.fileRow}>
              <FileCode size={13} color={mutedColor} />
              <Text style={[styles.fileText, { color: mutedColor }]}>
                components/ui/{component.file}
              </Text>
            </View>
          </View>

          {/* Close Cross Button */}
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: borderColor }]}
            activeOpacity={0.7}
            accessibilityLabel="Close modal"
          >
            <X size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Modal Body */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Description Section */}
          <View style={[styles.infoBanner, { backgroundColor: borderColor + '40' }]}>
            <Text style={[styles.descText, { color: textColor }]}>
              {component.description}
            </Text>
          </View>

          <Separator style={{ marginVertical: 16 }} />

          {/* Interactive Live Component Sandbox */}
          <View style={styles.previewContainer}>
            <PreviewComponent />
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        maxWidth: 640,
        maxHeight: '88%',
        marginHorizontal: 'auto',
        marginTop: '3%',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
        overflow: 'hidden',
      },
    }),
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  fileText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  infoBanner: {
    padding: 12,
    borderRadius: 8,
  },
  descText: {
    fontSize: 13,
    lineHeight: 18,
  },
  previewContainer: {
    paddingVertical: 8,
  },
});
