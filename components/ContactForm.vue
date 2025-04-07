<template>
  <form class="flex flex-col gap-4 w-full max-w-lg mx-auto">
    <div class="flex flex-col gap-1">
      <label for="name" class="font-bold">Name</label>
      <input
        type="text"
        id="name"
        placeholder="Your Name"
        class="px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label for="email" class="font-bold">Email</label>
      <input
        type="email"
        id="email"
        placeholder="Your Email"
        class="px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label for="message" class="font-bold">Message</label>
      <textarea
        id="message"
        placeholder="Your Message"
        class="px-3 py-2 border rounded focus:outline-none focus:border-blue-500 resize-vertical min-h-[150px]"
      ></textarea>
    </div>
    <Button>Submit</Button>
  </form>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
</script>
