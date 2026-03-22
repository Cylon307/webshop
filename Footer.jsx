import { A } from '@solidjs/router'

export default function Footer() {
  return (
    <footer class="bg-aurum-dark border-t border-aurum-border mt-20">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-aurum-gold rounded-full flex items-center justify-center">
                <span class="text-aurum-black font-display font-black text-sm">A</span>
              </div>
              <span class="font-display font-bold text-aurum-gold tracking-widest">AurumVault</span>
            </div>
            <p class="text-aurum-muted text-sm leading-relaxed">
              Curating rare, authenticated treasures with secure checkout and white-glove shipping.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 class="font-display text-sm font-bold text-aurum-gold tracking-widest uppercase mb-4">Explore</h4>
            <ul class="space-y-2 text-sm text-aurum-muted">
              <li><A href="/catalog" class="hover:text-aurum-gold transition-colors">Collections</A></li>
              <li><A href="/catalog?filter=exclusive" class="hover:text-aurum-gold transition-colors">Exclusives</A></li>
              <li><A href="/login" class="hover:text-aurum-gold transition-colors">Autentifikacija</A></li>
              <li><a href="#" class="hover:text-aurum-gold transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 class="font-display text-sm font-bold text-aurum-gold tracking-widest uppercase mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-aurum-muted">
              <li><a href="#" class="hover:text-aurum-gold transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-aurum-gold transition-colors">Shipping & Returns</a></li>
              <li><a href="#" class="hover:text-aurum-gold transition-colors">Warranty</a></li>
              <li><a href="#" class="hover:text-aurum-gold transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 class="font-display text-sm font-bold text-aurum-gold tracking-widest uppercase mb-4">Connect</h4>
            <div class="flex gap-3 mb-4">
              {['IG','TW','YT'].map(s => (
                <a href="#" class="w-8 h-8 border border-aurum-border rounded flex items-center justify-center text-xs text-aurum-muted hover:border-aurum-gold hover:text-aurum-gold transition-all">
                  {s}
                </a>
              ))}
            </div>
            <p class="text-aurum-muted text-xs">Contact: concierge@aurumvault.com</p>
            <div class="mt-4">
              <p class="text-aurum-muted text-xs mb-2">Subscribe for exclusive previews</p>
              <div class="flex gap-2">
                <input type="email" placeholder="Email address"
                  class="input-dark text-xs px-3 py-2 flex-1 min-w-0" />
                <button class="btn-gold px-3 py-2 text-xs rounded">→</button>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-aurum-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-aurum-muted text-xs">© 2025 AurumVault. All rights reserved.</p>
          <div class="flex gap-6 text-xs text-aurum-muted">
            <a href="#" class="hover:text-aurum-gold transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-aurum-gold transition-colors">Admin Terms</a>
            <a href="#" class="hover:text-aurum-gold transition-colors">Security Practices</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
