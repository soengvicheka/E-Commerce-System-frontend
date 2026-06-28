<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-6">Checkout</h1>

      <div v-if="!isLoggedIn" class="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-5xl mb-4">🔐</p>
        <p class="text-lg font-bold text-slate-800 mb-2">Please log in to continue</p>
        <p class="text-slate-500 mb-5">You need an account to place your order.</p>
        <router-link to="/login" class="btn btn-primary rounded-full px-8">Login to Checkout</router-link>
      </div>

      <div v-else-if="loading" class="space-y-4">
        <div class="skeleton h-24"></div>
        <div class="skeleton h-64"></div>
      </div>
      <div v-else-if="!cart.length" class="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-5xl mb-4">🛒</p>
        <p class="text-lg font-bold text-slate-800 mb-2">Your cart is empty</p>
        <router-link to="/products" class="btn btn-primary rounded-full">Start Shopping</router-link>
      </div>

      <div v-else class="space-y-6">
        <div class="card p-0 overflow-hidden">
          <div class="bg-slate-900 text-white px-6 py-4">
            <h3 class="font-bold text-lg">Order Summary</h3>
          </div>
          <div class="p-6">
            <div class="space-y-3">
              <div v-for="item in cart" :key="item.product_id" class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📦</span>
                  <div>
                    <p class="font-bold text-slate-800">{{ item.name }}</p>
                    <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="font-extrabold text-slate-900">${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</span>
              </div>
              <div class="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span class="font-bold text-slate-800">Total</span>
                <span class="text-2xl font-extrabold text-violet-700">${{ orderTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="placeOrder" class="card p-6 space-y-5">
          <h3 class="font-extrabold text-slate-900 text-lg">Shipping & Payment</h3>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Shipping Address</label>
            <textarea v-model="shippingAddress" required rows="3" placeholder="Street, City, State, ZIP, Country" class="input h-28 resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Payment Method</label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" @click="paymentMethod = 'cash'" :class="paymentMethod === 'cash' ? 'ring-2 ring-violet-500 bg-violet-50 border-violet-200' : 'border-slate-200'" class="border rounded-xl p-4 flex flex-col items-center gap-2 transition hover:border-violet-300 bg-white">
                <span class="text-2xl">💵</span>
                <span class="text-sm font-bold text-slate-800">Cash on Delivery</span>
              </button>
              <button type="button" @click="paymentMethod = 'card'" :class="paymentMethod === 'card' ? 'ring-2 ring-violet-500 bg-violet-50 border-violet-200' : 'border-slate-200'" class="border rounded-xl p-4 flex flex-col items-center gap-2 transition hover:border-violet-300 bg-white">
                <span class="text-2xl">💳</span>
                <span class="text-sm font-bold text-slate-800">Card Payment</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Notes (optional)</label>
            <textarea v-model="notes" rows="2" placeholder="Special instructions..." class="input h-20 resize-none"></textarea>
          </div>

          <button type="submit" class="btn btn-primary w-full text-base py-3 rounded-xl shadow-lg shadow-violet-200">
            Place Order
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../services/api'

const cart = ref([])
const loading = ref(true)
const isLoggedIn = !!localStorage.getItem('token')
const shippingAddress = ref('')
const paymentMethod = ref('')
const notes = ref('')

const orderTotal = computed(() => cart.value.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0))

async function loadCart() {
  loading.value = true
  const res = await api.get('/cart')
  cart.value = res.data.items
  loading.value = false
}

async function placeOrder() {
  try {
    const res = await api.post('/orders', {
      shipping_address: shippingAddress.value,
      payment_method: paymentMethod.value,
      notes: notes.value,
    })
    alert('Order placed successfully! Order #: ' + res.data.order_number)
    localStorage.setItem('cart', '[]')
    window.dispatchEvent(new Event('cart-updated'))
    window.location.href = '/orders'
  } catch (e) {
    alert('Failed: ' + (e.response?.data?.message || 'Unknown error'))
  }
}

onMounted(() => { if (isLoggedIn) loadCart() })
</script>
