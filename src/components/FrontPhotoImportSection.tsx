import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
  Camera,
  Star,
  FileCheck,
} from 'lucide-react';

export interface FrontPhotoData {
  url: string;
  caption?: string;
  credit?: string;
  isFrontPageFeatured?: boolean;
}

interface FrontPhotoImportSectionProps {
  publicationType: 'article' | 'research' | 'ebook';
  currentPhotoUrl?: string;
  currentCaption?: string;
  currentCredit?: string;
  isFrontPageFeatured?: boolean;
  onPhotoChanged: (data: FrontPhotoData) => void;
  presetImages?: Array<{ label: string; url: string }>;
}

export const FrontPhotoImportSection: React.FC<FrontPhotoImportSectionProps> = ({
  publicationType,
  currentPhotoUrl = '',
  currentCaption = '',
  currentCredit = '',
  isFrontPageFeatured = false,
  onPhotoChanged,
  presetImages = [
    { label: 'Diplomacy & Treaties', url: '/src/assets/images/patriot_hero_diplomacy_1792591089041.jpg' },
    { label: 'Cyber & Technology', url: '/src/assets/images/patriot_editorial_technology_1792591090748.jpg' },
    { label: 'Quantum & Physics', url: '/src/assets/images/patriot_research_quantum_1792591090584.jpg' },
    { label: 'Economic History', url: '/src/assets/images/patriot_book_economic_history_1792591091807.jpg' },
  ],
}) => {
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl);
  const [caption, setCaption] = useState(currentCaption);
  const [credit, setCredit] = useState(currentCredit);
  const [featured, setFeatured] = useState(isFrontPageFeatured);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const [importedFileSize, setImportedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setImportedFileName(file.name);
    setImportedFileSize(`${sizeInMb} MB`);

    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      if (result) {
        setPhotoUrl(result);
        const updatedCredit = credit || 'Uploaded Photo Desk File';
        onPhotoChanged({
          url: result,
          caption,
          credit: updatedCredit,
          isFrontPageFeatured: featured,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const updateField = (
    field: 'url' | 'caption' | 'credit' | 'featured',
    value: any
  ) => {
    let nextUrl = photoUrl;
    let nextCaption = caption;
    let nextCredit = credit;
    let nextFeatured = featured;

    if (field === 'url') {
      nextUrl = value;
      setPhotoUrl(value);
      setImportedFileName(null);
    } else if (field === 'caption') {
      nextCaption = value;
      setCaption(value);
    } else if (field === 'credit') {
      nextCredit = value;
      setCredit(value);
    } else if (field === 'featured') {
      nextFeatured = value;
      setFeatured(value);
    }

    onPhotoChanged({
      url: nextUrl,
      caption: nextCaption,
      credit: nextCredit,
      isFrontPageFeatured: nextFeatured,
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-4">
      {/* Header and Front Page Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/70 dark:border-amber-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-slate-900 dark:text-stone-100">
                Front Picture & Visual Wire Package
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-mono font-semibold">
                Manual Import
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Import a high-resolution front cover image to showcase this {publicationType} on the front page.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 shadow-xs">
          <input
            type="checkbox"
            checked={featured}
            onChange={e => updateField('featured', e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Feature on Front Page Hero</span>
          </span>
        </label>
      </div>

      {/* Manual File Import Upload Zone */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Import Front Picture File from Device
        </label>
        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-100/40 dark:bg-amber-950/40'
              : 'border-amber-300 dark:border-amber-800 hover:border-amber-500 bg-white dark:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Click to browse or drag & drop high-resolution front picture
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                PNG, JPG, WEBP, or SVG (Recommended 16:9 or 3:2 aspect ratio)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview & Details Card (if photo selected/imported) */}
      {photoUrl && (
        <div className="p-3 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
          <div className="relative w-28 h-18 sm:w-32 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-stone-200 dark:border-slate-700">
            <img src={photoUrl} alt="Front Preview" className="w-full h-full object-cover" />
            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-slate-950/80 rounded text-[9px] text-amber-300 font-mono font-bold">
              PREVIEW
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{importedFileName || 'Front Picture Attached'}</span>
            </div>
            {importedFileSize && (
              <span className="text-[10px] text-stone-400 font-mono block">{importedFileSize}</span>
            )}
            <p className="text-[11px] text-stone-600 dark:text-stone-300 truncate mt-1">
              Credit: {credit || 'Editorial Wire'}
            </p>
            {caption && (
              <p className="text-[10px] text-stone-500 dark:text-stone-400 italic truncate">
                Caption: "{caption}"
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setPhotoUrl('');
              setImportedFileName(null);
              setImportedFileSize(null);
              updateField('url', '');
            }}
            className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer self-start sm:self-center"
            title="Remove imported picture"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preset Picture Selector (alternative quick picks) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
            Or Select From Editorial Archive Presets
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presetImages.map(preset => (
            <button
              key={preset.url}
              type="button"
              onClick={() => updateField('url', preset.url)}
              className={`relative aspect-16/9 rounded-lg overflow-hidden border-2 text-left cursor-pointer transition-all ${
                photoUrl === preset.url
                  ? 'border-amber-600 ring-2 ring-amber-600/30'
                  : 'border-stone-200 dark:border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-[9px] text-white p-1 truncate text-center font-medium">
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Photo Wire Attribution & Caption Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Photo Wire Attribution / Credit
          </label>
          <input
            type="text"
            value={credit}
            onChange={e => updateField('credit', e.target.value)}
            placeholder="e.g. Reuters / The Patriot Photo Desk / AP"
            className="w-full p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Front Page Photo Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={e => updateField('caption', e.target.value)}
            placeholder="Descriptive caption explaining the photo on the front page..."
            className="w-full p-2 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default FrontPhotoImportSection;
