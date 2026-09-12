import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
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
  Building2,
  Compass,
} from 'lucide-react-native';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { useTheme } from '../../providers/theme-provider';

export interface MapMarkerItem {
  id: string;
  locationName: string;
  description: string;
  name: string;
  mobile: string;
  zipCode: string;
  lat: number;
  lng: number;
  icon: 'store' | 'pin';
  category?: string;
  population?: string;
}

export const DEFAULT_MAP_MARKERS: MapMarkerItem[] = [
  {
    id: '1',
    locationName: 'Jaipur Municipal Corporation',
    description: 'Jaipur Municipal Corporation, Rajasthan, India',
    name: 'Jaipur MC',
    mobile: '+91 141 274 7400',
    zipCode: '302015',
    lat: 26.9527,
    lng: 75.7429,
    icon: 'pin',
    category: 'Government & Public Services',
  },
  {
    id: '2',
    locationName: 'Bhopal Central Hub',
    description: 'Bhopal Central Hub, Madhya Pradesh, India',
    name: 'Priya Sharma',
    mobile: '+91 98765-43210',
    zipCode: '462001',
    lat: 23.2599,
    lng: 77.4126,
    icon: 'store',
    category: 'Commercial Hub',
  },
  {
    id: '3',
    locationName: 'Mumbai West Coast Store',
    description: 'Marine Drive, Mumbai, Maharashtra, India',
    name: 'Rohan Mehta',
    mobile: '+91 98123-45678',
    zipCode: '400001',
    lat: 19.076,
    lng: 72.8777,
    icon: 'store',
    category: 'Retail & Experience Store',
  },
  {
    id: '4',
    locationName: 'Kolkata Heritage Point',
    description: 'Park Street, Kolkata, West Bengal, India',
    name: 'Subhash Bose',
    mobile: '+91 98300-98765',
    zipCode: '700001',
    lat: 22.5726,
    lng: 88.3639,
    icon: 'pin',
    category: 'Logistics Hub',
  },
  {
    id: '5',
    locationName: 'Bengaluru Tech Park Store',
    description: 'Electronic City, Bengaluru, Karnataka, India',
    name: 'Ananya Rao',
    mobile: '+91 98450-12345',
    zipCode: '560001',
    lat: 12.9716,
    lng: 77.5946,
    icon: 'store',
    category: 'Tech Experience Store',
  },
  {
    id: '6',
    locationName: 'London European Center',
    description: 'Westminster, London, United Kingdom',
    name: 'James Williams',
    mobile: '+44 20 7946 0958',
    zipCode: 'EC1A 1BB',
    lat: 51.5074,
    lng: -0.1278,
    icon: 'store',
    category: 'International HQ',
  },
  {
    id: '7',
    locationName: 'Tokyo Shinjuku Point',
    description: 'Shinjuku City, Tokyo, Japan',
    name: 'Yuki Tanaka',
    mobile: '+81 3-1234-5678',
    zipCode: '100-0001',
    lat: 35.6762,
    lng: 139.6503,
    icon: 'pin',
    category: 'APAC Office',
  },
  {
    id: '8',
    locationName: 'New Delhi North Wing',
    description: 'Connaught Place, New Delhi, India',
    name: 'Amit Verma',
    mobile: '+91 98987-65432',
    zipCode: '110001',
    lat: 28.6139,
    lng: 77.209,
    icon: 'pin',
    category: 'Corporate Office',
  },
  {
    id: '9',
    locationName: 'New York City Manhattan Store',
    description: '5th Avenue, New York, NY, USA',
    name: 'John Smith',
    mobile: '+1 234-567-8900',
    zipCode: '10001',
    lat: 40.7128,
    lng: -74.006,
    icon: 'store',
    category: 'Flagship Store',
  },
  {
    id: '10',
    locationName: 'San Francisco Bay Office',
    description: 'Market Street, San Francisco, CA, USA',
    name: 'Sarah Johnson',
    mobile: '+1 345-678-9012',
    zipCode: '94105',
    lat: 37.7749,
    lng: -122.4194,
    icon: 'pin',
    category: 'Tech Office',
  },
];

