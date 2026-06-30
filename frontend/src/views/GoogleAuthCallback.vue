<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8 sm:p-10 w-full max-w-md text-center">
      <div v-if="loading" class="space-y-3">
        <div class="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-slate-600 font-medium">Completing Google sign-in...</p>
      </div>
      <div v-else-if="error" class="space-y-4">
        <p class="text-red-700 font-medium">{{ error }}</p>
        <router-link to="/login" class="btn btn-primary inline-block px-6 py-3 rounded-xl shadow-lg shadow-violet-200">Back to Login</router-link>
      </div>
      <div v-else class="space-y-4">
        <p class="text-green-700 font-medium">Signed in successfully!</p>
        <router-link to="/" class="btn btn-primary inline-block px-6 py-3 rounded-xl shadow-lg shadow-violet-200">Go to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')

async function completeLogin() {
  loading.value = true
  error.value = ''

  try {
    const code = route.query.code
    if (!code) {
      throw new Error('Missing authorization code from Google.')
    }

    const res = await api.post('/auth/google/callback', { code })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    await router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Google login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  completeLogin()
})
</script>
