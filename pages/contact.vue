<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    email: z.string().email().min(5),
    message: z.string().min(10).max(500),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>
<template>
  <div class="w-full flex flex-col items-center">
    <div class="mx-auto max-w-full px-6 lg:px-8 flex flex-col items-center">
      <div class="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
        <h1 class="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
          Contact Us
        </h1>
      </div>
      <form @submit="onSubmit" class="w-[32rem] max-w-full space-y-5 mt-16">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Your Name"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Your Email"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="message">
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <Textarea
                type="text"
                placeholder="Your Message"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit"> Submit </Button>
      </form>
    </div>
  </div>
</template>
