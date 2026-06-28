<template>
  <router-link :to="`/products/${product.id}`" class="group block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-xl transition duration-300 h-full">
    <!-- Image -->
    <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
      <img
        v-if="product.image"
        :src="STORAGE_BASE + product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-slate-100 to-slate-200">
        📦
      </div>

      <!-- Featured Badge -->
      <div v-if="product.is_featured" class="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[11px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm uppercase tracking-wider">
        <span>⭐</span>
        <span>Featured</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col gap-3 flex-1">
      <!-- Category -->
      <span class="text-sm font-extrabold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg uppercase tracking-wider inline-block w-fit">
        {{ product.category?.name || 'UNCATEGORIZED' }}
      </span>

      <!-- Product Name on colored bar -->
      <h3 class="text-xl font-extrabold leading-snug">
        <span class="bg-violet-600 text-white px-3 py-2 rounded-lg inline-block">
          {{ product.name }}
        </span>
      </h3>

      <!-- Price -->
      <div class="flex items-baseline gap-3 mt-1">
        <span class="text-2xl font-extrabold text-slate-900">
          ${{ formatPrice(product) }}
        </span>
        <span v-if="product.sale_price" class="text-lg text-slate-400 line-through font-medium">
          ${{ parseFloat(product.price).toFixed(2) }}
        </span>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-1.5 text-amber-400 text-xl">
        <span v-for="n in 5" :key="n">★</span>
        <span class="text-slate-500 ml-2 text-base font-semibold">({{ product.reviews_count || 0 }})</span>
      </div>

      <!-- Quick Add -->
      <button
        v-if="product.stock > 0"
        @click.prevent="addToCart"
        class="mt-2 w-full py-3 bg-slate-50 hover:bg-violet-600 text-slate-800 hover:text-white text-base font-bold rounded-xl transition"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Quick Add
        </span>
      </button>
      <button
        v-else
        disabled
        class="mt-2 w-full py-3 bg-slate-100 text-slate-400 text-base font-bold rounded-xl cursor-not-allowed"
      >
        Out of Stock
      </button>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { STORAGE_BASE } from '../services/api'

const props = defineProps({ product: { type: Object, required: true } })

function formatPrice(p) {
  return p.sale_price ? parseFloat(p.sale_price).toFixed(2) : parseFloat(p.price).toFixed(2)
}

function addToCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existing = cart.find(i => i.product_id === props.product.id)
  if (existing) existing.quantity++
  else cart.push({ product_id: props.product.id, quantity: 1, name: props.product.name, price: props.product.price, image: props.product.image })
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}
</script>

<style scoped>
/* line-clamp handled via layout; remove if not needed */
</style>
