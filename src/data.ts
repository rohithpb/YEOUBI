/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, LookbookItem } from "./types";

// Import custom AI-generated images using relative paths for Vite compiling safety
import heroStreetwear from "./assets/images/hero_streetwear_1779716105139.png";
import productRaw from "./assets/images/product_raw_1779716122171.png";
import productDark from "./assets/images/product_dark_1779716139064.png";
import productChaos from "./assets/images/product_chaos_1779716176928.png";
import productGravity from "./assets/images/product_gravity_1779716192607.png";
import limitedBag from "./assets/images/limited_bag_1779716157361.png";

export const IMAGES = {
  hero: heroStreetwear,
  productRaw,
  productDark,
  productChaos,
  productGravity,
  limitedBag,
  culture: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80&sat=-100"
};

export const PRODUCTS: Product[] = [
  {
    id: "raw-reflections",
    name: "RAW REFLECTIONS HOODIE",
    price: 185,
    season: "SS25",
    image: productRaw,
    badge: "NEW",
    description: "Heavyweight 480GSM French Terry cotton pullover featuring experimental outer raw edge design, dynamic double-panel protective hood, and distressed industrial wash. Signature oversized streetwear cut.",
    specs: [
      "Heavyweight 480GSM French Terry Cotton",
      "Raw Seams Exterior Engineering",
      "Signature Rear Silhouette Overlock Stitch",
      "Double-layered Drop-back Hood",
      "Handcrafted in Portugal"
    ]
  },
  {
    id: "dark-matter",
    name: "DARK MATTER FLIGHT CARGOS",
    price: 210,
    season: "SS25",
    image: productDark,
    description: "Technical dynamic utility flight cargos built with adjustable modular straps, military-grade tactical steel hardware zippers, and reinforced ergonomic double-knee grids. Finished in premium waterproof ripstop.",
    specs: [
      "High-grade Ripstop Nylon-Cotton Blend",
      "Reinforced Double-Layer Knee Sections",
      "Adjustable Signature Utility Straps",
      "Ankle Elastic Drawcord Locking Cinch System",
      "Signature YEOUBI Industrial Hardware"
    ]
  },
  {
    id: "chaos-theory",
    name: "CHAOS THEORY KNIT SWEATER",
    price: 165,
    season: "FW24",
    image: productChaos,
    description: "Premium intarsia knit sweater showcasing custom technical chaos motifs. Features hand-worked destructed raw distressing at collar bone, cuffs, and hem waistline for an authentic aggressive look.",
    specs: [
      "80% Extra Fine Merino Wool, 20% Nylon",
      "Handmade Distressed Details at Hems",
      "Intarsia Jacquard Abstract Graphics",
      "Prewashed for Optimal Velvet Texture",
      "Slouchy Sloped-Shoulder Construction"
    ]
  },
  {
    id: "zero-gravity",
    name: "ZERO GRAVITY HIGH-DENSITY TEE",
    price: 85,
    season: "FW24",
    image: productGravity,
    description: "Heavyweight urban basic built from carded cotton fibers. Includes high-density silicon abstract graphic prints layered on front collar and rear back. Designed with thick rib finish collar.",
    specs: [
      "300GSM Solid Ring-Spun Cotton",
      "High-Density 3D Silicon Heat-Press Artwork",
      "Thick Vintage 3.5cm Spandex Mock Collar",
      "Double-Needle Flatlock Reinforcements",
      "Sanforized Treatment to Stop Shrinking"
    ]
  }
];

export const LIMITED_DROP_PRODUCT: Product = {
  id: "limited-pouch",
  name: "YEOUBI METALLIC UTILITY POUCH",
  price: 145,
  season: "SS25 DROP",
  image: limitedBag,
  badge: "LIMITED",
  description: "Exclusive collector-grade modular utility sling pouch. Engineered from hyper-reflective metallic chrome technical canvas, with aerospace-grade anodized aluminum fasteners, structural dynamic paracord adjustments, and laser-carved YEOUBI serial numbers.",
  specs: [
    "Reflective Chrome Weatherproof Face",
    "Aircraft Anodized Aluminum Fasteners",
    "Braided Heavy Duty Paracord Pullers",
    "Laser-Carved Serial Coding Plate",
    "Extremely Limited Release (No Restocks)"
  ]
};

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: "look-1",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80&sat=-100",
    location: "Concrete Viaduct, Tokyo District",
    outfit: "RAW REFLECTIONS HOODIE + CORE SLING BAG"
  },
  {
    id: "look-2",
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80&sat=-100",
    location: "Underpass Block, Shinjuku District",
    outfit: "RAW SEAM WIND JACKET + FLIGHT CARGOS"
  },
  {
    id: "look-3",
    url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80&sat=-100",
    location: "Loading Dock 04, Berlin Outskirts",
    outfit: "CHAOS THEORY KNIT + DISTRESSED DENIM"
  },
  {
    id: "look-4",
    url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80&sat=-100",
    location: "Abandoned Brutalist Plaza, Warsaw",
    outfit: "ZERO GRAVITY TEE + REFLECTIVE SHIELD GLASS"
  }
];

export const NAVIGATION_LINKS = ["HOME", "COLLECTIONS", "LOOKBOOK", "THE CULTURE", "ABOUT"];
