<template>
  <div class="min-h-screen bg-slate-50">
    <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <router-link to="/" class="hover:text-violet-600">Home</router-link>
        <span>/</span>
        <router-link to="/products" class="hover:text-violet-600">Products</router-link>
        <span>/</span>
        <span class="text-slate-800 font-medium truncate max-w-[300px]">{{ product.name }}</span>
      </nav>

      <div class="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <!-- Image -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div class="aspect-square rounded-xl overflow-hidden bg-white">
            <img
              v-if="product.image"
              :src="STORAGE_BASE + product.image"
              :alt="product.name"
              class="w-full h-full object-contain p-6"
            >
            <div v-else class="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-slate-100 to-slate-200">
              📦
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-col">
          <div class="flex flex-wrap items-center gap-3 mb-4">
<span class="badge bg-violet-50 text-violet-700 ring-1 ring-violet-200 text-xs">{{ product.category?.name }}</span>
      <span class="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-xs">
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {{ product.name }}
          </h1>

          <div class="flex items-center gap-1.5 text-amber-400 mt-5">
            <span v-for="n in 5" :key="n" class="text-lg">★</span>
            <span class="text-slate-500 ml-2 text-sm">({{ product.reviews_count || 0 }} reviews)</span>
          </div>

          <p class="mt-6 text-base text-slate-600 leading-relaxed">{{ product.short_description || product.description }}</p>

          <div class="mt-8 flex items-baseline gap-4">
            <span class="text-4xl font-extrabold text-slate-900">
              ${{ formatPrice(product) }}
            </span>
            <span v-if="product.sale_price" class="text-xl text-slate-400 line-through">
              ${{ parseFloat(product.price).toFixed(2) }}
            </span>
          </div>

          <div class="mt-8 flex flex-wrap gap-4">
            <button
              @click="addToCart"
              :disabled="product.stock <= 0"
              :class="{'opacity-50 cursor-not-allowed': product.stock <= 0}"
              class="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-violet-200 transition flex items-center gap-3 text-base"
            >
              <span class="text-base">🛒</span>
              {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>

          <div class="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-3 text-slate-600">
              <span class="text-base">🚚</span>
              Free shipping over $500
            </div>
            <div class="flex items-center gap-3 text-slate-600">
              <span class="text-base">↩️</span>
              30 days return
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="mt-14 card p-6 sm:p-8">
        <h3 class="text-xl font-extrabold text-slate-900 mb-8">Customer Reviews</h3>

        <div v-if="isLoggedIn" class="bg-slate-50 rounded-xl p-5 sm:p-6 mb-8 border border-slate-100">
          <h4 class="font-bold text-slate-800 text-base mb-4">Write a review</h4>
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <select v-model="rating" class="input w-auto">
              <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
            </select>
          </div>
          <div class="flex gap-3">
            <input v-model="comment" placeholder="Share your experience..." class="input flex-1">
            <button @click="submitReview" class="btn btn-primary">Post</button>
          </div>
        </div>

        <div v-if="!product.reviews?.length" class="text-center py-14 text-slate-500">
          <p class="text-4xl mb-3">💬</p>
          <p class="font-semibold text-lg">No reviews yet. Be the first to review!</p>
        </div>
        <div class="space-y-5">
          <div v-for="review in product.reviews" :key="review.id" class="border border-slate-100 rounded-xl p-5 hover:bg-slate-50/60 transition">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                  {{ review.user?.name?.charAt(0) }}
                </div>
                <span class="font-bold text-slate-800">{{ review.user?.name }}</span>
              </div>
              <div class="text-amber-400 text-base">{{ '★'.repeat(review.rating) }}</div>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-28 text-slate-500">
      <div class="text-4xl mb-5">⏳</div>
      <p class="font-semibold text-lg">Loading product...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api, STORAGE_BASE } from '../services/api'

const route = useRoute()
const product = ref(null)
const rating = ref(5)
const comment = ref('')
const isLoggedIn = !!localStorage.getItem('token')

function formatPrice(p) {
  return p.sale_price ? parseFloat(p.sale_price).toFixed(2) : parseFloat(p.price).toFixed(2)
}

function addToCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existing = cart.find(i => i.product_id === product.value.id)
  if (existing) existing.quantity++
  else cart.push({ product_id: product.value.id, quantity: 1, name: product.value.name, price: product.value.price, image: product.value.image })
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

async function toggleWishlist() {
  try {
    await api.post('/wishlist/toggle', { product_id: product.value.id })
  } catch (e) {
    if (e.response?.status === 401) return window.location.href = '/login'
  }
}

async function submitReview() {
  try {
    await api.post(`/products/${route.params.id}/reviews`, { rating: rating.value, comment: comment.value })
    comment.value = ''
    loadProduct()
  } catch (e) {
    alert(e.response?.data?.message || 'Failed')
  }
}

async function loadProduct() {
  const res = await api.get(`/products/${route.params.id}`)
  product.value = res.data
}

onMounted(loadProduct)
</script>
