/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { X, Search, FileText, ArrowRight } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function SearchOverlay({ isOpen, onClose, onSelectProduct }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filteredProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.season.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleQuickKey = (tag: string) => {
    setQuery(tag);
  };

  return (
    <div 
      id="search-overlay" 
      className="fixed inset-0 z-50 bg-black/98 text-white flex flex-col p-6 md:p-12 animate-fadeIn transition-all duration-300 select-none"
    >
      {/* Top action block */}
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full pb-8 border-b border-zinc-900">
        <span className="font-mono text-[9px] tracking-[0.25em] text-red-600 font-extrabold uppercase">
          YEOUBI CLOUD INDEX ENGINE v1.1
        </span>
        <button
          id="btn-search-overlay-close"
          onClick={onClose}
          className="p-3 border border-zinc-800 hover:border-white transition-all cursor-pointer text-zinc-400 hover:text-white"
          aria-label="Exit Search Mode"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main input search column */}
      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col justify-center py-8">
        
        <div className="relative mb-6">
          <input
            id="search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b border-zinc-800 focus:border-red-600 text-3xl md:text-5xl font-display uppercase tracking-widest py-4 focus:outline-none placeholder-zinc-800 text-white transition-all"
            placeholder="ENTER SEARCH QUERY..."
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-700 pointer-events-none" />
        </div>

        {/* Quick suggestions tags */}
        <div id="search-tags" className="flex flex-wrap gap-2 items-center text-xs pb-6">
          <span className="font-mono text-[9px] text-zinc-650 tracking-wider uppercase mr-2">QUICK CODES //</span>
          {(["HOODIE", "CARGOS", "SS25", "FW24", "SWEATER"]).map((tag) => (
            <button
              id={`search-suggestion-btn-${tag.toLowerCase()}`}
              key={tag}
              onClick={() => handleQuickKey(tag)}
              className="px-3 py-1 font-mono text-[10px] text-zinc-400 border border-zinc-900 hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              {tag}
            </button>
          ))}
          {query && (
            <button
              id="search-suggestion-clear"
              onClick={() => setQuery("")}
              className="text-[9px] font-mono text-medium text-red-600 hover:underline"
            >
              RESET FILTER
            </button>
          )}
        </div>

        {/* Results layout */}
        <div className="mt-8 flex-1 overflow-y-auto max-h-[40vh] scrollbar">
          <h3 className="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase mb-4">
            SEARCH RESULTS ({filteredProducts.length})
          </h3>

          {filteredProducts.length === 0 ? (
            <div className="text-zinc-500 font-mono text-xs py-8 uppercase">
              NO MODELS MATCHED YOUR INDEXING TERM "{query}". TRY ANOTHER SEARCH PARAMETER.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  id={`search-result-row-${product.id}`}
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center space-x-4 p-4 border border-zinc-940 hover:border-red-600 hover:bg-zinc-970 cursor-pointer bg-zinc-950 transition-all group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-12 object-cover grayscale border border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[8px] text-zinc-500 tracking-wider uppercase block select-none">
                      {product.season} COLLECTION
                    </span>
                    <h4 className="font-sans text-xs font-black tracking-wider text-white uppercase group-hover:text-red-500 transition-colors">
                      {product.name}
                    </h4>
                    <span className="font-mono text-[9px] text-zinc-400 font-bold">${product.price}.00 USD</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Grid crosshair footer decorations to matches streetwear system boards */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-zinc-900 font-mono text-[8px] text-zinc-600 tracking-widest flex justify-between">
        <span>YB_SEARCH_DAEM_LOADED</span>
        <span>SECURITY ENVELOPE: TRIPLE_RSA</span>
      </div>
    </div>
  );
}
