<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div class="max-w-md w-full text-center space-y-6 fade-in">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 p-8 sm:p-10">
        <div class="text-5xl mb-4">👋</div>
        <h1 class="text-2xl font-extrabold text-slate-900">You have been logged out</h1>
        <p class="mt-2 text-slate-500">Thank you for visiting. Come back soon!</p>
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <router-link to="/" class="btn btn-primary flex-1">Go to Home</router-link>
          <router-link to="/login" class="btn btn-outline flex-1">Sign In Again</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()

onMounted(async () => {
  try {
    await api.post('/auth/logout')
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('token')
  localStorage.removeItem('user')
})
</script>
