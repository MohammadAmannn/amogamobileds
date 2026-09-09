import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  Eye,
  Download,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../providers/theme-provider';

export interface UploadedFileCardProps {
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  extension?: string;
  onPreview?: () => void;
  onDownload?: () => void;
}

export function UploadedFileCard({
  fileName = 'bank-full.csv',
  fileSize = '3.6 MB',
  fileType = 'CSV',
  extension = 'csv',
  onPreview,
  onDownload,
}: UploadedFileCardProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [downloaded, setDownloaded] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);

  const cardBg = isDark ? '#121216' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const actionBtnBg = isDark ? '#1e1e24' : '#f8fafc';
  const actionBtnHover = isDark ? '#27272a' : '#f1f5f9';

  // Badge colors matching Screenshot 3
  const getBadgeStyle = () => {
    const ext = (extension || fileType || 'file').toLowerCase();
    if (ext === 'csv' || ext === 'xls' || ext === 'xlsx') {
      return {
        bg: isDark ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb',
        border: isDark ? 'rgba(245, 158, 11, 0.25)' : '#fed7aa',
        color: '#f59e0b',
        Icon: FileSpreadsheet,
      };
    }
    if (ext === 'pdf') {
      return {
        bg: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
        border: isDark ? 'rgba(239, 68, 68, 0.25)' : '#fecaca',
        color: '#ef4444',
        Icon: FileText,
      };
    }
    if (ext === 'doc' || ext === 'docx') {
      return {
        bg: isDark ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff',
        border: isDark ? 'rgba(59, 130, 246, 0.25)' : '#bfdbfe',
        color: '#3b82f6',
        Icon: FileText,
      };
    }
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      return {
        bg: isDark ? 'rgba(16, 185, 129, 0.12)' : '#f0fdf4',
        border: isDark ? 'rgba(16, 185, 129, 0.25)' : '#bbf7d0',
        color: '#10b981',
        Icon: ImageIcon,
      };
    }
    return {
      bg: isDark ? 'rgba(139, 92, 246, 0.12)' : '#faf5ff',
      border: isDark ? 'rgba(139, 92, 246, 0.25)' : '#e9d5ff',
      color: '#8b5cf6',
      Icon: FileCode,
    };
  };

  const badge = getBadgeStyle();
  const IconComp = badge.Icon;

  const handleDownload = () => {
    setDownloaded(true);
    onDownload?.();
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handlePreview = () => {
    setPreviewActive(true);
    onPreview?.();
    setTimeout(() => setPreviewActive(false), 1500);
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
      {/* Left: Icon Badge */}
      <View
        style={[
          styles.iconBadge,
          {
            backgroundColor: badge.bg,
            borderColor: badge.border,
          },
        ]}
      >
        <IconComp size={18} color={badge.color} strokeWidth={2} />
      </View>

      {/* Middle: File Meta */}
      <View style={styles.metaCol}>
        <Text style={[styles.fileName, { color: textColor }]} numberOfLines={1}>
          {fileName}
        </Text>
        <Text style={[styles.fileInfo, { color: mutedText }]}>
          {fileSize} • {fileType.toUpperCase()}
        </Text>
      </View>

      {/* Right: Eye & Download Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={handlePreview}
          activeOpacity={0.7}
          style={[
            styles.actionBtn,
            {
              backgroundColor: previewActive ? actionBtnHover : actionBtnBg,
              borderColor,
            },
          ]}
          accessibilityLabel="Preview file"
        >
          <Eye size={15} color={previewActive ? badge.color : mutedText} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDownload}
          activeOpacity={0.7}
          style={[
            styles.actionBtn,
            {
              backgroundColor: downloaded ? (isDark ? '#064e3b' : '#ecfdf5') : actionBtnBg,
              borderColor: downloaded ? '#10b981' : borderColor,
            },
          ]}
          accessibilityLabel="Download file"
        >
          {downloaded ? (
            <Check size={15} color="#10b981" strokeWidth={2.4} />
          ) : (
            <Download size={15} color={mutedText} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaCol: {
    flex: 1,
    gap: 2,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    letterSpacing: -0.1,
  },
  fileInfo: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
