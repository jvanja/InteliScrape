<template>
  <div class="min-h-screen flex flex-col">
    <PageHeader />
    <div class="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
      <slot />
    </div>
    <PageFooter />
  </div>
</template>
