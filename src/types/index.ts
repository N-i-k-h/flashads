export type ScreenOrientation = 'landscape' | 'portrait';
export type ScreenStatus = 'online' | 'offline';
export type MediaType = 'image' | 'video';

export interface OperatingHours {
  start: string;
  end: string;
  days: string[];
}

export interface Screen {
  id: string;
  name: string;
  description?: string;
  orientation: ScreenOrientation;
  status: ScreenStatus;
  lastSeen: string;
  registeredDate: string;
  thumbnail: string;
  resolution?: string;
  assignedPlaylistId?: string;
  assignedPlaylistName?: string;
  defaultImageDuration?: number;
  operatingHours?: OperatingHours;
}

export interface MediaAsset {
  id: string;
  filename: string;
  title?: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  orientation: ScreenOrientation;
  durationSeconds?: number;
  sizeBytes: number;
  uploadDate: string;
  resolution?: string;
}

export interface PlaylistItem {
  id: string;
  mediaAssetId: string;
  filename: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  orientation: ScreenOrientation;
  durationSeconds: number;
  order: number;
}

export interface Playlist {
  id: string;
  name: string;
  screenId?: string;
  items: PlaylistItem[];
  totalDuration: number;
  updatedAt: string;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status: string;
  avatar: string;
  lastActive?: string;
}

