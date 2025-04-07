<template>
  <form class="contact-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" placeholder="Your Name" />
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="Your Email" />
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" placeholder="Your Message"></textarea>
    </div>
    <Button>Submit</Button>
  </form>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
</script>

<style lang="scss" scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: bold;
    }

    input,
    textarea {
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #007bff;
      }
    }

    textarea {
      resize: vertical;
      min-height: 150px;
    }
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
