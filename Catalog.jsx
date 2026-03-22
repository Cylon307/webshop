import { createSignal, For, Show, createMemo } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { PRODUCTS, CATEGORIES, addToCart } from '../stores/index.js'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const [added, setAdded] = createSignal(false)

  function handleAddToCart(e) {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div class="product-card group" onclick={() => navigate(`/product/${product.id}`)}>
      <div class="relative overflow-hidden aspect-square bg-aurum-dark">
        <img
          src={product.images[0]}
          alt={product.name}
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-aurum-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badges */}
        <div class="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge === 'Exclusive' && <span class="badge-exclusive">{product.badge}</span>}
          {product.badge === 'Members Only' && <span class="badge-exclusive">Members Only</span>}
          {product.badge === 'Limited' && <span class="badge-limited">Limited</span>}
          {product.badge?.startsWith('Limited') && product.badge !== 'Limited' && (
            <span class="badge-limited">{product.badge}</span>
          )}
          {product.badge === 'Sale' && <span class="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Sale</span>}
        </div>

        {/* Stock warning */}
        {product.stock <= 3 && (
          <div class="absolute top-2 right-2">
            <span class="bg-red-600/80 text-white text-xs px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          </div>
        )}

        {/* Quick view overlay */}
        <div class="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button
            onclick={e => { e.stopPropagation(); navigate(`/product/${product.id}`) }}
            class="flex-1 bg-aurum-dark/90 text-aurum-gold text-xs py-2 rounded border border-aurum-gold hover:bg-aurum-gold hover:text-aurum-black transition-all"
          >
            Quick View
          </button>
        </div>
      </div>

      <div class="p-4">
        <h3 class="font-display text-sm font-semibold text-aurum-text group-hover:text-aurum-gold transition-colors leading-snug mb-1">
          {product.name}
        </h3>
        <p class="text-aurum-muted text-xs mb-3">{product.description.substring(0, 60)}...</p>
        <div class="flex items-center justify-between">
          <div>
            {product.salePrice ? (
              <div class="flex items-center gap-2">
                <span class="text-aurum-gold font-bold">${product.salePrice.toLocaleString()}</span>
                <span class="text-aurum-muted text-xs line-through">${product.price.toLocaleString()}</span>
              </div>
            ) : (
              <span class="text-aurum-gold font-bold">${product.price.toLocaleString()}</span>
            )}
            <p class="text-aurum-muted text-xs">SKU: {product.sku}</p>
          </div>
          <button
            onclick={handleAddToCart}
            class={`text-xs px-3 py-2 rounded border transition-all ${
              added()
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-aurum-gold text-aurum-gold hover:bg-aurum-gold hover:text-aurum-black'
            }`}
          >
            {added() ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Catalog() {
  const [category, setCategory] = createSignal('All')
  const [priceMin, setPriceMin] = createSignal(0)
  const [priceMax, setPriceMax] = createSignal(15000)
  const [membersOnly, setMembersOnly] = createSignal(false)
  const [sortBy, setSortBy] = createSignal('Featured')
  const [view, setView] = createSignal('grid')

  const filtered = createMemo(() => {
    let items = PRODUCTS
    if (category() !== 'All') items = items.filter(p => p.category === category())
    if (membersOnly()) items = items.filter(p => p.membersOnly)
    items = items.filter(p => {
      const price = p.salePrice || p.price
      return price >= priceMin() && price <= priceMax()
    })
    if (sortBy() === 'Price: Low') items = [...items].sort((a,b) => (a.salePrice||a.price) - (b.salePrice||b.price))
    if (sortBy() === 'Price: High') items = [...items].sort((a,b) => (b.salePrice||b.price) - (a.salePrice||a.price))
    return items
  })

  return (
    <div class="min-h-screen bg-aurum-black">
      <Navbar />

      {/* Hero Banner */}
      <div class="relative bg-aurum-dark border-b border-aurum-border overflow-hidden">
        <div class="absolute inset-0 opacity-10"
          style="background: radial-gradient(ellipse at 70% 50%, rgba(240,192,64,0.4) 0%, transparent 70%)">
        </div>
        <div class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div class="md:col-span-2">
            <span class="badge-exclusive mb-2 inline-block">Curated Drop</span>
            <h1 class="font-display text-3xl font-bold text-white leading-tight mt-2">
              Aurum Noir —<br />
              <span class="text-aurum-gold gold-glow">Midnight Sculpture Series</span>
            </h1>
            <p class="text-aurum-muted mt-3 text-sm leading-relaxed max-w-lg">
              An exclusive limited-run of hand-finished sculptures. Members receive early access and complimentary authentication certificates.
            </p>
            <button class="btn-gold mt-5 px-6 py-3 rounded-lg text-xs">Explore Collection</button>
          </div>
          <div class="hidden md:flex flex-col gap-3">
            <div class="card-dark p-4">
              <span class="text-aurum-gold text-xs font-bold">Flash Offer</span>
              <p class="text-aurum-text text-sm mt-1">24-hour Members Preview</p>
            </div>
            <div class="card-dark p-4">
              <span class="text-aurum-gold text-xs font-bold">Certificate of Authenticity</span>
              <p class="text-aurum-muted text-xs mt-1">Free with select purchases</p>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <aside class="hidden lg:block w-56 flex-shrink-0">
          <div class="sticky top-24 space-y-6">
            <div>
              <h3 class="text-xs font-bold text-aurum-gold uppercase tracking-widest mb-3">Filters</h3>
            </div>

            {/* Category */}
            <div>
              <h4 class="text-xs text-aurum-muted uppercase tracking-widest mb-2">Category</h4>
              <select
                value={category()}
                onchange={e => setCategory(e.target.value)}
                class="input-dark w-full px-3 py-2 text-sm"
              >
                <For each={CATEGORIES}>{cat => <option value={cat}>{cat}</option>}</For>
              </select>
            </div>

            {/* Price range */}
            <div>
              <h4 class="text-xs text-aurum-muted uppercase tracking-widest mb-2">Price Range</h4>
              <div class="flex items-center gap-2">
                <input type="number" value={priceMin()} oninput={e => setPriceMin(+e.target.value)}
                  class="input-dark w-full px-2 py-1.5 text-xs" placeholder="Min" />
                <span class="text-aurum-muted">–</span>
                <input type="number" value={priceMax()} oninput={e => setPriceMax(+e.target.value)}
                  class="input-dark w-full px-2 py-1.5 text-xs" placeholder="Max" />
              </div>
            </div>

            {/* Members Only */}
            <div>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={membersOnly()} onchange={e => setMembersOnly(e.target.checked)}
                  class="checkbox checkbox-warning checkbox-sm" />
                <span class="text-xs text-aurum-text">Members only</span>
              </label>
            </div>

            <button onclick={() => { setCategory('All'); setPriceMin(0); setPriceMax(15000); setMembersOnly(false) }}
              class="text-xs text-aurum-muted hover:text-aurum-gold transition-colors underline">
              Reset
            </button>

            {/* Curated Picks */}
            <div class="border-t border-aurum-border pt-4">
              <h4 class="text-xs text-aurum-muted uppercase tracking-widest mb-3">Curated Picks</h4>
              <For each={PRODUCTS.slice(0, 2)}>{p => (
                <A href={`/product/${p.id}`} class="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
                  <img src={p.images[0]} alt={p.name} class="w-10 h-10 rounded object-cover" />
                  <div>
                    <p class="text-xs text-aurum-text leading-tight">{p.name}</p>
                    <p class="text-xs text-aurum-muted">Exclusive drop</p>
                  </div>
                </A>
              )}</For>
            </div>
          </div>
        </aside>

        {/* Products */}
        <main class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <p class="text-aurum-muted text-sm">Showing {filtered().length} items</p>
            <div class="flex items-center gap-3">
              <select value={sortBy()} onchange={e => setSortBy(e.target.value)}
                class="input-dark px-3 py-1.5 text-xs">
                <option>Featured</option>
                <option>Price: Low</option>
                <option>Price: High</option>
              </select>
              <div class="flex border border-aurum-border rounded overflow-hidden">
                <button onclick={() => setView('grid')}
                  class={`px-3 py-1.5 text-xs transition-colors ${view() === 'grid' ? 'bg-aurum-gold text-aurum-black' : 'text-aurum-muted hover:text-aurum-gold'}`}>
                  Grid
                </button>
                <button onclick={() => setView('list')}
                  class={`px-3 py-1.5 text-xs transition-colors ${view() === 'list' ? 'bg-aurum-gold text-aurum-black' : 'text-aurum-muted hover:text-aurum-gold'}`}>
                  List
                </button>
              </div>
            </div>
          </div>

          <div class={`grid gap-5 ${view() === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            <For each={filtered()}>
              {product => <ProductCard product={product} />}
            </For>
          </div>

          {filtered().length === 0 && (
            <div class="text-center py-20 text-aurum-muted">
              <p class="text-lg mb-2">No products found</p>
              <p class="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
