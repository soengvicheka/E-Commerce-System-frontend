<template>
  <footer class="bg-slate-900 text-slate-300 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="col-span-2 md:col-span-1">
          <router-link to="/" class="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">VKEN</router-link>
          <p class="mt-3 text-sm text-slate-400 leading-relaxed">Premium products, unbeatable prices. Your trusted online shopping destination.</p>
          <div class="flex gap-3 mt-5">
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition text-sm text-white">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.66 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.236.195 2.236.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.78v-2.632h-2.78v-6.922C18.36 2.04 20 3.668 20 5.5v3.2z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition text-sm text-white">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h-3.77l-2.243 3.124h-2.768L8.97 2.25H5.244l2.57 11.242L5.244 21.75h3.77l2.243-3.124h2.768l2.243 3.124h3.77l-2.57-11.242L21.756 2.25h-3.512z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition text-sm text-white">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 2.124 6.094 1 7.5 1s2.52 1.124 2.52 2.5S6.094 6 7.5 6 4.98 4.876 4.98 3.5zM12 8h10v16H2V8h10V4l4 4 4-4v4z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Shop</h4>
          <div class="space-y-2.5 text-sm">
            <router-link to="/products" class="block hover:text-white transition">All Products</router-link>
            <router-link to="/cart" class="block hover:text-white transition">Cart</router-link>
            <router-link to="/wishlist" class="block hover:text-white transition">Wishlist</router-link>
          </div>
        </div>
        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Account</h4>
          <div class="space-y-2.5 text-sm">
            <router-link to="/orders" class="block hover:text-white transition">My Orders</router-link>
            <router-link to="/profile" class="block hover:text-white transition">Profile</router-link>
            <router-link to="/login" class="block hover:text-white transition">Sign In</router-link>
          </div>
        </div>
        <div>
          <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Stay updated</h4>
          <p class="text-sm text-slate-400 mb-3">Get exclusive offers and updates.</p>
          <div class="flex gap-2">
            <input type="email" placeholder="Email address" class="flex-1 min-w-0 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500">
            <button class="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition">Join</button>
          </div>
        </div>
      </div>
      <div class="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© 2025 VKEN. All rights reserved.</p>
        <div class="flex gap-4">
          <a href="#" class="hover:text-slate-300 transition">Privacy</a>
          <a href="#" class="hover:text-slate-300 transition">Terms</a>
          <a href="#" class="hover:text-slate-300 transition">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>
