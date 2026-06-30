<template>
  <router-link :to="`/products/${product.id}`" class="group block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-xl transition duration-300 h-full no-underline">
    <!-- Image -->
    <div class="relative aspect-square bg-white overflow-hidden">
      <img
        v-if="product.image"
        :src="STORAGE_BASE + product.image"
        :alt="product.name"
        class="w-full h-full object-contain p-4 transition duration-500 group-hover:scale-105"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-slate-100 to-slate-200">
        📦
      </div>

      <!-- Sale Badge -->
      <div v-if="product.sale_price" class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
        Sale
      </div>
      <!-- Featured Badge -->
      <div v-else-if="product.is_featured" class="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm uppercase tracking-wider">
        <span>⭐</span>
        <span>Featured</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col gap-3 flex-1">
      <div class="flex-1">
        <!-- Category -->
        <span class="text-xs font-extrabold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg uppercase tracking-wider inline-block w-fit mb-3">
          {{ product.category?.name || 'UNCATEGORIZED' }}
        </span>

        <!-- Product Name -->
        <h3 class="text-lg font-extrabold leading-snug">
          <span class="bg-violet-600 text-white px-3 py-2 rounded-lg inline-block line-clamp-2">
            {{ product.name }}
          </span>
        </h3>

        <!-- Price -->
        <div class="flex items-baseline gap-3 mt-1">
          <span class="text-xl font-extrabold text-slate-900">
            ${{ formatPrice(product) }}
          </span>
          <span v-if="product.sale_price" class="text-base text-slate-400 line-through font-medium">
            ${{ parseFloat(product.price).toFixed(2) }}
          </span>
        </div>

        <!-- Rating -->
        <div v-if="product.reviews_count" class="flex items-center gap-1.5 text-amber-400 text-lg">
          <span>★</span>
          <span class="text-slate-500 ml-2 text-sm font-semibold">({{ product.reviews_count }})</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-2 flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2">
          <button
            v-if="product.stock > 0"
            type="button"
            @click.prevent.stop="addToCartAndGo"
            class="py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Quick Add
            </span>
          </button>
          <button
            v-else
            disabled
            type="button"
            class="py-3 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-not-allowed"
          >
            Out of Stock
          </button>

          <button
            type="button"
            @click.prevent.stop="buyNow"
            class="py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              Buy Now
            </span>
          </button>
        </div>

        <button
          type="button"
          @click.prevent.stop="toggleWishlist"
          class="w-full py-3 border rounded-xl text-sm font-bold transition"
          :class="inWishlist ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-700'"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" :class="inWishlist ? 'fill-rose-500 text-rose-500' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            {{ inWishlist ? '❤️ Saved' : '❤️ Add to Wishlist' }}
          </span>
        </button>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'
import { api, STORAGE_BASE } from '../services/api'

const props = defineProps({ product: { type: Object, required: true } })

const inWishlist = ref(false)

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

  const token = localStorage.getItem('token')
  if (token) {
    api.post('/cart', { product_id: props.product.id, quantity: 1 }).catch(() => {})
  }
}

async function addToCartAndGo() {
  addToCart()
  window.location.href = '/cart'
}

async function toggleWishlist() {
  try {
    const res = await api.post('/wishlist/toggle', { product_id: props.product.id })
    inWishlist.value = res.data?.in_wishlist ?? !inWishlist.value
  } catch (e) {
    const raw = e.response?.data
    if (typeof raw === 'string') alert(raw)
    else alert(raw?.message || raw?.error || 'Failed to update wishlist')
    if (e.response?.status === 401) setTimeout(() => (window.location.href = '/login'), 50)
  }
}

function buyNow() {
  addToCart()
  window.location.href = '/cart'
}
</script>

<style scoped>
/* line-clamp handled via layout; remove if not needed */
</style>
