<template>
  <form class="flex flex-col gap-4 w-full max-w-lg mx-auto">
    <div class="flex flex-col gap-1">
      <label for="name" class="font-bold">Name</label>
      <Input type="text" id="name" placeholder="Your Name" />
    </div>
    <div class="flex flex-col gap-1">
      <label for="email" class="font-bold">Email</label>
      <Input type="email" id="email" placeholder="Your Email" />
    </div>
    <div class="flex flex-col gap-1">
      <label for="message" class="font-bold">Message</label>
      <Textarea id="message" placeholder="Your Message" class="resize-vertical min-h-[150px]" />
    </div>
    <Button>Submit</Button>
  </form>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
</script>
