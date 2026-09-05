import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Copy, Check, FileCode } from 'lucide-react-native';
import { ComponentItem } from '@/components/design-system/registry';

interface CodePanelProps {
  component: ComponentItem;
  isDark?: boolean;
}

export function CodePanel({ component }: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const snippet =
    component.codeSnippet ||
    `import { ${component.name.split(' ')[0]} } from '@/components/ui/${component.file.replace('.tsx', '')}';

export function Example() {
  return <${component.name.split(' ')[0]} />;
}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = snippet.split('\n');

  return (
    <View
      style={{
        width: '100%',
        maxWidth: 780,
        backgroundColor: '#121316',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#27272a',
        overflow: 'hidden',
      }}
    >
      {/* Code Header Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: '#18191d',
          borderBottomWidth: 1,
          borderBottomColor: '#27272a',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Mac window dots */}
          <View style={{ flexDirection: 'row', gap: 6, marginRight: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' }} />
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#f59e0b' }} />
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981' }} />
          </View>
          <FileCode size={14} color="#a1a1aa" />
          <Text
            style={{
              fontSize: 12,
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              color: '#d4d4d8',
              fontWeight: '500',
            }}
          >
            components/ui/{component.file}
          </Text>
        </View>

        {/* Copy Button */}
        <TouchableOpacity
          onPress={handleCopy}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            height: 28,
            paddingHorizontal: 10,
            borderRadius: 6,
            backgroundColor: copied ? '#065f46' : '#27272a',
            borderWidth: 1,
            borderColor: copied ? '#059669' : '#3f3f46',
          }}
        >
          {copied ? <Check size={13} color="#6ee7b7" /> : <Copy size={13} color="#a1a1aa" />}
          <Text style={{ fontSize: 12, fontWeight: '500', color: copied ? '#6ee7b7' : '#e4e4e7' }}>
            {copied ? 'Copied!' : 'Copy Code'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Code Body with Line Numbers */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        style={{ padding: 16 }}
      >
        <View style={{ flexDirection: 'row' }}>
          {/* Line Numbers */}
          <View
            style={{
              paddingRight: 16,
              borderRightWidth: 1,
              borderRightColor: '#27272a',
              marginRight: 16,
            }}
          >
            {lines.map((_, i) => (
              <Text
                key={i}
                style={{
                  fontSize: 13,
                  lineHeight: 22,
                  fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                  color: '#52525b',
                  textAlign: 'right',
                }}
              >
                {i + 1}
              </Text>
            ))}
          </View>

          {/* Code Content */}
          <Text
            style={{
              fontSize: 13,
              lineHeight: 22,
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
              color: '#e4e4e7',
            }}
          >
            {snippet}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
