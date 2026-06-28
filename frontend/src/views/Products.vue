<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div class="flex items-end justify-between mb-3">
        <div>
          <h1 class="text-4xl font-extrabold text-slate-900">All Products</h1>
          <p class="mt-1 text-base text-slate-500">{{ loading ? 'Loading...' : products.length + ' products found' }}</p>
        </div>
        <div class="hidden sm:flex items-center gap-2 text-base text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <span class="font-medium">Sort:</span>
          <select v-model="sort" @change="fetchProducts" class="bg-transparent outline-none font-semibold text-slate-800">
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name A-Z</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <aside class="w-full md:w-72 shrink-0 space-y-6">
          <div class="card p-5">
            <div class="relative">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input v-model="search" @keyup.enter="fetchProducts" placeholder="Search products..." class="input pl-10 bg-slate-50">
            </div>
          </div>

          <div class="card p-5">
            <h3 class="font-bold text-slate-800 mb-4 text-base uppercase tracking-wider">Categories</h3>
            <div class="space-y-1">
              <button @click="categoryId = null; fetchProducts()" :class="{'bg-violet-50 text-violet-700 font-bold': !categoryId}" class="w-full text-left px-4 py-2.5 rounded-lg text-base text-slate-600 hover:bg-slate-50 transition">All Categories</button>
              <button v-for="cat in categories" :key="cat.id" @click="categoryId = cat.id; fetchProducts()" :class="{'bg-violet-50 text-violet-700 font-bold': categoryId === cat.id}" class="w-full text-left px-4 py-2.5 rounded-lg text-base text-slate-600 hover:bg-slate-50 transition">{{ cat.name }}</button>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="skeleton h-96"></div>
          </div>
          <div v-else-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
          </div>
          <div v-else class="text-center py-24 text-slate-500">
            <p class="text-5xl mb-4">🔍</p>
            <p class="font-semibold text-xl">No products found</p>
            <p class="text-base mt-1">Try adjusting your search or filters.</p>
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
  console.log('Products onMounted start')
  try {
    const res = await api.get('/categories')
    categories.value = res.data
    console.log('categories loaded', categories.value.length)
  } catch (e) { console.error('categories error', e) }
  await fetchProducts()
  console.log('fetchProducts done, products', products.value.length)
})
</script>
