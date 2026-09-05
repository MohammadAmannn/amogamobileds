export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type PlatformOS = 'ios' | 'android';

export type NotchType = 'island' | 'notch' | 'punch-hole' | 'none';

export interface DeviceConfig {
  id: string;
  name: string;
  platform: PlatformOS;
  type: 'mobile' | 'tablet';
  width: number;
  height: number;
  borderRadius: number;
  bezel: number;
  notchType: NotchType;
  islandWidth?: number;
  islandHeight?: number;
  homeBar?: boolean;
}

export type ViewMode = 'preview' | 'code' | 'fullscreen';
