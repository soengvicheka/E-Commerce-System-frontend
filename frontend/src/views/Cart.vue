<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-1">Shopping Cart</h1>
      <p class="text-slate-500 mb-6">{{ cartItems.length }} items in your cart</p>

      <div v-if="loading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="skeleton h-28"></div>
      </div>

      <div v-else-if="!cartItems.length" class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-6xl mb-4">🛒</p>
        <p class="text-xl font-bold text-slate-800 mb-2">Your cart is empty</p>
        <p class="text-slate-500 mb-6">Looks like you haven't added anything yet.</p>
        <router-link to="/products" class="btn btn-primary rounded-full px-8">Browse Products</router-link>
      </div>

      <div v-else>
        <div class="space-y-4">
          <div v-for="item in cartItems" :key="item.id" class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div class="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0">
              <img v-if="item.product.image" :src="STORAGE_BASE + item.product.image" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center text-3xl">📦</div>
            </div>
            <div class="flex-1 text-center sm:text-left">
              <router-link :to="`/products/${item.product_id}`" class="font-bold text-slate-800 hover:text-violet-600 transition">
                {{ item.product.name }}
              </router-link>
              <p class="text-xs text-slate-500 mt-0.5">{{ item.product.category?.name }}</p>
              <p class="mt-1 font-extrabold text-slate-900">${{ (parseFloat(item.product.price) * item.quantity).toFixed(2) }}</p>
            </div>
            <div class="flex items-center gap-3 bg-slate-50 rounded-full p-1 ring-1 ring-slate-200">
              <button @click="updateQty(item, -1)" class="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-slate-50 font-bold text-slate-700 transition">−</button>
              <span class="w-8 text-center font-bold text-slate-900 text-sm">{{ item.quantity }}</span>
              <button @click="updateQty(item, 1)" class="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-slate-50 font-bold text-slate-700 transition">+</button>
            </div>
            <button @click="removeItem(item)" class="p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p class="text-sm text-slate-500">Total amount</p>
              <p class="text-3xl font-extrabold text-slate-900">${{ total.toFixed(2) }}</p>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button @click="clearCart" class="btn btn-outline flex-1 sm:flex-none">Clear Cart</button>
              <router-link to="/checkout" class="btn btn-primary flex-1 sm:flex-none rounded-full px-6">Checkout →</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api, STORAGE_BASE } from '../services/api'

const cartItems = ref([])
const total = ref(0)
const loading = ref(true)

async function loadCart() {
  const token = localStorage.getItem('token')
  if (token) {
    const res = await api.get('/cart')
    cartItems.value = res.data.items
  } else {
    cartItems.value = JSON.parse(localStorage.getItem('cart') || '[]').map((item, idx) => ({
      id: 'local_' + idx,
      product_id: item.product_id,
      quantity: item.quantity,
      product: { id: item.product_id, name: item.name, price: item.price, image: item.image },
    }))
  }
  total.value = cartItems.value.reduce((sum, i) => sum + (parseFloat(i.product?.price || 0) * i.quantity), 0)
  loading.value = false
}

function updateQty(item, delta) {
  const newQty = item.quantity + delta
  if (newQty < 1) return
  const token = localStorage.getItem('token')
  if (token) {
    api.put(`/cart/${item.id}`, { quantity: newQty }).then(loadCart)
  } else {
    updateLocal(item.product_id, newQty)
  }
}

function removeItem(item) {
  const token = localStorage.getItem('token')
  if (token) {
    api.delete(`/cart/${item.id}`).then(loadCart)
  } else {
    updateLocal(item.product_id, 0)
  }
}

function updateLocal(productId, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  if (quantity <= 0) cart = cart.filter(i => i.product_id !== productId)
  else { const item = cart.find(i => i.product_id === productId); if (item) item.quantity = quantity }
  localStorage.setItem('cart', JSON.stringify(cart))
  loadCart()
}

function clearCart() {
  const token = localStorage.getItem('token')
  if (token) api.delete('/cart').then(loadCart)
  else { localStorage.setItem('cart', '[]'); loadCart() }
}

onMounted(loadCart)
</script>
