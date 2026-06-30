<template>
  <div class="bg-slate-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-6">My Profile</h1>

      <div class="grid gap-6">
        <!-- Info -->
        <div class="card p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
              <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-3xl font-extrabold text-white bg-gradient-to-br from-violet-500 to-blue-500">
                {{ initials }}
              </div>
            </div>
            <div>
              <p class="font-extrabold text-slate-900 text-lg">{{ user.name }}</p>
              <p class="text-sm text-slate-500">{{ user.email }}</p>
            </div>
          </div>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Profile Photo</label>
              <input ref="avatarInput" type="file" accept="image/*" class="block text-sm text-slate-600 mb-2" />
              <button type="button" @click="uploadAvatar" class="btn btn-primary">Upload Photo</button>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Name</label>
              <input v-model="name" class="input" placeholder="Your name">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
              <input v-model="email" type="email" class="input" placeholder="you@example.com">
            </div>
            <div v-if="success" class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3">Profile updated successfully.</div>
            <div v-if="error" class="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{{ error }}</div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </form>
        </div>

        <!-- Password -->
        <div class="card p-6">
          <h3 class="font-extrabold text-slate-900 mb-4">Change Password</h3>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">Current Password</label>
              <input v-model="currentPassword" type="password" class="input" placeholder="••••••••">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
              <input v-model="newPassword" type="password" class="input" placeholder="Min 8 characters">
            </div>
            <div v-if="pwError" class="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{{ pwError }}</div>
            <div v-if="pwSuccess" class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3">Password changed successfully.</div>
            <button type="submit" class="btn btn-dark">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api, STORAGE_BASE } from '../services/api'

const user = ref({})
const name = ref('')
const email = ref('')
const success = ref(false)
const error = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const pwSuccess = ref(false)
const pwError = ref('')
const avatarInput = ref(null)
const avatarUrl = ref('')

const initials = computed(() => (user.value.name || '?')[0].toUpperCase())

async function loadProfile() {
  try {
    const res = await api.get('/profile')
    user.value = res.data
    name.value = res.data.name
    email.value = res.data.email
    avatarUrl.value = res.data.avatar ? STORAGE_BASE + res.data.avatar : ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to load profile'
  }
}

async function updateProfile() {
  try {
    const res = await api.put('/profile', { name: name.value, email: email.value })
    user.value = res.data
    success.value = true
    error.value = ''
    setTimeout(() => success.value = false, 3000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Update failed'
  }
}

async function changePassword() {
  pwError.value = ''
  pwSuccess.value = false
  try {
    await api.put('/profile/password', { current_password: currentPassword.value, password: newPassword.value })
    pwSuccess.value = true
    currentPassword.value = ''
    newPassword.value = ''
    setTimeout(() => pwSuccess.value = false, 3000)
  } catch (e) {
    pwError.value = e.response?.data?.message || 'Password update failed'
  }
}

async function uploadAvatar() {
  const file = avatarInput.value?.files?.[0]
  if (!file) return
  const form = new FormData()
  form.append('avatar', file)
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/v1/profile/avatar', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: form,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || 'Upload failed')
    user.value = data
    avatarUrl.value = data.avatar ? STORAGE_BASE + data.avatar : ''
    alert('Avatar updated')
  } catch (e) {
    alert(e.message || 'Failed to upload avatar')
  }
}

onMounted(loadProfile)
</script>
