<!-- ~/components/MenuBar.vue -->
<template>
  <header class="sticky top-0 z-50 border-b bg-background">
    <div
      class="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4"
    >
      <!-- Logo or Brand -->
      <div class="text-xl font-bold">MyBrand</div>

      <!-- Desktop Nav -->
      <nav class="hidden gap-4 md:flex">
        <!-- Example links (you can also make them collapsible, if you want) -->
        <NuxtLink
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          class="text-sm font-medium text-foreground/80 hover:text-foreground"
        >
          {{ item.title }}
        </NuxtLink>
      </nav>

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
        <SheetContent side="left" class="w-[220px] sm:w-[300px]">
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
// The top-level nav items
const menuItems = [
  { title: 'Pricing', to: '/pricing' },
  { title: 'Contact', to: '/contact' },
]
</script>