export interface FullPageMapProps {
  markers?: MapMarkerItem[];
  defaultCenter?: [number, number]; // [lat, lng]
  defaultZoom?: number;
  onMarkerSelect?: (marker: MapMarkerItem) => void;
  onExplore?: (marker: MapMarkerItem) => void;
  height?: number | string;
  style?: any;
}

export function FullPageMap({
  markers = DEFAULT_MAP_MARKERS,
  defaultCenter = [23.2599, 77.4126], // [lat, lng] Bhopal / India
  defaultZoom = 4,
  onMarkerSelect,
  onExplore,
  height = '100%',
  style,
}: FullPageMapProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const iframeRef = useRef<any>(null);

  const filteredMarkers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return markers.filter(
      (m) =>
        m.locationName.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.zipCode.includes(q)
    );
  }, [markers, searchQuery]);

  // Select a marker from search dropdown or interaction
  const handleSelectMarker = useCallback(
    (marker: MapMarkerItem) => {
      setSelectedMarker(marker);
      setSearchQuery('');
      setIsSearchFocused(false);
      onMarkerSelect?.(marker);

      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'FLY_TO',
            lat: marker.lat,
            lng: marker.lng,
            zoom: 14,
            id: marker.id,
          },
          '*'
        );
      }
    },
    [onMarkerSelect]
  );

  // Handle message from map iframe
  useEffect(() => {
    const handleWindowMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'MARKER_CLICK') {
        const found = markers.find((m) => m.id === e.data.id);
        if (found) {
          setSelectedMarker(found);
          onMarkerSelect?.(found);
        }
      } else if (e.data.type === 'MAP_CLICK') {
        if (e.data.lat && e.data.lng) {
          const dynamicMarker: MapMarkerItem = {
            id: `explore-${Date.now()}`,
            locationName: e.data.name || `${e.data.lat.toFixed(4)}, ${e.data.lng.toFixed(4)}`,
            description: e.data.address || 'Explored Location',
            name: 'Pinpoint Location',
            mobile: 'N/A',
            zipCode: e.data.postcode || '',
            lat: e.data.lat,
            lng: e.data.lng,
            icon: 'pin',
            category: 'Explored Location',
          };
          setSelectedMarker(dynamicMarker);
        } else {
          setSelectedMarker(null);
        }
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('message', handleWindowMessage);
      return () => {
        window.removeEventListener('message', handleWindowMessage);
      };
    }
  }, [markers, onMarkerSelect]);

  // Map Controls
  const handleZoomIn = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'ZOOM_IN' }, '*');
    }
  };

  const handleZoomOut = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'ZOOM_OUT' }, '*');
    }
  };

  const handleResetView = () => {
    setSelectedMarker(null);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'FLY_TO',
          lat: defaultCenter[0],
          lng: defaultCenter[1],
          zoom: defaultZoom,
        },
        '*'
      );
    }
  };

  // Location Permission & Locate user
  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setIsLocating(false);
            const userCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            const userMarker: MapMarkerItem = {
              id: 'my-current-location',
              locationName: 'Your Current Location',
              description: 'Precise GPS Coordinates',
              name: 'You',
              mobile: '',
              zipCode: '',
              lat: userCoords.lat,
              lng: userCoords.lng,
              icon: 'pin',
              category: 'Current Location',
            };
            setSelectedMarker(userMarker);

            if (iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                {
                  type: 'FLY_TO',
                  lat: userCoords.lat,
                  lng: userCoords.lng,
                  zoom: 14,
                  showUserPin: true,
                },
                '*'
              );
            }
          },
          (err) => {
            console.warn('Geolocation error:', err);
            setIsLocating(false);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setIsLocating(false);
          const userMarker: MapMarkerItem = {
            id: 'my-current-location',
            locationName: 'Your Current Location',
            description: 'GPS Position',
            name: 'You',
            mobile: '',
            zipCode: '',
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            icon: 'pin',
          };
          setSelectedMarker(userMarker);

          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'FLY_TO',
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                zoom: 14,
                showUserPin: true,
              },
              '*'
            );
          }
        } else {
          setIsLocating(false);
        }
      }
    } catch (e) {
      console.warn('Location request failed:', e);
      setIsLocating(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleOpenExternalMaps = (marker: MapMarkerItem) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${marker.lat},${marker.lng}`;
    Linking.openURL(url);
  };

  // Pure MapLibre Vector Tiles with CARTO Positron Vector Style (Same as amoganextapp)
  const mapHtml = useMemo(() => {
    const styleUrl = isDark
      ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

    const markersJson = JSON.stringify(markers);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: ${isDark ? '#0b0f19' : '#f4f4f6'};
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #map {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }
    .maplibregl-ctrl-attrib, .maplibregl-ctrl { display: none !important; }

    /* Custom Marker Styling matching Screenshot 2 */
    .custom-marker-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
    }

    .marker-pin-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    }

    .marker-pin-circle.pin {
      background: #ef4444;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.45);
    }

    .marker-pin-circle.store {
      background: #2563eb;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
    }

    .custom-marker-wrap:hover .marker-pin-circle {
      transform: scale(1.24);
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
    }

    /* Pulse animation for user's located pin */
    .user-pulse-ring {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #2563eb;
      opacity: 0.45;
      animation: userPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      pointer-events: none;
    }

    @keyframes userPing {
      75%, 100% {
        transform: scale(2.2);
        opacity: 0;
      }
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
  <script>
    const map = new maplibregl.Map({
      container: 'map',
      style: '${styleUrl}',
      center: [${defaultCenter[1]}, ${defaultCenter[0]}], // [lng, lat]
      zoom: ${defaultZoom},
      minZoom: 1,
      maxZoom: 19,
      attributionControl: false
    });

    const markersData = ${markersJson};
    let userMarkerInstance = null;

    function createMarkerElement(marker) {
      const isPin = marker.icon === 'pin';
      const iconSvg = isPin
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>';

      const el = document.createElement('div');
      el.className = 'custom-marker-wrap';
      el.innerHTML = '<div class="marker-pin-circle ' + (isPin ? 'pin' : 'store') + '">' + iconSvg + '</div>';

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        window.parent.postMessage({ type: 'MARKER_CLICK', id: marker.id }, '*');
        map.flyTo({ center: [marker.lng, marker.lat], zoom: 14, essential: true, duration: 1200 });
      });

      return el;
    }

    map.on('load', () => {
      markersData.forEach(marker => {
        const el = createMarkerElement(marker);
        new maplibregl.Marker({ element: el })
          .setLngLat([marker.lng, marker.lat])
          .addTo(map);
      });
      map.resize();
    });

    // Map tap/click for reverse geocoding exploration
    map.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      try {
        const res = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng);
        const data = await res.json();
        const displayName = data.display_name ? data.display_name.split(',')[0] : 'Explored Location';
        window.parent.postMessage({
          type: 'MAP_CLICK',
          lat: lat,
          lng: lng,
          name: displayName,
          address: data.display_name || '',
          postcode: data.address ? data.address.postcode : ''
        }, '*');
      } catch (err) {
        window.parent.postMessage({
          type: 'MAP_CLICK',
          lat: lat,
          lng: lng,
          name: lat.toFixed(4) + ', ' + lng.toFixed(4),
          address: 'Coordinates: ' + lat.toFixed(4) + ', ' + lng.toFixed(4)
        }, '*');
      }
    });

    window.addEventListener('message', (e) => {
      if (!e.data) return;
      if (e.data.type === 'ZOOM_IN') {
        map.zoomIn();
      } else if (e.data.type === 'ZOOM_OUT') {
        map.zoomOut();
      } else if (e.data.type === 'FLY_TO') {
        map.flyTo({
          center: [e.data.lng, e.data.lat],
          zoom: e.data.zoom || 14,
          essential: true,
          duration: 1200
        });

        if (e.data.showUserPin) {
          if (userMarkerInstance) {
            userMarkerInstance.setLngLat([e.data.lng, e.data.lat]);
          } else {
            const userEl = document.createElement('div');
            userEl.className = 'custom-marker-wrap';
            userEl.innerHTML = '<div class="user-pulse-ring"></div><div class="marker-pin-circle pin" style="background: #2563eb; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="#ffffff"/></svg></div>';
            userMarkerInstance = new maplibregl.Marker({ element: userEl })
              .setLngLat([e.data.lng, e.data.lat])
              .addTo(map);
          }
        }
      }
    });

    window.addEventListener('resize', () => map.resize());
    setTimeout(() => map.resize(), 100);
    setTimeout(() => map.resize(), 500);
  </script>
</body>
</html>
`;
  }, [isDark, markers, defaultCenter, defaultZoom]);

  return (
    <View
      style={[
        styles.container,
        style,
        {
          height: height || '100%',
        },
      ]}
    >
      {/* ── 1. Interactive Map Viewport (CARTO Positron Vector) ──────────────────── */}
      <View style={styles.mapViewport}>
        {Platform.OS === 'web' ? (
          <iframe
            ref={iframeRef}
            srcDoc={mapHtml}
            title="CARTO Positron OpenStreetMap"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 0,
            }}
          />
        ) : (
          <View style={styles.mobileFallback}>
            <Building2 size={36} color="#2563eb" />
            <Text style={{ color: colors.foreground, marginTop: 8, fontWeight: '600' }}>
              CARTO Positron Maps
            </Text>
          </View>
        )}

        {/* ── 2. Top Floating Search Bar (Edge-to-Edge Floating Overlay) ─────────── */}
        <View style={styles.topSearchContainer}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.97)',
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
                  key={`search-${marker.id}`}
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
                        backgroundColor: marker.icon === 'pin' ? '#ef4444' : '#2563eb',
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
                      style={[styles.dropdownItemTitle, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {marker.locationName}
                    </Text>
                    <Text
                      style={[styles.dropdownItemSub, { color: colors.mutedForeground }]}
                      numberOfLines={1}
                    >
                      {marker.description} {marker.zipCode ? `• ${marker.zipCode}` : ''}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* ── 3. Right Floating Controls Group ──────────────────────────────────── */}
        <View
          style={[
            styles.floatingControlsGroup,
            {
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.96)',
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
            style={[styles.btnDivider, { backgroundColor: isDark ? colors.border : '#e2e8f0' }]}
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
            style={[styles.btnDivider, { backgroundColor: isDark ? colors.border : '#e2e8f0' }]}
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
            style={[styles.btnDivider, { backgroundColor: isDark ? colors.border : '#e2e8f0' }]}
          />

          {/* Locate Me (Permissions + Spinner + User Pin) */}
          <Pressable
            onPress={handleLocateMe}
            hitSlop={6}
            style={styles.floatingBtn}
            accessibilityLabel="My Location"
          >
            {isLocating ? (
              <Loader2 size={14} color="#2563eb" />
            ) : (
              <Locate size={14} color={colors.foreground} strokeWidth={2} />
            )}
          </Pressable>

          <View
            style={[styles.btnDivider, { backgroundColor: isDark ? colors.border : '#e2e8f0' }]}
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
                ? 'rgba(24, 24, 27, 0.88)'
                : 'rgba(255, 255, 255, 0.94)',
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
            {markers.length} locations
          </Text>
        </View>

        {/* ── 5. Bottom-Right Attribution ───────────────────────────────────────── */}
        <View style={styles.attributionBadge}>
          <Text style={styles.attributionText}>
            © CARTO, © OpenStreetMap contributors{' '}
            <Text style={styles.infoIcon}>ⓘ</Text>
          </Text>
        </View>

        {/* ── 6. Popup Card (Matching Screenshot 2) ─────────────────────────────── */}
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
            {/* Top Accent Gradient Bar (Blue -> Purple -> Pink) */}
            <View style={styles.gradientBarContainer}>
              <View style={[styles.gradientBarSegment, { backgroundColor: '#3b82f6' }]} />
              <View style={[styles.gradientBarSegment, { backgroundColor: '#a855f7' }]} />
              <View style={[styles.gradientBarSegment, { backgroundColor: '#ec4899' }]} />
            </View>

            <View style={styles.popupContentBody}>
              {/* Header: Icon + Title + Close Button */}
              <View style={styles.popupHeaderRow}>
                <View style={styles.popupTitleLeft}>
                  <View
                    style={[
                      styles.popupIconBox,
                      {
                        backgroundColor:
                          selectedMarker.icon === 'store' ? '#eff6ff' : '#fef2f2',
                      },
                    ]}
                  >
                    {selectedMarker.icon === 'store' ? (
                      <Building2 size={16} color="#2563eb" strokeWidth={2.2} />
                    ) : (
                      <MapPin size={16} color="#ef4444" strokeWidth={2.2} />
                    )}
                  </View>
                  <Text
                    style={[styles.popupTitleText, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {selectedMarker.locationName}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedMarker(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.popupCloseBtn}
                >
                  <X size={14} color={colors.mutedForeground} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Subheader: Location label */}
              <Text style={[styles.popupSubLabel, { color: colors.mutedForeground }]}>
                Location
              </Text>

              {/* Details: Address */}
              <View style={styles.popupDetailRow}>
                <MapPin size={13} color={colors.mutedForeground} style={{ marginTop: 2 }} />
                <Text
                  style={[styles.popupDetailText, { color: colors.foreground }]}
                  numberOfLines={2}
                >
                  {selectedMarker.description}
                  {selectedMarker.zipCode ? `, ${selectedMarker.zipCode}` : ''}
                </Text>
              </View>

              {/* Details: Coordinates */}
              <View style={styles.popupDetailRow}>
                <Compass size={13} color={colors.mutedForeground} style={{ marginTop: 2 }} />
                <Text style={[styles.popupCoordsText, { color: colors.mutedForeground }]}>
                  {selectedMarker.lat.toFixed(4)}, {selectedMarker.lng.toFixed(4)}
                </Text>
              </View>

              {/* Bottom Actions Row: [ ↗ Maps ] and [ ✈ Explore ] */}
              <View style={styles.popupActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleOpenExternalMaps(selectedMarker)}
                  style={[
                    styles.actionBtnSecondary,
                    {
                      backgroundColor: isDark ? '#27272a' : '#f0fdf4',
                      borderColor: isDark ? colors.border : '#bbf7d0',
                    },
                  ]}
                >
                  <ExternalLink size={13} color="#16a34a" strokeWidth={2} />
                  <Text style={[styles.actionBtnText, { color: '#16a34a' }]}>Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => onExplore?.(selectedMarker)}
                  style={[
                    styles.actionBtnPrimary,
                    {
                      backgroundColor: isDark ? '#3b82f6' : '#eff6ff',
                      borderColor: isDark ? '#2563eb' : '#bfdbfe',
                    },
                  ]}
                >
                  <Navigation size={13} color="#2563eb" strokeWidth={2} />
                  <Text style={[styles.actionBtnText, { color: '#2563eb' }]}>Explore</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
  },
  topSearchContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 40,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
      } as any,
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: 'Open Sans',
    paddingVertical: 0,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 240,
    overflow: 'hidden',
    zIndex: 50,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
      } as any,
    }),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  dropdownIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  dropdownItemSub: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
    marginTop: 1,
  },
  mapViewport: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 0,
    overflow: 'hidden',
  },
  mobileFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  floatingControlsGroup: {
    position: 'absolute',
    top: 66,
    right: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 30,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      } as any,
    }),
  },
  floatingBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDivider: {
    width: '75%',
    height: 1,
  },
  bottomLocationsBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 25,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      } as any,
    }),
  },
  bottomLocationsText: {
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  attributionBadge: {
    position: 'absolute',
    bottom: 6,
    right: 12,
    zIndex: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 10,
    color: '#334155',
    fontFamily: 'Open Sans',
  },
  infoIcon: {
    fontWeight: '700',
    color: '#0284c7',
  },
  popupOverlayCard: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -160 }],
    width: 320,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 45,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 30px rgba(0,0,0,0.16)',
      } as any,
    }),
  },
  gradientBarContainer: {
    width: '100%',
    height: 4,
    flexDirection: 'row',
  },
  gradientBarSegment: {
    flex: 1,
    height: '100%',
  },
  popupContentBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  popupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  popupTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 6,
  },
  popupIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupTitleText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
    flex: 1,
  },
  popupCloseBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupSubLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Open Sans',
    marginBottom: 4,
  },
  popupDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 3,
  },
  popupDetailText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Open Sans',
    flex: 1,
  },
  popupCoordsText: {
    fontSize: 11.5,
    fontFamily: 'Open Sans',
  },
  popupActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
});
