import { Platform } from 'react-native';
import { useColor } from '../../hooks/useColor';
import Feather from '@expo/vector-icons/Feather';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

const { Icon, Label, VectorIcon } = NativeTabs.Trigger;

export default function TabsLayout() {
  const primary = useColor('primary');
  const foreground = useColor('foreground');

  return (
    <NativeTabs
      minimizeBehavior='onScrollDown'
      labelStyle={{
        default: { color: primary },
        selected: { color: foreground },
      }}
      iconColor={{
        default: primary,
        selected: foreground,
      }}
      labelVisibilityMode='labeled'
      disableTransparentOnScrollEdge={true}
    >
      <NativeTabs.Trigger name='(home)'>
        {Platform.select({
          ios: <Icon sf='square.grid.2x2.fill' />,
          android: (
            <Icon src={<VectorIcon family={Feather} name='layers' />} />
          ),
        })}
        <Label>Design System</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='settings'>
        {Platform.select({
          ios: <Icon sf='gear' />,
          android: (
            <Icon src={<VectorIcon family={Feather} name='settings' />} />
          ),
        })}
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
