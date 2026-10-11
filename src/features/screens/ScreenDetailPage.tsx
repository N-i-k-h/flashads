import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Clock, 
  Play, 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  Search, 
  Filter, 
  Upload, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Monitor, 
  Smartphone, 
  Eye, 
  Info,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen, MediaAsset, PlaylistItem, ScreenOrientation } from '../../types';

export const ScreenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    screens, 
    mediaAssets, 
    getScreenPlaylist, 
    saveScreenPlaylist, 
    updateScreen, 
    showToast 
  } = useApp();

  // Find screen
  const screen = screens.find((s) => s.id === id);

  // Active Tab: only 'content' or 'details'
  const [activeTab, setActiveTab] = useState<'content' | 'details'>('content');

  // Playlist items state
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [isSaved, setIsSaved] = useState(true);

  // Content library search & filter
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');

  // Modals
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewActiveIndex, setPreviewActiveIndex] = useState(0);

  // Settings form state
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editOrientation, setEditOrientation] = useState<ScreenOrientation>('landscape');
  const [editDefaultDuration, setEditDefaultDuration] = useState(10);

  // Operating Hours form state
  const [hoursStart, setHoursStart] = useState('07:00');
  const [hoursEnd, setHoursEnd] = useState('22:00');
  const [hoursDays, setHoursDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  // Load screen & its playlist
  useEffect(() => {
    if (screen) {
      setEditName(screen.name);
      setEditDesc(screen.description || '');
      setEditOrientation(screen.orientation);
      setEditDefaultDuration(screen.defaultImageDuration || 10);
      if (screen.operatingHours) {
        setHoursStart(screen.operatingHours.start);
        setHoursEnd(screen.operatingHours.end);
        setHoursDays(screen.operatingHours.days);
      }

      const existingPl = getScreenPlaylist(screen.id);
      if (existingPl) {
        setPlaylistItems(existingPl.items);
      }
      setIsSaved(true);
    }
  }, [screen?.id]);

  // Playlist preview auto loop
  useEffect(() => {
    if (!isPreviewModalOpen || playlistItems.length === 0) return;
    const currentItem = playlistItems[previewActiveIndex];
    const duration = (currentItem?.durationSeconds || 5) * 1000;
    const timer = setTimeout(() => {
      setPreviewActiveIndex((prev) => (prev + 1) % playlistItems.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [isPreviewModalOpen, previewActiveIndex, playlistItems]);

  if (!screen) {
    return (
      <div className="text-center py-20">
        <h2 className="text-base font-semibold text-gray-900">Screen not found</h2>
        <p className="text-xs text-gray-500 mt-1 mb-4">The screen may have been deleted.</p>
        <button
          onClick={() => navigate('/screens')}
          className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Screens
        </button>
      </div>
    );
  }

  // Filter right side media library
  const filteredLibrary = mediaAssets.filter((asset) => {
    if (mediaTypeFilter !== 'all' && asset.type !== mediaTypeFilter) return false;
    if (mediaSearch.trim()) {
      return asset.filename.toLowerCase().includes(mediaSearch.toLowerCase());
    }
    return true;
  });

  // Adding media to playlist
  const handleAddMedia = (asset: MediaAsset) => {
    const newItem: PlaylistItem = {
      id: `pli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      mediaAssetId: asset.id,
      filename: asset.filename,
      type: asset.type,
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl,
      orientation: asset.orientation,
      durationSeconds: asset.type === 'video' ? asset.durationSeconds || 15 : screen.defaultImageDuration || 10,
      order: playlistItems.length + 1,
    };
    setPlaylistItems([...playlistItems, newItem]);
    setIsSaved(false);
  };

  const handleRemovePlaylistItem = (itemId: string) => {
    setPlaylistItems(playlistItems.filter((i) => i.id !== itemId));
    setIsSaved(false);
  };

  const handleUpdateDuration = (itemId: string, duration: number) => {
    setPlaylistItems(
      playlistItems.map((item) =>
        item.id === itemId ? { ...item, durationSeconds: Math.max(1, duration) } : item
      )
    );
    setIsSaved(false);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...playlistItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setPlaylistItems(newItems);
    setIsSaved(false);
  };

  const handleSavePlaylist = () => {
    saveScreenPlaylist(screen.id, playlistItems);
    setIsSaved(true);
    showToast('success', 'Playlist Saved', `Playlist sequence with ${playlistItems.length} items saved.`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateScreen(screen.id, {
      name: editName.trim(),
      description: editDesc.trim(),
      orientation: editOrientation,
      defaultImageDuration: editDefaultDuration,
    });
    setIsSettingsModalOpen(false);
    showToast('success', 'Settings Updated', 'Display preferences updated successfully.');
  };

  const handleSaveHours = (e: React.FormEvent) => {
    e.preventDefault();
    updateScreen(screen.id, {
      operatingHours: {
        start: hoursStart,
        end: hoursEnd,
        days: hoursDays,
      },
    });
    setIsHoursModalOpen(false);
    showToast('success', 'Hours Saved', `Operating schedule set to ${hoursStart} - ${hoursEnd}.`);
  };

  const totalDuration = playlistItems.reduce((acc, item) => acc + (item.durationSeconds || 0), 0);

  // Drag and drop support
  const handleDragStart = (e: React.DragEvent, asset: MediaAsset) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(asset));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (data) {
        const asset = JSON.parse(data) as MediaAsset;
        handleAddMedia(asset);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      {/* Back button */}
      <div>
        <Link
          to="/screens"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Screens</span>
        </Link>
      </div>

      {/* Top Screen Header Banner (AbleSign Style) */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Screen Thumbnail */}
          <div className="relative w-24 h-16 rounded-md bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
            <img
              src={screen.thumbnail}
              alt={screen.name}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                screen.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">{screen.name}</h1>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  screen.status === 'online'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {screen.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-0.5">{screen.description || 'Digital signage display'}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
              <span>Last seen: <strong className="text-gray-600 font-medium">{screen.lastSeen}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {screen.orientation === 'portrait' ? (
                  <>
                    <Smartphone className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 font-medium">Portrait (9:16)</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-600 font-medium">Landscape (16:9)</span>
                  </>
                )}
              </span>
              <span>•</span>
              <span>Playlist: <strong className="text-gray-700 font-medium">{playlistItems.length} items ({totalDuration}s)</strong></span>
            </div>
          </div>
        </div>

        {/* Header Actions: Settings & Hours */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          <button
            onClick={() => setIsHoursModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Operating Hours</span>
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-gray-500" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* AbleSign Tabs: Content & Screen Details (NO WEBSITES TAB) */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'text-pink-600 border-pink-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'text-pink-600 border-pink-600 font-semibold'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            Screen Details
          </button>
        </nav>
      </div>

      {/* TAB 1: CONTENT (Two-Column Layout) */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Playlist Editor (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col min-h-[500px]">
            {/* Playlist Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Playlist</h2>
                <p className="text-xs text-gray-500">
                  {playlistItems.length} {playlistItems.length === 1 ? 'item' : 'items'} • Loop cycle: {totalDuration}s
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPreviewActiveIndex(0);
                    setIsPreviewModalOpen(true);
                  }}
                  disabled={playlistItems.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 text-blue-600 fill-current" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={handleSavePlaylist}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md shadow-xs transition-colors ${
                    !isSaved
                      ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Saved' : 'Save Changes'}</span>
                </button>
              </div>
            </div>

            {/* Playlist Drop / Items Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`flex-1 rounded-md p-2 transition-colors ${
                playlistItems.length === 0
                  ? 'border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50'
                  : 'space-y-2'
              }`}
            >
              {playlistItems.length === 0 ? (
                <div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-gray-900">Build your playlist</h4>
                  <p className="text-xs text-gray-500 max-w-xs mt-1">
                    Drag media items from the library on the right to here, or click "+" on any library card.
                  </p>
                </div>
              ) : (
                playlistItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-md shadow-2xs group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Reorder index / Grip */}
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs font-mono font-medium text-gray-500 w-4 text-center">
                          {index + 1}
                        </span>
                        <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                      </div>

                      {/* Item Thumbnail */}
                      <div className="w-12 h-9 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Filename and details */}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate max-w-[180px] sm:max-w-xs">
                          {item.filename}
                        </p>
                        <span className="text-[10px] uppercase font-semibold text-gray-400">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    {/* Controls: Duration, Up/Down, Remove */}
                    <div className="flex items-center gap-2">
                      {/* Duration Input */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <input
                          type="number"
                          min={1}
                          max={3600}
                          value={item.durationSeconds}
                          onChange={(e) => handleUpdateDuration(item.id, parseInt(e.target.value) || 5)}
                          className="w-12 text-center py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <span className="text-[11px] text-gray-400">sec</span>
                      </div>

                      {/* Up/Down buttons */}
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMoveItem(index, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveItem(index, 'down')}
                          disabled={index === playlistItems.length - 1}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => handleRemovePlaylistItem(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                        title="Remove from playlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side: Content Library (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col min-h-[500px]">
            {/* Heading */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Content Library</h2>
                <p className="text-xs text-gray-500">Click or drag media into the playlist</p>
              </div>
              <Link
                to="/content"
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <Upload className="w-3 h-3" /> Upload Media
              </Link>
            </div>

            {/* Filter and Search controls */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setMediaTypeFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    mediaTypeFilter === 'all'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMediaTypeFilter('image')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    mediaTypeFilter === 'image'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setMediaTypeFilter('video')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    mediaTypeFilter === 'video'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Videos
                </button>
              </div>
            </div>

            {/* Vertical media list */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[460px] pr-1">
              {filteredLibrary.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400">
                  No matching media found
                </div>
              ) : (
                filteredLibrary.map((asset) => (
                  <div
                    key={asset.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, asset)}
                    onClick={() => handleAddMedia(asset)}
                    className="flex items-center justify-between p-2 rounded-md border border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-9 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        <img
                          src={asset.thumbnailUrl}
                          alt={asset.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[150px] sm:max-w-[180px]">
                          {asset.filename}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {asset.type.toUpperCase()} • {asset.uploadDate}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMedia(asset);
                      }}
                      className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Add to playlist"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCREEN DETAILS (NO WEBSITES TAB) */}
      {activeTab === 'details' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">Screen Information</h2>
              <p className="text-xs text-gray-500">Hardware parameters, registration date, and assignment</p>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors"
            >
              Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="block text-gray-400 font-medium">Screen Name</span>
              <span className="text-sm font-semibold text-gray-900">{screen.name}</span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Description</span>
              <span className="text-gray-700">{screen.description || 'None provided'}</span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Device Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    screen.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                />
                <span className="font-semibold text-gray-800 capitalize">{screen.status}</span>
              </div>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Orientation</span>
              <span className="font-medium text-gray-800 capitalize">
                {screen.orientation} ({screen.orientation === 'landscape' ? '16:9' : '9:16'})
              </span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Resolution</span>
              <span className="font-mono text-gray-700">{screen.resolution || '1920 x 1080'}</span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Registered Date</span>
              <span className="text-gray-700">{screen.registeredDate}</span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Last Seen Online</span>
              <span className="text-gray-700">{screen.lastSeen}</span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Active Playlist</span>
              <span className="text-gray-800 font-semibold">{screen.assignedPlaylistName || 'Assigned Screen Playlist'}</span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Default Image Duration</span>
              <span className="text-gray-700">{screen.defaultImageDuration || 10} seconds</span>
            </div>

            <div>
              <span className="block text-gray-400 font-medium">Operating Hours Schedule</span>
              <span className="text-gray-700">
                {screen.operatingHours
                  ? `${screen.operatingHours.start} - ${screen.operatingHours.end} (${screen.operatingHours.days.join(', ')})`
                  : 'All day (24/7)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Screen Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-bold text-gray-900">Screen Settings</h3>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Screen Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Orientation</label>
                <select
                  value={editOrientation}
                  onChange={(e) => setEditOrientation(e.target.value as ScreenOrientation)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="landscape">Landscape (Horizontal 16:9)</option>
                  <option value="portrait">Portrait (Vertical 9:16)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Default Image Duration (seconds)</label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={editDefaultDuration}
                  onChange={(e) => setEditDefaultDuration(parseInt(e.target.value) || 10)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Operating Hours Modal */}
      {isHoursModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">Operating Hours</h3>
              </div>
              <button
                onClick={() => setIsHoursModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHours} className="space-y-4 text-xs">
              <p className="text-gray-500">
                Set when this display player turns on and turns off to conserve power and schedule broadcasts.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Time (Turn On)</label>
                  <input
                    type="time"
                    value={hoursStart}
                    onChange={(e) => setHoursStart(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">End Time (Turn Off)</label>
                  <input
                    type="time"
                    value={hoursEnd}
                    onChange={(e) => setHoursEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">Active Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isSelected = hoursDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => {
                          if (isSelected) {
                            setHoursDays(hoursDays.filter((d) => d !== day));
                          } else {
                            setHoursDays([...hoursDays, day]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsHoursModalOpen(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Playlist Loop Player Modal Preview */}
      {isPreviewModalOpen && playlistItems.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black text-white rounded-lg overflow-hidden max-w-4xl w-full flex flex-col border border-gray-800 shadow-2xl">
            {/* Player Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400 fill-current" />
                <span className="text-xs font-semibold text-gray-200">
                  Live Player Simulation — {screen.name}
                </span>
                <span className="text-[11px] text-gray-400">
                  (Item {previewActiveIndex + 1} of {playlistItems.length}: {playlistItems[previewActiveIndex]?.filename})
                </span>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display Canvas */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {playlistItems[previewActiveIndex]?.type === 'video' ? (
                <video
                  src={playlistItems[previewActiveIndex]?.url}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={playlistItems[previewActiveIndex]?.url}
                  alt={playlistItems[previewActiveIndex]?.filename}
                  className="w-full h-full object-contain animate-in fade-in duration-500"
                />
              )}

              {/* Player Overlay Tag */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded text-xs text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Now Playing: {playlistItems[previewActiveIndex]?.filename}</span>
                <span className="text-gray-400">• {playlistItems[previewActiveIndex]?.durationSeconds}s</span>
              </div>
            </div>

            {/* Timeline thumbnails */}
            <div className="p-3 bg-gray-900 flex items-center gap-2 overflow-x-auto border-t border-gray-800">
              {playlistItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setPreviewActiveIndex(idx)}
                  className={`w-16 h-10 rounded overflow-hidden shrink-0 border-2 transition-all ${
                    previewActiveIndex === idx
                      ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={item.thumbnailUrl} alt={item.filename} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
