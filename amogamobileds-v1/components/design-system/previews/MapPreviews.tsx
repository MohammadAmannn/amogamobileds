import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native'
import {
  Search,
  X,
  MapPin,
  Store,
  Navigation,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Locate,
  Loader2,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import type { GalleryEntry } from '../../types'

export interface MapMarkerItem {
  id: string
  locationName: string
  description: string
  name: string
  mobile: string
  zipCode: string
  lat: number
  lng: number
  icon: 'store' | 'pin'
  population?: string
}

export const MOCK_MARKERS: MapMarkerItem[] = [
  {
    id: '1',
    locationName: 'New York City',
    description: 'The city that never sleeps.',
    name: 'John Smith',
    mobile: '+1 234-567-8900',
    zipCode: '10001',
    lat: 40.7128,
    lng: -74.006,
    icon: 'store',
    population: '8.3 million',
  },
  {
    id: '2',
    locationName: 'San Francisco',
    description: 'The Golden Gate city.',
    name: 'Sarah Johnson',
    mobile: '+1 345-678-9012',
    zipCode: '94105',
    lat: 37.7749,
    lng: -122.4194,
    icon: 'pin',
    population: '883,305',
  },
  {
    id: '3',
    locationName: 'London',
    description: 'The historic capital of England.',
    name: 'James Williams',
    mobile: '+44 20 7946 0958',
    zipCode: 'EC1A 1BB',
    lat: 51.5074,
    lng: -0.1278,
    icon: 'store',
    population: '8.9 million',
  },
  {
    id: '4',
    locationName: 'Bhopal',
    description: 'The City of Lakes.',
    name: 'Priya Sharma',
    mobile: '+91 98765-43210',
    zipCode: '462001',
    lat: 23.2599,
    lng: 77.4126,
    icon: 'store',
    population: '1.8 million',
  },
  {
    id: '5',
    locationName: 'Tokyo',
    description: 'The bustling metropolis of Japan.',
    name: 'Yuki Tanaka',
    mobile: '+81 3-1234-5678',
    zipCode: '100-0001',
    lat: 35.6762,
    lng: 139.6503,
    icon: 'pin',
    population: '13.9 million',
  },
  {
    id: '6',
    locationName: 'Sydney',
    description: 'The harbor city of Australia.',
    name: 'Emma Wilson',
    mobile: '+61 2 9876-5432',
    zipCode: '2000',
    lat: -33.8688,
    lng: 151.2093,
    icon: 'pin',
    population: '5.3 million',
  },
  {
    id: '7',
    locationName: 'Mumbai',
    description: 'The financial capital of India.',
    name: 'Rohan Mehta',
    mobile: '+91 98123-45678',
    zipCode: '400001',
    lat: 19.076,
    lng: 72.8777,
    icon: 'store',
    population: '12.5 million',
  },
  {
    id: '8',
    locationName: 'New Delhi',
    description: 'The capital city of India.',
    name: 'Amit Verma',
    mobile: '+91 98987-65432',
    zipCode: '110001',
    lat: 28.6139,
    lng: 77.209,
    icon: 'pin',
    population: '16.7 million',
  },
  {
    id: '9',
    locationName: 'Bengaluru',
    description: 'Silicon Valley of India.',
    name: 'Ananya Rao',
    mobile: '+91 98450-12345',
    zipCode: '560001',
    lat: 12.9716,
    lng: 77.5946,
    icon: 'store',
    population: '8.4 million',
  },
  {
    id: '10',
    locationName: 'Kolkata',
    description: 'City of Joy.',
    name: 'Subhash Bose',
    mobile: '+91 98300-98765',
    zipCode: '700001',
    lat: 22.5726,
    lng: 88.3639,
    icon: 'pin',
    population: '4.5 million',
  },
]

interface MapPreviewsProps {
  entry?: GalleryEntry
}

export function MapPreviews({ entry }: MapPreviewsProps) {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'
  const { width } = useWindowDimensions()

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerItem | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const iframeRef = useRef<any>(null)

  const filteredMarkers = useMemo(() => {
    if (!searchQuery.trim()) return []
    return MOCK_MARKERS.filter(
      (m) =>
        m.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.zipCode.includes(searchQuery)
    )
  }, [searchQuery])

  // Handle selecting marker from search
  const handleSelectMarker = (marker: MapMarkerItem) => {
    setSelectedMarker(marker)
    setSearchQuery('')
    setIsSearchFocused(false)
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'FLY_TO', lat: marker.lat, lng: marker.lng, id: marker.id },
        '*'
      )
    }
  }

  // Handle message from iframe when user clicks a marker on the map
  useEffect(() => {
    const handleWindowMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'MARKER_CLICK') {
        const found = MOCK_MARKERS.find((m) => m.id === e.data.id)
        if (found) {
          setSelectedMarker(found)
        }
      } else if (e.data && e.data.type === 'MAP_CLICK') {
        setSelectedMarker(null)
      }
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('message', handleWindowMessage)
      return () => {
        window.removeEventListener('message', handleWindowMessage)
      }
    }
  }, [])

  // Action helpers to send to iframe
  const handleZoomIn = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'ZOOM_IN' }, '*')
    }
  }

  const handleZoomOut = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'ZOOM_OUT' }, '*')
    }
  }

  const handleResetView = () => {
    setSelectedMarker(null)
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'FLY_TO', lat: 23.2599, lng: 77.4126, zoom: 4 },
        '*'
      )
    }
  }

  const handleLocateMe = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false)
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'FLY_TO',
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                zoom: 13,
              },
              '*'
            )
          }
        },
        () => {
          setIsLocating(false)
        },
        { enableHighAccuracy: true, timeout: 6000 }
      )
    }
  }

  const handleToggleFullscreen = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
        setIsFullscreen(true)
      } else {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }

  // Generate self-contained Leaflet + Carto Positron map HTML
  const mapHtml = useMemo(() => {
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

    const markersJson = JSON.stringify(MOCK_MARKERS)

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: ${isDark ? '#09090b' : '#f8fafc'}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow: hidden; }
    .leaflet-control-attribution { display: none !important; }
    .leaflet-control-zoom { display: none !important; }
    
    /* Custom Map Marker Styling */
    .custom-marker-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      position: relative;
    }
    
    .marker-label {
      font-size: 11px;
      font-weight: 500;
      color: ${isDark ? '#e2e8f0' : '#334155'};
      white-space: nowrap;
      text-shadow: 0 1px 3px ${isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'};
      pointer-events: none;
    }

    .marker-icon-box {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .marker-icon-box.pin {
      background: #ef4444;
      color: #ffffff;
    }
    
    .marker-icon-box.store {
      background: #3b82f6;
      color: #ffffff;
    }
    
    .custom-marker-wrap:hover .marker-icon-box {
      transform: scale(1.18);
    }
    
    .pulse-ring {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.3;
      animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      pointer-events: none;
    }

    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', {
      center: [23.2599, 77.4126],
      zoom: 4,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('${tileUrl}', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const markersData = ${markersJson};
    const leafletMarkers = {};

    function createMarkerIcon(marker) {
      const isPin = marker.icon === 'pin';
      const iconSvg = isPin 
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>';

      return L.divIcon({
        className: 'custom-leaflet-icon',
        html: \`
          <div class="custom-marker-wrap">
            <span class="marker-label">\${marker.locationName}</span>
            <div class="marker-icon-box \${isPin ? 'pin' : 'store'}">
              \${iconSvg}
            </div>
          </div>
        \`,
        iconSize: [120, 36],
        iconAnchor: [60, 18]
      });
    }

    markersData.forEach(marker => {
      const m = L.marker([marker.lat, marker.lng], { icon: createMarkerIcon(marker) }).addTo(map);
      
      m.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        window.parent.postMessage({ type: 'MARKER_CLICK', id: marker.id }, '*');
        map.flyTo([marker.lat, marker.lng], 13, { duration: 1.2 });
      });

      leafletMarkers[marker.id] = m;
    });

    map.on('click', () => {
      window.parent.postMessage({ type: 'MAP_CLICK' }, '*');
    });

    window.addEventListener('message', (e) => {
      if (!e.data) return;
      if (e.data.type === 'ZOOM_IN') {
        map.zoomIn();
      } else if (e.data.type === 'ZOOM_OUT') {
        map.zoomOut();
      } else if (e.data.type === 'FLY_TO') {
        map.flyTo([e.data.lat, e.data.lng], e.data.zoom || 13, { duration: 1.2 });
      }
    });
  </script>
</body>
</html>
`
  }, [isDark])

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderColor: isDark ? colors.border : '#e2e8f0',
        },
      ]}
    >
      {/* ── 1. Top Search Bar Exactly as Next.js ──────────────────────────────── */}
      <View style={styles.topSearchContainer}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDark ? '#18181b' : '#ffffff',
              borderColor: isDark ? colors.border : '#e2e8f0',
            },
          ]}
        >
          <Search
            size={16}
            color={colors.mutedForeground}
            strokeWidth={1.8}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search locations or contacts..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={15} color={colors.mutedForeground} />
            </Pressable>
          ) : null}
        </View>

        {/* Search Results Dropdown */}
        {isSearchFocused && filteredMarkers.length > 0 && (
          <View
            style={[
              styles.dropdownMenu,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? colors.border : '#e2e8f0',
              },
            ]}
          >
            {filteredMarkers.map((marker) => (
              <Pressable
                key={`search-res-${marker.id}`}
                onPress={() => handleSelectMarker(marker)}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  pressed && {
                    backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                  },
                ]}
              >
                <View
                  style={[
                    styles.dropdownIconCircle,
                    {
                      backgroundColor:
                        marker.icon === 'pin' ? '#ef4444' : '#3b82f6',
                    },
                  ]}
                >
                  {marker.icon === 'pin' ? (
                    <MapPin size={12} color="#ffffff" strokeWidth={2.5} />
                  ) : (
                    <Store size={12} color="#ffffff" strokeWidth={2.5} />
                  )}
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={[
                      styles.dropdownItemTitle,
                      { color: colors.foreground },
                    ]}
                    numberOfLines={1}
                  >
                    {marker.locationName}
                  </Text>
                  <Text
                    style={[
                      styles.dropdownItemSub,
                      { color: colors.mutedForeground },
                    ]}
                    numberOfLines={1}
                  >
                    {marker.name} • {marker.zipCode}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* ── 2. Interactive Map Viewport (Carto Positron) ────────────────────────── */}
      <View style={styles.mapViewport}>
        {Platform.OS === 'web' ? (
          <iframe
            ref={iframeRef}
            srcDoc={mapHtml}
            title="Carto OpenStreetMap"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 16,
            }}
          />
        ) : (
          <View style={styles.mobileFallback}>
            <MapPin size={36} color="#ef4444" />
            <Text style={{ color: colors.foreground, marginTop: 8 }}>
              Carto Map Template
            </Text>
          </View>
        )}

        {/* ── 3. Top-Right Floating Controls ────────────────────────────────────── */}
        <View
          style={[
            styles.floatingControlsGroup,
            {
              backgroundColor: isDark ? '#18181b' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? colors.border : '#e2e8f0',
            },
          ]}
        >
          {/* Zoom In */}
          <Pressable
            onPress={handleZoomIn}
            hitSlop={6}
            style={styles.floatingBtn}
            accessibilityLabel="Zoom In"
          >
            <Plus size={16} color={colors.foreground} strokeWidth={2} />
          </Pressable>

          <View
            style={[
              styles.btnDivider,
              { backgroundColor: isDark ? colors.border : '#e2e8f0' },
            ]}
          />

          {/* Zoom Out */}
          <Pressable
            onPress={handleZoomOut}
            hitSlop={6}
            style={styles.floatingBtn}
            accessibilityLabel="Zoom Out"
          >
            <Minus size={16} color={colors.foreground} strokeWidth={2} />
          </Pressable>

          <View
            style={[
              styles.btnDivider,
              { backgroundColor: isDark ? colors.border : '#e2e8f0' },
            ]}
          />

          {/* Reset View */}
          <Pressable
            onPress={handleResetView}
            hitSlop={6}
            style={styles.floatingBtn}
            accessibilityLabel="Reset View"
          >
            <RotateCcw size={14} color={colors.foreground} strokeWidth={2} />
          </Pressable>

          <View
            style={[
              styles.btnDivider,
              { backgroundColor: isDark ? colors.border : '#e2e8f0' },
            ]}
          />

          {/* Locate Me */}
          <Pressable
            onPress={handleLocateMe}
            hitSlop={6}
            style={styles.floatingBtn}
            accessibilityLabel="My Location"
          >
            {isLocating ? (
              <Loader2 size={14} color="#3b82f6" style={{ transform: [{ rotate: '45deg' }] }} />
            ) : (
              <Locate size={14} color={colors.foreground} strokeWidth={2} />
            )}
          </Pressable>

          <View
            style={[
              styles.btnDivider,
              { backgroundColor: isDark ? colors.border : '#e2e8f0' },
            ]}
          />

          {/* Fullscreen Toggle */}
          <Pressable
            onPress={handleToggleFullscreen}
            hitSlop={6}
            style={styles.floatingBtn}
            accessibilityLabel="Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 size={14} color={colors.foreground} strokeWidth={2} />
            ) : (
              <Maximize2 size={14} color={colors.foreground} strokeWidth={2} />
            )}
          </Pressable>
        </View>

        {/* ── 4. Bottom-Left Badge: 10 locations ────────────────────────────────── */}
        <View
          style={[
            styles.bottomLocationsBadge,
            {
              backgroundColor: isDark
                ? 'rgba(24, 24, 27, 0.85)'
                : 'rgba(255, 255, 255, 0.9)',
              borderColor: isDark ? colors.border : '#e2e8f0',
            },
          ]}
        >
          <Text
            style={[
              styles.bottomLocationsText,
              { color: isDark ? '#94a3b8' : '#64748b' },
            ]}
          >
            {MOCK_MARKERS.length} locations
          </Text>
        </View>

        {/* ── 5. Bottom-Right Attribution ───────────────────────────────────────── */}
        <View style={styles.attributionBadge}>
          <Text style={styles.attributionText}>
            © CARTO, © OpenStreetMap contributors{' '}
            <Text style={styles.infoIcon}>ⓘ</Text>
          </Text>
        </View>

        {/* ── 6. Popup Card (MapPopup) on Marker Select ─────────────────────────── */}
        {selectedMarker && (
          <View
            style={[
              styles.popupOverlayCard,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: isDark ? colors.border : '#e2e8f0',
              },
            ]}
          >
            {/* Top Accent Gradient Line */}
            <View
              style={[
                styles.popupAccentBar,
                {
                  backgroundColor:
                    selectedMarker.icon === 'pin' ? '#ef4444' : '#3b82f6',
                },
              ]}
            />

            <View style={styles.popupBody}>
              {/* Header */}
              <View style={styles.popupHeaderRow}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={[
                      styles.popupLocationTitle,
                      { color: colors.foreground },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedMarker.locationName}
                  </Text>
                  <Text
                    style={[
                      styles.popupLocationDesc,
                      { color: colors.mutedForeground },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedMarker.description}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setSelectedMarker(null)}
                  hitSlop={8}
                  style={styles.closeBtn}
                >
                  <X size={15} color={colors.mutedForeground} />
                </Pressable>
              </View>

              {/* 4-Box Clean Info Grid */}
              <View style={styles.infoGrid}>
                <View
                  style={[
                    styles.gridBox,
                    { backgroundColor: isDark ? '#27272a' : '#f8fafc' },
                  ]}
                >
                  <Text
                    style={[
                      styles.gridLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    CONTACT
                  </Text>
                  <Text
                    style={[styles.gridValue, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {selectedMarker.name}
                  </Text>
                </View>

                <View
                  style={[
                    styles.gridBox,
                    { backgroundColor: isDark ? '#27272a' : '#f8fafc' },
                  ]}
                >
                  <Text
                    style={[
                      styles.gridLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    PHONE
                  </Text>
                  <Text
                    style={[styles.gridValue, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {selectedMarker.mobile}
                  </Text>
                </View>

                <View
                  style={[
                    styles.gridBox,
                    { backgroundColor: isDark ? '#27272a' : '#f8fafc' },
                  ]}
                >
                  <Text
                    style={[
                      styles.gridLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    ZIP CODE
                  </Text>
                  <Text
                    style={[styles.gridValue, { color: colors.foreground }]}
                  >
                    {selectedMarker.zipCode}
                  </Text>
                </View>

                <View
                  style={[
                    styles.gridBox,
                    { backgroundColor: isDark ? '#27272a' : '#f8fafc' },
                  ]}
                >
                  <Text
                    style={[
                      styles.gridLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    COORDINATES
                  </Text>
                  <Text
                    style={[styles.gridValue, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {selectedMarker.lat.toFixed(4)},{' '}
                    {selectedMarker.lng.toFixed(4)}
                  </Text>
                </View>
              </View>

              {/* View in Google Maps Button */}
              <Pressable
                onPress={() => {
                  if (Platform.OS === 'web' && typeof window !== 'undefined') {
                    window.open(
                      `https://www.google.com/maps?q=${selectedMarker.lat},${selectedMarker.lng}`,
                      '_blank'
                    )
                  }
                }}
                style={({ pressed }) => [
                  styles.googleMapsBtn,
                  {
                    backgroundColor: isDark ? '#27272a' : '#f1f5f9',
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Navigation size={13} color={colors.foreground} strokeWidth={2} />
                <Text
                  style={[
                    styles.googleMapsBtnText,
                    { color: colors.foreground },
                  ]}
                >
                  View in Google Maps
                </Text>
                <ExternalLink size={12} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 580,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'column',
    position: 'relative',
  },
  topSearchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    position: 'relative',
    zIndex: 50,
  },
  searchBox: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    fontFamily: 'Open Sans',
    padding: 0,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 62,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 220,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 60,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(226, 232, 240, 0.4)',
  },
  dropdownIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemTitle: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
  dropdownItemSub: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  mapViewport: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  mobileFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingControlsGroup: {
    position: 'absolute',
    top: 14,
    right: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 30,
    overflow: 'hidden',
  },
  floatingBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDivider: {
    height: 1,
    width: '100%',
  },
  bottomLocationsBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  bottomLocationsText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    fontWeight: '500',
  },
  attributionBadge: {
    position: 'absolute',
    bottom: 6,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  attributionText: {
    fontSize: 10,
    color: '#475569',
    fontFamily: 'Open Sans',
  },
  infoIcon: {
    fontWeight: '700',
  },
  popupOverlayCard: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    width: 310,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 40,
    overflow: 'hidden',
  },
  popupAccentBar: {
    height: 3.5,
    width: '100%',
  },
  popupBody: {
    padding: 14,
    gap: 10,
  },
  popupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  popupLocationTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  popupLocationDesc: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  closeBtn: {
    padding: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gridBox: {
    width: '48.5%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    fontFamily: 'Open Sans',
  },
  gridValue: {
    fontSize: 11.5,
    fontWeight: '500',
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  googleMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 2,
  },
  googleMapsBtnText: {
    fontSize: 11.5,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
})
