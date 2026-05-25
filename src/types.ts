/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  season: string;
  image: string;
  description: string;
  badge?: string;
  specs: string[];
}

export interface CartItem {
  product: Product;
  size: "S" | "M" | "L" | "XL";
  quantity: number;
}

export interface LookbookItem {
  id: string;
  url: string;
  location: string;
  outfit: string;
}
