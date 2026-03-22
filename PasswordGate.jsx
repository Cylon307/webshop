import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { setSiteUnlocked, SITE_PASSCODE } from '../stores/index.js'

export default function PasswordGate() {
  const navigate = useNavigate()
  const [passcode, setPasscode] = createSignal('')
  const [error, setError] = createSignal(false)
  const [loading, setLoading] = createSignal(false)

  async function handleUnlock(e) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    // Simulate async check
    await new Promise(r => setTimeout(r, 800))
    if (passcode() === SITE_PASSCODE) {
      setSiteUnlocked(true)
      navigate('/catalog')
    } else {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div class="min-h-screen bg-aurum-black flex flex-col">
      {/* Top bar */}
      <div class="flex items-center justify-between px-6 py-4 border-b border-aurum-border">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-aurum-gold rounded-full flex items-center justify-center">
            <span class="text-aurum-black font-display font-black text-sm">A</span>
          </div>
          <span class="font-display font-bold text-aurum-gold tracking-widest text-lg gold-glow">AurumVault</span>
        </div>
        <div class="flex items-center gap-6 text-xs text-aurum-muted">
          <span class="flex items-center gap-2">
            Accessibility
            <span class="w-8 h-4 bg-aurum-gold rounded-full inline-block"></span>
          </span>
          <span class="hidden sm:block">High Contrast</span>
          <span class="hidden sm:block">Larger Text</span>
        </div>
      </div>

      {/* Main content */}
      <div class="flex-1 flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center page-enter">

          {/* Vault image */}
          <div class="hidden lg:block">
            <div class="relative rounded-xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
                alt="Vault"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-aurum-black via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Passcode form */}
          <div class="gold-border-anim bg-aurum-card rounded-2xl p-8">
            <div class="text-center mb-8">
              <span class="badge-exclusive mb-3 inline-block">Exclusive</span>
              <h1 class="font-display text-2xl font-bold text-white leading-tight mt-2">
                Exclusive access —<br />enter passcode
              </h1>
              <p class="text-aurum-muted text-sm mt-3 leading-relaxed">
                This site is restricted to approved members. Enter the site-wide passcode to continue to AurumVault's private catalog.
              </p>
            </div>

            <form onsubmit={handleUnlock}>
              <label class="block text-xs text-aurum-muted uppercase tracking-widest mb-2">
                Site passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode"
                value={passcode()}
                oninput={e => { setPasscode(e.target.value); setError(false) }}
                class={`input-dark w-full px-4 py-3 text-sm mb-3 ${error() ? 'border-red-500' : ''}`}
              />

              {error() && (
                <div class="flex items-center justify-between mb-4">
                  <p class="text-red-400 text-xs flex items-center gap-1">
                    <span>⚠</span> Passcode incorrect. Please try again.
                  </p>
                  <a href="#" class="text-aurum-gold text-xs hover:underline">Need help? Contact support</a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading()}
                class="btn-gold w-full py-3 rounded-lg text-sm mt-2"
              >
                {loading() ? 'Verifying...' : 'Unlock Vault'}
              </button>
            </form>

            <p class="text-center text-aurum-muted text-xs mt-4">
              🔒 This passcode protects all AurumVault catalog pages.
            </p>

            <p class="text-center mt-3 text-xs text-aurum-muted">
              Demo passcode: <span class="text-aurum-gold font-mono">aurum2025</span>
            </p>
          </div>

          {/* Info cards */}
          <div class="flex flex-col gap-4">
            <div class="card-dark p-4">
              <h3 class="text-aurum-gold text-sm font-bold font-display tracking-wider mb-2">Access Terms</h3>
              <p class="text-aurum-muted text-xs leading-relaxed">
                Members only. By entering you confirm you are authorized to view AurumVault content and agree to our confidentiality terms.
              </p>
            </div>
            <div class="card-dark p-4">
              <h3 class="text-aurum-gold text-sm font-bold font-display tracking-wider mb-2">Last Updated</h3>
              <p class="text-aurum-muted text-xs leading-relaxed">
                March 3, 2025 — Passcode rotation performed by security team.
              </p>
            </div>
            <div class="card-dark p-4">
              <h3 class="text-aurum-gold text-sm font-bold font-display tracking-wider mb-2">Support Hours</h3>
              <p class="text-aurum-muted text-xs leading-relaxed">
                Mon–Fri 09:00–18:00 GMT. For urgent access issues email{' '}
                <a href="mailto:support@aurumvault.com" class="text-aurum-gold hover:underline">
                  support@aurumvault.com
                </a>{' '}
                or use the assistant link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div class="border-t border-aurum-border px-6 py-4 flex justify-between items-center text-xs text-aurum-muted">
        <span>© 2025 AurumVault. All rights reserved.</span>
        <span>Contact: <a href="mailto:contact@aurumvault.com" class="text-aurum-gold hover:underline">contact@aurumvault.com</a></span>
      </div>
    </div>
  )
}
