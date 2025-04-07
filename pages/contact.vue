<template>
  <div class="contact-page">
    <h1>Contact Us</h1>
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
        <Textarea
          id="message"
          placeholder="Your Message"
          class="resize-vertical min-h-[150px]"
        />
      </div>
      <Button>Submit</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
</script>
<style lang="css">
.contact-page {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-bottom: 2rem;
    text-align: center;
  }
}
</style>
