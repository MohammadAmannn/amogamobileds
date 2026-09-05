import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useColor } from '@/hooks/useColor';
import { CORNERS, FONT_SIZE } from '@/theme/globals';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LucideProps, Video, X } from 'lucide-react-native';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Modal,
  Pressable,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export type MediaType = 'image' | 'video' | 'all';
export type MediaQuality = 'low' | 'medium' | 'high';

export interface MediaAsset {
  id: string;
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
  filename?: string;
  fileSize?: number;
}

export interface MediaPickerProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: React.ComponentType<LucideProps>;
  disabled?: boolean;
  mediaType?: MediaType;
  multiple?: boolean;
  maxSelection?: number;
  quality?: MediaQuality;
  buttonText?: string;
  placeholder?: string;
  gallery?: boolean;
  showPreview?: boolean;
  previewSize?: number;
  selectedAssets?: MediaAsset[];
  onSelectionChange?: (assets: MediaAsset[]) => void;
  onError?: (error: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

// Helper function to compare arrays of MediaAssets
const arraysEqual = (a: MediaAsset[], b: MediaAsset[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((item, index) => {
    const bItem = b[index];
    return (
      item.id === bItem.id && item.uri === bItem.uri && item.type === bItem.type
    );
  });
};

export const MediaPicker = forwardRef<RNView, MediaPickerProps>(
  (
    {
      children,
      mediaType = 'all',
      multiple = false,
      gallery = false,
      maxSelection = 10,
      quality = 'high',
      onSelectionChange,
      onError,
      buttonText,
      showPreview = true,
      previewSize = 80,
      style,
      variant,
      size,
      icon,
      disabled = false,
      selectedAssets = [],
    },
    ref
  ) => {
    const [assets, setAssets] = useState<MediaAsset[]>(selectedAssets);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [canAskAgain, setCanAskAgain] = useState(true);

    // Use ref to track previous selectedAssets to avoid unnecessary updates
    const prevSelectedAssetsRef = useRef<MediaAsset[]>(selectedAssets);

    // Theme colors
    const cardColor = useColor('card');
    const borderColor = useColor('border');
    const textColor = useColor('text');
    const mutedColor = useColor('mutedForeground');
    const primaryColor = useColor('primary');
    const secondary = useColor('secondary');

    // Update internal state when selectedAssets prop changes (with proper comparison)
    useEffect(() => {
      // Only update if the arrays are actually different
      if (!arraysEqual(prevSelectedAssetsRef.current, selectedAssets)) {
        setAssets(selectedAssets);
        prevSelectedAssetsRef.current = selectedAssets;
      }
    }, [selectedAssets]);

    // Requested lazily, from the picker button press, rather than eagerly on
    // mount — avoids surfacing the OS permission prompt before the user has
    // expressed any intent to pick media.
    const requestPermissions = async (): Promise<{
      granted: boolean;
      canAskAgain: boolean;
    }> => {
      try {
        const { status, canAskAgain: canAsk } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const granted = status === 'granted';
        setHasPermission(granted);
        setCanAskAgain(canAsk);

        if (!granted) {
          onError?.(
            canAsk
              ? 'Media library permission is required to access photos and videos'
              : 'Media library permission was denied. Enable it in Settings to continue.'
          );
        }

        return { granted, canAskAgain: canAsk };
      } catch (error) {
        onError?.('Failed to request permissions');
        setHasPermission(false);
        return { granted: false, canAskAgain: true };
      }
    };

    const pickFromGallery = async () => {
      if (!hasPermission) {
        if (hasPermission === false && !canAskAgain) {
          Linking.openSettings();
          return;
        }

        const { granted, canAskAgain: canAsk } = await requestPermissions();
        if (!granted) {
          if (!canAsk) {
            Linking.openSettings();
          }
          return;
        }
      }

      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            mediaType === 'image'
              ? ['images']
              : mediaType === 'video'
                ? ['videos']
                : ['images', 'videos'],
          allowsMultipleSelection: multiple,
          quality: quality === 'high' ? 1 : quality === 'medium' ? 0.7 : 0.3,
          selectionLimit: multiple ? maxSelection : 1,
        });

        if (!result.canceled && result.assets) {
          const newAssets = result.assets.map((asset, index) => ({
            id: `gallery_${Date.now()}_${index}`,
            uri: asset.uri,
            type:
              asset.type === 'video' ? ('video' as const) : ('image' as const),
            width: asset.width,
            height: asset.height,
            duration: asset.duration || undefined,
            filename: asset.fileName || undefined,
            fileSize: asset.fileSize,
          }));

          handleAssetSelection(newAssets);
        }
      } catch (error) {
        onError?.('Failed to pick media from gallery');
      }
    };

    const handleAssetSelection = (newAssets: MediaAsset[]) => {
      let updatedAssets: MediaAsset[];

      if (multiple) {
        updatedAssets = [...assets, ...newAssets].slice(0, maxSelection);
      } else {
        updatedAssets = newAssets;
      }

      setAssets(updatedAssets);
      prevSelectedAssetsRef.current = updatedAssets; // Update ref to prevent loop
      onSelectionChange?.(updatedAssets);
    };

    const removeAsset = (assetId: string) => {
      const filteredAssets = assets.filter((asset) => asset.id !== assetId);
      setAssets(filteredAssets);
      prevSelectedAssetsRef.current = filteredAssets; // Update ref
      onSelectionChange?.(filteredAssets);
    };

    const renderPreviewItem = ({ item }: { item: MediaAsset }) => (
      <View style={[styles.previewItem, { borderColor }]}>
        <ExpoImage
          source={{ uri: item.uri }}
          style={[
            styles.previewImage,
            { width: previewSize, height: previewSize },
          ]}
          contentFit='cover'
        />
        {item.type === 'video' && (
          <View style={styles.videoIndicator}>
            <Video size={16} color='white' />
          </View>
        )}
        <TouchableOpacity
          style={[styles.removeButton, { backgroundColor: primaryColor }]}
          onPress={() => removeAsset(item.id)}
        >
          <X size={12} color={secondary} />
        </TouchableOpacity>
      </View>
    );

    return (
      <View ref={ref} style={style}>
        {children ? (
          children
        ) : (
          <Button
            onPress={pickFromGallery}
            disabled={disabled}
            variant={variant}
            size={size}
            icon={icon}
          >
            {buttonText ||
              `Select ${
                mediaType === 'all'
                  ? 'Media'
                  : mediaType === 'image'
                    ? 'Images'
                    : 'Videos'
              }`}
          </Button>
        )}

        {showPreview && assets.length > 0 && (
          <FlatList
            data={assets}
            renderItem={renderPreviewItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewContainer}
            contentContainerStyle={styles.previewContent}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  compactButton: {
    width: 60,
    height: 60,
    borderRadius: CORNERS,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabled: {
    opacity: 0.5,
  },

  previewContainer: {
    marginTop: 12,
  },

  previewContent: {
    paddingHorizontal: 4,
  },

  previewItem: {
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },

  previewImage: {
    borderRadius: 8,
  },

  videoIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },

  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalContainer: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  selectionCount: {
    fontSize: FONT_SIZE,
    fontWeight: '500',
  },

  closeButton: {
    padding: 4,
  },

  galleryContent: {
    padding: 2,
  },

  galleryItem: {
    margin: 1,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },

  galleryImage: {
    width: '100%',
    height: '100%',
  },

  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

MediaPicker.displayName = 'MediaPicker';
