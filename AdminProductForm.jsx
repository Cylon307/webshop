import { createSignal, Show, For } from 'solid-js'
import { A, useNavigate, useParams } from '@solidjs/router'
import { isAdmin, PRODUCTS } from '../stores/index.js'

export default function AdminProductForm() {
  const params = useParams()
  const navigate = useNavigate()
  const isEdit = !!params.id
  const existing = isEdit ? PRODUCTS.find(p => p.id === +params.id) : null

  if (!isAdmin()) { navigate('/login'); return null }

  const [saved, setSaved] = createSignal(false)
  const [published, setPublished] = createSignal(false)

  const [form, setForm] = createSignal({
    title:       existing?.name || '',
    sku:         existing?.sku || '',
    price:       existing?.price || '',
    salePrice:   existing?.salePrice || '',
    inventory:   existing?.stock || '',
    description: existing?.description || '',
    tags:        existing?.badge ? [existing.badge] : ['Accessories'],
    primaryCat:  existing?.category || 'Accessories',
  })

  const [variants] = createSignal([
    { size: 'M', color: 'Onyx', sku: 'AV-WLT-021-M-ONY', inv: 120, price: 59 },
    { size: 'L', color: 'Onyx', sku: 'AV-WLT-021-L-ONY', inv: 80,  price: 69 },
    { size: 'S', color: 'Ash',  sku: 'AV-WLT-021-S-ASH', inv: 40,  price: 69 },
  ])

  function handleSaveDraft() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handlePublish() {
    setPublished(true)
    setTimeout(() => { setPublished(false); navigate('/admin') }, 1500)
  }

  return (
    <div class="min-h-screen bg-aurum-black">
      {/* Admin top bar */}
      <div class="bg-aurum-dark border-b border-aurum-border px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4 text-sm">
          <A href="/admin" class="flex items-center gap-2">
            <div class="w-6 h-6 bg-aurum-gold rounded-full flex items-center justify-center">
              <span class="text-aurum-black font-black text-xs">A</span>
            </div>
            <span class="font-display font-bold text-aurum-gold tracking-widest hidden sm:block">AurumVault</span>
          </A>
          <span class="text-aurum-muted">›</span>
          <A href="/admin" class="text-aurum-muted hover:text-aurum-gold text-xs">Admin</A>
          <span class="text-aurum-muted">›</span>
          <A href="/admin" class="text-aurum-muted hover:text-aurum-gold text-xs">Products</A>
          <span class="text-aurum-muted">›</span>
          <span class="text-aurum-text text-xs">{isEdit ? 'Edit product' : 'New product'}</span>
        </div>
        <div class="flex items-center gap-3">
          <button class="text-xs border border-aurum-border text-aurum-muted px-3 py-1.5 rounded hover:border-aurum-gold transition-colors">
            Duplicate
          </button>
          <button class="text-xs border border-aurum-border text-aurum-muted px-3 py-1.5 rounded hover:border-aurum-gold transition-colors">
            Bulk Import
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div class="flex items-center gap-4 mb-8">
          <h1 class="font-display text-2xl font-bold text-white">
            {isEdit ? 'Add / Edit Product' : 'Add New Product'}
          </h1>
          <span class="text-xs border border-yellow-500 text-yellow-500 px-2 py-0.5 rounded">
            ⚠ Inline validation enabled
          </span>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div class="xl:col-span-2 space-y-6">

            {/* Title */}
            <div class="card-dark p-6">
              <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Product Title</label>
              <input
                type="text"
                value={form().title}
                oninput={e => setForm({...form(), title: e.target.value})}
                class="input-dark w-full px-4 py-3 text-sm font-medium"
                placeholder="Make the title descriptive and SEO friendly"
              />
              <p class="text-aurum-muted text-xs mt-1">Make the title descriptive and SEO friendly</p>
            </div>

            {/* SKU + Price */}
            <div class="card-dark p-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">SKU</label>
                  <input type="text" value={form().sku} oninput={e => setForm({...form(), sku: e.target.value})}
                    class="input-dark w-full px-4 py-2.5 text-sm" placeholder="AV-XXX-000" />
                  <p class="text-aurum-muted text-xs mt-1">Unique stock keeping unit</p>
                </div>
                <div>
                  <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">
                    Price (USD) <span class="text-red-400">Required</span>
                  </label>
                  <input type="number" value={form().price} oninput={e => setForm({...form(), price: e.target.value})}
                    class="input-dark w-full px-4 py-2.5 text-sm" placeholder="Base retail price" />
                </div>
                <div>
                  <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Sale Price (optional)</label>
                  <input type="number" value={form().salePrice} oninput={e => setForm({...form(), salePrice: e.target.value})}
                    class="input-dark w-full px-4 py-2.5 text-sm" placeholder="Displayed during active sale period" />
                </div>
                <div>
                  <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Inventory Count</label>
                  <input type="number" value={form().inventory} oninput={e => setForm({...form(), inventory: e.target.value})}
                    class="input-dark w-full px-4 py-2.5 text-sm" placeholder="Available stock units across variants" />
                </div>
              </div>
            </div>

            {/* Categories & Tags */}
            <div class="card-dark p-6">
              <div class="flex items-start gap-6">
                <div class="flex-1">
                  <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-2">Categories & Tags</label>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <For each={form().tags}>{tag => (
                      <span class="badge-exclusive flex items-center gap-1">
                        {tag}
                        <button onclick={() => setForm({...form(), tags: form().tags.filter(t => t !== tag)})}
                          class="hover:text-red-300 ml-1">×</button>
                      </span>
                    )}</For>
                  </div>
                  <input type="text" placeholder="Add category or tag and press enter"
                    class="input-dark w-full px-4 py-2.5 text-sm"
                    onkeydown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        setForm({...form(), tags: [...form().tags, e.target.value.trim()]})
                        e.target.value = ''
                        e.preventDefault()
                      }
                    }} />
                </div>
                <div>
                  <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-2">Primary Category</label>
                  <select value={form().primaryCat} onchange={e => setForm({...form(), primaryCat: e.target.value})}
                    class="input-dark px-3 py-2.5 text-sm">
                    {['Rings','Necklaces','Watches','Accessories','Art Objects'].map(c => (
                      <option value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div class="card-dark p-6">
              <div class="flex items-center justify-between mb-4">
                <label class="block text-xs text-aurum-muted uppercase tracking-widest">Variants (Size / Color)</label>
                <div class="flex gap-2">
                  <button class="text-xs border border-aurum-border text-aurum-muted px-3 py-1.5 rounded hover:border-aurum-gold transition-colors">
                    + Add Variant
                  </button>
                  <button class="text-xs border border-aurum-border text-aurum-muted px-3 py-1.5 rounded hover:border-aurum-gold transition-colors">
                    Bulk Add
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <For each={variants()}>{v => (
                  <div class="bg-aurum-dark border border-aurum-border rounded-lg p-4">
                    <p class="text-xs font-bold text-aurum-gold mb-2">Size: {v.size} · Color: {v.color}</p>
                    <p class="text-xs text-aurum-muted mb-3">SKU {v.sku}</p>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-xs text-aurum-muted mb-1">Inventory</label>
                        <input type="number" value={v.inv} class="input-dark w-full px-2 py-1.5 text-xs" />
                      </div>
                      <div>
                        <label class="block text-xs text-aurum-muted mb-1">Price</label>
                        <input type="number" value={v.price} class="input-dark w-full px-2 py-1.5 text-xs" />
                      </div>
                    </div>
                  </div>
                )}</For>
              </div>
            </div>

            {/* Description */}
            <div class="card-dark p-6">
              <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-2">Product Description</label>
              <div class="flex gap-2 mb-2">
                {['B','I','Link','UL'].map(tool => (
                  <button class="border border-aurum-border text-aurum-muted text-xs px-2 py-1 rounded hover:border-aurum-gold transition-colors">
                    {tool}
                  </button>
                ))}
              </div>
              <textarea
                value={form().description}
                oninput={e => setForm({...form(), description: e.target.value})}
                rows={5}
                class="input-dark w-full px-4 py-3 text-sm resize-none"
                placeholder="Describe the product with features, materials, and storytelling."
              />
              <p class="text-aurum-muted text-xs mt-1">This description will appear on the public product page and in search previews.</p>
            </div>

            {/* Product Images */}
            <div class="card-dark p-6">
              <div class="flex items-center justify-between mb-2">
                <label class="block text-xs text-aurum-muted uppercase tracking-widest">Product Images</label>
                <span class="text-aurum-muted text-xs">Max 12 images · 5MB each</span>
              </div>
              <div class="border-2 border-dashed border-aurum-border rounded-lg p-8 text-center hover:border-aurum-gold transition-colors cursor-pointer">
                <p class="text-aurum-muted text-sm">Drag & drop or click to upload</p>
                <p class="text-aurum-muted text-xs mt-1">Supported: JPG, PNG, GIF. Primary image will be first in gallery</p>
              </div>
            </div>
          </div>

          {/* Right: Preview + Actions */}
          <div class="space-y-4">
            {/* Notifications */}
            <Show when={saved()}>
              <div class="bg-green-900/30 border border-green-500 rounded-lg p-3 flex items-start gap-2 text-sm">
                <span class="text-green-400">✓</span>
                <div>
                  <p class="text-green-400 font-bold">Product saved</p>
                  <p class="text-green-400/70 text-xs">Your changes were saved as a draft.</p>
                </div>
              </div>
            </Show>

            {/* Product Preview Card */}
            <div class="card-dark p-4">
              <h3 class="text-xs text-aurum-muted uppercase tracking-widest mb-3">Live Preview</h3>
              <div class="bg-aurum-dark rounded-lg overflow-hidden">
                <div class="aspect-square bg-aurum-muted flex items-center justify-center">
                  <Show when={existing?.images?.[0]} fallback={
                    <p class="text-aurum-muted text-xs">No image</p>
                  }>
                    <img src={existing?.images?.[0]} alt="" class="w-full h-full object-cover" />
                  </Show>
                </div>
                <div class="p-3">
                  <Show when={form().tags.length > 0}>
                    <span class="badge-exclusive mb-2 inline-block">{form().tags[0]}</span>
                  </Show>
                  <p class="text-aurum-text text-xs font-medium">{form().title || 'Product title'}</p>
                  <p class="text-aurum-muted text-xs">{form().sku}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-aurum-gold font-bold text-sm">${form().salePrice || form().price || '0.00'}</span>
                    {form().salePrice && <span class="text-aurum-muted text-xs line-through">${form().price}</span>}
                  </div>
                </div>
              </div>
              <div class="flex gap-2 mt-3">
                <button class="flex-1 text-xs border border-aurum-border text-aurum-muted py-1.5 rounded hover:border-aurum-gold transition-colors">
                  Preview on Site
                </button>
                <button class="flex-1 text-xs border border-aurum-border text-aurum-muted py-1.5 rounded hover:border-aurum-gold transition-colors">
                  Share Preview Link
                </button>
              </div>
            </div>

            {/* Performance Snapshot */}
            <div class="card-dark p-4">
              <h3 class="text-xs text-aurum-muted uppercase tracking-widest mb-3">Performance Snapshot</h3>
              <p class="text-aurum-muted text-xs mb-2">Estimated CTR and conversion for members</p>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between"><span class="text-aurum-muted">Views this week:</span><span class="text-aurum-text">1,240</span></div>
                <div class="flex justify-between"><span class="text-aurum-muted">Add to carts:</span><span class="text-aurum-text">86</span></div>
                <div class="flex justify-between"><span class="text-aurum-muted">Conversion:</span><span class="text-aurum-gold font-bold">6.9%</span></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div class="card-dark p-4 space-y-3">
              <button onclick={handleSaveDraft}
                class="w-full border border-aurum-border text-aurum-text py-2.5 rounded text-sm hover:border-aurum-gold transition-colors">
                💾 Save Draft
              </button>
              <button onclick={handlePublish}
                class="w-full btn-gold py-2.5 rounded text-sm">
                {published() ? '✓ Published!' : '🚀 Publish'}
              </button>
              <button class="w-full border border-red-500/30 text-red-400 py-2.5 rounded text-sm hover:bg-red-900/20 transition-colors">
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
