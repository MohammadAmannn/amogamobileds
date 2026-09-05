import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isDark?: boolean;
  children: React.ReactNode;
}

export function FullscreenModal({
  isOpen,
  onClose,
  title,
  isDark = false,
  children,
}: FullscreenModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (typeof window !== 'undefined' && isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bg = isDark ? '#09090b' : '#f4f4f5';
  const headerBg = isDark ? '#18181b' : '#ffffff';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const text = isDark ? '#f4f4f5' : '#09090b';

  return (
    <Modal visible={isOpen} transparent={false} animationType="fade">
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: headerBg,
            borderBottomWidth: 1,
            borderBottomColor: border,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: text }}>
            {title}{' '}
            <Text style={{ fontSize: 13, fontWeight: '500', opacity: 0.6 }}>
              — Fullscreen Preview
            </Text>
          </Text>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: isDark ? '#27272a' : '#f4f4f5',
              borderWidth: 1,
              borderColor: border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} color={text} />
          </TouchableOpacity>
        </View>

        {/* Canvas Body */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
