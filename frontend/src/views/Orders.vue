<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-6">My Orders</h1>
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 2" :key="n" class="skeleton h-24"></div>
      </div>
      <div v-else-if="orders.length" class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="card p-0 overflow-hidden fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
            <div class="flex items-center gap-3 text-sm">
              <span class="font-extrabold text-slate-900">#{{ order.order_number }}</span>
              <span class="badge" :class="statusClass(order.status)">{{ order.status }}</span>
            </div>
            <span class="text-xs text-slate-500">{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="p-5">
            <div class="space-y-3">
              <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">📦</div>
                  <div>
                    <p class="font-bold text-slate-800">{{ item.product?.name }}</p>
                    <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <p class="font-bold text-slate-900">${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-sm text-slate-600">Total</span>
              <span class="text-xl font-extrabold text-violet-700">${{ parseFloat(order.total).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20 text-slate-500">
        <p class="text-5xl mb-4">📦</p>
        <p class="font-semibold text-slate-700">No orders yet</p>
        <router-link to="/products" class="btn btn-primary mt-4">Start Shopping</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../services/api'

const orders = ref([])
const loading = ref(true)

function statusClass(s) {
  return s === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function loadOrders() {
  const res = await api.get('/orders')
  orders.value = res.data
  loading.value = false
}

onMounted(loadOrders)
</script>
