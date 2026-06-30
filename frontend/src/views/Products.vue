<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="bg-gradient-to-r from-violet-600 to-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <p class="text-sm font-semibold uppercase tracking-wider text-white/80">Shop</p>
        <h1 class="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">All Products</h1>
        <p class="mt-3 text-white/85 max-w-2xl">
          Browse the collection and add items directly to your cart.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="w-full md:w-72 shrink-0 space-y-6">
          <div class="card p-5">
            <div class="relative">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input v-model="search" @keyup.enter="fetchProducts" placeholder="Search products..." class="input pl-10 bg-slate-50">
            </div>
          </div>

          <div class="card overflow-hidden">
            <div class="bg-slate-900 px-5 py-3">
              <h3 class="text-white text-sm font-bold uppercase tracking-wider">Categories</h3>
            </div>
            <div class="p-3">
              <button @click="categoryId = null; fetchProducts()" :class="{'bg-violet-50 text-violet-700 font-bold': !categoryId}" class="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition">All Categories</button>
              <button v-for="cat in categories" :key="cat.id" @click="categoryId = cat.id; fetchProducts()" :class="{'bg-violet-50 text-violet-700 font-bold': categoryId === cat.id}" class="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition">{{ cat.name }}</button>
            </div>
          </div>
        </aside>

        <!-- Products -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <p class="text-sm text-slate-600">
              <span class="font-semibold text-slate-900">{{ loading ? '...' : products.length }}</span>
              <span class="ml-1">products found</span>
            </p>
            <div class="hidden sm:flex items-center gap-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <span class="font-medium">Sort:</span>
              <select v-model="sort" @change="fetchProducts" class="bg-transparent outline-none font-semibold text-slate-800">
                <option value="latest">Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name A-Z</option>
              </select>
            </div>
          </div>

          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="skeleton h-96"></div>
          </div>
          <div v-else-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
          </div>
          <div v-else class="text-center py-24 text-slate-500">
            <p class="text-5xl mb-4">🔍</p>
            <p class="font-semibold text-lg">No products found</p>
            <p class="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const products = ref([])
const categories = ref([])
const loading = ref(true)
const search = ref(route.query.search || '')
const categoryId = ref(null)
const sort = ref('latest')

watch(() => route.query.search, (val) => search.value = val || '')

async function fetchProducts() {
  loading.value = true
  try {
    const params = {}
    if (search.value) params.search = search.value
    if (categoryId.value) params.category_id = categoryId.value
    params.sort = sort.value
    const res = await api.get('/products', { params })
    products.value = res.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/categories')
    categories.value = res.data
  } catch (e) { console.error('categories error', e) }
  await fetchProducts()
})
</script>
