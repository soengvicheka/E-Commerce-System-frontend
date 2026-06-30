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
            <input v-model="email" type="email" required class="input pl-9" placeholder="you@example.com" autocomplete="email">
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
          <input v-model="password" type="password" required class="input" placeholder="Enter your password" autocomplete="current-password">
        </div>
        <div v-if="formError" class="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{{ formError }}</div>
        <button type="submit" :disabled="formLoading" class="btn btn-primary w-full text-base py-3 rounded-xl shadow-lg shadow-violet-200 disabled:opacity-60">
          {{ formLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="flex items-center gap-3 my-6">
        <div class="flex-1 h-px bg-slate-200"></div>
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">or</span>
        <div class="flex-1 h-px bg-slate-200"></div>
      </div>

      <button
        type="button"
        @click="googleLogin"
        :disabled="googleLoading"
        class="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {{ googleLoading ? 'Connecting...' : 'Continue with Google' }}
      </button>

      <p v-if="googleError" class="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm mt-4">{{ googleError }}</p>

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
const formError = ref('')
const formLoading = ref(false)
const googleError = ref('')
const googleLoading = ref(false)

function googleLogin() {
  googleLoading.value = true
  googleError.value = ''
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    googleError.value = 'Google login is not configured.'
    googleLoading.value = false
    return
  }
  const redirectUri = 'http://localhost:5173/auth/google/callback'
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid profile email')
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')
  window.location.href = authUrl.toString()
}

async function login() {
  formLoading.value = true
  formError.value = ''
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/')
  } catch (e) {
    formError.value = e.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    formLoading.value = false
  }
}
</script>
