/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Plus,
  Play,
  Mail,
  Compass,
  CheckCircle,
  Terminal,
  Grid,
  Shield,
  Tag,
  Share2,
  Lock,
  X
} from "lucide-react";

import Navbar from "./components/Navbar";
import Marquee from "./components/Marquee";
import { motion, useScroll, useTransform } from "motion/react";
import ProductQuickView from "./components/ProductQuickView";
import CartDrawer from "./components/CartDrawer";
import CampaignVideoModal from "./components/CampaignVideoModal";
import LookbookLightbox from "./components/LookbookLightbox";
import SearchOverlay from "./components/SearchOverlay";
import { ParticleTextEffect } from "./components/ui/particle-text-effect";

import { Product, CartItem, LookbookItem } from "./types";
import { PRODUCTS, LOOKBOOK_ITEMS, IMAGES, LIMITED_DROP_PRODUCT } from "./data";

export default function App() {
  const { scrollY } = useScroll();
  // As the user scrolls down from 0 to 800px, zoom in the title from 1x to 2.5x scale
  const titleScale = useTransform(scrollY, [0, 800], [1, 2.5]);

  // Intro decryption loading animation states
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [fadeIntro, setFadeIntro] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 13); // Accelerated loading time (~1.3s instead of 4.5s)
    return () => clearInterval(interval);
  }, []);

  const handleParticleAnimationFinished = () => {
    setFadeIntro(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 700);
  };

  // Shopping Cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Responsive design checker for canvas rendering sizes
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Modal display overlays
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Lookbook Modal and indices elements
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Ticking limited drop timer states (Init with elegant fallback matching prompt specs)
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 47,
    seconds: 12
  });

  // Client subscription parameters
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Account registration mock
  const [accountCreated, setAccountCreated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userKey, setUserKey] = useState("");

  // Product Grid Snap scroll indices
  const [activeGridIdx, setActiveGridIdx] = useState(0);

  // Compute live drop date ticker offsets (targets June 1, 2026)
  useEffect(() => {
    const targetTime = new Date("2026-06-01T00:00:00Z").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle addition to bag drawer
  const handleAddToCart = (product: Product, size: "S" | "M" | "L" | "XL", quantity: number) => {
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prevItems, { product, size, quantity }];
    });
    // Triggers slight delay for visual feedback, then prompts drawer slide-in
    setTimeout(() => {
      setCartOpen(true);
    }, 400);
  };

  // Modify cart parameters
  const handleUpdateCartQty = (index: number, quantity: number) => {
    setCartItems((prevItems) => {
      const updated = [...prevItems];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  // Delete cart parameters
  const handleRemoveCartItem = (index: number) => {
    setCartItems((prevItems) => prevItems.filter((_, idx) => idx !== index));
  };

  // Clear checkout bag
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Lookbook carousel scrolling handlers
  const handleNextLook = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % LOOKBOOK_ITEMS.length);
    }
  };

  const handlePrevLook = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + LOOKBOOK_ITEMS.length) % LOOKBOOK_ITEMS.length);
    }
  };

  // Grid Carousel snap sliding helpers (Desktop click visual adjustments)
  const scrollGridLeft = () => {
    setActiveGridIdx((prev) => Math.max(0, prev - 1));
  };

  const scrollGridRight = () => {
    setActiveGridIdx((prev) => Math.min(PRODUCTS.length - 1, prev + 1));
  };

  // Scroll to section helper
  const handleScrollToSegment = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle register account mock
  const handleRegisterAccount = (e: FormEvent) => {
    e.preventDefault();
    if (!userName) return;
    setAccountCreated(true);
    setUserKey(`YB-KEY-${Math.round(Math.random() * 899990 + 100009)}`);
  };

  const handleShareSystemlink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("SYSTEM SUCCESS // LINK COPY OK.");
    }
  };

  return (
    <div id="yeoubi-app-landscape" className="min-h-screen bg-black text-white selection:bg-red-650 selection:text-white font-sans antialiased flex flex-col justify-between">
      
      {/* 🚀 THE INTRO DECRYPTION CORE LOADING STAGE */}
      {showIntro && (
        <div 
          id="intro-loader-screen"
          className={`fixed inset-0 z-[100] bg-black flex flex-col justify-between p-6 md:p-12 transition-opacity duration-700 ease-in-out select-none ${
            fadeIntro ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Immersive background particle canvas */}
          <ParticleTextEffect
            words={["YEOUBI", "YEOUBI"]}
            onAnimationFinished={handleParticleAnimationFinished}
          />

          {/* Top Header Grid Lines */}

          {/* Bottom stats layout */}
          <div className="w-full relative z-10 pointer-events-none pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[8.5px] font-mono text-zinc-650 gap-2">
            <div>© YEOUBI TOKYO CORE SS25 SERIES INDEX. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center space-x-2 text-zinc-500 font-bold">
              <span>LAT: 35.6762° N</span>
              <span>·</span>
              <span>LON: 139.6503° E</span>
              <span>·</span>
              <button 
                onClick={() => setFadeIntro(true)}
                className="text-white hover:text-[#E8002D] border-b border-dashed border-white/40 hover:border-[#E8002D] cursor-pointer pointer-events-auto transition-colors"
              >
                SKIP INTRO →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Sticky White Navigation Component */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onScrollToSection={handleScrollToSegment}
      />

      {/* 📢 ENDLESS MARQUEE TICKER TAPE */}
      <Marquee />

      {/* 🦸 PHOTO-FREE ARTISTIC HERO SECTION */}
      <section 
        id="hero-section" 
        className="w-full relative min-h-[95vh] md:min-h-screen bg-black flex flex-col justify-between border-b border-white/10 select-none overflow-hidden"
      >
        {/* Grid Background Accents */}
        <div className="absolute inset-0 grid grid-cols-4 pointer-events-none z-0 opacity-15">
          <div className="border-r border-white/10 h-full"></div>
          <div className="border-r border-white/10 h-full"></div>
          <div className="border-r border-white/10 h-full"></div>
          <div className="h-full"></div>
        </div>
        
        <div className="absolute inset-y-0 left-0 right-0 grid grid-rows-3 pointer-events-none z-0 opacity-15">
          <div className="border-b border-white/10 w-full"></div>
          <div className="border-b border-white/10 w-full"></div>
          <div className="w-full"></div>
        </div>

        {/* Top Header Compartment with System Labels */}
        <div className="w-full z-10 px-6 py-4 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 bg-zinc-950/20 backdrop-blur-subtle gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div id="new-drop-badge" className="inline-flex items-center bg-white text-black px-3 py-1.5 space-x-2 select-none border border-black shadow">
              <span className="text-[#E8002D] text-[10px] animate-pulse">●</span>
              <span className="text-[9px] font-bold tracking-tighter uppercase text-black">NEW DROP "RAW REFLECTIONS" 05.24.25</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold">
              SS25 TOKYO OUTPOST ARCHIVE
            </span>
          </div>
          <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8002D] animate-ping"></span>
            <span>PORT_ACCESS_3000 // CORE ACTIVE</span>
          </div>
        </div>

        {/* Center Dynamic Typography & Particle Vapor Scene */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 min-h-[350px]">
          <div className="w-full max-w-5xl flex flex-col items-center justify-center text-center">
            {/* Elegant futuristic wireframe crossbars */}
            <div className="flex items-center space-x-4 mb-2 text-[#E8002D] font-mono text-[9px] tracking-[0.3em] font-black">
              <span>✛ CORE ARCHIVE SS25 ✛</span>
            </div>
            
            <motion.h1 
              id="hero-massive-title" 
              className="text-[64px] sm:text-[100px] md:text-[140px] lg:text-[170px] font-black tracking-tighter leading-none uppercase select-none transition-all duration-700 ease-out text-white hover:text-zinc-200 cursor-default origin-center"
              style={{
                scale: titleScale,
                fontFamily: '"Arial Black", sans-serif',
                letterSpacing: "-0.04em"
              }}
            >
              YEOUBI
            </motion.h1>

            {/* Accent coordinate grids */}
            <div className="w-full max-w-xs h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
          </div>
          
          {/* Subtext Statement */}
          <div className="text-center mt-2 max-w-lg">
            <p className="font-sans text-[11px] font-black uppercase tracking-[0.3em] leading-tight text-[#E8002D] mb-3">
              RESPECT THE CULTURE. BUILT FROM EXPRESSION.
            </p>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light">
              Streetwear is not just a canvas; it is an aggressive, dark editorial rebellion. Celebrating heavy-duty fabrics, structural symmetry, and minimalistic digital code. Built for the concrete vanguard.
            </p>
          </div>
        </div>

        {/* Footer Control Room: Action CTA Grid & System Coordinates */}
        <div className="w-full z-10 px-6 py-6 md:px-12 border-t border-white/5 bg-zinc-950/40 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            
            {/* CTAs column */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                id="btn-hero-cta"
                onClick={() => handleScrollToSegment("featured-collection")}
                className="px-8 py-4 bg-[#E8002D] hover:bg-white hover:text-black hover:border-white text-[10px] font-extrabold tracking-widest text-white flex items-center justify-center space-x-2 transition-all duration-300 uppercase cursor-pointer border border-[#E8002D]"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="btn-hero-play-campaign"
                onClick={() => setCampaignOpen(true)}
                className="px-6 py-4 border border-zinc-800 hover:border-white text-[10px] font-bold tracking-widest flex items-center justify-center space-x-2 transition-all duration-350 cursor-pointer bg-black/50 hover:bg-black/90 text-white uppercase"
              >
                <Play className="h-3 w-3 fill-white" />
                <span>PLAY SS25 TRANSMISSION</span>
              </button>
            </div>

            {/* Technical Data Columns */}
            <div className="grid grid-cols-2 gap-x-8 text-left border-l border-white/10 pl-6 hidden lg:grid">
              <div>
                <div className="text-[8px] font-mono text-zinc-550 tracking-wider">LATITUDE</div>
                <div className="text-[10px] font-mono text-white font-bold">35.6762° N (TOKYO)</div>
              </div>
              <div>
                <div className="text-[8px] font-mono text-zinc-550 tracking-wider">LONGITUDE</div>
                <div className="text-[10px] font-mono text-white font-bold">139.6503° E (OUTPOST)</div>
              </div>
            </div>

            {/* Corner alignment marker */}
            <div className="flex items-center justify-between md:justify-end gap-6 font-mono text-[9px] text-zinc-500">
              <div className="flex items-center space-x-1 font-bold">
                <span className="text-[#E8002D]">✛</span>
                <span>STREETWEAR BEYOND FABRIC</span>
              </div>
              <button
                id="lbl-hero-bottom-scroll"
                onClick={() => handleScrollToSegment("featured-collection")}
                className="hover:text-white transition-colors uppercase font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>SCROLL DOWN</span>
                <ArrowDown className="h-3 w-3 animate-bounce text-[#E8002D]" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 👕 FEATURED COLLECTION SECTOR (Product Cards Showcase) */}
      <section id="featured-collection" className="w-full bg-white text-black py-16 px-6 md:px-12 border-b border-black">
        <div className="mx-auto max-w-7xl">
          
          {/* Header identifier */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-black pb-6 mb-12">
            <div>
              <span className="font-sans text-[10px] font-black tracking-widest text-[#E8002D] block uppercase mb-1.5">
                01 · CURRENT DECK DROPS
              </span>
              <motion.h2 
                id="collection-headline" 
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
                className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter uppercase text-black leading-none"
              >
                RAW REFLECTIONS
              </motion.h2>
            </div>
            <div className="mt-4 sm:mt-0 max-w-xs text-right font-mono text-[9px] text-zinc-550 space-y-1">
              <div>BATCH SEQUENCE: AP-RAW-SS25</div>
              <div>MATERIALS INTEGRITY: 100% FRENCH COTTON JERSEY</div>
              <div className="text-[#E8002D] font-bold">ONLINE BOUTIQUE OPEN</div>
            </div>
          </div>

          {/* Cards carousel wrapper */}
          <div 
            id="featured-cards-grid" 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500"
          >
            {PRODUCTS.map((product) => (
              <div
                id={`product-card-${product.id}`}
                key={product.id}
                onClick={() => setActiveProduct(product)}
                className="group relative flex flex-col bg-zinc-50 border border-zinc-200 hover:border-black transition-all duration-300 shadow-sm overflow-hidden select-none cursor-pointer"
              >
                {/* Image panel */}
                <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden border-b border-zinc-100">
                  {product.badge && (
                    <span className="absolute left-3 top-3 bg-red-600 text-white font-mono text-[9px] font-extrabold tracking-[0.2em] py-[1px] px-2 z-10">
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-108 group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle technical overlay with Add to Cart and Quick view buttons */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="font-mono text-[8px] text-zinc-350 tracking-widest leading-none block mb-1">DESIGN SPEC:</span>
                    <p className="font-sans text-[10px] text-white leading-relaxed line-clamp-3 mb-4 font-light">
                      {product.description}
                    </p>
                    
                    {/* Add to Cart overlay button */}
                    <button
                      id={`btn-card-add-to-cart-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, "M", 1);
                      }}
                      className="w-full py-2.5 bg-[#E8002D] hover:bg-white hover:text-black text-white font-sans text-[10px] font-black tracking-[0.2em] transition-all uppercase cursor-pointer mb-2 border border-[#E8002D]"
                    >
                      ADD TO BAG
                    </button>

                    <button
                      id={`btn-card-quick-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProduct(product);
                      }}
                      className="w-full py-1.5 bg-black/70 hover:bg-black text-white border border-white/20 hover:border-white font-sans text-[9px] font-bold tracking-[0.15em] transition-all uppercase cursor-pointer"
                    >
                      QUICK SPEC VIEW
                    </button>
                  </div>
                </div>

                {/* Info and price tags */}
                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
                        {product.season} // SERIES_V0{product.id.length}
                      </span>
                      <span className="font-sans text-[10px] font-bold text-red-600 tracking-tight">
                        EXPRESS AVAILABLE
                      </span>
                    </div>

                    <h3 className="font-sans text-xs font-extrabold tracking-wider text-black uppercase leading-tight mb-2">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                    <span className="font-sans text-sm font-black text-black">
                      ${product.price}.00 USD
                    </span>
                    <button
                      id={`btn-card-explore-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProduct(product);
                      }}
                      className="text-zinc-600 hover:text-red-650 transition-colors cursor-pointer text-xs flex items-center space-x-1"
                    >
                      <span className="font-mono text-[9px] font-bold tracking-widest">EXPLORE</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Section Carousel control indicators */}
          <div id="grid-carousel-controls" className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200">
            <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase">
              YEOUBI INVENTORY SYSTEM: 4 OF 4 MODELS RENDERED OK
            </span>
            <div className="flex space-x-2">
              <button
                id="btn-grid-prev"
                onClick={scrollGridLeft}
                className="p-3 border border-zinc-200 hover:border-black text-black transition-all cursor-pointer"
                aria-label="Previous Page"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                id="btn-grid-next"
                onClick={scrollGridRight}
                className="p-3 bg-red-600 hover:bg-black text-white transition-all cursor-pointer"
                aria-label="Next Page"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 🖤 THE CULTURE & LIMITED COUNTDOWN SPLIT BLOCK */}
      <section className="w-full bg-black border-b border-white/10 flex flex-col lg:flex-row relative">
        
        {/* LHS: The Cultural Vision */}
        <div id="culture-section" className="w-full lg:w-1/2 p-6 md:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold tracking-widest uppercase">
                THE CULTURE <span className="text-[#E8002D]">●</span>
              </span>
              <span className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest font-bold">VOLUME // FILE_005</span>
            </div>

            {/* Immersive motion group shot image */}
            <div className="aspect-video bg-neutral-900 relative border border-white/10 overflow-hidden mb-8 select-none group">
              <img
                src={IMAGES.culture}
                alt="Streetwear Movement Community Group"
                className="w-full h-full object-cover grayscale object-center opacity-40 transition-all duration-700 group-hover:opacity-70 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white text-black font-sans text-[7.5px] font-black tracking-widest px-2 py-1 leading-none uppercase">
                CAPTURE LEVEL // RAW
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-8 h-8 flex items-center justify-center">
                <span className="text-[#E8002D] text-3xl font-thin animate-pulse">✛</span>
              </div>
            </div>

            <p className="font-sans text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic leading-tight mb-4 select-none">
              "We build from expression. Streetwear is not a static canvas; it is a movement."
            </p>

            <p className="font-sans text-xs text-zinc-400 leading-relaxed max-w-xl">
              YEOUBI isn't just about clothes. It's about a movement. A way of thinking. A way of living. We embody the aggressive concrete corners of Tokyo, Berlin and Warsaw, synthesizing modular layouts and raw cuts for the modern vanguard.
            </p>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 flex justify-between items-center">
            <button
              id="btn-culture-discover"
              onClick={() => {
                alert("INITIATING INTEL TRANSFER: CULTURE STATEMENT DECRYPTED. REDIRECTING USER CHANNELS TO DISCORD & INSTAGRAM HUB.");
              }}
              className="text-[10px] font-bold tracking-widest uppercase border-b border-white pb-1 hover:text-[#E8002D] hover:border-[#E8002D] transition-colors cursor-pointer"
            >
              DISCOVER MORE →
            </button>
            <span className="font-mono text-[9px] text-zinc-600 select-none">© YEOUBI SYSTEM MOVEMENT</span>
          </div>

        </div>

        {/* RHS: Interactive Limited Drop Container */}
        <div id="limited-drop-section" className="w-full lg:w-1/2 p-6 md:p-14 bg-neutral-950 flex flex-col justify-between">
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold tracking-widest uppercase">
                LIMITED DROP <span className="text-[#E8002D]">●</span>
              </span>
              <span className="font-mono text-[8.5px] text-[#E8002D] tracking-widest bg-zinc-900 border border-white/5 px-2 py-[2px] font-bold uppercase">
                HIGH THREAT RUN // NO RESTOCKS
              </span>
            </div>

            {/* Countdown layout configured cleanly */}
            <div id="countdown-grid" className="flex items-center justify-center space-x-4 mb-8 bg-black/50 p-6 border border-white/15 select-none text-center">
              
              <div className="text-center">
                <div id="timer-days" className="text-3xl sm:text-4xl font-mono text-[#E8002D] font-black tracking-tight leading-none">
                  {timeLeft.days.toString().padStart(2, "0")}
                </div>
                <div className="text-[8px] uppercase tracking-tighter opacity-50 mt-1">DAYS</div>
              </div>

              <div className="text-3xl sm:text-4xl font-mono text-[#E8002D] font-black">:</div>

              <div className="text-center">
                <div id="timer-hours" className="text-3xl sm:text-4xl font-mono text-[#E8002D] font-black tracking-tight leading-none">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-[8px] uppercase tracking-tighter opacity-50 mt-1">HRS</div>
              </div>

              <div className="text-3xl sm:text-4xl font-mono text-[#E8002D] font-black">:</div>

              <div className="text-center">
                <div id="timer-minutes" className="text-3xl sm:text-4xl font-mono text-[#E8002D] font-black tracking-tight leading-none">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-[8px] uppercase tracking-tighter opacity-50 mt-1">MINS</div>
              </div>

              <div className="text-3xl sm:text-4xl font-mono text-white font-black">:</div>

              <div className="text-center">
                <div id="timer-seconds" className="text-3xl sm:text-4xl font-mono text-white font-black tracking-tight leading-none">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-[8px] uppercase tracking-tighter opacity-50 mt-1">SECS</div>
              </div>

            </div>

            {/* Product description with tilted preview layout from the design */}
            <div className="flex flex-col sm:flex-row gap-6 items-center bg-black/40 p-5 border border-white/5 mb-6">
              <div className="w-24 h-24 bg-neutral-900 rounded p-2 rotate-3 shadow-xl border border-white/5 flex-shrink-0 relative overflow-hidden select-none hover:rotate-0 transition-transform duration-300">
                <img
                  src={LIMITED_DROP_PRODUCT.image}
                  alt={LIMITED_DROP_PRODUCT.name}
                  className="w-full h-full object-contain grayscale invert"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[8px] text-[#E8002D] tracking-wider uppercase block font-bold mb-0.5">LIMITED EDITION CHROME DECK</span>
                <h4 className="font-sans text-xs font-black tracking-wider text-white uppercase mb-1">
                  {LIMITED_DROP_PRODUCT.name}
                </h4>
                <p className="font-sans text-[10px] text-zinc-500 leading-normal line-clamp-2">
                  {LIMITED_DROP_PRODUCT.description}
                </p>
                <span className="font-sans text-xs font-black text-white block mt-1.5">${LIMITED_DROP_PRODUCT.price}.00 USD</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex space-x-3">
            <button
              id="btn-limited-view"
              onClick={() => setActiveProduct(LIMITED_DROP_PRODUCT)}
              className="flex-1 py-4 text-[10px] font-sans font-extrabold tracking-widest bg-[#E8002D] hover:bg-white hover:text-black hover:border-white text-white uppercase border border-[#E8002D] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>INSPECT DROP MODEL →</span>
            </button>
            <button
              id="btn-limited-checkout"
              onClick={() => {
                handleAddToCart(LIMITED_DROP_PRODUCT, "M", 1);
              }}
              className="px-6 py-4 border border-zinc-800 hover:border-white hover:bg-white hover:text-black transition-all duration-200 cursor-pointer text-[10px] tracking-widest text-white uppercase font-bold"
            >
              SECURE SLOT
            </button>
          </div>

        </div>

      </section>

      {/* ⚡ YEOUBI KINETIC CULTURE STATEMENT */}
      <section className="w-full bg-black text-white py-16 px-6 md:px-12 border-b border-white/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(232,0,45,0.08),transparent_70%)] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl relative">
          
          {/* Subtle grid line decoration */}
          <div className="absolute -top-16 left-1/4 w-[1px] h-full bg-white/5 hidden md:block" />
          <div className="absolute -top-16 left-3/4 w-[1px] h-full bg-white/5 hidden md:block" />

          {/* Heading meta-info */}
          <div className="flex items-center space-x-3 mb-8">
            <span className="h-1.5 w-1.5 bg-[#E8002D] rounded-full animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-black">
              STATEMENT SYSTEM // EXP_2025
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Red Line Accent */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="w-[1px] h-32 bg-gradient-to-b from-[#E8002D] to-transparent mx-auto" />
            </div>

            {/* Main Statement Text */}
            <div className="lg:col-span-11 space-y-6">
              
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  className="font-sans text-[11px] font-black tracking-widest text-[#E8002D] uppercase"
                >
                  YEOUBI // CULTURAL BLUEPRINT
                </motion.div>
              </div>

              {/* Core animated slogan split by kinetic slide-ins */}
              <div className="space-y-2">
                <div className="overflow-hidden">
                  <motion.h3 
                    initial={{ x: -150, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.1 }}
                    className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tighter uppercase leading-none text-white"
                    style={{ fontFamily: '"Arial Black", sans-serif' }}
                  >
                    YEOUBI 2025
                  </motion.h3>
                </div>

                <div className="overflow-hidden">
                  <motion.h3 
                    initial={{ x: 150, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.2 }}
                    className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tighter uppercase leading-none text-[#E8002D]"
                    style={{ fontFamily: '"Arial Black", sans-serif' }}
                  >
                    RESPECT THE CULTURE
                  </motion.h3>
                </div>

                <div className="overflow-hidden">
                  <motion.h3 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.3 }}
                    className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tighter uppercase leading-none text-zinc-300"
                    style={{ fontFamily: '"Arial Black", sans-serif' }}
                  >
                    BUILT FROM EXPRESSION.
                  </motion.h3>
                </div>
              </div>

              {/* Running ticker layout / bottom accents */}
              <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[9px] font-mono text-zinc-500">
                <div>SYSTEM CHECK: STABLE // EXP_CHANNELS ACTIVE</div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[#E8002D]">✛</span>
                  <span>WE EMPOWER THE RAW MOVEMENT © 2025</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 📸 LOOKBOOK VIEWPORT GALLERY */}
      <section id="lookbook-section" className="w-full bg-white text-black py-16 px-6 md:px-12 border-b border-black">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-black pb-4 mb-10">
            <div>
              <span className="font-sans text-[10px] font-black tracking-widest text-[#E8002D] block uppercase mb-1.5">
                02 · EDITORIAL ARCHIVES
              </span>
              <motion.h2 
                id="lookbook-headline" 
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 70, damping: 14 }}
                className="font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter uppercase text-black leading-none"
              >
                Spring / Summer 2025 "Raw Reflections"
              </motion.h2>
            </div>
            <div className="mt-4 sm:mt-0 font-mono text-[9px] text-zinc-550 leading-none">
              PHOTOGRAPHY: TOKYO CONCRETE SESSIONS
            </div>
          </div>

          {/* Lookbook 4-column photo grid and zoom overlay actions */}
          <div id="lookbook-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            {LOOKBOOK_ITEMS.map((item, index) => (
              <div
                id={`lookbook-card-${item.id}`}
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative bg-zinc-100 aspect-[3/4] border border-zinc-200 hover:border-black transition-all duration-300 overflow-hidden cursor-pointer shadow-sm"
              >
                <img
                  src={item.url}
                  alt={item.outfit}
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:filter-none"
                  referrerPolicy="no-referrer"
                />

                {/* Styled text specs card metadata overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 text-white">
                  <div className="font-mono text-[8.5px] tracking-widest border border-white/20 p-2 bg-black/40">
                    <div>LENS: DIGITAL_MONO_100</div>
                    <div>GEOTAG: {item.location.split(",")[0]}</div>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-red-400 tracking-wider block uppercase">ACTIVE LAYOUT MODEL</span>
                    <h4 className="font-sans text-xs font-extrabold tracking-wider uppercase leading-tight">
                      {item.outfit}
                    </h4>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-black text-white font-mono text-[8px] px-2 py-[2px] tracking-widest border border-zinc-900 leading-none">
                  [ PHOTO_0{index + 1} // VIEW ]
                </div>
              </div>
            ))}
          </div>

          <div id="lookbook-footer-btn" className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-200">
            <span className="font-mono text-[9px] text-zinc-400">SESSION CAP BARCODE: 0x918928001</span>
            <button
              id="btn-lookbook-discover-all"
              onClick={() => setLightboxIndex(0)}
              className="text-black font-sans text-xs font-extrabold tracking-[0.2em] uppercase hover:text-red-600 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>VIEW FULL LOOKBOOK LIGHTBOX →</span>
            </button>
          </div>

        </div>
      </section>

      {/* 🧾 TACTICAL NEWSLETTER REGISTRY & CORE INFO BOARD */}
      <section id="tactical-newsletter" className="w-full bg-black py-16 px-6 md:px-12 border-b border-zinc-900">
        <div className="mx-auto max-w-4xl border border-zinc-800 bg-zinc-950 p-6 md:p-12 relative overflow-hidden select-none">
          
          <div className="absolute top-2 left-2 text-red-650 hover:text-white font-mono text-[8px] tracking-widest">
            ✛ YB_NEWSLETTER_QUEUE
          </div>

          <div className="text-center max-w-xl mx-auto space-y-6">
            <div className="space-y-2">
              <h3 id="news-headline" className="font-display text-2xl sm:text-4xl tracking-wider text-white uppercase">
                JOIN THE SYSTEM LEDGER
              </h3>
              <p className="font-mono text-[9px] text-red-500 font-extrabold tracking-[0.2em] uppercase">
                SUBSCRIBE TO DISPATCH LOGS, ENCRYPTED CODES AND FLASH DROP ALERTS
              </p>
            </div>

            <p className="font-sans text-xs text-zinc-400 font-normal leading-relaxed">
              We do not distribute promotional spam. Subscribers receive clean cryptographic keys providing immediate private queue access on limited FW/SS drops.
            </p>

            {newsletterSubscribed ? (
              <div id="news-subscribed-alert" className="p-4 bg-zinc-900 border border-red-600 text-center space-y-2 animate-fadeIn">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto animate-bounce" />
                <h4 className="font-sans text-xs font-extrabold text-white uppercase tracking-wider">LEDGER INFILTRATION OK //</h4>
                <p className="font-mono text-[9px] text-zinc-400">
                  SYSTEM KEY ACTIVATED FOR <strong>{newsletterEmail.toUpperCase()}</strong>. DETAILED MANUAL ENCLOSED.
                </p>
              </div>
            ) : (
              <form
                id="news-form"
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newsletterEmail) return;
                  setNewsletterSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input
                  id="news-email-input"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="ENTER REGISTERED SMTP EMAIL ADDRESS..."
                  className="flex-1 bg-black border border-zinc-800 p-4 text-xs font-mono text-white placeholder-zinc-700 focus:border-red-600 focus:outline-none"
                />
                <button
                  id="btn-news-submit"
                  type="submit"
                  className="px-6 py-4 bg-red-600 hover:bg-white hover:text-black text-[10px] font-sans font-black tracking-widest text-white uppercase transition-all cursor-pointer"
                >
                  SECURE SLOT
                </button>
              </form>
            )}

            <div className="font-mono text-[8px] text-zinc-650 tracking-[0.15em] leading-relaxed pt-2">
              SECURITY ADVISORY: EMAILS SIGNUPS ENCRYPTED WITH TWOFISH-256 SYSTEM SCHEMES.
            </div>
          </div>

        </div>
      </section>

      {/* 🔻 FOOTER */}
      <footer id="about-footer" className="w-full bg-white text-zinc-600 py-12 px-6 md:px-12 relative overflow-hidden border-t border-black">
        <div className="mx-auto max-w-7xl flex flex-col items-stretch space-y-10">
          
          {/* Top segment block links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-black/10">
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="font-sans font-black text-2xl tracking-tighter text-black uppercase">YEOUBI</span>
                <span className="font-sans text-[8px] font-bold mt-1 ml-[1px] text-black">®</span>
              </div>
              <p className="font-sans text-xs text-zinc-500 leading-relaxed uppercase font-medium">
                Streetwear Beyond Fabric. Designed in-house for the aggressive concrete modern vanguard. Handcrafted silhouettes shipped internationally.
              </p>
              <div className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                SYSTEM STATS // LEDGER_ONLINE // v1.0.5_RELEASE
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-sans text-[11px] font-black tracking-widest text-black uppercase">SYSTEM POLICY LOGS</h5>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans font-bold text-zinc-700">
                <button onClick={() => alert("STANDARD TRACKED EXPRESS DELIVERY: 2-4 DAYS URBAN PROCESSING. WORLDWIDE SHIPPINGS ACTIVE.")} className="hover:text-[#E8002D] text-left cursor-pointer transition-colors">SHIPPING POLICIES</button>
                <button onClick={() => alert("RETURNS PERIOD VALID FOR 14 DAYS AFTER RECEIVING PACKAGE. RESIDUES MUST NOT BE DETECTED.")} className="hover:text-[#E8002D] text-left cursor-pointer transition-colors">RETURNS PORTAL</button>
                <button onClick={() => alert("TERMS DECLARATION: PRODUCTS EXCLUSIVELY LICENSED BY YEOUBI SYSTEM GRAPHICS CO.")} className="hover:text-[#E8002D] text-left cursor-pointer transition-colors">TERMS & LEDGERS</button>
                <button onClick={() => alert("SECURED SYSTEMS: USER EMAILS ARE SHARED STRICTLY WITH SHIPPING PARTNERS.")} className="hover:text-[#E8002D] text-left cursor-pointer transition-colors">PRIVACY GUARANTEES</button>
                <button onClick={() => alert("CONTACT COMMUNICATORS: ENCRYPTED PORTAL SEC_CORE@YEOUBI.COM")} className="hover:text-[#E8002D] text-left cursor-pointer transition-colors">CONTACT CORE</button>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-sans text-[11px] font-black tracking-widest text-black uppercase">EXTERNAL SYSTEMS COMM</h5>
              <div className="flex space-x-4 text-xs font-mono font-bold text-zinc-700">
                <a href="#instagram" onClick={(e) => { e.preventDefault(); alert("REDIRECTING TO INSTRAGRAM FEED: @YEOUBI_RAW_SYSTEM"); }} className="hover:text-[#E8002D] transition-colors uppercase">IG FEED</a>
                <a href="#tiktok" onClick={(e) => { e.preventDefault(); alert("LAUNCHING ENCRYPTED TIKTOK TRANSMISSION: @YEOUBI_OFFICIAL"); }} className="hover:text-[#E8002D] transition-colors uppercase">TIKTOK</a>
                <a href="#youtube" onClick={(e) => { e.preventDefault(); alert("COMMENCING YOUTUBE CHANNELS ACCESS"); }} className="hover:text-[#E8002D] transition-colors uppercase">YOUTUBE</a>
              </div>
              <div className="pt-2">
                <button
                  id="btn-footer-share"
                  onClick={handleShareSystemlink}
                  className="px-4 py-2 border border-black hover:border-[#E8002D] hover:text-[#E8002D] text-[9px] font-mono tracking-widest text-black uppercase transition-all cursor-pointer flex items-center space-x-1 font-bold bg-white"
                >
                  <Share2 className="h-3 w-3" />
                  <span>YB_SHARE_SECURE_LINK</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom regulatory block standard copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-zinc-500 gap-4 font-bold">
            <div>
              YEOUBI © 2025. DIGITAL CORE AUTHORIZED BY ALLIANCE NETS.
            </div>
            <div className="flex items-center space-x-4">
              <span>DESIGNED BY YEOUBI BOUTIQUE DEPOT</span>
              <span>·</span>
              <button 
                onClick={() => handleScrollToSegment("hero-section")} 
                className="hover:text-[#E8002D] transition-colors font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>BACK TO VECTOR HEADER</span>
                <span className="font-mono">▲</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ---------------- DRAWERS & INTERACTIVE OVERLAYS ---------------- */}
      
      {/* 01. PRODUCT QUICK VIEW POPUP */}
      <ProductQuickView
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 02. INTERACTIVE BOUTIQUE BAG CART DRAWER */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* 03. LOOKBOOK GALLERY LIGHTBOX POPUP */}
      {lightboxIndex !== null && (
        <LookbookLightbox
          item={LOOKBOOK_ITEMS[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onNext={handleNextLook}
          onPrev={handlePrevLook}
        />
      )}

      {/* 04. CINEMATIC MOOD CAMPAIGN SCREEN MOCK */}
      <CampaignVideoModal
        isOpen={campaignOpen}
        onClose={() => setCampaignOpen(false)}
      />

      {/* 05. HIGH CONTRAST SEARCH KEYWORDS ENGINE */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(product: Product) => {
          setActiveProduct(product);
        }}
      />

      {/* 06. USER ACCOUNT SYSTEM LEDGERS POPUP */}
      {accountOpen && (
        <div 
          id="account-modal-overlay" 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300"
          onClick={() => setAccountOpen(false)}
        >
          <div 
            id="account-modal-box"
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 text-white p-6 relative shadow-2xl font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="btn-account-modal-close"
              onClick={() => setAccountOpen(false)}
              className="absolute right-4 top-4 p-1 border border-zinc-800 hover:border-white text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-1 border-b border-zinc-900 pb-4 mb-4 select-none">
              <Lock className="h-4 w-4 text-red-650" />
              <span className="font-display text-lg tracking-wider text-white">YEOUBI SYSTEM ACCOUNT LOGS</span>
            </div>

            {accountCreated ? (
              <div id="account-activated-panel" className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-red-950/40 border border-red-600 text-red-500 hover:text-white text-[10px] tracking-widest leading-loose">
                  REGISTRATION REGISTER_OK // DECRYPTION COMPLETE
                </div>
                <div className="space-y-1 text-xs text-zinc-300">
                  <div><strong>CONSIGNEE:</strong> {userName.toUpperCase()}</div>
                  <div><strong>SYSTEM USER KEY:</strong> <code className="text-red-500 font-bold">{userKey}</code></div>
                  <div><strong>CREDITING CLEARANCES:</strong> CLASS C SEC_CORES</div>
                  <div><strong>LEDGER HISTORY:</strong> NO PURCHASE HISTORY FOUND</div>
                </div>

                <div className="pt-4 border-t border-zinc-900">
                  <button
                    id="btn-account-recreate-exit"
                    onClick={() => {
                      setAccountCreated(false);
                      setUserName("");
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-white hover:text-black font-sans text-[10px] font-black tracking-widest text-white uppercase transition-all duration-200 cursor-pointer"
                  >
                    DESTROY KEY & RE-REGISTER
                  </button>
                </div>
              </div>
            ) : (
              <form id="account-register-form" onSubmit={handleRegisterAccount} className="space-y-4">
                <p className="text-[10px] text-zinc-400 uppercase leading-relaxed font-sans mb-3 font-semibold select-none">
                  Establish a cryptographic wallet consignee identity to save addresses, track drops status and unlock members-only items.
                </p>

                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 font-bold tracking-widest">CONSIGNEE FULL NAME</label>
                  <input
                    id="account-reg-name"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="EX: ALEXANDER KROSS"
                    className="w-full bg-black border border-zinc-800 p-3 text-xs focus:border-red-600 focus:outline-none uppercase text-white font-sans font-bold"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="btn-account-register-submit"
                    type="submit"
                    className="w-full py-3 bg-white hover:bg-red-600 hover:text-white text-black font-sans text-[10px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                  >
                    GENERATE ACCOUNT KEY →
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 mt-6 border-t border-zinc-900 text-center font-mono text-[8px] text-zinc-650 tracking-[0.2em] select-none">
              AUTHORITY ENVELOPE SHA-3 // ALL RIGHTS RESERVED
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
