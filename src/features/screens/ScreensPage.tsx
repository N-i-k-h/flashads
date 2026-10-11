import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Monitor, 
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  Tv
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PairingModal } from '../../components/dialogs/PairingModal';
import { Screen, ScreenStatus } from '../../types';

export const ScreensPage: React.FC = () => {
  const { screens, deleteScreen, updateScreen, showToast } = useApp();
  const navigate = useNavigate();

  // Controls state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'last-seen' | 'status'>('name-asc');
  
  // Dropdowns / Modals
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
  
  // Three-dot menu tracking
  const [openMenuScreenId, setOpenMenuScreenId] = useState<string | null>(null);

  // Edit Name Modal
  const [editingScreen, setEditingScreen] = useState<Screen | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Delete Confirmation Dialog
  const [deletingScreen, setDeletingScreen] = useState<Screen | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuScreenId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter & Sort
  const filteredScreens = screens
    .filter(screen => {
      // Status filter
      if (statusFilter !== 'all' && screen.status !== statusFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          screen.name.toLowerCase().includes(query) ||
          (screen.description && screen.description.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'last-seen') return a.lastSeen.localeCompare(b.lastSeen);
      return 0;
    });

  const handleOpenEdit = (screen: Screen, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuScreenId(null);
    setEditingScreen(screen);
    setEditNameValue(screen.name);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScreen || !editNameValue.trim()) return;

    updateScreen(editingScreen.id, { name: editNameValue.trim() });
    showToast('success', 'Screen Renamed', `Screen has been renamed to "${editNameValue.trim()}".`);
    setEditingScreen(null);
  };

  const handleOpenDelete = (screen: Screen, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuScreenId(null);
    setDeletingScreen(screen);
  };

  const handleConfirmDelete = () => {
    if (!deletingScreen) return;
    deleteScreen(deletingScreen.id);
    showToast('info', 'Screen Deleted', `"${deletingScreen.name}" was removed.`);
    setDeletingScreen(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Screens</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your digital signage players and active playback loops
          </p>
        </div>

        {/* Action Controls Header */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Filter Control */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                statusFilter !== 'all'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter{statusFilter !== 'all' ? `: ${statusFilter}` : ''}</span>
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-md shadow-md py-1 z-30 text-xs">
                <button
                  onClick={() => { setStatusFilter('all'); setIsFilterDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${statusFilter === 'all' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  All Statuses
                </button>
                <button
                  onClick={() => { setStatusFilter('online'); setIsFilterDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between ${statusFilter === 'online' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  <span>Online Only</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>
                <button
                  onClick={() => { setStatusFilter('offline'); setIsFilterDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center justify-between ${statusFilter === 'offline' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  <span>Offline Only</span>
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                </button>
              </div>
            )}
          </div>

          {/* Sort Control */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort</span>
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-md shadow-md py-1 z-30 text-xs">
                <button
                  onClick={() => { setSortBy('name-asc'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'name-asc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Name: A to Z
                </button>
                <button
                  onClick={() => { setSortBy('name-desc'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'name-desc' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Name: Z to A
                </button>
                <button
                  onClick={() => { setSortBy('last-seen'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'last-seen' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Recently Active
                </button>
                <button
                  onClick={() => { setSortBy('status'); setIsSortDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 ${sortBy === 'status' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  Status (Online first)
                </button>
              </div>
            )}
          </div>

          {/* Add Screen Primary Button */}
          <button
            onClick={() => setIsPairingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Screen</span>
          </button>
        </div>
      </div>

      {/* Grid of Screen Cards */}
      {filteredScreens.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-lg border border-dashed border-gray-300">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">No screens found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter to find displays.'
              : 'Add your first Flash Ads player to begin scheduling content loops.'}
          </p>
          <button
            onClick={() => setIsPairingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Screen</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredScreens.map((screen) => {
            const isOnline = screen.status === 'online';

            return (
              <div
                key={screen.id}
                onClick={() => navigate(`/screens/${screen.id}`)}
                className="group relative bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col"
              >
                {/* Screen Preview Container */}
                <div className="relative w-full aspect-video bg-gray-100 overflow-hidden border-b border-gray-100">
                  <img
                    src={screen.thumbnail}
                    alt={screen.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Status Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-medium shadow-xs">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                      }`}
                    />
                    <span className={isOnline ? 'text-emerald-700 font-semibold' : 'text-gray-600'}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Orientation Indicator */}
                  <div className="absolute bottom-2 left-2.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    {screen.orientation === 'portrait' ? (
                      <>
                        <Smartphone className="w-3 h-3" />
                        <span>Portrait</span>
                      </>
                    ) : (
                      <>
                        <Monitor className="w-3 h-3" />
                        <span>Landscape</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {screen.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {screen.description || 'Digital signage display'}
                      </p>
                    </div>

                    {/* Three-Dot Actions Menu */}
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                      ref={openMenuScreenId === screen.id ? menuRef : undefined}
                    >
                      <button
                        onClick={() => setOpenMenuScreenId(openMenuScreenId === screen.id ? null : screen.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                        aria-label="Screen options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuScreenId === screen.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20 text-xs">
                          <button
                            onClick={() => {
                              setOpenMenuScreenId(null);
                              navigate(`/screens/${screen.id}`);
                            }}
                            className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={(e) => handleOpenEdit(screen, e)}
                            className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                            <span>Edit Name</span>
                          </button>
                          <div className="border-t border-gray-100 my-0.5" />
                          <button
                            onClick={(e) => handleOpenDelete(screen, e)}
                            className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>Last seen: {screen.lastSeen}</span>
                    </span>
                    <span className="text-blue-600 font-medium group-hover:underline">
                      Manage →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pairing Modal */}
      <PairingModal
        isOpen={isPairingModalOpen}
        onClose={() => setIsPairingModalOpen(false)}
        onScreenCreated={(newId) => navigate(`/screens/${newId}`)}
      />

      {/* Edit Screen Name Modal */}
      {editingScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-full p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Edit Screen Name</h3>
            <p className="text-xs text-gray-500 mb-4">Update display identifier for this device.</p>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <input
                type="text"
                required
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingScreen(null)}
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

      {/* Delete Confirmation Modal */}
      {deletingScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-full p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Delete Screen</h3>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to unpair and remove <strong>"{deletingScreen.name}"</strong>? This will stop playback on the player.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingScreen(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
