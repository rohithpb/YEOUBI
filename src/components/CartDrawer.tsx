/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { X, Trash2, ShieldCheck, Mail, MapPin, CreditCard, Loader2, ArrowRight, Printer, CheckCircle } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

type CheckoutStep = "CART" | "SHIPPING" | "PROCESSING" | "RECEIPT";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("CART");
  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [paymentCard, setPaymentCard] = useState("");
  const [errMessage, setErrMessage] = useState("");

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08); // 8% mock tax
  const shippingCost = subtotal > 300 ? 0 : 15; // Free shipping above $300
  const orderTotal = subtotal + tax + shippingCost;

  if (!isOpen) return null;

  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep("SHIPPING");
  };

  const handleProcessCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!shippingEmail || !shippingName || !shippingAddress || !shippingCity || !shippingZip) {
      setErrMessage("ALL FIELDS IN THE RAW REGISTRY MUST BE SPECIFIED.");
      return;
    }
    setErrMessage("");
    setCheckoutStep("PROCESSING");

    // Simulate standard transaction authorization wait
    setTimeout(() => {
      setCheckoutStep("RECEIPT");
    }, 2800);
  };

  const handleResetCheckout = () => {
    onClearCart();
    setCheckoutStep("CART");
    onClose();
  };

  return (
    <div 
      id="cart-drawer-overlay" 
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-subtle transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        id="cart-drawer-container"
        className="w-full max-w-lg bg-black text-white h-full shadow-2xl border-l border-zinc-800 flex flex-col justify-between relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="font-display text-xl tracking-wider">BOUTIQUE BAG</span>
            <span className="font-mono text-[9px] bg-red-650 text-white rounded-full px-2 py-[2px] font-bold">
              SYSTEM v1.0
            </span>
          </div>
          <button
            id="btn-cart-close"
            onClick={onClose}
            className="p-2 border border-zinc-800 hover:border-white transition-colors cursor-pointer"
            aria-label="Close Shopping Cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content body depending on step */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar">
          
          {checkoutStep === "CART" && (
            <div id="cart-step-list">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 font-mono text-xs">
                  <div className="text-red-600 text-lg mb-2">✛</div>
                  <p>YOUR STREETWEAR REPOSITORY IS VOID.</p>
                  <p className="mt-1 text-[10px] text-zinc-600">ZERO ITEMS DETECTED IN STORAGE</p>
                  <button
                    id="btn-cart-empty-close"
                    onClick={onClose}
                    className="mt-6 px-4 py-2 border border-zinc-800 hover:border-red-600 text-[10px] tracking-widest text-white uppercase font-bold cursor-pointer"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div id={`cart-item-${item.product.id}-${index}`} key={index} className="flex space-x-4 border-b border-zinc-900 pb-6">
                      <div className="h-20 w-16 bg-zinc-900 flex-shrink-0 border border-zinc-800 relative">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover grayscale"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 id={`cart-item-title-${index}`} className="font-sans text-[11px] font-extrabold tracking-wider max-w-[180px] break-words uppercase">
                              {item.product.name}
                            </h4>
                            <span className="font-mono text-xs text-red-600 font-bold ml-2">
                              ${item.product.price * item.quantity}.00
                            </span>
                          </div>
                          <div className="font-mono text-[9px] text-zinc-500 mt-1 uppercase flex space-x-2">
                            <span>SIZE: {item.size}</span>
                            <span>·</span>
                            <span>{item.product.season} DROP</span>
                          </div>
                        </div>

                        {/* Quantity and Trash Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-zinc-800 bg-black">
                            <button
                              id={`btn-cart-dec-${index}`}
                              onClick={() => item.quantity > 1 && onUpdateQty(index, item.quantity - 1)}
                              className="px-2 py-[2px] font-mono font-bold text-zinc-500 hover:text-white"
                            >
                              -
                            </button>
                            <span className="font-mono text-[10px] px-2 font-bold select-none">{item.quantity}</span>
                            <button
                              id={`btn-cart-inc-${index}`}
                              onClick={() => onUpdateQty(index, item.quantity + 1)}
                              className="px-2 py-[2px] font-mono font-bold text-zinc-600 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                          <button
                            id={`btn-cart-remove-${index}`}
                            onClick={() => onRemoveItem(index)}
                            className="text-zinc-600 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="h-[14px] w-[14px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {checkoutStep === "SHIPPING" && (
            <form id="cart-step-form" onSubmit={handleProcessCheckout} className="space-y-5">
              <div className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-800 text-[10px] font-mono tracking-wider text-red-550 mb-2">
                <ShieldCheck className="h-4 w-4 text-red-600 animate-pulse" />
                <span>SECURED CRYPTOGRAPHIC PROTOCOL ENGAGED</span>
              </div>

              {errMessage && (
                <div className="p-3 bg-red-950/40 border border-red-600 text-red-500 font-mono text-[9px] tracking-widest leading-normal">
                  ERROR // {errMessage}
                </div>
              )}

              {/* Form Input Blocks */}
              <div className="space-y-2">
                <label className="font-sans text-[9px] font-bold tracking-widest text-zinc-400 flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>01. REGISTRATION EMAIL *</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={shippingEmail}
                  onChange={(e) => setShippingEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs font-mono focus:border-red-600 focus:outline-none"
                  placeholder="EX: SECURE_CORE@YEOUBI.COM"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[9px] font-bold tracking-widest text-zinc-400 flex items-center space-x-1">
                  <span className="text-red-500">▪</span>
                  <span>02. CONSIGNEE FULL NAME *</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs font-sans font-bold uppercase focus:border-red-600 focus:outline-none"
                  placeholder="EX: ALEXANDER KROSS"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[9px] font-bold tracking-widest text-zinc-400 flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>03. PHYSICAL DISPATCH ADDRESS *</span>
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs font-sans uppercase focus:border-red-600 focus:outline-none"
                  placeholder="STREET NAME AND BUILDINGS NUMBER"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-sans text-[9px] font-bold tracking-widest text-zinc-400">04. METROPOLIS / CITY *</label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs font-sans uppercase focus:border-red-600 focus:outline-none"
                    placeholder="EX: TOKYO, SHINJUKU"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-[9px] font-bold tracking-widest text-zinc-400">05. ZIP CODE *</label>
                  <input
                    id="checkout-zip"
                    type="text"
                    required
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs font-mono focus:border-red-600 focus:outline-none"
                    placeholder="POSTAL DIGITS"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="font-sans text-[9px] font-bold tracking-widest text-zinc-400 flex items-center space-x-1">
                  <CreditCard className="h-3 w-3" />
                  <span>06. CRYPTOGRAPHIC SECURED CREDIT CARD NUMBER</span>
                </label>
                <input
                  id="checkout-card"
                  type="text"
                  value={paymentCard}
                  onChange={(e) => setPaymentCard(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 text-xs font-mono tracking-[0.25em] focus:border-red-600 focus:outline-none"
                  placeholder="4000 1234 5678 9010 (DEMO)"
                />
                <p className="text-[8px] text-zinc-600 font-mono tracking-wider leading-relaxed">
                  * WE DO NOT HARVEST CREDIT DETAILS. IN THE PREVIEW SANDBOX, LEAVING CARD BLANK ENABLES TEST REVENUE DIRECT ROUTE AUTHORIZATION.
                </p>
              </div>

              {/* Action Buttons inside Form */}
              <div className="flex space-x-3 pt-4">
                <button
                  id="btn-checkout-back"
                  type="button"
                  onClick={() => setCheckoutStep("CART")}
                  className="w-1/3 py-4 text-[10px] tracking-widest border border-zinc-800 uppercase font-bold hover:border-white transition-all cursor-pointer"
                >
                  GO BACK
                </button>
                <button
                  id="btn-checkout-submit"
                  type="submit"
                  className="w-2/3 py-4 text-[10px] tracking-widest bg-red-600 text-white font-sans font-extrabold uppercase hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  AUTHORIZE DISPATCH →
                </button>
              </div>
            </form>
          )}

          {checkoutStep === "PROCESSING" && (
            <div id="cart-step-loading" className="flex flex-col items-center justify-center py-24 text-center font-mono">
              <Loader2 className="h-10 w-10 text-red-600 animate-spin mb-4" />
              <h3 className="text-xs uppercase tracking-widest text-white mb-2">CRYPTOGRAPHIC CLEARANCE IN PROGRESS</h3>
              <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed uppercase">
                transacting with master-ledger bank routers... syncing raw dispatch registers... securing shipping queues...
              </p>
              <div className="w-48 bg-zinc-900 border border-zinc-800 h-2 mt-6 overflow-hidden relative">
                <div className="h-full bg-red-500 absolute top-0 left-0 animate-[shimmer_2s_infinite] w-full" style={{ backgroundImage: "linear-gradient(90deg, rgba(232,0,45,0.3) 0%, rgba(232,0,45,1) 50%, rgba(232,0,45,0.3) 100%)", backgroundSize: "200% 100%" }}></div>
              </div>
            </div>
          )}

          {checkoutStep === "RECEIPT" && (
            <div id="cart-step-receipt" className="space-y-6">
              
              {/* Receipt Visual Body */}
              <div className="border border-white bg-white text-black p-5 relative select-none font-mono">
                
                {/* Vintage stamp design */}
                <div className="absolute top-4 right-4 border border-zinc-850 p-2 text-zinc-550 flex flex-col items-center leading-none text-center">
                  <span className="text-[7px] tracking-widest font-black uppercase">YEOUBI SYSTEM</span>
                  <span className="text-[12px] tracking-tight font-extrabold uppercase mt-1">APPROVED</span>
                  <span className="text-[6px] tracking-wider text-black mt-1">№ 517-9192</span>
                </div>

                <div className="flex items-center space-x-1 mb-6 border-b border-black pb-4 text-black">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-display text-xl tracking-widest">YEOUBI CO.</span>
                </div>

                <div className="text-[9px] text-zinc-700 space-y-[2px] uppercase">
                  <div><strong>ORDER REFERENCE:</strong> YB-SS25-{Math.round(Math.random() * 89999 + 10000)}</div>
                  <div><strong>CONSIGNEE:</strong> {shippingName}</div>
                  <div><strong>EMAIL LOGS:</strong> {shippingEmail}</div>
                  <div><strong>DISPATCH DEST:</strong> {shippingAddress}, {shippingCity} - {shippingZip}</div>
                  <div><strong>LEDGER TIME:</strong> {new Date().toISOString()}</div>
                </div>

                {/* Receipt Line Items Table */}
                <div className="border-t border-b border-black border-dashed py-3 my-4">
                  <div className="text-[10px] font-bold flex justify-between uppercase mb-2">
                    <span>ITEM MODEL</span>
                    <span>SIZE [QTY]</span>
                    <span>VALUE</span>
                  </div>
                  {cartItems.map((item, idx) => (
                    <div id={`receipt-line-${idx}`} key={idx} className="text-[9px] text-zinc-700 flex justify-between uppercase my-1">
                      <span className="truncate max-w-[150px]">{item.product.name}</span>
                      <span>{item.size} x{item.quantity}</span>
                      <span>${item.product.price * item.quantity}.00</span>
                    </div>
                  ))}
                </div>

                {/* Receipt Math */}
                <div className="text-[10px] text-black space-y-[3px] text-right font-black uppercase">
                  <div>SUBTOTAL: ${subtotal}.00</div>
                  <div>REGIONAL TAX (8%): ${tax}.00</div>
                  <div>DISPATCH CHARGE: ${shippingCost === 0 ? "FREE" : `$${shippingCost}.00`}</div>
                  <div className="text-xs pt-1 border-t border-black font-extrabold text-red-650 flex justify-between mt-2">
                    <span>LEDGER DESTRUCTION STATUS: SUCCESS</span>
                    <span>TOTAL: ${orderTotal}.00</span>
                  </div>
                </div>

                {/* Printable Barcode */}
                <div className="mt-8 flex flex-col items-center justify-center">
                  <div className="h-8 w-60 border-l border-r border-black flex items-center justify-around overflow-hidden mb-1 opacity-80" style={{ backgroundImage: "repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 7px)" }}>
                  </div>
                  <span className="text-[8px] text-zinc-500 font-mono tracking-[0.25em] uppercase">* YB-SECURE-ID-{Math.round(Math.random() * 8999000 + 1000)} *</span>
                </div>

                <p className="text-[7.5px] text-zinc-400 mt-6 leading-relaxed font-sans text-center uppercase">
                  Thank you for respecting the culture. Your shipment is routed on active express courier lines. To verify tracing, contact security core nodes.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="space-y-2">
                <button
                  id="btn-receipt-print"
                  onClick={() => alert("COMMENCING PAPER FEED TRIGGER... SIMULATING SYSTEM PRINT DIALOG.")}
                  className="w-full py-4 text-[10px] tracking-widest border border-zinc-500 text-white font-sans font-bold uppercase hover:border-red-600 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Printer className="h-3 w-3" />
                  <span>PRINT DISPATCH PASS</span>
                </button>
                <button
                  id="btn-receipt-complete"
                  onClick={handleResetCheckout}
                  className="w-full py-4 text-[10px] tracking-widest bg-red-600 text-white font-sans font-extrabold uppercase hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  CLEAR BAG & EXIT WAREHOUSE
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer pricing totals (Visible only on Cart step) */}
        {checkoutStep === "CART" && cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-900 bg-zinc-950 font-mono text-zinc-300">
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-zinc-500">BOUTIQUE BAG INDEX</span>
                <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} ITEMS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">BUREAUCRATIC TAX (8%)</span>
                <span>${tax}.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">EXPRESS SHIPPING PORTAL</span>
                <span>{shippingCost === 0 ? <span className="text-green-500 font-bold">FREE</span> : `$${shippingCost}.00 USD`}</span>
              </div>
              {shippingCost > 0 && (
                <div className="text-[8px] text-zinc-500 tracking-wider">
                  * SPEND <strong>${300 - subtotal}.00</strong> MORE FOR STANDARD FREE EXPRESS DISPATCH.
                </div>
              )}
              <hr className="border-zinc-800 my-2" />
              <div className="flex justify-between text-white font-bold text-sm">
                <span className="tracking-widest">TOTAL VALUE</span>
                <span className="text-red-500 font-extrabold">${orderTotal}.00 USD</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="btn-cart-checkout-proceed"
                onClick={handleStartCheckout}
                className="w-full py-4 text-xs font-bold tracking-[0.2em] bg-red-650 hover:bg-red-700 bg-red-600 text-white font-sans font-extrabold uppercase hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>PROCEED TO SECURE LEDGER</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="btn-cart-empty"
                onClick={onClearCart}
                className="w-full py-2 text-[9px] tracking-widest text-zinc-500 hover:text-red-650 transition-all font-mono uppercase cursor-pointer"
              >
                VOID BAG CONTENTS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
