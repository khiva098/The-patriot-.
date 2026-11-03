import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running in standalone mode on home screen, do not show
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label="Install THE PATRIOT app"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer shadow-xs whitespace-nowrap"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {/* Installation Instruction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-stone-100">
                  Install THE PATRIOT App
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Install <strong>THE PATRIOT</strong> as a standalone application on your mobile device or computer for instant offline access and reading without browser clutter.
            </p>

            {isIOS ? (
              <div className="space-y-3 bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900/40 text-xs text-slate-800 dark:text-stone-200">
                <div className="flex items-start gap-2.5">
                  <Share className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>1. In Safari, tap the <strong>Share</strong> button at the bottom of the screen.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <PlusSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>2. Scroll down and select <strong>Add to Home Screen</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 bg-stone-50 dark:bg-slate-800/50 p-4 rounded-lg border border-stone-200 dark:border-slate-700 text-xs text-stone-700 dark:text-stone-300">
                <p>
                  <strong>Desktop (Chrome, Edge):</strong> Click the <strong>Install</strong> icon in the right side of the address bar, or click Menu (⋮) → <em>Install THE PATRIOT</em>.
                </p>
                <p className="pt-1">
                  <strong>Android:</strong> Tap the browser menu (⋮) → <em>Install app</em> or <em>Add to Home screen</em>.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
