import React, { useState } from 'react';
import { X, Tv, ArrowRight, CheckCircle2, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScreenOrientation } from '../../types';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScreenCreated?: (screenId: string) => void;
}

export const PairingModal: React.FC<PairingModalProps> = ({ isOpen, onClose, onScreenCreated }) => {
  const { addScreen, showToast } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [pairingCode, setPairingCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Step 2 details
  const [screenName, setScreenName] = useState('');
  const [description, setDescription] = useState('');
  const [orientation, setOrientation] = useState<ScreenOrientation>('landscape');

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setPairingCode('');
    setCodeError('');
    setScreenName('');
    setDescription('');
    setOrientation('landscape');
    onClose();
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = pairingCode.trim().toUpperCase();

    if (!cleanCode) {
      setCodeError('Please enter the 6-character pairing code shown on your screen.');
      return;
    }

    if (cleanCode.length < 5) {
      setCodeError('Pairing code must be at least 5-6 characters.');
      return;
    }

    setIsValidating(true);
    setCodeError('');

    // Simulate instant validation (accept any 5-6 char code or known demo codes like FLASH1, ABLE24, DEMO01)
    setTimeout(() => {
      setIsValidating(false);
      setScreenName(`Screen ${cleanCode}`);
      setStep(2);
    }, 450);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenName.trim()) {
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
    ];
    const randomThumb = defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const created = addScreen({
      name: screenName.trim(),
      description: description.trim() || 'Connected digital signage display player',
      orientation,
      thumbnail: randomThumb,
      resolution: orientation === 'landscape' ? '1920 x 1080' : '1080 x 1920',
      defaultImageDuration: 10,
    });

    showToast('success', 'Screen Paired Successfully', `"${screenName}" has been paired and is ready.`);
    handleClose();
    if (onScreenCreated) {
      onScreenCreated(created.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {step === 1 ? 'Add New Screen' : 'Configure Display Settings'}
              </h3>
              <p className="text-xs text-gray-500">
                {step === 1 ? 'Step 1 of 2: Device Pairing' : 'Step 2 of 2: Screen Details'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 1 ? (
          <form onSubmit={handleCodeSubmit} className="p-6 space-y-5">
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-xs text-gray-600 space-y-2">
              <p className="font-semibold text-gray-900 text-sm">How to pair a player:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>Install and launch the <span className="font-medium text-gray-900">Flash Ads Player</span> app on your smart display, Fire TV, Raspberry Pi, or Android box.</li>
                <li>Your display screen will present a unique <span className="font-semibold text-blue-600">6-character pairing code</span>.</li>
                <li>Enter that pairing code in the field below to connect it to your account.</li>
              </ol>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Pairing Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. FLASH1 or ABLE24"
                  value={pairingCode}
                  onChange={(e) => {
                    setPairingCode(e.target.value.toUpperCase());
                    setCodeError('');
                  }}
                  className={`w-full px-4 py-2.5 text-center text-lg font-mono tracking-widest uppercase border rounded-md focus:outline-none focus:ring-2 ${
                    codeError
                      ? 'border-red-400 focus:ring-red-400 text-red-900'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  autoFocus
                />
              </div>

              {codeError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{codeError}</span>
                </div>
              )}

              <p className="text-[11px] text-gray-400 mt-2">
                Demo hint: Enter any 5-6 alphanumeric code (e.g., <button type="button" onClick={() => setPairingCode('DEMO99')} className="text-blue-600 underline">DEMO99</button>) to test pairing.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isValidating}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs disabled:opacity-50"
              >
                {isValidating ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleFinalSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-md text-xs border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Player verified with pairing code <strong>{pairingCode}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Screen Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Reception Lobby Screen"
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ground floor entrance waiting area"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Screen Orientation
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-md text-xs font-medium transition-colors ${
                    orientation === 'landscape'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Landscape (16:9)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`flex items-center justify-center gap-2 p-3 border rounded-md text-xs font-medium transition-colors ${
                    orientation === 'portrait'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Portrait (9:16)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
              >
                Back
              </button>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
                >
                  Complete Pairing
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
