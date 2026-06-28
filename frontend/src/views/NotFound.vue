<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
    <div class="text-8xl font-extrabold text-slate-200 select-none">404</div>
    <h1 class="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Looks like you took a wrong turn.</h1>
    <p class="mt-3 text-base text-slate-500 max-w-md">The page you are looking for does not exist or has been moved. Let's get you back to shopping.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <router-link to="/" class="btn btn-primary px-8 py-3.5 text-base rounded-full">Back to Home</router-link>
      <router-link to="/products" class="btn btn-outline px-8 py-3.5 text-base rounded-full">Browse Products</router-link>
    </div>
  </div>
</template>

<script setup>
</script>
