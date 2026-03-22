import { createSignal, Show } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { isAuthenticated, currentUser, isAdmin, logout, cartCount } from '../stores/index.js'

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = createSignal(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav class="sticky top-0 z-50 bg-aurum-black border-b border-aurum-border">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <A href="/catalog" class="flex items-center gap-2 group">
          <div class="w-8 h-8 bg-aurum-gold rounded-full flex items-center justify-center">
            <span class="text-aurum-black font-display font-black text-sm">A</span>
          </div>
          <span class="font-display font-bold text-lg text-aurum-gold tracking-widest gold-glow">
            AurumVault
          </span>
        </A>

        {/* Desktop Nav */}
        <div class="hidden md:flex items-center gap-8">
          <A href="/catalog" class="nav-link">Collections</A>
          <A href="/catalog?filter=new" class="nav-link">New Arrivals</A>
          <A href="/catalog?filter=exclusive" class="nav-link text-aurum-gold">Exclusives</A>
        </div>

        {/* Right side */}
        <div class="flex items-center gap-4">
          <Show when={isAdmin()}>
            <A href="/admin" class="nav-link text-aurum-gold text-xs border border-aurum-gold px-3 py-1 rounded hover:bg-aurum-gold hover:text-aurum-black transition-all">
              Admin
            </A>
          </Show>

          <Show when={isAuthenticated()} fallback={
            <A href="/login" class="nav-link">Account</A>
          }>
            <div class="flex items-center gap-3">
              <A href="/profile" class="nav-link flex items-center gap-1">
                <div class="w-7 h-7 bg-aurum-gold rounded-full flex items-center justify-center">
                  <span class="text-aurum-black font-bold text-xs">
                    {currentUser()?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span class="hidden sm:block">{currentUser()?.name}</span>
              </A>
              <button onclick={handleLogout} class="nav-link text-xs opacity-50 hover:opacity-100">
                Odjava
              </button>
            </div>
          </Show>

          <A href="/cart" class="relative p-2 text-aurum-text hover:text-aurum-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <Show when={cartCount() > 0}>
              <span class="absolute -top-1 -right-1 bg-aurum-gold text-aurum-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount()}
              </span>
            </Show>
          </A>

          {/* Mobile menu btn */}
          <button onclick={() => setMenuOpen(!menuOpen())} class="md:hidden text-aurum-text hover:text-aurum-gold">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d={menuOpen() ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Show when={menuOpen()}>
        <div class="md:hidden bg-aurum-dark border-t border-aurum-border px-4 py-4 flex flex-col gap-4">
          <A href="/catalog" class="nav-link" onclick={() => setMenuOpen(false)}>Collections</A>
          <A href="/catalog?filter=new" class="nav-link" onclick={() => setMenuOpen(false)}>New Arrivals</A>
          <A href="/catalog?filter=exclusive" class="nav-link text-aurum-gold" onclick={() => setMenuOpen(false)}>Exclusives</A>
        </div>
      </Show>
    </nav>
  )
}
