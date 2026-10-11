import React, { createContext, useContext, useState, useEffect } from 'react';
import { Screen, MediaAsset, Playlist, PlaylistItem, ToastItem } from '../types';
import { initialScreens, initialMediaAssets, initialPlaylists } from '../data/mockData';

interface AppContextType {
  screens: Screen[];
  mediaAssets: MediaAsset[];
  playlists: Playlist[];
  toasts: ToastItem[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Screen actions
  addScreen: (screen: Omit<Screen, 'id' | 'lastSeen' | 'status' | 'registeredDate'>) => Screen;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  deleteScreen: (id: string) => void;

  // Media actions
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'uploadDate'>) => MediaAsset;
  renameMediaAsset: (id: string, newFilename: string) => void;
  deleteMediaAsset: (id: string) => void;
  deleteMediaAssets: (ids: string[]) => void;

  // Playlist actions
  getScreenPlaylist: (screenId: string) => Playlist | undefined;
  saveScreenPlaylist: (screenId: string, items: PlaylistItem[]) => void;

  // Toast actions
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SCREENS: 'flashads_as_screens_v2',
  MEDIA: 'flashads_as_media_v2',
  PLAYLISTS: 'flashads_as_playlists_v2',
  THEME: 'flashads_as_theme_v2',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screens, setScreens] = useState<Screen[]>(() => loadStored(STORAGE_KEYS.SCREENS, initialScreens));
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => loadStored(STORAGE_KEYS.MEDIA, initialMediaAssets));
  const [playlists, setPlaylists] = useState<Playlist[]>(() => loadStored(STORAGE_KEYS.PLAYLISTS, initialPlaylists));
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SCREENS, JSON.stringify(screens)); }, [screens]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaAssets)); }, [mediaAssets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists)); }, [playlists]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Screens CRUD
  const addScreen = (screenData: Omit<Screen, 'id' | 'lastSeen' | 'status' | 'registeredDate'>): Screen => {
    const newScreen: Screen = {
      ...screenData,
      id: `scr-${Date.now()}`,
      status: 'online',
      lastSeen: 'Just now',
      registeredDate: 'Today',
      thumbnail: screenData.thumbnail || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
      defaultImageDuration: screenData.defaultImageDuration || 10,
      operatingHours: screenData.operatingHours || {
        start: '07:00',
        end: '22:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    };

    // Automatically create empty/default playlist for screen
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name: `${newScreen.name} Playlist`,
      screenId: newScreen.id,
      items: [],
      totalDuration: 0,
      updatedAt: 'Just now'
    };

    newScreen.assignedPlaylistId = newPl.id;
    newScreen.assignedPlaylistName = newPl.name;

    setScreens(prev => [newScreen, ...prev]);
    setPlaylists(prev => [...prev, newPl]);
    showToast('success', 'Screen Paired', `"${newScreen.name}" is now connected to Flash Ads.`);
    return newScreen;
  };

  const updateScreen = (id: string, updates: Partial<Screen>) => {
    setScreens(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    showToast('success', 'Screen Updated', 'Changes were saved successfully.');
  };

  const deleteScreen = (id: string) => {
    const screen = screens.find(s => s.id === id);
    setScreens(prev => prev.filter(s => s.id !== id));
    setPlaylists(prev => prev.filter(p => p.screenId !== id));
    showToast('info', 'Screen Deleted', `"${screen?.name || 'Screen'}" removed from account.`);
  };

  // Media CRUD
  const addMediaAsset = (assetData: Omit<MediaAsset, 'id' | 'uploadDate'>): MediaAsset => {
    const newAsset: MediaAsset = {
      ...assetData,
      id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      uploadDate: 'Today',
    };
    setMediaAssets(prev => [newAsset, ...prev]);
    showToast('success', 'File Uploaded', `"${newAsset.filename}" has been added to content library.`);
    return newAsset;
  };

  const renameMediaAsset = (id: string, newFilename: string) => {
    setMediaAssets(prev => prev.map(m => m.id === id ? { ...m, filename: newFilename, title: newFilename } : m));
    // Also update filename in playlists
    setPlaylists(prev => prev.map(pl => ({
      ...pl,
      items: pl.items.map(item => item.mediaAssetId === id ? { ...item, filename: newFilename } : item)
    })));
    showToast('success', 'File Renamed', `Updated to "${newFilename}".`);
  };

  const deleteMediaAsset = (id: string) => {
    const asset = mediaAssets.find(m => m.id === id);
    setMediaAssets(prev => prev.filter(m => m.id !== id));
    // Remove from all playlists
    setPlaylists(prev => prev.map(pl => {
      const remainingItems = pl.items.filter(item => item.mediaAssetId !== id);
      return {
        ...pl,
        items: remainingItems,
        totalDuration: remainingItems.reduce((acc, curr) => acc + curr.durationSeconds, 0)
      };
    }));
    showToast('info', 'Media Deleted', `"${asset?.filename || 'File'}" deleted.`);
  };

  const deleteMediaAssets = (ids: string[]) => {
    setMediaAssets(prev => prev.filter(m => !ids.includes(m.id)));
    setPlaylists(prev => prev.map(pl => {
      const remainingItems = pl.items.filter(item => !ids.includes(item.mediaAssetId));
      return {
        ...pl,
        items: remainingItems,
        totalDuration: remainingItems.reduce((acc, curr) => acc + curr.durationSeconds, 0)
      };
    }));
    showToast('info', 'Files Deleted', `Deleted ${ids.length} files from library.`);
  };

  // Playlist Management
  const getScreenPlaylist = (screenId: string): Playlist | undefined => {
    const screen = screens.find(s => s.id === screenId);
    if (!screen) return undefined;
    if (screen.assignedPlaylistId) {
      const existing = playlists.find(p => p.id === screen.assignedPlaylistId);
      if (existing) return existing;
    }
    return playlists.find(p => p.screenId === screenId);
  };

  const saveScreenPlaylist = (screenId: string, items: PlaylistItem[]) => {
    const totalDuration = items.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const existing = playlists.find(p => p.screenId === screenId);

    if (existing) {
      setPlaylists(prev => prev.map(p => p.id === existing.id ? {
        ...p,
        items,
        totalDuration,
        updatedAt: 'Just now'
      } : p));
      setScreens(prev => prev.map(s => s.id === screenId ? {
        ...s,
        assignedPlaylistId: existing.id,
        assignedPlaylistName: existing.name
      } : s));
    } else {
      const screen = screens.find(s => s.id === screenId);
      const newPl: Playlist = {
        id: `pl-${Date.now()}`,
        name: `${screen?.name || 'Screen'} Playlist`,
        screenId,
        items,
        totalDuration,
        updatedAt: 'Just now'
      };
      setPlaylists(prev => [...prev, newPl]);
      setScreens(prev => prev.map(s => s.id === screenId ? {
        ...s,
        assignedPlaylistId: newPl.id,
        assignedPlaylistName: newPl.name
      } : s));
    }

    showToast('success', 'Playlist Saved', 'Screen playlist published successfully.');
  };

  return (
    <AppContext.Provider
      value={{
        screens,
        mediaAssets,
        playlists,
        toasts,
        theme,
        toggleTheme,
        addScreen,
        updateScreen,
        deleteScreen,
        addMediaAsset,
        renameMediaAsset,
        deleteMediaAsset,
        deleteMediaAssets,
        getScreenPlaylist,
        saveScreenPlaylist,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
