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
        <a
          v-for="item in menuItems"
          :key="item.title"
          :href="item.href"
          class="text-sm font-medium text-foreground/80 hover:text-foreground"
        >
          {{ item.title }}
        </a>
      </nav>

      <!-- Mobile Hamburger Button -->
      <Sheet
        :open="sheetOpen"
        @open-change="(val: boolean) => (sheetOpen = val)"
      >
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
// Example data for your menu (some may have nested items, etc.)
interface MenuItemData {
  title: string
  href?: string
  submenu?: MenuItemData[]
}

// The top-level nav items
const menuItems: MenuItemData[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  {
    title: 'Services',
    submenu: [
      { title: 'Web Development', href: '/services/webdev' },
      { title: 'Mobile Apps', href: '/services/mobile' },
      { title: 'SEO', href: '/services/seo' },
    ],
  },
  { title: 'Contact', href: '/contact' },
]

// Control if the Sheet is open
const sheetOpen = ref(false)
</script>
