/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, ArrowUpRight } from "lucide-react";
import { NAVIGATION_LINKS } from "../data";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onScrollToSection: (id: string) => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onScrollToSection
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (link: string) => {
    setMobileMenuOpen(false);
    // Standard section target mapping
    let elementId = "";
    if (link === "HOME") elementId = "hero-section";
    else if (link === "COLLECTIONS") elementId = "featured-collection";
    else if (link === "LOOKBOOK") elementId = "lookbook-section";
    else if (link === "THE CULTURE") elementId = "culture-section";
    else if (link === "ABOUT") elementId = "about-footer";

    if (elementId) {
      onScrollToSection(elementId);
    }
  };

  return (
    <nav id="navbar" className="sticky top-0 z-50 w-full md:h-[45px] bg-white text-black flex items-center justify-between px-6 border-b border-black shrink-0 transition-all duration-300">
      <div className="w-full flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div id="nav-left-group" className="flex items-center space-x-8">
          <div 
            id="nav-logo" 
            className="flex cursor-pointer items-start select-none font-black text-xl tracking-tighter"
            onClick={() => handleLinkClick("HOME")}
          >
            YEOUBI<span className="text-[8px] align-top ml-0.5">®</span>
          </div>

          {/* Center: Curated Navigation Links (Desktop) */}
          <div id="nav-desktop-links" className="hidden lg:flex items-center space-x-5 text-[10px] font-bold tracking-widest">
            {NAVIGATION_LINKS.map((link) => (
              <button
                id={`nav-link-${link.toLowerCase().replace(/\s+/g, '-')}`}
                key={link}
                onClick={() => handleLinkClick(link)}
                className="hover:text-red-600 transition-colors duration-200 cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Action Handlers */}
        <div id="nav-actions" className="flex items-center space-x-6 text-[10px] font-bold tracking-widest uppercase">
          
          {/* SEARCH Selector */}
          <button
            id="btn-nav-search"
            onClick={onOpenSearch}
            className="hidden md:flex items-center hover:text-red-600 transition-colors duration-200 cursor-pointer uppercase"
          >
            SEARCH <span className="ml-1 text-[8px]">▼</span>
          </button>

          {/* USER ACCOUNT */}
          <button
            id="btn-nav-account"
            onClick={onOpenAccount}
            className="hover:text-red-600 transition-colors duration-200 cursor-pointer uppercase"
          >
            ACCOUNT
          </button>

          {/* SENSITIVE ACTIVE CART TRIGGER */}
          <button
            id="btn-nav-cart"
            onClick={onOpenCart}
            className="hover:text-red-600 transition-colors duration-200 cursor-pointer uppercase"
          >
            CART ({cartCount})
          </button>

          {/* Solid Tech Dot Button */}
          <button 
            id="btn-nav-tech-dot"
            onClick={onOpenCart}
            className="w-4 h-4 bg-black rounded-full hover:bg-red-600 transition-colors duration-300 cursor-pointer"
            title="System Terminal Status"
          />

          {/* Burger Menu for Mobile Screens */}
          <button
            id="btn-nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-black hover:text-red-600 transition-colors duration-150 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="nav-mobile-menu" className="lg:hidden absolute top-[100%] left-0 w-full bg-white border-b border-black py-6 px-6 shadow-2xl z-50 flex flex-col space-y-4">
          <div className="flex flex-col space-y-4 pb-4">
            {NAVIGATION_LINKS.map((link) => (
              <button
                id={`nav-link-mobile-${link.toLowerCase().replace(/\s+/g, '-')}`}
                key={link}
                onClick={() => handleLinkClick(link)}
                className="text-left font-sans text-xs font-bold tracking-[0.25em] text-zinc-700 hover:text-red-600 transition-colors duration-150"
              >
                {link}
              </button>
            ))}
          </div>
          
          <hr className="border-zinc-200" />
          
          <div className="flex items-center justify-between pt-2">
            <button
              id="btn-nav-mobile-search"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="flex items-center space-x-2 text-xs font-bold tracking-[0.2em] text-zinc-800"
            >
              <Search className="h-4 w-4 text-zinc-800" />
              <span>SEARCH</span>
            </button>
            
            <button
              id="btn-nav-mobile-account"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAccount();
              }}
              className="flex items-center space-x-2 text-xs font-bold tracking-[0.2em] text-zinc-800"
            >
              <User className="h-4 w-4 text-zinc-800" />
              <span>ACCOUNT</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
