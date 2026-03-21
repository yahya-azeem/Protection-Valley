<script lang="ts">
  import Router from './components/Router.svelte'
  import Route from './components/Route.svelte'
  import Layout from './components/Layout.svelte'
  import Home from './pages/Home.svelte'
  import Products from './pages/Products.svelte'
  import ProductDetail from './pages/ProductDetail.svelte'
  import Cart from './pages/Cart.svelte'
  import Checkout from './pages/Checkout.svelte'
  import Login from './pages/Login.svelte'
  import Admin from './pages/Admin.svelte'
  import Orders from './pages/Orders.svelte'
  import About from './pages/About.svelte'
  import Contact from './pages/Contact.svelte'
  import NotFound from './pages/NotFound.svelte'
</script>

<Router>
  <Layout>
    <Route path="/" component={Home} />
    <Route path="/products" component={Products} />
    <Route path="/product/:id" component={ProductDetail} />
    <Route path="/cart" component={Cart} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/login" component={Login} />
    <Route path="/admin" component={Admin} />
    <Route path="/admin/orders" component={Orders} />
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
    <Route path="*" component={NotFound} />
  </Layout>
</Router>
