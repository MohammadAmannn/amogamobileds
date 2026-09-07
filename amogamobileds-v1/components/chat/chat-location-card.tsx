import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Share2,
  Compass,
  Check,
} from 'lucide-react-native';
import { useTheme } from '@/providers/theme-provider';

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
  title = 'Amoga Tech Hub',
  address = 'Building 10, Cyber City, Gurugram, India',
  latitude = 28.4595,
  longitude = 77.0266,
  isLive = true,
  accuracy = 'Accurate to 10m',
  updatedTime = 'Updated 2 mins ago',
  onOpenMap,
  onNavigate,
}: ChatLocationCardProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [navigating, setNavigating] = useState(false);

  const cardBg = isDark ? '#121216' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const mapBg = isDark ? '#0f172a' : '#f1f5f9';
  const footerBg = isDark ? '#18181f' : '#f8fafc';

  const handleNavigate = () => {
    setNavigating(true);
    onNavigate?.();
    setTimeout(() => setNavigating(false), 2000);
  };

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: cardBg,
          borderColor,
          shadowColor: isDark ? '#000000' : '#64748b',
        },
      ]}
    >
      {/* 1. Map Visual Canvas */}
      <View style={[styles.mapHeader, { backgroundColor: mapBg }]}>
        {/* Subtle grid pattern circles */}
        <View style={styles.gridOverlay}>
          <View
            style={[
              styles.radarRing,
              { borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.25)' },
            ]}
          />
          <View
            style={[
              styles.radarRingSmall,
              { borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(14, 165, 233, 0.35)' },
            ]}
          />
        </View>

        {/* Central Map Pin */}
        <View style={styles.pinWrapper}>
          <View style={styles.pinShadow} />
          <View style={styles.pinBadge}>
            <MapPin size={22} color="#ffffff" fill="#ffffff" />
          </View>
        </View>

        {/* Top-Right Live Badge */}
        {isLive && (
          <View style={[styles.liveBadge, { backgroundColor: isDark ? '#064e3b' : '#dcfce7' }]}>
            <View style={styles.liveDot} />
            <Text style={[styles.liveText, { color: isDark ? '#34d399' : '#15803d' }]}>
              LIVE
            </Text>
          </View>
        )}

        {/* Bottom-left map attribution */}
        <View style={[styles.mapCredit, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)' }]}>
          <Text style={[styles.mapCreditText, { color: mutedText }]}>
            © MapBox • OpenStreetMap
          </Text>
        </View>
      </View>

      {/* 2. Content Details */}
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <MapPin size={16} color="#0284c7" strokeWidth={2.2} />
          </View>
          <View style={styles.titleCol}>
            <Text style={[styles.titleText, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.addressText, { color: mutedText }]} numberOfLines={1}>
              {address}
            </Text>
          </View>
        </View>

        <View style={[styles.metaRow, { borderColor: isDark ? '#27272a' : '#f1f5f9' }]}>
          <Text style={[styles.coordsText, { color: mutedText }]}>
            {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E • {accuracy}
          </Text>
          <Text style={[styles.timeText, { color: mutedText }]}>
            {updatedTime}
          </Text>
        </View>
      </View>

      {/* 3. Action Footer */}
      <View style={[styles.footer, { backgroundColor: footerBg, borderTopColor: borderColor }]}>
        <TouchableOpacity
          onPress={onOpenMap}
          activeOpacity={0.7}
          style={[styles.actionBtn, { borderColor }]}
        >
          <ExternalLink size={14} color={mutedText} />
          <Text style={[styles.actionBtnText, { color: textColor }]}>View on Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigate}
          activeOpacity={0.7}
          style={[
            styles.primaryActionBtn,
            navigating && { backgroundColor: '#059669' },
          ]}
        >
          {navigating ? (
            <Check size={14} color="#ffffff" strokeWidth={2.4} />
          ) : (
            <Navigation size={14} color="#ffffff" strokeWidth={2.2} />
          )}
          <Text style={styles.primaryActionBtnText}>
            {navigating ? 'Opened' : 'Navigate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  mapHeader: {
    height: 140,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
  },
  radarRingSmall: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  pinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pinShadow: {
    position: 'absolute',
    bottom: -6,
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  pinBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveText: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    letterSpacing: 0.5,
  },
  mapCredit: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mapCreditText: {
    fontSize: 8.5,
    fontFamily: 'Open Sans',
  },
  body: {
    padding: 14,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    letterSpacing: -0.1,
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  coordsText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
  },
  timeText: {
    fontSize: 10.5,
    fontFamily: 'Open Sans',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#0284c7',
  },
  primaryActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Open Sans',
  },
});
