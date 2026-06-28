<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8 sm:p-10 w-full max-w-md fade-in">
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">VKEN</router-link>
        <p class="mt-2 text-slate-500 text-sm">Welcome back — login to continue</p>
      </div>

      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Email address</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </span>
            <input v-model="email" type="email" required class="input pl-9" placeholder="you@example.com">
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
          <input v-model="password" type="password" required class="input" placeholder="Enter your password">
        </div>
        <div v-if="error" class="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{{ error }}</div>
        <button type="submit" :disabled="loading" class="btn btn-primary w-full text-base py-3 rounded-xl shadow-lg shadow-violet-200 disabled:opacity-60">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-center text-sm text-slate-500 mt-6">
        Don't have an account?
        <router-link to="/register" class="text-violet-600 font-bold hover:text-violet-700">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
