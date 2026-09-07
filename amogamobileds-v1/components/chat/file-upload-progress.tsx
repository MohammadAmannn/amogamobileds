import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  X,
  RotateCcw,
  UploadCloud,
} from 'lucide-react-native';
import { useTheme } from '@/providers/theme-provider';

export interface FileUploadProgressProps {
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  initialProgress?: number;
  status?: 'uploading' | 'completed' | 'paused' | 'error';
  onCancel?: () => void;
  onRetry?: () => void;
  onComplete?: () => void;
}

export function FileUploadProgress({
  fileName = 'quarterly_financial_report.pdf',
  fileSize = '3.6 MB',
  fileType = 'PDF',
  initialProgress = 65,
  status: initialStatus = 'uploading',
  onCancel,
  onRetry,
  onComplete,
}: FileUploadProgressProps) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const [progress, setProgress] = useState(initialProgress);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    let interval: any;
    if (status === 'uploading' && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStatus('completed');
            onComplete?.();
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [status, progress, onComplete]);

  const cardBg = isDark ? '#121216' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#09090b';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const trackBg = isDark ? '#27272a' : '#f1f5f9';

  // Compute icon style based on type
  const getFileBadge = () => {
    const ext = fileType.toUpperCase();
    if (ext === 'PDF') {
      return { bg: isDark ? '#450a0a' : '#fee2e2', text: '#ef4444', Icon: FileText };
    }
    if (ext === 'CSV' || ext === 'XLSX' || ext === 'XLS') {
      return { bg: isDark ? '#451a03' : '#fef3c7', text: '#d97706', Icon: FileSpreadsheet };
    }
    if (ext === 'ZIP' || ext === 'RAR') {
      return { bg: isDark ? '#3b0764' : '#f3e8ff', text: '#a855f7', Icon: FileArchive };
    }
    if (ext === 'PNG' || ext === 'JPG' || ext === 'JPEG') {
      return { bg: isDark ? '#064e3b' : '#dcfce7', text: '#10b981', Icon: ImageIcon };
    }
    return { bg: isDark ? '#1e1b4b' : '#e0e7ff', text: '#6366f1', Icon: FileCode };
  };

  const badge = getFileBadge();
  const IconComp = badge.Icon;

  const handleTogglePause = () => {
    if (status === 'uploading') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('uploading');
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setStatus('uploading');
    onRetry?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor,
          shadowColor: isDark ? '#000000' : '#64748b',
        },
      ]}
    >
      {/* Top row: Icon, Name & Status Button */}
      <View style={styles.topRow}>
        <View style={[styles.typeIconBadge, { backgroundColor: badge.bg }]}>
          <IconComp size={18} color={badge.text} strokeWidth={2} />
        </View>

        <View style={styles.metaCol}>
          <View style={styles.titleRow}>
            <Text style={[styles.fileName, { color: textColor }]} numberOfLines={1}>
              {fileName}
            </Text>
            {status === 'completed' && (
              <CheckCircle2 size={15} color="#10b981" strokeWidth={2.2} />
            )}
            {status === 'error' && (
              <AlertCircle size={15} color="#ef4444" strokeWidth={2.2} />
            )}
          </View>
          <Text style={[styles.fileSub, { color: mutedText }]}>
            {fileSize} • {fileType} • {status === 'completed' ? 'Uploaded' : status === 'paused' ? 'Paused' : `${progress}%`}
          </Text>
        </View>

        {/* Action controls */}
        <View style={styles.controlsRow}>
          {status === 'uploading' && (
            <TouchableOpacity
              onPress={handleTogglePause}
              style={[styles.smallBtn, { backgroundColor: trackBg }]}
              accessibilityLabel="Pause upload"
            >
              <Pause size={12} color={mutedText} />
            </TouchableOpacity>
          )}

          {status === 'paused' && (
            <TouchableOpacity
              onPress={handleTogglePause}
              style={[styles.smallBtn, { backgroundColor: trackBg }]}
              accessibilityLabel="Resume upload"
            >
              <Play size={12} color={mutedText} />
            </TouchableOpacity>
          )}

          {status === 'completed' ? (
            <TouchableOpacity
              onPress={handleRestart}
              style={[styles.smallBtn, { backgroundColor: trackBg }]}
              accessibilityLabel="Upload again"
            >
              <RotateCcw size={12} color={mutedText} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setStatus('paused');
                onCancel?.();
              }}
              style={[styles.smallBtn, { backgroundColor: trackBg }]}
              accessibilityLabel="Cancel upload"
            >
              <X size={12} color={mutedText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom row: Animated Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: trackBg }]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor:
                status === 'completed'
                  ? '#10b981'
                  : status === 'paused'
                  ? '#f59e0b'
                  : status === 'error'
                  ? '#ef4444'
                  : '#8b5cf6',
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaCol: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  fileSub: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  smallBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});
