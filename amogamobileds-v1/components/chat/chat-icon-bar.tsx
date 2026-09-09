import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Animated,
} from 'react-native';
import {
  ThumbsUp,
  ThumbsDown,
  CornerUpLeft,
  Copy,
  Share2,
  MoreHorizontal,
  Trash2,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';

export interface ChatIconBarProps {
  onThumbUp?: () => void;
  onThumbDown?: () => void;
  onReply?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
  initialLiked?: boolean;
  initialDisliked?: boolean;
}


export function ChatIconBar({
  onThumbUp,
  onThumbDown,
  onCopy,
  onShare,
  onMore,
  initialLiked = false,
  initialDisliked = false,
}: ChatIconBarProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isDisliked, setIsDisliked] = useState(initialDisliked);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const bg = isDark ? '#141418' : '#ffffff';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const iconMuted = isDark ? '#94a3b8' : '#64748b';
  const iconActive = isDark ? '#fafafa' : '#09090b';

  const triggerFeedback = (name: string) => {
    setActiveTooltip(name);
    setTimeout(() => setActiveTooltip(null), 1400);
  };

  const handleThumbUp = () => {
    setIsLiked(!isLiked);
    if (!isLiked) setIsDisliked(false);
    triggerFeedback(!isLiked ? 'Liked' : 'Removed like');
    onThumbUp?.();
  };

  const handleThumbDown = () => {
    setIsDisliked(!isDisliked);
    if (!isDisliked) setIsLiked(false);
    triggerFeedback(!isDisliked ? 'Disliked' : 'Removed dislike');
    onThumbDown?.();
  };

  const handleCopy = () => {
    setIsCopied(true);
    triggerFeedback('Copied!');
    setTimeout(() => setIsCopied(false), 2000);
    onCopy?.();
  };

  const handleShare = () => {
    triggerFeedback('Share');
    onShare?.();
  };

  const handleMore = () => {
    onMore?.();
  };

  return (
    <View style={styles.outerWrap}>
      {activeTooltip && (
        <View style={[styles.tooltipPill, { backgroundColor: isDark ? '#27272a' : '#09090b' }]}>
          <Text style={styles.tooltipText}>{activeTooltip}</Text>
        </View>
      )}

      <View
        style={[
          styles.pillContainer,
          {
            backgroundColor: bg,
            borderColor: border,
            shadowColor: isDark ? '#000000' : '#64748b',
          },
        ]}
      >
        {/* 1. Like */}
        <TouchableOpacity
          onPress={handleThumbUp}
          activeOpacity={0.7}
          style={[
            styles.iconBtn,
            isLiked && { backgroundColor: isDark ? '#064e3b' : '#ecfdf5' },
          ]}
          accessibilityLabel="Like"
        >
          <ThumbsUp
            size={16}
            color={isLiked ? '#10b981' : iconMuted}
            strokeWidth={isLiked ? 2.4 : 1.8}
          />
        </TouchableOpacity>

        {/* 2. Dislike */}
        <TouchableOpacity
          onPress={handleThumbDown}
          activeOpacity={0.7}
          style={[
            styles.iconBtn,
            isDisliked && { backgroundColor: isDark ? '#4c0519' : '#fff1f2' },
          ]}
          accessibilityLabel="Dislike"
        >
          <ThumbsDown
            size={16}
            color={isDisliked ? '#f43f5e' : iconMuted}
            strokeWidth={isDisliked ? 2.4 : 1.8}
          />
        </TouchableOpacity>

        {/* 3. Copy */}
        <TouchableOpacity
          onPress={handleCopy}
          activeOpacity={0.7}
          style={[
            styles.iconBtn,
            isCopied && { backgroundColor: isDark ? '#1e1b4b' : '#ede9fe' },
          ]}
          accessibilityLabel="Copy message"
        >
          {isCopied ? (
            <Check size={16} color="#8b5cf6" strokeWidth={2.4} />
          ) : (
            <Copy size={16} color={iconMuted} strokeWidth={1.8} />
          )}
        </TouchableOpacity>

        {/* 4. Share */}
        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={0.7}
          style={styles.iconBtn}
          accessibilityLabel="Share"
        >
          <Share2 size={16} color={iconMuted} strokeWidth={1.8} />
        </TouchableOpacity>

        {/* 5. 3-Dot Menu */}
        <TouchableOpacity
          onPress={handleMore}
          activeOpacity={0.7}
          style={styles.iconBtn}
          accessibilityLabel="More options"
        >
          <MoreHorizontal size={17} color={iconMuted} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipPill: {
    position: 'absolute',
    top: -30,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 10,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Open Sans',
  },
});
