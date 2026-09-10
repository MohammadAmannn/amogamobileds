import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Telescope, MessageSquare, LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';

export interface ComingSoonViewProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  onGoToChat?: () => void;
  style?: any;
}

export function ComingSoonView({
  title,
  description,
  icon: CustomIcon,
  onGoToChat,
  style,
}: ComingSoonViewProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const IconToRender = CustomIcon || Telescope;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      <View style={styles.contentWrap}>
        {/* Soft Circular Badge matching Screenshot 2 */}
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: `${colors.primary}18`,
            },
          ]}
        >
          <IconToRender
            size={42}
            color={colors.primary}
            strokeWidth={1.8}
          />
        </View>

        {/* Big Bold Title */}
        <Text style={[styles.title, { color: colors.foreground }]}>
          Coming Soon!
        </Text>

        {/* Subtitles matching Screenshot 2 */}
        <Text style={[styles.sub1, { color: colors.mutedForeground }]}>
          {description || 'This page has not been created yet.'}
        </Text>
        <Text style={[styles.sub2, { color: colors.mutedForeground }]}>
          Stay tuned though!
        </Text>

        {/* Optional Go to Chat Action */}
        {onGoToChat && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onGoToChat}
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <MessageSquare size={16} color="#ffffff" strokeWidth={2.2} />
            <Text style={styles.actionBtnText}>Go to Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    width: '100%',
    height: '100%',
  },
  contentWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 480,
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Open Sans',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  sub1: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    textAlign: 'center',
    lineHeight: 22,
  },
  sub2: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Open Sans',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginTop: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
});
