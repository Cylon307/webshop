import { createSignal, createContext, useContext } from 'solid-js'

// ── Auth Store ──────────────────────────────────────────────
export const [isAuthenticated, setIsAuthenticated] = createSignal(false)
export const [currentUser, setCurrentUser] = createSignal(null)
export const [isAdmin, setIsAdmin] = createSignal(false)

export function login(user) {
  setCurrentUser(user)
  setIsAuthenticated(true)
  setIsAdmin(user.role === 'admin')
}

export function logout() {
  setCurrentUser(null)
  setIsAuthenticated(false)
  setIsAdmin(false)
}

// ── Password Gate ───────────────────────────────────────────
export const [siteUnlocked, setSiteUnlocked] = createSignal(false)
export const SITE_PASSCODE = 'aurum2025'

// ── Cart Store ──────────────────────────────────────────────
export const [cartItems, setCartItems] = createSignal([])

export function addToCart(product, quantity = 1) {
  setCartItems(prev => {
    const existing = prev.find(i => i.id === product.id)
    if (existing) {
      return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
    }
    return [...prev, { ...product, quantity }]
  })
}

export function removeFromCart(productId) {
  setCartItems(prev => prev.filter(i => i.id !== productId))
}

export function updateQuantity(productId, quantity) {
  if (quantity <= 0) { removeFromCart(productId); return }
  setCartItems(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i))
}

export function clearCart() { setCartItems([]) }

export function cartTotal() {
  return cartItems().reduce((sum, i) => sum + i.price * i.quantity, 0)
}

export function cartCount() {
  return cartItems().reduce((sum, i) => sum + i.quantity, 0)
}

// ── Mock Products ────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: 1, name: 'Aurum Signet Classic', price: 249, salePrice: null,
    category: 'Rings', badge: 'Exclusive', membersOnly: true,
    stock: 5, sku: 'AV-RLIC-09',
    description: 'Refined signet ring crafted for understated luxury. Brushed finish with polished bezel. Hand-finished and numbered.',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'],
    sizes: ['5','7','8','9'],
  },
  {
    id: 2, name: '18k Locket — Heirloom', price: 7800, salePrice: null,
    category: 'Necklaces', badge: 'Members Only', membersOnly: true,
    stock: 1, sku: 'AV-542',
    description: 'Hand-engraved, comes with box. A timeless piece for generations.',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600'],
    sizes: [],
  },
  {
    id: 3, name: 'Enamel Timepiece — Aurora', price: 12900, salePrice: null,
    category: 'Watches', badge: 'Limited', membersOnly: false,
    stock: 3, sku: 'TF-337',
    description: '39mm manual wind. A statement piece in deep enamel and gold.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    sizes: [],
  },
  {
    id: 4, name: 'Ceremonial Mask — Obsidian', price: 9250, salePrice: null,
    category: 'Art Objects', badge: 'Limited 2', membersOnly: false,
    stock: 2, sku: 'CM-016',
    description: 'Museum-quality finish. Hand-crafted obsidian ceremonial mask.',
    images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600'],
    sizes: [],
  },
  {
    id: 5, name: 'Vault Pendant — Hammered', price: 1150, salePrice: null,
    category: 'Necklaces', badge: 'Members Only', membersOnly: true,
    stock: 8, sku: 'IT-325',
    description: 'Chain sold separately. Hammered gold finish pendant.',
    images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600'],
    sizes: [],
  },
  {
    id: 6, name: 'Eclipse Graph Leather Wallet', price: 89, salePrice: 69,
    category: 'Accessories', badge: 'Sale', membersOnly: false,
    stock: 240, sku: 'AV-WLT-021',
    description: 'Compact RFID-protected leather wallet with premium finishing. Available in Onyx and Ash.',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
    sizes: [],
  },
  {
    id: 7, name: 'Aurum Slim Band', price: 129, salePrice: null,
    category: 'Rings', badge: null, membersOnly: false,
    stock: 15, sku: 'AV-SLM-03',
    description: 'Sleek and minimal. 18k gold plated over sterling.',
    images: ['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600'],
    sizes: ['5','6','7','8','9'],
  },
  {
    id: 8, name: 'Vintage Crest Necklace', price: 189, salePrice: null,
    category: 'Necklaces', badge: null, membersOnly: false,
    stock: 6, sku: 'AV-VCN-11',
    description: 'Victorian-inspired crest pendant on 18" gold chain.',
    images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600'],
    sizes: [],
  },
]

export const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Watches', 'Accessories', 'Art Objects']

// ── Orders Store ─────────────────────────────────────────────
export const [orders, setOrders] = createSignal([
  { id: '#AV-10081', customer: 'Javier Mendes', total: 249, status: 'Processing', date: '28 Feb 2025' },
  { id: '#AV-10078', customer: 'Leila Morgan',  total: 79,  status: 'Awaiting Fulfillment', date: '28 Feb 2025' },
  { id: '#AV-10070', customer: 'Chen Wei',      total: 436, status: 'Shipped', date: '27 Feb 2025' },
  { id: '#AV-10065', customer: 'Priya Nair',    total: 59,  status: 'Pending', date: '27 Feb 2025' },
])
