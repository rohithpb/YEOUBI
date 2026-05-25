/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { LookbookItem } from "../types";

interface LookbookLightboxProps {
  item: LookbookItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function LookbookLightbox({ item, onClose, onNext, onPrev }: LookbookLightboxProps) {
  if (!item) return null;

  return (
    <div 
      id="lightbox-overlay" 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all duration-300 select-none animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="lightbox-box"
        className="w-full max-w-4xl relative flex flex-col md:flex-row bg-black border border-zinc-850"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close indicator */}
        <button
          id="btn-lightbox-close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all bg-black/80 cursor-pointer"
          aria-label="Close Lightbox"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Carousel arrows */}
        <button
          id="btn-lightbox-prev"
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-zinc-830 hover:border-white text-white z-10 transition-all cursor-pointer"
          aria-label="Previous Photo"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          id="btn-lightbox-next"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-zinc-830 hover:border-white text-white z-10 transition-all cursor-pointer"
          aria-label="Next Photo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* LHS: Media Column */}
        <div className="w-full md:w-2/3 bg-zinc-950 flex items-center justify-center relative aspect-[3/4]">
          <img
            src={item.url}
            alt={item.outfit}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale object-center select-none"
          />
          <div className="absolute top-4 left-4 bg-black/90 px-3 py-1 text-[9px] font-mono tracking-[0.2em] border border-zinc-850 text-white leading-none">
            REEL_CODE // B&W STREET_SENS9
          </div>
        </div>

        {/* RHS: Metadata panel info */}
        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between bg-black text-white">
          <div className="space-y-4">
            <div className="flex items-center space-x-1 font-mono text-[9px] tracking-widest text-red-500 font-extrabold uppercase select-none">
              <Compass className="h-4 w-4" />
              <span>GEOLOCATION SYNC</span>
            </div>

            <div className="space-y-1 border-b border-zinc-900 pb-4">
              <span className="font-mono text-[9px] text-zinc-550 block uppercase leading-none">LOCATION CODE //</span>
              <h4 id="lightbox-location" className="font-sans text-xs font-bold tracking-wider text-white uppercase leading-normal">
                {item.location}
              </h4>
            </div>

            <div className="space-y-1 border-b border-zinc-900 pb-4">
              <span className="font-mono text-[9px] text-zinc-550 block uppercase leading-none">OUTFIT DECK //</span>
              <p id="lightbox-outfit" className="font-sans text-xs font-bold text-red-500 tracking-wider uppercase leading-normal">
                {item.outfit}
              </p>
            </div>

            <div className="pt-2">
              <span className="font-mono text-[9px] text-zinc-550 block uppercase mb-1">SYSTEM SPECIFICATIONS //</span>
              <ul className="space-y-1 text-[9px] font-mono text-zinc-400 uppercase leading-relaxed">
                <li>• CAMERA: LEICA M6 MONOCHROM RAW</li>
                <li>• SILHOUETTE: OVERSIZED BOUTIQUE</li>
                <li>• PRODUCTION: IN-SITU ARCHIVE DISPATCH</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 font-mono text-[8px] text-zinc-600 tracking-widest flex justify-between items-center select-none border-t border-zinc-900">
            <span>INDEX: {item.id} / LOOK_4</span>
            <span>YEOUBI SS25</span>
          </div>

        </div>

      </div>
    </div>
  );
}
