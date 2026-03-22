# AurumVault — Setup

## Pokretanje projekta

```bash
# 1. Instaliraj dependencies
npm install

# 2. Pokreni development server
npm run dev

# 3. Otvori http://localhost:3000
```

## Stranice

| URL | Stranica | Pristup |
|-----|----------|---------|
| `/` | Password Gate | Svi |
| `/catalog` | Katalog proizvoda | Nakon unosa lozinke |
| `/product/:id` | Detalji proizvoda | Svi |
| `/login` | Prijava / Registracija | Svi |
| `/checkout` | Košarica + Checkout | Svi |
| `/profile` | Korisnički profil | Prijavljeni korisnici |
| `/admin` | Admin Dashboard | Admin korisnici |
| `/admin/products/new` | Dodaj proizvod | Admin |
| `/admin/products/edit/:id` | Uredi proizvod | Admin |

## Demo podaci

**Lozinka za ulaz u webshop:** `aurum2025`

**Demo korisnici:**
- User: `user@aurumvault.com` / `user123`
- Admin: `admin@aurumvault.com` / `admin123`

**Kupon za popust** (samo prijavljeni): `AURUM10` (10% popusta)

## Faza 2 — Firebase integracija

Za produkciju, zamijeni mock podatke u `src/stores/index.js` s Firebase:

```bash
npm install firebase
```

Kreirati `src/firebase.js`:
```js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  // Tvoji Firebase config podaci
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

## Struktura projekta

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Footer.jsx
├── pages/
│   ├── PasswordGate.jsx
│   ├── Catalog.jsx
│   ├── ProductPage.jsx
│   ├── LoginPage.jsx
│   ├── CheckoutPage.jsx
│   ├── ProfilePage.jsx
│   ├── AdminDashboard.jsx
│   └── AdminProductForm.jsx
├── stores/
│   └── index.js        ← Globalni state (zamijeni s Firebase)
├── styles/
│   └── index.css
└── index.jsx           ← Router + entry point
```
