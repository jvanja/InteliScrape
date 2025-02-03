<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div class="text-xl font-bold">
          <NuxtLink to="/">InteliScrape</NuxtLink>
        </div>
        <div>
          <Button variant="secondary" @click="logout" >Log Out</Button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
      <div v-if="user" class="text-center">
        <h1 class="text-3xl font-semibold mb-10">
          Welcome, <span class="text-blue-600">{{ user.email }}</span
          >!
        </h1>
        <!-- Add your dashboard content here -->
        <UserQueries v-if="!newQuery" />
        <ScrapeForm v-else />

        <Button
          v-if="!newQuery"
          class="mt-4"
          @click="newQuery = true"
        >Create a New Query</Button>

      </div>

      <div v-else class="text-center mt-10">
        <p class="text-xl text-red-500">You are not logged in.</p>
        <p class="text-gray-700 mt-2">
          <a href="/login" class="text-blue-600 hover:underline">
            Go to Login
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser, useSupabaseClient, navigateTo } from "#imports";
import UserQueries from "~/components/UserQueries.vue";

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const newQuery = ref(false);

async function logout() {
  await supabase.auth.signOut();
  navigateTo("/login");
}
</script>
