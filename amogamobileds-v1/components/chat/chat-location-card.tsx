import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Navigation,
  ExternalLink,
  X,
  Compass,
  Check,
  Maximize2,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';

export interface ChatLocationCardProps {
  title?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isLive?: boolean;
  accuracy?: string;
  updatedTime?: string;
  onOpenMap?: () => void;
  onNavigate?: () => void;
}

export function ChatLocationCard({
  title = 'Shared Location',
  address = 'Jaipur, Rajasthan, India',
  latitude = 26.9529,
  longitude = 75.7433,
  isLive = true,
  accuracy = 'Accurate to 10m',
  updatedTime = 'Updated 2 mins ago',
  onOpenMap,
  onNavigate,
}: ChatLocationCardProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2); // 1 = 500m, 2 = 100m, 3 = 20m, 4 = 5m

  const cardBg = isDark ? '#14171f' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e2e8f0';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const mapBg = isDark ? '#0b1329' : '#f0fdf4';

  const handleNavigate = () => {
    setNavigating(true);
    onNavigate?.();
    setTimeout(() => setNavigating(false), 2000);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 1));
  };

  const handleRecenter = () => {
    setZoomLevel(2);
  };

  const getZoomScale = () => {
    switch (zoomLevel) {
      case 1:
        return 0.7;
      case 2:
        return 1.0;
      case 3:
        return 1.35;
      case 4:
        return 1.7;
      default:
        return 1.0;
    }
  };

  const getAccuracyLabel = () => {
    switch (zoomLevel) {
      case 1:
        return 'Street Level (500m)';
      case 2:
        return 'Accurate to 10m';
      case 3:
        return 'High Precision (5m)';
      case 4:
        return 'Pinpoint Precision (1m)';
      default:
        return accuracy;
    }
  };

  return (
    <>
      {/* ──────────────── Small Compact Preview Box (In Chat Message) ──────────────── */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setIsFullScreen(true)}
        style={[
          styles.compactBox,
          {
            backgroundColor: cardBg,
            borderColor,
            shadowColor: isDark ? '#000000' : '#94a3b8',
          },
        ]}
      >
        {/* Compact Map Canvas */}
        <View style={[styles.compactMapCanvas, { backgroundColor: mapBg }]}>
          {/* Subtle radar ring */}
          <View
            style={[
              styles.compactRadarRing,
              { borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(16, 185, 129, 0.25)' },
            ]}
          />
          {/* Center Pin */}
          <View style={styles.compactPinBadge}>
            <MapPin size={16} color="#ffffff" fill="#ffffff" />
          </View>

          {/* LIVE badge */}
          {isLive && (
            <View style={[styles.compactLiveBadge, { backgroundColor: isDark ? '#064e3b' : '#dcfce7' }]}>
              <View style={styles.liveDot} />
              <Text style={[styles.compactLiveText, { color: isDark ? '#34d399' : '#15803d' }]}>
                LIVE
              </Text>
            </View>
          )}

          {/* Expand icon hint */}
          <View style={styles.expandHintBadge}>
            <Maximize2 size={12} color="#ffffff" />
          </View>
        </View>

        {/* Compact Info Footer */}
        <View style={styles.compactInfo}>
          <View style={styles.compactTitleRow}>
            <MapPin size={13} color="#0284c7" />
            <Text style={[styles.compactTitleText, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <Text style={[styles.compactAddressText, { color: mutedText }]} numberOfLines={1}>
            {address}
          </Text>
        </View>
      </TouchableOpacity>

      {/* ──────────────── Full Screen Interactive Modal ──────────────── */}
      <Modal
        visible={isFullScreen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsFullScreen(false)}
      >
        <SafeAreaView style={[styles.fullScreenRoot, { backgroundColor: isDark ? '#090d16' : '#f8fafc' }]}>
          {/* Modal Header */}
          <View style={[styles.fullScreenHeader, { borderBottomColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
            <View style={styles.modalHeaderTitleRow}>
              <View style={styles.headerPinCircle}>
                <MapPin size={16} color="#0284c7" />
              </View>
              <View>
                <Text style={[styles.modalHeaderTitle, { color: textColor }]}>
                  {title}
                </Text>
                <Text style={[styles.modalHeaderSubtitle, { color: mutedText }]}>
                  Live Map View • Zoom {zoomLevel}x
                </Text>
              </View>
            </View>

            {/* Close Button (X) */}
            <TouchableOpacity
              onPress={() => setIsFullScreen(false)}
              style={[
                styles.closeModalBtn,
                { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' },
              ]}
              hitSlop={8}
            >
              <X size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Full Screen Map Graphic with Zoom Transform */}
          <View style={[styles.fullMapContainer, { backgroundColor: isDark ? '#0c1527' : '#ecfdf5' }]}>
            {/* Dynamic Scaled Radar Canvas */}
            <View
              style={[
                styles.fullRadarOuter,
                { transform: [{ scale: getZoomScale() }] },
              ]}
            >
              <View
                style={[
                  styles.fullRadarRingLarge,
                  { borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.25)' },
                ]}
              />
              <View
                style={[
                  styles.fullRadarRingMed,
                  { borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.35)' },
                ]}
              />
              <View
                style={[
                  styles.fullRadarRingSmall,
                  { borderColor: isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.45)' },
                ]}
              />
            </View>

            {/* Glowing Big Center Pin */}
            <View style={styles.fullCenterPinBadge}>
              <MapPin size={28} color="#ffffff" fill="#ffffff" />
            </View>

            {/* Floating Map Zoom Tools (Zoom In, Zoom Out, Recenter) */}
            <View
              style={[
                styles.mapToolsWidget,
                {
                  backgroundColor: isDark ? 'rgba(24, 24, 31, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleZoomIn}
                style={styles.mapToolBtn}
                hitSlop={6}
                accessibilityLabel="Zoom In"
              >
                <Text style={[styles.mapToolPlusText, { color: textColor }]}>+</Text>
              </TouchableOpacity>

              <View style={[styles.mapToolDivider, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]} />

              <TouchableOpacity
                onPress={handleZoomOut}
                style={styles.mapToolBtn}
                hitSlop={6}
                accessibilityLabel="Zoom Out"
              >
                <Text style={[styles.mapToolMinusText, { color: textColor }]}>−</Text>
              </TouchableOpacity>

              <View style={[styles.mapToolDivider, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]} />

              <TouchableOpacity
                onPress={handleRecenter}
                style={styles.mapToolBtn}
                hitSlop={6}
                accessibilityLabel="Recenter"
              >
                <Compass size={16} color="#0284c7" />
              </TouchableOpacity>
            </View>

            {/* Top-Right LIVE Badge */}
            <View style={[styles.fullLiveBadge, { backgroundColor: isDark ? '#064e3b' : '#dcfce7' }]}>
              <View style={styles.liveDot} />
              <Text style={[styles.fullLiveText, { color: isDark ? '#34d399' : '#15803d' }]}>
                REALTIME GPS ACTIVE
              </Text>
            </View>

            {/* Map Attribution */}
            <View style={[styles.fullMapCredit, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)' }]}>
              <Text style={[styles.fullMapCreditText, { color: mutedText }]}>
                © MapBox • OpenStreetMap • Scale {zoomLevel}x
              </Text>
            </View>
          </View>

          {/* Full Location Details Card */}
          <View style={[styles.fullDetailsCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.fullLocationRow}>
              <View style={styles.fullIconCircle}>
                <Compass size={20} color="#0284c7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fullTitle, { color: textColor }]}>
                  {title}
                </Text>
                <Text style={[styles.fullAddress, { color: mutedText }]}>
                  {address}
                </Text>
              </View>
            </View>

            <View style={[styles.fullMetaRow, { borderTopColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Text style={[styles.fullMetaText, { color: mutedText }]}>
                {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E • {getAccuracyLabel()}
              </Text>
              <Text style={[styles.fullMetaText, { color: mutedText }]}>
                {updatedTime}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.fullActionFooter}>
            <TouchableOpacity
              onPress={onOpenMap}
              activeOpacity={0.7}
              style={[styles.fullActionBtn, { borderColor, backgroundColor: cardBg }]}
            >
              <ExternalLink size={16} color={textColor} />
              <Text style={[styles.fullActionBtnText, { color: textColor }]}>
                View on Map
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNavigate}
              activeOpacity={0.7}
              style={[
                styles.fullPrimaryActionBtn,
                navigating && { backgroundColor: '#059669' },
              ]}
            >
              {navigating ? (
                <Check size={16} color="#ffffff" strokeWidth={2.4} />
              ) : (
                <Navigation size={16} color="#ffffff" strokeWidth={2.2} />
              )}
              <Text style={styles.fullPrimaryActionBtnText}>
                {navigating ? 'Opened' : 'Navigate'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Compact In-Chat Box
  compactBox: {
    width: 230,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 4,
  },
  compactMapCanvas: {
    height: 90,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compactRadarRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    position: 'absolute',
  },
  compactPinBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  compactLiveBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10b981',
  },
  compactLiveText: {
    fontSize: 8.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: 0.4,
  },
  expandHintBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 6,
  },
  compactInfo: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  compactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compactTitleText: {
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  compactAddressText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },

  // Full Screen Modal Styles
  fullScreenRoot: {
    flex: 1,
  },
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerPinCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  modalHeaderSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  closeModalBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullMapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fullRadarOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  fullRadarRingLarge: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1.5,
    position: 'absolute',
  },
  fullRadarRingMed: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    position: 'absolute',
  },
  fullRadarRingSmall: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    position: 'absolute',
  },
  fullCenterPinBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fullLiveBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  fullLiveText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: 0.5,
  },
  fullMapCredit: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fullMapCreditText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  fullDetailsCard: {
    margin: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  fullLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fullIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  fullAddress: {
    fontSize: 12.5,
    fontFamily: 'Open Sans',
  },
  fullMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  fullMetaText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  mapToolsWidget: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 4,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  mapToolBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapToolPlusText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  mapToolMinusText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  mapToolDivider: {
    width: 24,
    height: 1,
  },
  fullActionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  fullActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  fullActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  fullPrimaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0284c7',
  },
  fullPrimaryActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
});
