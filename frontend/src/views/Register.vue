<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8 sm:p-10 w-full max-w-md fade-in">
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">VKEN</router-link>
        <p class="mt-2 text-slate-500 text-sm">Create your account</p>
      </div>

      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
          <input v-model="name" type="text" required class="input" placeholder="John Doe">
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Email address</label>
          <input v-model="email" type="email" required class="input" placeholder="you@example.com">
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
          <input v-model="password" type="password" required class="input" placeholder="Min 8 characters">
        </div>
        <div v-if="error" class="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{{ error }}</div>
        <button type="submit" :disabled="loading" class="btn btn-primary w-full text-base py-3 rounded-xl shadow-lg shadow-violet-200 disabled:opacity-60">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center text-sm text-slate-500 mt-6">
        Already have an account?
        <router-link to="/login" class="text-violet-600 font-bold hover:text-violet-700">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function register() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.post('/auth/register', { name: name.value, email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
