import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckSquare, 
  Square, 
  X, 
  Film, 
  Image as ImageIcon, 
  Check, 
  Clock, 
  AlertCircle,
  FileCheck,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaAsset, MediaType, ScreenOrientation } from '../../types';

export const ContentPage: React.FC = () => {
  const { 
    mediaAssets, 
    addMediaAsset, 
    renameMediaAsset, 
    deleteMediaAsset, 
    deleteMediaAssets, 
    showToast 
  } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'name-asc' | 'name-desc' | 'size-desc'>('date-desc');

  // Multi-selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dropdowns
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [renamingAsset, setRenamingAsset] = useState<MediaAsset | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingAsset, setDeletingAsset] = useState<MediaAsset | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Upload modal state
  const [dragOverUpload, setDragOverUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter & Sort Assets
  const filteredAssets = mediaAssets
    .filter((asset) => {
      if (typeFilter !== 'all' && asset.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        return asset.filename.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.filename.localeCompare(b.filename);
      if (sortBy === 'name-desc') return b.filename.localeCompare(a.filename);
      if (sortBy === 'size-desc') return (b.sizeBytes || 0) - (a.sizeBytes || 0);
      return b.id.localeCompare(a.id); // date-desc fallback
    });

  // Bulk Selection Handlers
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAssets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAssets.map((a) => a.id));
    }
  };

  const handleBulkDelete = () => {
    deleteMediaAssets(selectedIds);
    showToast('info', 'Items Deleted', `${selectedIds.length} media assets were removed.`);
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  // Upload Logic with real preview conversion
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Supported formats
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setUploadError('Unsupported format. Please upload an image (PNG, JPG, WebP) or video (MP4, WebM).');
      return;
    }

    setUploadError(null);
    setUploadProgress(10);

    // Simulate progress while reading file
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultDataUrl = e.target?.result as string;
      setUploadProgress(70);

      setTimeout(() => {
        setUploadProgress(100);

        setTimeout(() => {
          addMediaAsset({
            filename: file.name,
            title: file.name.replace(/\.[^/.]+$/, ''),
            type: isImage ? 'image' : 'video',
            url: resultDataUrl,
            thumbnailUrl: resultDataUrl,
            orientation: 'landscape',
            durationSeconds: isVideo ? 15 : 10,
            sizeBytes: file.size,
            resolution: '1920 x 1080',
          });

          showToast('success', 'File Uploaded', `"${file.name}" has been added to your content library.`);
          setUploadProgress(null);
          setIsUploadModalOpen(false);
        }, 300);
      }, 350);
    };

    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setUploadProgress(null);
    };

    reader.readAsDataURL(file);
  };

  // Rename Handler
  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingAsset || !renameValue.trim()) return;

    renameMediaAsset(renamingAsset.id, renameValue.trim());
    showToast('success', 'File Renamed', `Renamed to "${renameValue.trim()}".`);
    setRenamingAsset(null);
  };

  // Single Delete Handler
  const handleConfirmSingleDelete = () => {
    if (!deletingAsset) return;
    deleteMediaAsset(deletingAsset.id);
    showToast('info', 'Media Deleted', `"${deletingAsset.filename}" has been deleted.`);
    setDeletingAsset(null);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '1.2 MB';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Content Library</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Store and manage images and video media for all digital signage screens
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search filenames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                typeFilter !== 'all'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter{typeFilter !== 'all' ? `: ${typeFilter}` : ''}</span>
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-200 rounded-md shadow-md py-1 z-30 text-xs">
                <button
                  onClick={() => { setTypeFilter('all'); setIsFilterOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${typeFilter === 'all' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  All Types
                </button>
                <button
                  onClick={() => { setTypeFilter('image'); setIsFilterOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${typeFilter === 'image' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Images only
                </button>
                <button
                  onClick={() => { setTypeFilter('video'); setIsFilterOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${typeFilter === 'video' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Videos only
                </button>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort</span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-md shadow-md py-1 z-30 text-xs">
                <button
                  onClick={() => { setSortBy('date-desc'); setIsSortOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'date-desc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Newest Uploads
                </button>
                <button
                  onClick={() => { setSortBy('name-asc'); setIsSortOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'name-asc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Name: A to Z
                </button>
                <button
                  onClick={() => { setSortBy('name-desc'); setIsSortOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'name-desc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Name: Z to A
                </button>
                <button
                  onClick={() => { setSortBy('size-desc'); setIsSortOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'size-desc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  File Size (Largest)
                </button>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* Multi-Select Toolbar if items are selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedIds.length}</span>
            <span>files selected</span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-blue-700 underline ml-2 hover:text-blue-900"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Media Cards Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-lg border border-dashed border-gray-300">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No media found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || typeFilter !== 'all'
              ? 'Try adjusting your search filters to find content.'
              : 'Upload your posters, promos, menu items, or video loops to start building playlists.'}
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
        </div>
      ) : (
        <div>
          {/* Select all toggle indicator */}
          <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
            <button
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 hover:text-gray-800"
            >
              {selectedIds.length === filteredAssets.length ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>Select all ({filteredAssets.length})</span>
            </button>
            <span>Showing {filteredAssets.length} assets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredAssets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);

              return (
                <div
                  key={asset.id}
                  onClick={() => setPreviewAsset(asset)}
                  className={`group relative bg-white border rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Thumbnail area */}
                  <div className="relative w-full aspect-video bg-gray-100 overflow-hidden border-b border-gray-100">
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.filename}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Checkbox button top-left */}
                    <button
                      onClick={(e) => handleToggleSelect(asset.id, e)}
                      className="absolute top-2 left-2 p-1 rounded bg-white/90 backdrop-blur-xs text-gray-600 hover:text-blue-600 transition-colors shadow-xs"
                      aria-label="Select file"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </button>

                    {/* Media Type & Duration badge top-right */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      {asset.type === 'video' ? (
                        <>
                          <Film className="w-3 h-3 text-amber-400" />
                          <span>{asset.durationSeconds || 15}s</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3 text-blue-400" />
                          <span>IMAGE</span>
                        </>
                      )}
                    </div>

                    {/* Hover preview trigger overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="bg-white/90 text-gray-900 text-xs font-medium px-2.5 py-1 rounded shadow-sm flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" /> Preview
                      </span>
                    </div>
                  </div>

                  {/* Card Info Area */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-semibold text-gray-900 truncate" title={asset.filename}>
                          {asset.filename}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                          {asset.resolution || '1920 x 1080'} • {formatFileSize(asset.sizeBytes)}
                        </p>
                      </div>

                      {/* Three-dot dropdown menu */}
                      <div
                        className="relative shrink-0"
                        onClick={(e) => e.stopPropagation()}
                        ref={activeMenuId === asset.id ? menuRef : undefined}
                      >
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === asset.id ? null : asset.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                          aria-label="Media options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === asset.id && (
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20 text-xs">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setPreviewAsset(asset);
                              }}
                              className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-400" />
                              <span>Preview</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setRenamingAsset(asset);
                                setRenameValue(asset.filename);
                              }}
                              className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                              <span>Rename</span>
                            </button>
                            <div className="border-t border-gray-100 my-0.5" />
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setDeletingAsset(asset);
                              }}
                              className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload date */}
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Uploaded {asset.uploadDate}</span>
                      <span className="text-gray-500 font-medium capitalize">{asset.orientation}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Modal (Drag-and-Drop & File Picker) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-bold text-gray-900">Upload Media Content</h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadError(null);
                  setUploadProgress(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drop area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverUpload(true);
              }}
              onDragLeave={() => setDragOverUpload(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverUpload(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragOverUpload
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-800">
                Click to browse or drop your files here
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Supports PNG, JPG, GIF, WebP, MP4, and WebM (up to 100MB)
              </p>
            </div>

            {/* Upload progress indicator */}
            {uploadProgress !== null && (
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Validation error */}
            {uploadError && (
              <div className="flex items-center gap-2 mt-3 text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadError(null);
                  setUploadProgress(null);
                }}
                className="px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Fullscreen Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black text-white rounded-lg overflow-hidden max-w-4xl w-full flex flex-col border border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-gray-200 truncate">{previewAsset.filename}</h3>
                <p className="text-[11px] text-gray-400">
                  {previewAsset.type.toUpperCase()} • {previewAsset.resolution || '1920 x 1080'} • {previewAsset.uploadDate}
                </p>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {previewAsset.type === 'video' ? (
                <video
                  src={previewAsset.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.filename}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rename File Modal */}
      {renamingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-full p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Rename Media File</h3>
            <p className="text-xs text-gray-500 mb-4">Enter a new filename for this asset.</p>
            <form onSubmit={handleSaveRename} className="space-y-4">
              <input
                type="text"
                required
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenamingAsset(null)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Single Item Modal */}
      {deletingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-full p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Delete Media File</h3>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to delete <strong>"{deletingAsset.filename}"</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingAsset(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-full p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Delete Selected Files</h3>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to delete <strong>{selectedIds.length}</strong> selected media files? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete {selectedIds.length} Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
