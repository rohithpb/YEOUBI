/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { X, Check, ShoppingBag, Terminal, Heart } from "lucide-react";
import { Product } from "../types";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: "S" | "M" | "L" | "XL", qty: number) => void;
}

export default function ProductQuickView({ product, onClose, onAddToCart }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Reset states when the product shifts
  useEffect(() => {
    if (product) {
      setSelectedSize("M");
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  if (!product) return null;

  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrease = () => quantity < 10 && setQuantity(quantity + 1);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 2000);
  };

  // Stock status dynamic simulations depending on the selected size
  const getStockStatus = (size: string) => {
    if (size === "S") return { text: "LOW STOCK — 3 ITEMS LEFT", color: "text-amber-500", rawTerm: "ERR_STOCK_CRIT" };
    if (size === "XL") return { text: "RESTOCK PRE-ORDER STATUS", color: "text-red-500", rawTerm: "BACKORDER" };
    return { text: "IN STOCK — NEXT DAY URBAN DISPATCH", color: "text-green-600", rawTerm: "SYS_OK" };
  };

  const currentStock = getStockStatus(selectedSize);

  return (
    <div 
      id="quick-view-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-subtle transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        id="quick-view-container"
        className="relative w-full max-w-4xl bg-white text-black shadow-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh] flex flex-col md:flex-row border border-black"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Absolute red crosshairs */}
        <div className="absolute top-2 left-2 text-red-600 font-mono text-[9px] select-none opacity-40">✛ YB-GRID</div>
        <div className="absolute bottom-2 right-2 text-red-600 font-mono text-[9px] select-none opacity-40">✛ SS25_REF</div>

        {/* Close trigger button */}
        <button
          id="btn-quickview-close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white border border-black p-2 text-black hover:bg-black hover:text-white transition-all duration-150 cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* LHS: Image representation and technical label */}
        <div className="w-full md:w-1/2 bg-zinc-100 flex flex-col relative border-b md:border-b-0 md:border-r border-black select-none">
          {product.badge && (
            <span className="absolute left-4 top-4 bg-red-600 text-white font-sans text-[10px] font-extrabold tracking-[0.25em] py-1 px-3">
              {product.badge}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale aspect-[4/5] object-center mix-blend-multiply"
          />
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center bg-black/90 backdrop-blur-md px-3 py-1 text-white font-digital text-[10px] tracking-widest leading-relaxed">
            <span>SPEC_SYS: REF-00{product.id.length}</span>
            <span>SATURATION_LVL: 0%</span>
          </div>
        </div>

        {/* RHS: Interactive checkout and descriptors */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Season Tag */}
            <div className="flex items-center space-x-2 font-mono text-[10px] tracking-widest text-zinc-500 font-semibold mb-1">
              <span>{product.season} COLLECTION</span>
              <span>·</span>
              <span className="text-red-600">ONLINE EXCLUSIVE</span>
            </div>

            {/* Product Title */}
            <h2 id="quickview-title" className="font-display text-2xl md:text-3xl tracking-wide text-black leading-tight mb-2">
              {product.name}
            </h2>

            {/* Price section */}
            <div id="quickview-price" className="font-sans text-xl font-bold tracking-tight text-red-600 mb-4">
              ${product.price}.00 USD
            </div>

            {/* Paragraph body copy */}
            <p id="quickview-desc" className="font-sans text-xs text-zinc-600 leading-relaxed font-normal mb-6">
              {product.description}
            </p>

            {/* Bullet attributes */}
            <div id="quickview-bullet-specs" className="border-t border-b border-zinc-100 py-4 mb-6">
              <span className="font-sans text-[10px] font-extrabold text-black tracking-widest block mb-2 uppercase">TECHNICAL METADATA</span>
              <ul className="space-y-1">
                {product.specs.map((spec, i) => (
                  <li id={`quickview-spec-${i}`} key={i} className="font-mono text-[10px] text-zinc-500 flex items-start space-x-2">
                    <span className="text-red-600 font-extrabold select-none">▪</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizes selector */}
            <div id="quickview-size-section" className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="font-sans text-[10px] font-extrabold text-black tracking-widest uppercase">SELECT SIZE</label>
                <span className="font-sans text-[10px] text-zinc-500 hover:underline cursor-pointer">SIZE CHART</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["S", "M", "L", "XL"] as const).map((size) => (
                  <button
                    id={`btn-quickview-size-${size.toLowerCase()}`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border py-3 text-xs font-bold font-mono tracking-widest transition-all duration-150 cursor-pointer ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-zinc-800 border-zinc-200 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Live stock warning */}
              <div className="flex items-center space-x-2 mt-3 p-2 bg-zinc-50 border border-zinc-150 text-[10px] font-mono tracking-wider leading-none">
                <Terminal className="h-3 w-3 text-zinc-700" />
                <span className="text-zinc-500 font-bold uppercase">{currentStock.rawTerm} // </span>
                <span className={`${currentStock.color} font-extrabold`}>{currentStock.text}</span>
              </div>
            </div>

            {/* Quantities selector */}
            <div id="quickview-qty-section" className="mb-6">
              <label className="font-sans text-[10px] font-extrabold text-black tracking-widest uppercase block mb-2">QUANTITY</label>
              <div className="flex items-center border border-zinc-200 w-32 justify-between py-1 bg-white">
                <button
                  id="btn-quickview-qty-dec"
                  onClick={handleDecrease}
                  className="px-3 py-1 font-bold font-mono text-zinc-500 hover:text-black transition-colors"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold">{quantity}</span>
                <button
                  id="btn-quickview-qty-inc"
                  onClick={handleIncrease}
                  className="px-3 py-1 font-bold font-mono text-zinc-500 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Checkout simulated button */}
          <div className="flex space-x-3 mt-4">
            <button
              id="btn-quickview-add-to-cart"
              onClick={handleAdd}
              disabled={addedAnimation}
              className={`flex-1 py-4 text-xs font-bold tracking-[0.25em] text-white flex items-center justify-center space-x-2 transition-all duration-300 transform rounded-none cursor-pointer ${
                addedAnimation 
                  ? "bg-green-600" 
                  : "bg-red-600 hover:bg-black hover:scale-[1.02]"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>ADDED OK // SYSTEM OK</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>ADD TO BOUTIQUE BAG →</span>
                </>
              )}
            </button>

            <button
              id="btn-quickview-wishlist"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`border border-black p-4 flex items-center justify-center transition-all cursor-pointer ${
                isWishlisted ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-600 text-red-600" : ""}`} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
