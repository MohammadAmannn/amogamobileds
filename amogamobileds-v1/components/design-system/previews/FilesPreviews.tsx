import React, { useState } from 'react'
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native'
import {
  FileText,
  Folder,
  FolderOpen,
  UploadCloud,
  Download,
  Eye,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  ChevronDown,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Film,
  Archive,
  MoreVertical,
  Plus,
  ArrowUpRight,
  HardDrive,
} from 'lucide-react-native'
import { useTheme } from '@/providers/theme-provider'
import type { GalleryEntry } from '../../types'

interface AttachedFile {
  id: string
  name: string
  size: string
  type: string
  date: string
  color: string
}

const SAMPLE_FILES: AttachedFile[] = [
  {
    id: 'f1',
    name: 'Q3_Financial_Summary.pdf',
    size: '2.4 MB',
    type: 'PDF',
    date: 'Aug 19, 2026',
    color: '#ef4444',
  },
  {
    id: 'f2',
    name: 'Product_Roadmap_2027.docx',
    size: '1.1 MB',
    type: 'DOC',
    date: 'Aug 18, 2026',
    color: '#3b82f6',
  },
  {
    id: 'f3',
    name: 'Marketing_Analytics_Export.xlsx',
    size: '840 KB',
    type: 'XLS',
    date: 'Aug 17, 2026',
    color: '#10b981',
  },
  {
    id: 'f4',
    name: 'Hero_Mockup_Visuals.png',
    size: '4.8 MB',
    type: 'IMG',
    date: 'Aug 15, 2026',
    color: '#f59e0b',
  },
  {
    id: 'f5',
    name: 'Demo_Walkthrough_Video.mp4',
    size: '42.0 MB',
    type: 'VID',
    date: 'Aug 12, 2026',
    color: '#a855f7',
  },
  {
    id: 'f6',
    name: 'Design_Tokens_Archive.zip',
    size: '15.2 MB',
    type: 'ZIP',
    date: 'Aug 10, 2026',
    color: '#f97316',
  },
]

