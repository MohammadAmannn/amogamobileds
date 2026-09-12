import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FullPageMap, DEFAULT_MAP_MARKERS, type MapMarkerItem } from '../../ui/full-page-map';
import type { GalleryEntry } from '../../types';

export { DEFAULT_MAP_MARKERS, type MapMarkerItem };

interface MapPreviewsProps {
  entry?: GalleryEntry;
}

export function MapPreviews({ entry }: MapPreviewsProps) {
  return (
    <View style={styles.previewContainer}>
      <FullPageMap
        markers={DEFAULT_MAP_MARKERS}
        defaultCenter={[23.2599, 77.4126]}
        defaultZoom={4}
        height="100%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    minHeight: 580,
    borderRadius: 0,
    overflow: 'hidden',
  },
});

