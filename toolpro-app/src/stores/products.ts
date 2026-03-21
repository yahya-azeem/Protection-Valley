import { writable, derived } from 'svelte/store'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  wholesalePrice: number
  category: string
  image: string
  stock: number
  sku: string
  ebayId?: string
}

export const products = writable<Product[]>([
  {
    id: 1,
    name: 'Professional Cordless Drill',
    description: '20V MAX cordless drill with lithium-ion battery, perfect for construction and DIY projects.',
    price: 149.99,
    wholesalePrice: 119.99,
    category: 'Power Tools',
    image: '/images/drill.jpg',
    stock: 50,
    sku: 'DRILL-001',
    ebayId: '123456789'
  },
  {
    id: 2,
    name: 'Circular Saw 7-1/4"',
    description: 'High-performance circular saw with laser guide and dust blower.',
    price: 89.99,
    wholesalePrice: 71.99,
    category: 'Power Tools',
    image: '/images/circular-saw.jpg',
    stock: 35,
    sku: 'SAW-001',
    ebayId: '123456790'
  },
  {
    id: 3,
    name: 'Electrician Tool Set 45-Piece',
    description: 'Complete electrician tool set with insulated tools, testers, and carrying case.',
    price: 199.99,
    wholesalePrice: 159.99,
    category: 'Hand Tools',
    image: '/images/electrician-set.jpg',
    stock: 25,
    sku: 'SET-001',
    ebayId: '123456791'
  },
  {
    id: 4,
    name: 'Hammer Drill Rotary',
    description: 'SDS-Plus rotary hammer drill for concrete and masonry work.',
    price: 249.99,
    wholesalePrice: 199.99,
    category: 'Power Tools',
    image: '/images/hammer-drill.jpg',
    stock: 20,
    sku: 'DRILL-002',
    ebayId: '123456792'
  },
  {
    id: 5,
    name: 'Tape Measure 25ft',
    description: 'Professional grade tape measure with magnetic hook and rubber grip.',
    price: 24.99,
    wholesalePrice: 19.99,
    category: 'Measuring',
    image: '/images/tape-measure.jpg',
    stock: 100,
    sku: 'MEASURE-001',
    ebayId: '123456793'
  },
  {
    id: 6,
    name: 'Level 48" Magnetic',
    description: 'Heavy-duty aluminum level with rare earth magnets for hands-free use.',
    price: 59.99,
    wholesalePrice: 47.99,
    category: 'Measuring',
    image: '/images/level.jpg',
    stock: 40,
    sku: 'LEVEL-001',
    ebayId: '123456794'
  },
  {
    id: 7,
    name: 'Angle Grinder 4-1/2"',
    description: 'Powerful angle grinder with paddle switch and adjustable guard.',
    price: 79.99,
    wholesalePrice: 63.99,
    category: 'Power Tools',
    image: '/images/grinder.jpg',
    stock: 30,
    sku: 'GRINDER-001',
    ebayId: '123456795'
  },
  {
    id: 8,
    name: 'Pliers Set 6-Piece',
    description: 'Professional pliers set including lineman\'s, needle nose, and slip-joint.',
    price: 49.99,
    wholesalePrice: 39.99,
    category: 'Hand Tools',
    image: '/images/pliers-set.jpg',
    stock: 60,
    sku: 'PLIERS-001',
    ebayId: '123456796'
  },
  {
    id: 9,
    name: 'Multimeter Digital',
    description: 'True RMS multimeter with auto-ranging and backlit display.',
    price: 69.99,
    wholesalePrice: 55.99,
    category: 'Electrical',
    image: '/images/multimeter.jpg',
    stock: 45,
    sku: 'METER-001',
    ebayId: '123456797'
  },
  {
    id: 10,
    name: 'Wire Stripper Automatic',
    description: 'Self-adjusting wire stripper for 10-24 AWG wire.',
    price: 34.99,
    wholesalePrice: 27.99,
    category: 'Electrical',
    image: '/images/wire-stripper.jpg',
    stock: 80,
    sku: 'STRIPPER-001',
    ebayId: '123456798'
  },
  {
    id: 11,
    name: 'Tool Belt Professional',
    description: 'Heavy-duty leather tool belt with 12 pockets and suspenders.',
    price: 89.99,
    wholesalePrice: 71.99,
    category: 'Storage',
    image: '/images/tool-belt.jpg',
    stock: 25,
    sku: 'BELT-001',
    ebayId: '123456799'
  },
  {
    id: 12,
    name: 'Toolbox 26" Rolling',
    description: 'Mobile toolbox with telescopic handle and ball-bearing slides.',
    price: 129.99,
    wholesalePrice: 103.99,
    category: 'Storage',
    image: '/images/toolbox.jpg',
    stock: 15,
    sku: 'BOX-001',
    ebayId: '123456800'
  }
])

export const selectedCategory = writable<string>('All')

export const categories = derived(products, $products => {
  const cats = new Set($products.map(p => p.category))
  return ['All', ...Array.from(cats)]
})

export const filteredProducts = derived(
  [products, selectedCategory],
  ([$products, $selectedCategory]) => {
    if ($selectedCategory === 'All') return $products
    return $products.filter(p => p.category === $selectedCategory)
  }
)

// Search functionality
export const searchQuery = writable<string>('')

export const searchedProducts = derived(
  [filteredProducts, searchQuery],
  ([$filteredProducts, $searchQuery]) => {
    if (!$searchQuery.trim()) return $filteredProducts
    const query = $searchQuery.toLowerCase()
    return $filteredProducts.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    )
  }
)
