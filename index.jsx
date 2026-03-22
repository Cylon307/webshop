import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import './styles/index.css'

import PasswordGate      from './pages/PasswordGate.jsx'
import Catalog           from './pages/Catalog.jsx'
import ProductPage       from './pages/ProductPage.jsx'
import LoginPage         from './pages/LoginPage.jsx'
import CheckoutPage      from './pages/CheckoutPage.jsx'
import ProfilePage       from './pages/ProfilePage.jsx'
import AdminDashboard    from './pages/AdminDashboard.jsx'
import AdminProductForm  from './pages/AdminProductForm.jsx'

import { siteUnlocked } from './stores/index.js'
import { createEffect } from 'solid-js'

function App() {
  return (
    <Router>
      <Route path="/"                      component={PasswordGate} />
      <Route path="/catalog"               component={Catalog} />
      <Route path="/product/:id"           component={ProductPage} />
      <Route path="/login"                 component={LoginPage} />
      <Route path="/checkout"              component={CheckoutPage} />
      <Route path="/cart"                  component={CheckoutPage} />
      <Route path="/profile"              component={ProfilePage} />
      <Route path="/admin"                 component={AdminDashboard} />
      <Route path="/admin/products/new"    component={AdminProductForm} />
      <Route path="/admin/products/edit/:id" component={AdminProductForm} />
    </Router>
  )
}

render(() => <App />, document.getElementById('root'))
