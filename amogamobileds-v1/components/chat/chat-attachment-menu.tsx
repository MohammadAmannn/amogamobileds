import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {
  ImagePlus,
  Video,
  FileText,
  MapPin,
  FileType,
  RefreshCw,
  Scan,
  ScanLine,
  FileCode2,
} from 'lucide-react-native';
import { useTheme } from '@/providers/theme-provider';

export interface AttachmentMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  iconColor?: string;
  textColor?: string;
}

export interface ChatAttachmentMenuProps {
  onSelect?: (type: string) => void;
  selectedId?: string;
}

export function ChatAttachmentMenu({
  onSelect,
  selectedId = 'location',
}: ChatAttachmentMenuProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [activeId, setActiveId] = useState<string>(selectedId);

  const cardBg = isDark ? '#121216' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const mutedColor = isDark ? '#94a3b8' : '#475569';
  const activeBg = isDark ? '#1e293b' : '#f0f7ff';
  const activeText = isDark ? '#38bdf8' : '#0284c7';

  const menuOptions: AttachmentMenuItem[] = [
    { id: 'images', label: 'Images', icon: ImagePlus, iconColor: '#3b82f6' },
    { id: 'videos', label: 'Videos', icon: Video, iconColor: '#0284c7' },
    { id: 'documents', label: 'Documents', icon: FileText, iconColor: '#64748b' },
    { id: 'location', label: 'Location', icon: MapPin, iconColor: '#0ea5e9' },
    { id: 'image-converter', label: 'Image Converter', icon: FileType, iconColor: '#6366f1' },
    { id: 'doc-converter', label: 'Doc Converter', icon: RefreshCw, iconColor: '#059669' },
    { id: 'doc-scanner', label: 'Doc Scanner', icon: Scan, iconColor: '#8b5cf6' },
    { id: 'scan-document', label: 'Scan Document', icon: ScanLine, iconColor: '#64748b' },
    { id: 'extract-text', label: 'Extract Text', icon: FileCode2, iconColor: '#8b5cf6' },
  ];

  const handlePress = (id: string) => {
    setActiveId(id);
    onSelect?.(id);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor,
          shadowColor: isDark ? '#000000' : '#64748b',
        },
      ]}
    >
      {menuOptions.map((item) => {
        const isSelected = activeId === item.id;
        const IconComp = item.icon;
        const itemIconColor = isSelected ? activeText : (item.iconColor || mutedColor);

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handlePress(item.id)}
            activeOpacity={0.7}
            style={[
              styles.menuRow,
              isSelected && {
                backgroundColor: activeBg,
              },
            ]}
          >
            <IconComp
              size={18}
              color={itemIconColor}
              strokeWidth={isSelected ? 2.2 : 1.8}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? (isDark ? '#fafafa' : '#09090b') : textColor,
                  fontWeight: isSelected ? '600' : '500',
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 210,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 5,
    gap: 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  label: {
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    letterSpacing: -0.1,
  },
});
