import { createSignal, Show, For, createMemo } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { cartItems, cartTotal, clearCart, removeFromCart, updateQuantity, isAuthenticated, currentUser } from '../stores/index.js'
import Navbar from '../components/Navbar.jsx'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [step, setStep] = createSignal(1) // 1=Cart, 2=Shipping, 3=Payment, 4=Confirm
  const [coupon, setCoupon] = createSignal('')
  const [couponApplied, setCouponApplied] = createSignal(false)
  const [couponError, setCouponError] = createSignal('')
  const [paymentMethod, setPaymentMethod] = createSignal('visa')
  const [orderComplete, setOrderComplete] = createSignal(false)
  const [loading, setLoading] = createSignal(false)

  const [form, setForm] = createSignal({
    fullName: currentUser()?.name || '',
    phone: '', address: '', city: '', state: '', postal: '', country: 'Croatia',
    shipping: 'standard'
  })

  const discount = createMemo(() => couponApplied() ? cartTotal() * 0.1 : 0)
  const shipping = createMemo(() => form().shipping === 'express' ? 12 : (cartTotal() > 100 ? 0 : 12))
  const tax = createMemo(() => (cartTotal() - discount()) * 0.075)
  const total = createMemo(() => cartTotal() - discount() + shipping() + tax())

  function applyCoupon() {
    if (!isAuthenticated()) { setCouponError('Kuponi su dostupni samo prijavljenim korisnicima.'); return }
    if (coupon() === 'AURUM10') { setCouponApplied(true); setCouponError('') }
    else setCouponError('Nevažeći kupon kod.')
  }

  async function placeOrder() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setOrderComplete(true)
    clearCart()
    setLoading(false)
  }

  const steps = ['Košarica', 'Dostava', 'Plaćanje', 'Potvrda']

  if (orderComplete()) {
    return (
      <div class="min-h-screen bg-aurum-black flex flex-col">
        <Navbar />
        <div class="flex-1 flex items-center justify-center px-4">
          <div class="text-center page-enter">
            <div class="w-20 h-20 bg-aurum-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-4xl text-aurum-black">✓</span>
            </div>
            <h1 class="font-display text-3xl font-bold text-aurum-gold mb-3">Narudžba potvrđena!</h1>
            <p class="text-aurum-muted mb-2">Hvala na kupovini. Potvrda je poslana na vaš email.</p>
            <p class="text-aurum-muted text-sm mb-8">Broj narudžbe: <span class="text-aurum-gold font-bold">#AV-{Math.floor(Math.random()*90000)+10000}</span></p>
            <A href="/catalog" class="btn-gold px-8 py-3 rounded-lg inline-block">Nastavi kupovinu</A>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div class="min-h-screen bg-aurum-black">
      <Navbar />

      <div class="max-w-6xl mx-auto px-4 py-8 page-enter">
        {/* Steps */}
        <div class="flex items-center justify-center mb-10">
          <For each={steps}>{(s, i) => (
            <div class="flex items-center">
              <div class="flex flex-col items-center">
                <div class={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step() > i()+1 ? 'bg-green-600 text-white' :
                  step() === i()+1 ? 'bg-aurum-gold text-aurum-black' :
                  'bg-aurum-dark border border-aurum-border text-aurum-muted'
                }`}>
                  {step() > i()+1 ? '✓' : i()+1}
                </div>
                <span class={`text-xs mt-1 ${step() === i()+1 ? 'text-aurum-gold' : 'text-aurum-muted'}`}>{s}</span>
              </div>
              {i() < steps.length - 1 && (
                <div class={`w-16 sm:w-24 h-px mx-2 mb-4 transition-all ${step() > i()+1 ? 'bg-aurum-gold' : 'bg-aurum-border'}`}></div>
              )}
            </div>
          )}</For>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div class="lg:col-span-2 space-y-6">

            {/* Step 1: Cart Review */}
            <Show when={step() === 1}>
              <div class="card-dark p-6">
                <h2 class="font-display text-lg font-bold text-aurum-gold mb-4">Vaša košarica</h2>
                <Show when={cartItems().length === 0}>
                  <div class="text-center py-8 text-aurum-muted">
                    <p>Košarica je prazna</p>
                    <A href="/catalog" class="text-aurum-gold text-sm hover:underline mt-2 inline-block">Idi na katalog</A>
                  </div>
                </Show>
                <For each={cartItems()}>{item => (
                  <div class="flex items-center gap-4 py-4 border-b border-aurum-border last:border-0">
                    <img src={item.images?.[0]} alt={item.name} class="w-16 h-16 rounded object-cover bg-aurum-dark" />
                    <div class="flex-1">
                      <p class="text-aurum-text text-sm font-medium">{item.name}</p>
                      <p class="text-aurum-muted text-xs">{item.sku}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button onclick={() => updateQuantity(item.id, item.quantity - 1)}
                        class="w-6 h-6 border border-aurum-border rounded text-xs hover:border-aurum-gold text-aurum-text">−</button>
                      <span class="text-sm text-aurum-text w-6 text-center">{item.quantity}</span>
                      <button onclick={() => updateQuantity(item.id, item.quantity + 1)}
                        class="w-6 h-6 border border-aurum-border rounded text-xs hover:border-aurum-gold text-aurum-text">+</button>
                    </div>
                    <span class="text-aurum-gold font-bold text-sm w-20 text-right">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button onclick={() => removeFromCart(item.id)} class="text-aurum-muted hover:text-red-400 text-lg">×</button>
                  </div>
                )}</For>
              </div>

              {/* Coupon */}
              <div class="card-dark p-6">
                <div class="flex items-center gap-3">
                  <input type="text" value={coupon()} oninput={e => setCoupon(e.target.value)}
                    placeholder="Promo kod"
                    class={`input-dark flex-1 px-4 py-2 text-sm ${!isAuthenticated() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isAuthenticated()}
                  />
                  <button onclick={applyCoupon} class="btn-gold px-4 py-2 text-sm rounded">Primijeni</button>
                </div>
                <Show when={couponError()}>
                  <p class="text-red-400 text-xs mt-2">⚠ {couponError()}</p>
                </Show>
                <Show when={couponApplied()}>
                  <p class="text-green-400 text-xs mt-2">✓ Kupon AURUM10 primijenjen — 10% popusta</p>
                </Show>
                <Show when={!isAuthenticated()}>
                  <p class="text-aurum-muted text-xs mt-2">
                    Kuponi su dostupni samo prijavljenim korisnicima.{' '}
                    <A href="/login" class="text-aurum-gold hover:underline">Prijavi se</A>
                  </p>
                </Show>
              </div>

              <button onclick={() => setStep(2)} disabled={cartItems().length === 0}
                class="btn-gold w-full py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Nastavi na dostavu →
              </button>
            </Show>

            {/* Step 2: Shipping */}
            <Show when={step() === 2}>
              <div class="card-dark p-6">
                <h2 class="font-display text-lg font-bold text-aurum-gold mb-4">Podaci za dostavu</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Ime i prezime</label>
                    <input type="text" value={form().fullName} oninput={e => setForm({...form(), fullName: e.target.value})}
                      class="input-dark w-full px-4 py-2.5 text-sm" placeholder="Ivan Horvat" />
                  </div>
                  <div>
                    <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Telefon</label>
                    <input type="tel" value={form().phone} oninput={e => setForm({...form(), phone: e.target.value})}
                      class="input-dark w-full px-4 py-2.5 text-sm" placeholder="+385 91 234 5678" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Adresa</label>
                    <input type="text" value={form().address} oninput={e => setForm({...form(), address: e.target.value})}
                      class="input-dark w-full px-4 py-2.5 text-sm" placeholder="Ulica i broj" />
                  </div>
                  <div>
                    <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Grad</label>
                    <input type="text" value={form().city} oninput={e => setForm({...form(), city: e.target.value})}
                      class="input-dark w-full px-4 py-2.5 text-sm" placeholder="Zagreb" />
                  </div>
                  <div>
                    <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-1.5">Poštanski broj</label>
                    <input type="text" value={form().postal} oninput={e => setForm({...form(), postal: e.target.value})}
                      class="input-dark w-full px-4 py-2.5 text-sm" placeholder="10000" />
                  </div>
                </div>

                <div class="mt-6">
                  <h3 class="text-xs text-aurum-muted uppercase tracking-widest mb-3">Metoda dostave</h3>
                  <div class="space-y-2">
                    {[
                      { value: 'standard', label: 'Standard — 3–5 business days', price: cartTotal() > 100 ? 'Besplatno' : '$12.00' },
                      { value: 'express', label: 'Express — 1–2 business days', price: '$12.00 extra' },
                    ].map(opt => (
                      <label class={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${
                        form().shipping === opt.value ? 'border-aurum-gold bg-aurum-dark' : 'border-aurum-border hover:border-aurum-muted'
                      }`}>
                        <input type="radio" name="shipping" value={opt.value} checked={form().shipping === opt.value}
                          onchange={() => setForm({...form(), shipping: opt.value})}
                          class="radio radio-warning radio-sm" />
                        <div class="flex-1">
                          <p class="text-sm text-aurum-text">{opt.label}</p>
                        </div>
                        <span class="text-aurum-gold text-sm font-bold">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <button onclick={() => setStep(1)} class="flex-1 py-3 border border-aurum-border text-aurum-muted rounded-lg text-sm hover:border-aurum-gold transition-colors">
                  ← Nazad
                </button>
                <button onclick={() => setStep(3)} class="flex-1 btn-gold py-3 rounded-lg text-sm">
                  Nastavi na plaćanje →
                </button>
              </div>
            </Show>

            {/* Step 3: Payment */}
            <Show when={step() === 3}>
              <div class="card-dark p-6">
                <h2 class="font-display text-lg font-bold text-aurum-gold mb-4">Način plaćanja</h2>

                <div class="space-y-3 mb-6">
                  {[
                    { value: 'visa', label: 'Visa ending 4242', sub: 'Nikad ne ističe' },
                    { value: 'mc',   label: 'Mastercard ending 8828', sub: 'Expires 12/2026' },
                    { value: 'amex', label: 'American Express ending 3358', sub: 'Expires 09/2025' },
                  ].map(card => (
                    <label class={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-colors ${
                      paymentMethod() === card.value ? 'border-aurum-gold bg-aurum-dark' : 'border-aurum-border hover:border-aurum-muted'
                    }`}>
                      <input type="radio" name="payment" checked={paymentMethod() === card.value}
                        onchange={() => setPaymentMethod(card.value)} class="radio radio-warning radio-sm" />
                      <div class="w-10 h-6 bg-aurum-muted rounded flex items-center justify-center text-xs text-white">
                        {card.value === 'visa' ? 'VISA' : card.value === 'mc' ? 'MC' : 'AMEX'}
                      </div>
                      <div class="flex-1">
                        <p class="text-sm text-aurum-text">{card.label}</p>
                        <p class="text-xs text-aurum-muted">{card.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div class="border-t border-aurum-border pt-4">
                  <h3 class="text-xs text-aurum-muted uppercase tracking-widest mb-3">Dodaj novu karticu</h3>
                  <div class="grid grid-cols-1 gap-3">
                    <input placeholder="Ime na kartici" class="input-dark px-4 py-2.5 text-sm" />
                    <input placeholder="Broj kartice" class="input-dark px-4 py-2.5 text-sm" />
                    <div class="grid grid-cols-2 gap-3">
                      <input placeholder="MM / YY" class="input-dark px-4 py-2.5 text-sm" />
                      <input placeholder="CVC" class="input-dark px-4 py-2.5 text-sm" />
                    </div>
                  </div>
                </div>

                <p class="text-center text-aurum-muted text-xs mt-4">
                  🔒 PCI-SSL compliant. Vaši podaci su sigurni.
                </p>
              </div>

              <div class="flex gap-3">
                <button onclick={() => setStep(2)} class="flex-1 py-3 border border-aurum-border text-aurum-muted rounded-lg text-sm hover:border-aurum-gold transition-colors">
                  ← Nazad
                </button>
                <button onclick={() => setStep(4)} class="flex-1 btn-gold py-3 rounded-lg text-sm">
                  Pregled narudžbe →
                </button>
              </div>
            </Show>

            {/* Step 4: Confirm */}
            <Show when={step() === 4}>
              <div class="card-dark p-6">
                <h2 class="font-display text-lg font-bold text-aurum-gold mb-4">Potvrda narudžbe</h2>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-aurum-muted">Adresa:</span>
                    <span class="text-aurum-text text-right">{form().address}, {form().city}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-aurum-muted">Dostava:</span>
                    <span class="text-aurum-text">{form().shipping === 'express' ? 'Express' : 'Standard'}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-aurum-muted">Plaćanje:</span>
                    <span class="text-aurum-text capitalize">{paymentMethod()}</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-3">
                <button onclick={() => setStep(3)} class="flex-1 py-3 border border-aurum-border text-aurum-muted rounded-lg text-sm hover:border-aurum-gold transition-colors">
                  ← Nazad
                </button>
                <button onclick={placeOrder} disabled={loading()} class="flex-1 btn-gold py-3 rounded-lg text-sm">
                  {loading() ? 'Obrađujem...' : '✓ Naruči'}
                </button>
              </div>
            </Show>
          </div>

          {/* Order Summary */}
          <div class="lg:col-span-1">
            <div class="card-dark p-6 sticky top-24">
              <h3 class="font-display text-sm font-bold text-aurum-gold uppercase tracking-widest mb-4">
                Sažetak narudžbe
              </h3>
              <div class="text-xs text-aurum-muted mb-2">
                {cartItems().length} {cartItems().length === 1 ? 'artikl' : 'artikala'}
              </div>
              <For each={cartItems()}>{item => (
                <div class="flex items-center gap-2 mb-2 text-xs">
                  <img src={item.images?.[0]} alt="" class="w-8 h-8 rounded object-cover" />
                  <span class="flex-1 text-aurum-text truncate">{item.name}</span>
                  <span class="text-aurum-gold">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              )}</For>

              <div class="border-t border-aurum-border mt-4 pt-4 space-y-2 text-sm">
                <div class="flex justify-between text-aurum-muted">
                  <span>Subtotal</span><span>${cartTotal().toLocaleString()}</span>
                </div>
                <Show when={couponApplied()}>
                  <div class="flex justify-between text-green-400">
                    <span>Popust (10%)</span><span>−${discount().toFixed(2)}</span>
                  </div>
                </Show>
                <div class="flex justify-between text-aurum-muted">
                  <span>Dostava</span>
                  <span>{shipping() === 0 ? <span class="text-green-400">Besplatno</span> : `$${shipping().toFixed(2)}`}</span>
                </div>
                <div class="flex justify-between text-aurum-muted">
                  <span>PDV</span><span>${tax().toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-aurum-gold font-bold text-base pt-2 border-t border-aurum-border">
                  <span>Ukupno</span><span>${total().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
