<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <router-link to="/" class="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
          VKEN.ze
        </router-link>
        <nav class="hidden md:flex items-center gap-6 text-base font-medium text-slate-600">
          <router-link to="/" class="hover:text-violet-600 transition" active-class="text-violet-600 !font-bold">Home</router-link>
          <router-link to="/products" class="hover:text-violet-600 transition" active-class="text-violet-600 !font-bold">Products</router-link>
        </nav>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <div class="hidden md:flex items-center bg-slate-100/80 rounded-full pl-3 pr-1 py-1 ring-1 ring-slate-200">
          <svg class="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="search" @keyup.enter="doSearch" placeholder="Search products..." class="bg-transparent outline-none text-sm w-40 placeholder:text-slate-400">
        </div>

        <router-link to="/cart" class="relative p-2 rounded-full hover:bg-slate-100 transition group">
          <svg class="w-5 h-5 text-slate-700 group-hover:text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
          <span v-if="cartCount" class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white">
            {{ cartCount }}
          </span>
        </router-link>

        <div v-if="isLoggedIn" class="flex items-center gap-2">
          <router-link to="/wishlist" class="p-2 rounded-full hover:bg-slate-100 transition hidden sm:block">
            <svg class="w-5 h-5 text-slate-700 hover:text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </router-link>
          <div class="relative group">
            <button class="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-slate-100/80 hover:bg-slate-200/60 transition text-base font-medium text-slate-700">
              <span class="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold ring-2 ring-white shadow-sm">
                {{ userInitial }}
              </span>
              <span class="hidden sm:inline max-w-[120px] truncate">{{ user.name }}</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div class="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-slate-200/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div class="p-2">
                <router-link to="/orders" class="flex items-center gap-3 px-3 py-2.5 text-base rounded-lg hover:bg-slate-50 text-slate-700">
                  <span class="text-lg">📦</span> My Orders
                </router-link>
                <router-link to="/wishlist" class="flex items-center gap-3 px-3 py-2.5 text-base rounded-lg hover:bg-slate-50 text-slate-700">
                  <span class="text-lg">❤️</span> Wishlist
                </router-link>
                <router-link to="/profile" class="flex items-center gap-3 px-3 py-2.5 text-base rounded-lg hover:bg-slate-50 text-slate-700">
                  <span class="text-lg">👤</span> Profile
                </router-link>
                <div class="my-1.5 h-px bg-slate-100"></div>
                <button @click="logout" class="w-full flex items-center gap-3 px-3 py-2.5 text-base rounded-lg hover:bg-red-50 text-red-600">
                  <span class="text-lg">🚪</span> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <router-link v-else to="/login" class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold rounded-full transition shadow-sm shadow-violet-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
          Login
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()
const search = ref('')

const isLoggedIn = computed(() => !!localStorage.getItem('token'))
const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'))
const userInitial = computed(() => user.value.name?.[0]?.toUpperCase() || '?')
const cartCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  return cart.reduce((sum, i) => sum + i.quantity, 0)
})

function doSearch() {
  if (search.value.trim()) {
    router.push({ path: '/products', query: { search: search.value } })
  }
}

async function logout() {
  try {
    await api.post('/auth/logout')
  } catch (e) {
    // ignore network errors; still clear local session
  }
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
  window.location.reload()
}
</script>
