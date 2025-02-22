<!-- ~/components/MenuItem.vue -->
<template>
  <Collapsible
    v-if="item.submenu"
    :open="open"
    @open-change="(val: boolean) => (open = val)"
  >
    <CollapsibleTrigger as-child>
      <button
        class="flex w-full items-center justify-between py-2 font-medium text-foreground/80 hover:text-foreground"
      >
        {{ item.title }}
        <component
          :is="open ? 'ChevronDown' : 'ChevronRight'"
          class="h-4 w-4"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent>
      <div class="ml-3 mt-1 flex flex-col space-y-1">
        <!-- Recursively render sub items -->
        <MenuItem v-for="sub in item.submenu" :key="sub.title" :item="sub" />
      </div>
    </CollapsibleContent>
  </Collapsible>

  <!-- Non-collapsible, normal link -->
  <a
    v-else
    :href="item.href"
    class="block py-2 font-medium text-foreground/80 hover:text-foreground"
  >
    {{ item.title }}
  </a>
</template>

<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const open = ref(false)
</script>
