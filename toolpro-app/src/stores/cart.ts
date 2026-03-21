import { writable, derived } from 'svelte/store'

// Check if we're in a browser environment
const browser = typeof window !== 'undefined'

export interface CartItem {
  id: number
  name: string
  price: number
  wholesalePrice: number
  quantity: number
  image: string
  category: string
}

function createCartStore() {
  const { subscribe, set, update } = writable<CartItem[]>([])

  return {
    subscribe,
    addItem: (item: Omit<CartItem, 'quantity'>) => {
      update(items => {
        const existingItem = items.find(i => i.id === item.id)
        if (existingItem) {
          return items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        }
        return [...items, { ...item, quantity: 1 }]
      })
    },
    removeItem: (id: number) => {
      update(items => items.filter(i => i.id !== id))
    },
    updateQuantity: (id: number, quantity: number) => {
      if (quantity <= 0) {
        update(items => items.filter(i => i.id !== id))
      } else {
        update(items =>
          items.map(i => (i.id === id ? { ...i, quantity } : i))
        )
      }
    },
    clear: () => set([]),
    init: (items: CartItem[]) => set(items)
  }
}

export const cart = createCartStore()

export const cartTotal = derived(cart, $cart =>
  $cart.reduce((total, item) => total + item.price * item.quantity, 0)
)

export const cartWholesaleTotal = derived(cart, $cart =>
  $cart.reduce((total, item) => total + item.wholesalePrice * item.quantity, 0)
)

export const cartCount = derived(cart, $cart =>
  $cart.reduce((count, item) => count + item.quantity, 0)
)

// Persist cart to localStorage
if (browser) {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    try {
      cart.init(JSON.parse(savedCart))
    } catch (e) {
      console.error('Failed to parse cart from localStorage')
    }
  }

  cart.subscribe(value => {
    localStorage.setItem('cart', JSON.stringify(value))
  })
}
