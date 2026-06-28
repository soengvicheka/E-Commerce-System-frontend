<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-6">My Wishlist</h1>
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="n in 3" :key="n" class="skeleton h-64"></div>
      </div>
      <div v-else-if="wishlist.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="item in wishlist" :key="item.id" class="card overflow-hidden fade-in">
          <div class="aspect-[4/3] bg-slate-100 relative">
            <img v-if="item.product.image" :src="STORAGE_BASE + item.product.image" class="w-full h-full object-cover">
            <div v-else class="w-full h-full flex items-center justify-center text-4xl">📦</div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-slate-800">{{ item.product.name }}</h3>
            <p class="text-sm text-slate-500">{{ item.product.category?.name }}</p>
            <p class="mt-2 font-extrabold text-slate-900">${{ formatPrice(item.product) }}</p>
            <div class="mt-3 flex gap-2">
              <button @click="addToCart(item.product)" class="btn btn-primary flex-1 text-xs">Add to Cart</button>
              <button @click="remove(item.id)" class="btn btn-outline text-xs px-2">🗑️</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20 text-slate-500">
        <p class="text-5xl mb-4">❤️</p>
        <p class="font-semibold text-slate-700">Your wishlist is empty</p>
        <router-link to="/products" class="btn btn-primary mt-4">Explore Products</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, STORAGE_BASE } from '../services/api'

const wishlist = ref([])
const loading = ref(true)

function formatPrice(p) {
  return p.sale_price ? parseFloat(p.sale_price).toFixed(2) : parseFloat(p.price).toFixed(2)
}

async function loadWishlist() {
  loading.value = true
  const res = await api.get('/wishlist')
  wishlist.value = res.data
  loading.value = false
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existing = cart.find(i => i.product_id === product.id)
  if (existing) existing.quantity++
  else cart.push({ product_id: product.id, quantity: 1, name: product.name, price: product.price, image: product.image })
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

async function remove(id) {
  await api.delete(`/wishlist/${id}`)
  loadWishlist()
}

onMounted(loadWishlist)
</script>