// ─── 1. FILE UPLOADER & INLINE DOCUMENT VIEWER ──────────────────────────────
export function FileUploaderAndViewerPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [files, setFiles] = useState<AttachedFile[]>(SAMPLE_FILES)
  const [activePreview, setActivePreview] = useState<AttachedFile | null>(null)
  const [copiedJson, setCopiedJson] = useState(false)

  const handleAddSample = () => {
    const newFile: AttachedFile = {
      id: `f-${Date.now()}`,
      name: 'Executive_Brief_2026.pdf',
      size: '1.8 MB',
      type: 'PDF',
      date: 'Just now',
      color: '#ef4444',
    }
    setFiles((prev) => [newFile, ...prev])
  }

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (activePreview?.id === id) setActivePreview(null)
  }

  const handleCopyJson = () => {
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 2000)
  }

  // Inline document preview mode
  if (activePreview) {
    return (
      <View style={styles.cardWrapper}>
        <View
          style={[
            styles.previewBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.docViewerHeader}>
            <View style={styles.docViewerTitleGroup}>
              <View
                style={[
                  styles.fileTypeBadge,
                  { backgroundColor: activePreview.color },
                ]}
              >
                <Text style={styles.fileTypeBadgeText}>
                  {activePreview.type}
                </Text>
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                  {activePreview.name}
                </Text>
                <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
                  {activePreview.size} • Uploaded {activePreview.date}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setActivePreview(null)}
              style={[
                styles.closePreviewBtn,
                {
                  backgroundColor: isDark ? colors.background : colors.secondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.closePreviewBtnText, { color: colors.foreground }]}>
                Close Viewer
              </Text>
            </Pressable>
          </View>

          {/* Document Content Simulation */}
          <View
            style={[
              styles.documentSheet,
              {
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.docHeaderBar}>
              <Text style={styles.docHeading}>Document Content Preview</Text>
              <Text style={styles.docTimestamp}>Generated Aug 19, 2026</Text>
            </View>

            <View style={styles.docParagraph}>
              <Text style={[styles.docBodyText, { color: isDark ? '#e4e4e7' : '#334155' }]}>
                1. Executive Summary & Goals{'\n'}
                This document provides architectural and design system specifications for the universal Expo Web and Mobile applications. It demonstrates inline document streaming, file preview capabilities, and responsive UI components.
              </Text>
            </View>

            <View style={styles.docParagraph}>
              <Text style={[styles.docBodyText, { color: isDark ? '#e4e4e7' : '#334155' }]}>
                2. Key Objectives & Deliverables{'\n'}
                • Maintain exact visual parity with the Next.js design system{'\n'}
                • Support full theme switching across all views and viewports{'\n'}
                • Provide high performance interactive date pickers, calendars, data cards, wizards, and file managers.
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.previewBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Top Dropzone */}
        <Pressable
          onPress={handleAddSample}
          style={[
            styles.dropzoneBox,
            {
              backgroundColor: isDark ? 'rgba(14, 165, 233, 0.05)' : '#f0f9ff',
              borderColor: isDark ? 'rgba(14, 165, 233, 0.3)' : '#bae6fd',
            },
          ]}
        >
          <UploadCloud size={32} color='#0284c7' />
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Text style={[styles.dropzoneTitle, { color: colors.foreground }]}>
              Click to attach or upload documents
            </Text>
            <Text style={[styles.dropzoneSub, { color: colors.mutedForeground }]}>
              Supports PDF, DOCX, XLSX, PNG, MP4, and ZIP files up to 50MB
            </Text>
          </View>
        </Pressable>

        {/* Header with count and JSON action */}
        <View style={styles.filesHeaderRow}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Attached Files ({files.length})
          </Text>
          <Pressable
            onPress={handleCopyJson}
            style={[
              styles.copyJsonBtn,
              {
                backgroundColor: isDark ? colors.background : colors.secondary,
                borderColor: colors.border,
              },
            ]}
          >
            {copiedJson ? (
              <>
                <Check size={12} color='#10b981' />
                <Text style={styles.copyJsonBtnTextSuccess}>Copied</Text>
              </>
            ) : (
              <>
                <Copy size={12} color={colors.mutedForeground} />
                <Text style={[styles.copyJsonBtnText, { color: colors.foreground }]}>
                  Copy JSON
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Files list */}
        <View style={styles.filesList}>
          {files.map((file) => (
            <View
              key={file.id}
              style={[
                styles.fileItemRow,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.fileItemLeft}>
                <View
                  style={[
                    styles.fileTypeBadge,
                    { backgroundColor: file.color },
                  ]}
                >
                  <Text style={styles.fileTypeBadgeText}>{file.type}</Text>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={[styles.fileNameText, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {file.name}
                  </Text>
                  <Text
                    style={[
                      styles.fileMetaText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {file.size} • {file.date}
                  </Text>
                </View>
              </View>

              <View style={styles.fileItemActions}>
                <Pressable
                  onPress={() => setActivePreview(file)}
                  style={[
                    styles.actionIconBtn,
                    { borderColor: colors.border },
                  ]}
                  hitSlop={6}
                >
                  <Eye size={13} color={colors.foreground} />
                </Pressable>
                <Pressable
                  onPress={() => handleRemove(file.id)}
                  style={[
                    styles.actionIconBtn,
                    { borderColor: colors.border },
                  ]}
                  hitSlop={6}
                >
                  <Trash2 size={13} color='#ef4444' />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

// ─── 2. FILE MANAGER & EXPLORER VIEW ────────────────────────────────────────
export function FileManagerViewPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const categories = ['All', 'PDFs', 'Docs', 'Spreadsheets', 'Media', 'Archives']

  const filtered = SAMPLE_FILES.filter((f) => {
    if (selectedCategory === 'PDFs' && f.type !== 'PDF') return false
    if (selectedCategory === 'Docs' && f.type !== 'DOC') return false
    if (selectedCategory === 'Spreadsheets' && f.type !== 'XLS') return false
    if (
      selectedCategory === 'Media' &&
      f.type !== 'IMG' &&
      f.type !== 'VID'
    )
      return false
    if (selectedCategory === 'Archives' && f.type !== 'ZIP') return false
    if (searchQuery) {
      return f.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.previewBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Explorer Header */}
        <View style={styles.explorerHeader}>
          <View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Cloud Storage Explorer
            </Text>
            <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
              6 files • 67.3 MB total storage used
            </Text>
          </View>

          <View style={styles.viewToggleGroup}>
            <Pressable
              onPress={() => setViewMode('grid')}
              style={[
                styles.viewToggleBtn,
                viewMode === 'grid' && {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Grid
                size={14}
                color={viewMode === 'grid' ? '#ffffff' : colors.mutedForeground}
              />
            </Pressable>
            <Pressable
              onPress={() => setViewMode('table')}
              style={[
                styles.viewToggleBtn,
                viewMode === 'table' && {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <List
                size={14}
                color={viewMode === 'table' ? '#ffffff' : colors.mutedForeground}
              />
            </Pressable>
          </View>
        </View>

        {/* Search & Categories */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={14} color={colors.mutedForeground} />
          <TextInput
            placeholder='Search files...'
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsRow}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  isSelected
                    ? {
                        backgroundColor: '#0284c7',
                        borderColor: '#0284c7',
                      }
                    : {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      },
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isSelected ? '#ffffff' : colors.foreground,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Grid or Table Display */}
        {viewMode === 'grid' ? (
          <View style={styles.gridFilesContainer}>
            {filtered.map((file) => (
              <View
                key={file.id}
                style={[
                  styles.gridFileCard,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridFileIconCircle,
                    { backgroundColor: `${file.color}20` },
                  ]}
                >
                  <FileText size={22} color={file.color} />
                </View>
                <Text
                  style={[styles.gridFileName, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {file.name}
                </Text>
                <Text
                  style={[
                    styles.gridFileMeta,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {file.size}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.filesList}>
            {filtered.map((file) => (
              <View
                key={file.id}
                style={[
                  styles.fileItemRow,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.fileItemLeft}>
                  <View
                    style={[
                      styles.fileTypeBadge,
                      { backgroundColor: file.color },
                    ]}
                  >
                    <Text style={styles.fileTypeBadgeText}>{file.type}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text
                      style={[
                        styles.fileNameText,
                        { color: colors.foreground },
                      ]}
                      numberOfLines={1}
                    >
                      {file.name}
                    </Text>
                    <Text
                      style={[
                        styles.fileMetaText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {file.size} • {file.date}
                    </Text>
                  </View>
                </View>
                <Download size={14} color={colors.mutedForeground} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

// ─── 3. FILE CARD ITEM (INDIVIDUAL CARDS) ───────────────────────────────────
export function FileCardItemPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardCardsGrid}>
        {SAMPLE_FILES.slice(0, 4).map((file) => (
          <View
            key={file.id}
            style={[
              styles.individualCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.indCardTopRow}>
              <View
                style={[
                  styles.fileTypeBadge,
                  { backgroundColor: file.color },
                ]}
              >
                <Text style={styles.fileTypeBadgeText}>{file.type}</Text>
              </View>
              <Pressable hitSlop={6}>
                <MoreVertical size={14} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <View style={{ gap: 2, marginVertical: 4 }}>
              <Text
                style={[styles.cardTitle, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {file.name}
              </Text>
              <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
                {file.size} • {file.date}
              </Text>
            </View>

            <View
              style={[
                styles.indCardFooter,
                { borderTopColor: colors.border },
              ]}
            >
              <Pressable style={styles.indCardActionBtn}>
                <Eye size={12} color={colors.primary} />
                <Text style={[styles.indCardActionText, { color: colors.primary }]}>
                  Preview
                </Text>
              </Pressable>
              <Pressable style={styles.indCardActionBtn}>
                <Download size={12} color={colors.mutedForeground} />
                <Text style={[styles.indCardActionText, { color: colors.mutedForeground }]}>
                  Download
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

// ─── 4. FOLDER TREE NAVIGATION ──────────────────────────────────────────────
export function FolderTreeItemPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true,
    docs: true,
    media: false,
  })

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.previewBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Folder Hierarchy
        </Text>
        <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
          Collapsible nested folders with file counts.
        </Text>

        <View style={styles.treeContainer}>
          {/* Root */}
          <Pressable
            onPress={() => toggle('root')}
            style={styles.treeNodeRow}
          >
            {expanded.root ? (
              <ChevronDown size={14} color={colors.foreground} />
            ) : (
              <ChevronRight size={14} color={colors.foreground} />
            )}
            <FolderOpen size={16} color='#0284c7' />
            <Text style={[styles.treeNodeText, { color: colors.foreground }]}>
              Workspace Storage
            </Text>
            <View style={styles.treeCountBadge}>
              <Text style={styles.treeCountText}>12</Text>
            </View>
          </Pressable>

          {expanded.root && (
            <View style={styles.treeSubBranch}>
              {/* Level 1: Documents */}
              <Pressable
                onPress={() => toggle('docs')}
                style={styles.treeNodeRow}
              >
                {expanded.docs ? (
                  <ChevronDown size={14} color={colors.foreground} />
                ) : (
                  <ChevronRight size={14} color={colors.foreground} />
                )}
                <Folder size={15} color='#3b82f6' />
                <Text style={[styles.treeNodeText, { color: colors.foreground }]}>
                  Finance & Reports
                </Text>
                <View style={styles.treeCountBadge}>
                  <Text style={styles.treeCountText}>4</Text>
                </View>
              </Pressable>

              {expanded.docs && (
                <View style={styles.treeSubBranch}>
                  <View style={styles.treeLeafRow}>
                    <FileText size={13} color='#ef4444' />
                    <Text
                      style={[styles.treeLeafText, { color: colors.mutedForeground }]}
                    >
                      Q3_Financial_Summary.pdf
                    </Text>
                  </View>
                  <View style={styles.treeLeafRow}>
                    <FileSpreadsheet size={13} color='#10b981' />
                    <Text
                      style={[styles.treeLeafText, { color: colors.mutedForeground }]}
                    >
                      Marketing_Analytics_Export.xlsx
                    </Text>
                  </View>
                </View>
              )}

              {/* Level 1: Media */}
              <Pressable
                onPress={() => toggle('media')}
                style={styles.treeNodeRow}
              >
                {expanded.media ? (
                  <ChevronDown size={14} color={colors.foreground} />
                ) : (
                  <ChevronRight size={14} color={colors.foreground} />
                )}
                <Folder size={15} color='#f59e0b' />
                <Text style={[styles.treeNodeText, { color: colors.foreground }]}>
                  Media Assets
                </Text>
                <View style={styles.treeCountBadge}>
                  <Text style={styles.treeCountText}>8</Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

// ─── 5. FILE UPLOAD FORM & COMPOSER ─────────────────────────────────────────
export function FileUploadFormPreview() {
  const { colors, resolvedMode } = useTheme()
  const isDark = resolvedMode === 'dark'

  const [subject, setSubject] = useState('Quarterly Audit Report Attachments')
  const [progress, setProgress] = useState(78)

  return (
    <View style={styles.cardWrapper}>
      <View
        style={[
          styles.previewBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          Document Upload & Composer
        </Text>
        <Text style={[styles.cardSubtext, { color: colors.mutedForeground }]}>
          Attach documents, set subject, and track upload status.
        </Text>

        <View style={styles.composerFormGroup}>
          <Text style={[styles.inputLabel, { color: colors.foreground }]}>
            Document Subject
          </Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            style={[
              styles.textInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
          />
        </View>

        {/* Upload Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressTitleRow}>
            <Text style={[styles.progressFileName, { color: colors.foreground }]}>
              Uploading Q3_Financial_Summary.pdf
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {progress}%
            </Text>
          </View>

          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: isDark ? '#27272a' : '#f4f4f5' },
            ]}
          >
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>

        <Pressable
          style={[styles.primarySubmitBtn, { backgroundColor: '#0284c7' }]}
        >
          <UploadCloud size={15} color='#ffffff' />
          <Text style={styles.primarySubmitBtnText}>Submit & Attach Files</Text>
        </Pressable>
      </View>
    </View>
  )
}

// ─── MASTER FILES PREVIEWS EXPORT ───────────────────────────────────────────
export function FilesPreviews({ entry }: { entry?: GalleryEntry }) {
  const { colors } = useTheme()

  if (entry?.id === 'file-manager-view') {
    return <FileManagerViewPreview />
  }
  if (entry?.id === 'file-card-item') {
    return <FileCardItemPreview />
  }
  if (entry?.id === 'folder-tree-item') {
    return <FolderTreeItemPreview />
  }
  if (entry?.id === 'file-upload-form') {
    return <FileUploadFormPreview />
  }
  if (
    entry?.id === 'file-uploader-viewer' ||
    entry?.category === 'Files'
  ) {
    return <FileUploaderAndViewerPreview />
  }

  // Default overview
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <FileUploaderAndViewerPreview />
      <FileManagerViewPreview />
      <FileCardItemPreview />
      <FolderTreeItemPreview />
      <FileUploadFormPreview />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: 4,
  },
  previewBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  cardSubtext: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    marginTop: 2,
  },
  dropzoneBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dropzoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  dropzoneSub: {
    fontSize: 11,
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  filesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyJsonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  copyJsonBtnText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  copyJsonBtnTextSuccess: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
    fontFamily: 'Open Sans',
  },
  filesList: {
    gap: 8,
  },
  fileItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  fileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  fileTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  fileTypeBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Open Sans',
  },
  fileNameText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  fileMetaText: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  fileItemActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docViewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  docViewerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  closePreviewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  closePreviewBtnText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  documentSheet: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  docHeaderBar: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    paddingBottom: 8,
  },
  docHeading: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  docTimestamp: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    fontFamily: 'Open Sans',
  },
  docParagraph: {
    gap: 4,
  },
  docBodyText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Open Sans',
  },
  explorerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    borderRadius: 6,
    padding: 2,
    gap: 2,
  },
  viewToggleBtn: {
    padding: 4,
    borderRadius: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Open Sans',
    paddingVertical: 0,
  },
  categoryPillsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  gridFilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridFileCard: {
    width: '48%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  gridFileIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridFileName: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    textAlign: 'center',
  },
  gridFileMeta: {
    fontSize: 10,
    fontFamily: 'Open Sans',
  },
  cardCardsGrid: {
    gap: 10,
  },
  individualCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  indCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  indCardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  indCardActionText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  treeContainer: {
    gap: 8,
    paddingTop: 4,
  },
  treeNodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  treeNodeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Open Sans',
    flex: 1,
  },
  treeCountBadge: {
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  treeCountText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  treeSubBranch: {
    paddingLeft: 20,
    gap: 4,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(150, 150, 150, 0.2)',
    marginLeft: 6,
  },
  treeLeafRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  treeLeafText: {
    fontSize: 11,
    fontFamily: 'Open Sans',
  },
  composerFormGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  textInput: {
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 12,
    fontFamily: 'Open Sans',
  },
  progressSection: {
    gap: 6,
  },
  progressTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressFileName: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  primarySubmitBtn: {
    height: 38,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primarySubmitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
})
