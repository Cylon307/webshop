import { createSignal, Show, For } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { isAdmin, currentUser, logout, orders, PRODUCTS } from '../stores/index.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = createSignal('dashboard')
  const [sessionTime] = createSignal('12m 34s')

  if (!isAdmin()) { navigate('/login'); return null }

  const stats = [
    { label: 'Sales Today', value: '$18,742', change: '+8.6% vs yesterday', icon: '💰', color: 'text-aurum-gold' },
    { label: 'Orders Pending', value: '48', change: '3 high priority', icon: '📦', color: 'text-yellow-400' },
    { label: 'Inventory Alerts', value: '7', change: '4 critical', icon: '⚠', color: 'text-red-400' },
  ]

  const lowStock = [
    { name: 'Auric Wireless Headphones', sku: 'AW-233', stock: 2, level: 'CRITICAL' },
    { name: 'Goldline Charging Dock', sku: 'GL-10', stock: 3, level: 'LOW' },
    { name: 'Lumen Smart Lamp', sku: 'SL-L-11', stock: 5, level: 'LOW' },
  ]

  const auditLog = [
    { text: 'Sabrina Ortega updated product: Auric Wireless Headphones', time: '28 Feb 2026 · 0:02 · IP 192.168.2.14', type: 'info' },
    { text: 'Role change: Leila Morgan promoted to Manager', time: '28 Feb 2026 · 0:01 · IP 192.168.5.235', type: 'warning' },
    { text: 'System: Failed login attempt blocked (3 attempts)', time: '28 Feb 2026 · 03:05 · IP 87.240.23.10', type: 'error' },
  ]

  const statusColors = {
    'Processing': 'text-yellow-400 bg-yellow-900/30',
    'Awaiting Fulfillment': 'text-blue-400 bg-blue-900/30',
    'Shipped': 'text-green-400 bg-green-900/30',
    'Pending': 'text-aurum-muted bg-aurum-dark',
  }

  return (
    <div class="min-h-screen bg-aurum-black flex flex-col">
      {/* Admin Top Bar */}
      <div class="bg-aurum-dark border-b border-aurum-border px-4 py-2 flex items-center justify-between text-xs">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-aurum-gold rounded-full flex items-center justify-center">
              <span class="text-aurum-black font-black text-xs">A</span>
            </div>
            <span class="font-display font-bold text-aurum-gold tracking-widest">AurumVault</span>
          </div>
          <span class="text-red-400 border border-red-400/30 px-2 py-0.5 rounded">🔒 Secure Admin Area</span>
          <span class="text-aurum-muted">2-Step Verification: Enabled</span>
          <span class="text-green-400">Session active • Expires in <span class="font-bold">{sessionTime()}</span></span>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-aurum-text font-bold">{currentUser()?.name}</p>
            <p class="text-aurum-gold text-xs">Role: Super Admin</p>
          </div>
          <button onclick={() => { logout(); navigate('/login') }}
            class="border border-aurum-border text-aurum-muted px-3 py-1 rounded hover:border-red-400 hover:text-red-400 transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside class="w-48 bg-aurum-dark border-r border-aurum-border flex flex-col p-4">
          <div class="text-xs text-aurum-muted uppercase tracking-widest mb-3">
            Navigation <span class="text-aurum-gold">v1.3</span>
          </div>
          {[
            { key: 'dashboard', icon: '📊', label: 'Products' },
            { key: 'orders',    icon: '📦', label: 'Orders' },
            { key: 'customers', icon: '👥', label: 'Customers' },
            { key: 'promotions',icon: '🏷', label: 'Promotions' },
            { key: 'settings',  icon: '⚙', label: 'Settings' },
          ].map(item => (
            <button onclick={() => setActiveNav(item.key)}
              class={`flex items-center gap-2 px-3 py-2.5 rounded text-sm mb-1 transition-colors w-full text-left ${
                activeNav() === item.key ? 'bg-aurum-gold text-aurum-black font-bold' : 'text-aurum-muted hover:text-aurum-text hover:bg-aurum-card'
              }`}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}

          <div class="mt-6 pt-4 border-t border-aurum-border">
            <div class="text-xs text-aurum-muted uppercase tracking-widest mb-2">Security</div>
            <div class="flex items-center gap-2 text-xs text-green-400 mb-3">
              <span class="w-2 h-2 bg-green-400 rounded-full"></span>
              Audit Trail Live
            </div>
            <div class="text-xs text-aurum-muted uppercase tracking-widest mb-2">Quick Role Controls</div>
            {[
              { role: 'Manager', active: true },
              { role: 'Auditor', active: false },
            ].map(r => (
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-aurum-text">{r.role}</span>
                <div class={`w-8 h-4 rounded-full ${r.active ? 'bg-aurum-gold' : 'bg-aurum-muted'}`}></div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main class="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map(stat => (
              <div class="card-dark p-5 flex items-start justify-between">
                <div>
                  <p class="text-aurum-muted text-xs uppercase tracking-widest">{stat.label}</p>
                  <p class={`font-display text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  <p class="text-aurum-muted text-xs mt-1">{stat.change}</p>
                </div>
                <span class="text-2xl">{stat.icon}</span>
              </div>
            ))}
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div class="xl:col-span-2 card-dark p-5">
              <div class="flex items-center justify-between mb-4">
                <h2 class="section-title text-base">Latest transactions</h2>
                <span class="text-aurum-muted text-xs">Showing 4 of 48</span>
              </div>
              <div class="space-y-3">
                <For each={orders()}>{order => (
                  <div class="flex items-center gap-3 py-3 border-b border-aurum-border last:border-0">
                    <div class="w-10 h-10 bg-aurum-muted rounded overflow-hidden flex items-center justify-center">
                      <span class="text-xs">📦</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-aurum-text text-sm font-bold">Order {order.id} · {order.customer}</p>
                      <p class="text-aurum-muted text-xs">{order.date}</p>
                    </div>
                    <span class="text-aurum-gold font-bold text-sm">${order.total}</span>
                    <span class={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || 'text-aurum-muted'}`}>
                      {order.status}
                    </span>
                  </div>
                )}</For>
              </div>
            </div>

            {/* Quick Actions + Audit */}
            <div class="space-y-4">
              <div class="card-dark p-5">
                <h3 class="section-title text-sm mb-4">Quick Actions</h3>
                <div class="space-y-2">
                  <A href="/admin/products/new" class="flex items-center gap-2 bg-aurum-gold text-aurum-black text-sm font-bold px-4 py-2.5 rounded w-full hover:bg-yellow-300 transition-colors">
                    + Add New Product
                  </A>
                  <button class="flex items-center gap-2 border border-aurum-border text-aurum-text text-sm px-4 py-2.5 rounded w-full hover:border-aurum-gold transition-colors">
                    🏷 Create Promotion
                  </button>
                  <button class="flex items-center gap-2 border border-aurum-border text-aurum-text text-sm px-4 py-2.5 rounded w-full hover:border-aurum-gold transition-colors">
                    👥 Manage Roles
                  </button>
                </div>
              </div>

              {/* Audit Trail */}
              <div class="card-dark p-5">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="section-title text-sm">Audit Trail</h3>
                  <span class="text-xs text-aurum-muted">5 events</span>
                </div>
                <div class="space-y-3">
                  {auditLog.map(log => (
                    <div class={`text-xs border-l-2 pl-3 ${
                      log.type === 'error' ? 'border-red-500 text-red-400' :
                      log.type === 'warning' ? 'border-yellow-500 text-yellow-400' : 'border-aurum-gold text-aurum-text'
                    }`}>
                      <p class="leading-relaxed">{log.text}</p>
                      <p class="text-aurum-muted mt-0.5">{log.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div class="card-dark p-5 mt-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="section-title text-base">Items needing restock</h2>
              <span class="text-aurum-muted text-xs">Last updated 5m ago</span>
            </div>
            <div class="space-y-3">
              {lowStock.map(item => (
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-aurum-muted rounded flex items-center justify-center text-xs">📦</div>
                  <div class="flex-1">
                    <p class="text-aurum-text text-sm font-medium">{item.name}</p>
                    <p class="text-aurum-muted text-xs">SKU: {item.sku} · {item.stock} units left</p>
                  </div>
                  <span class={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.level === 'CRITICAL' ? 'text-red-400 bg-red-900/30' : 'text-yellow-400 bg-yellow-900/30'
                  }`}>{item.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div class="mt-6 border border-aurum-gold/30 bg-aurum-gold/5 rounded-lg p-4 text-xs text-aurum-muted">
            <span class="text-aurum-gold font-bold">Security Notice</span>
            <p class="mt-1 leading-relaxed">
              This admin area requires a separate admin password and two-factor authentication. All actions are logged and changes to roles trigger audit notifications. If you did not initiate recent changes, contact Security at <a href="mailto:security@aurumvault.com" class="text-aurum-gold hover:underline">security@aurumvault.com</a> immediately.
            </p>
          </div>
        </main>

        {/* Session timeout panel */}
        <div class="w-48 bg-aurum-dark border-l border-aurum-border p-4 hidden xl:block">
          <h4 class="text-xs text-aurum-muted uppercase tracking-widest mb-3">Role-Based Controls</h4>
          {[
            { label: 'Grant product edit', active: true },
            { label: 'Allow promotions create', active: false },
          ].map(ctrl => (
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-aurum-text leading-tight pr-2">{ctrl.label}</span>
              <div class={`w-8 h-4 rounded-full flex-shrink-0 ${ctrl.active ? 'bg-aurum-gold' : 'bg-aurum-muted'}`}></div>
            </div>
          ))}

          <div class="mt-6 pt-4 border-t border-aurum-border card-dark p-3">
            <h4 class="text-xs text-aurum-muted uppercase tracking-widest mb-2">Session Timeout</h4>
            <p class="text-xs text-aurum-muted leading-relaxed">
              Your session will expire in <span class="text-aurum-gold font-bold">{sessionTime()}</span> and be logged out automatically for inactivity.
            </p>
            <div class="flex flex-col gap-2 mt-3">
              <button class="btn-gold py-1.5 rounded text-xs">Extend Session</button>
              <button onclick={() => { logout(); navigate('/login') }}
                class="border border-aurum-border text-aurum-muted py-1.5 rounded text-xs hover:border-red-400 hover:text-red-400 transition-colors">
                Logout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
