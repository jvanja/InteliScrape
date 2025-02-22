<!-- ~/components/MenuBar.vue -->
<template>
  <header class="sticky top-0 z-50 border-b bg-gray-800 text-gray-400">
    <div
      class="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4"
    >
      <!-- Logo or Brand -->
      <NuxtLink class="text-xl font-bold" to="/">Verity.ai</NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden gap-4 md:flex">
        <MenuItem v-for="item in menuItems" :item="item" :key="item.title" />
      </nav>

      <div v-if="user" class="flex gap-x-4 items-center">
        <MenuItem :item="{title: 'Dashboard', to: '/dashboard'}" />
        <MenuItem :item="{title: 'Profile', to: '/profile'}" />
        <Button variant="secondary" @click="logout">Log Out</Button>
      </div>
      <div v-else>
        <NuxtLink to="/login" class="text-purple-600 font-bold"
          >Log In</NuxtLink
        >
      </div>
      <!-- Mobile Hamburger Button -->
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" class="md:hidden">
            <!-- Using lucide-vue’s Menu icon -->
            <Icon name="eva:menu-2-fill" class="w-5 h-5" />
            <span class="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        <!-- The slide-out menu on mobile -->
        <SheetContent side="left" class="w-[220px] sm:w-[300px] bg-black">
          <nav class="flex flex-col space-y-4 p-4">
            <MenuItem
              v-for="item in menuItems"
              :key="item.title"
              :item="item"
            />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import { Menu } from 'lucide-vue-next'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
// The top-level nav items
const menuItems = [
  { title: 'Pricing', to: '/pricing', current: true },
  { title: 'Contact', to: '/contact', current: false },
]

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
