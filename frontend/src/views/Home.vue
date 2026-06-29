<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900">
      <!-- Bokeh -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute top-12 left-1/4 h-64 w-64 rounded-full bg-violet-500/20 blur-[120px]"></div>
        <div class="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-[140px]"></div>
        <div class="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[130px]"></div>
      </div>

      <!-- Controls -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-28 text-center text-white">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Discover Quality Products
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Shop the latest trends with confidence. Free shipping over $500 and 30-day returns.
        </p>
        <div class="mt-10 flex justify-center gap-4">
          <router-link to="/products" class="btn btn-primary text-base px-8 py-3.5 rounded-full shadow-xl shadow-violet-900/40 hover:shadow-2xl hover:shadow-violet-900/50 transition">
            Shop Now
          </router-link>
          <router-link to="/products" class="btn bg-white/10 hover:bg-white/20 text-white text-base px-8 py-3.5 rounded-full backdrop-blur-md border border-white/20 transition">
            Browse All
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div class="flex flex-col items-center gap-3">
            <span class="text-3xl">🚚</span>
            <h3 class="text-base font-bold text-slate-900">Free Shipping</h3>
            <p class="text-sm text-slate-500">On orders over $500</p>
          </div>
          <div class="flex flex-col items-center gap-3">
            <span class="text-3xl">🛡️</span>
            <h3 class="text-base font-bold text-slate-900">Secure Payment</h3>
            <p class="text-sm text-slate-500">Transactions are safe</p>
          </div>
          <div class="flex flex-col items-center gap-3">
            <span class="text-3xl">↩️</span>
            <h3 class="text-base font-bold text-slate-900">Easy Returns</h3>
            <p class="text-sm text-slate-500">30-day return policy</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Shop by Category -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
      <div class="section-header">
        <div>
          <h2>Shop by Category</h2>
          <p class="section-subtitle">Find exactly what you need by browsing our curated collections.</p>
        </div>
        <router-link to="/products" class="btn btn-ghost text-sm font-semibold rounded-full px-3 py-1">View all →</router-link>
      </div>
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div v-for="n in 4" :key="n" class="skeleton h-32"></div>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div v-for="cat in categories" :key="cat.id" class="group card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition cursor-pointer">
          <div class="w-16 h-16 mx-auto rounded-full bg-violet-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-violet-100 transition">
            {{ categoryIcon(cat.name) }}
          </div>
          <h3 class="font-bold text-slate-800 text-base">{{ cat.name }}</h3>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section id="products" class="bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div class="section-header">
          <div>
            <h2>Latest Products</h2>
            <p class="section-subtitle">Handpicked new arrivals just for you.</p>
          </div>
          <router-link to="/products" class="btn btn-ghost text-sm font-semibold rounded-full px-3 py-1">View all →</router-link>
        </div>
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="skeleton h-96"></div>
        </div>
        <div v-else-if="latest.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in latest" :key="product.id" :product="product" />
        </div>
        <div v-else class="text-center py-20 text-slate-500 text-lg">No products found.</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import ProductCard from '../components/ProductCard.vue'

const categories = ref([])
const latest = ref([])
const loading = ref(true)

function categoryIcon(name) {
  const map = {
    Electronics: '💻',
    Clothing: '👕',
    'Home & Garden': '🏠',
    Sports: '⚽',
    Books: '📚',
    Toys: '🧸',
    Beauty: '💄',
    Automotive: '🚗',
  }
  return map[name] || '📦'
}

onMounted(async () => {
  try {
    const [catRes, prodRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products?limit=8'),
    ])
    categories.value = catRes.data
    latest.value = prodRes.data.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
