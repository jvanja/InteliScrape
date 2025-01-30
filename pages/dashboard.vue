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
          <button
            class="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            @click="logout"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
      <div v-if="user" class="text-center">
        <h1 class="text-3xl font-semibold mb-10">
          Welcome, <span class="text-blue-600">{{ user.email }}</span
          >!
        </h1>
        <!-- Add your dashboard content here -->
        <div class="p-4 bg-white border border-gray-200 rounded shadow-sm">
          <form
            @submit.prevent="handleSubmit"
            class="bg-secondary-50 shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div class="mb-4">
              <label
                for="urls"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Enter URLs (one per line):</label
              >
              <textarea
                id="urls"
                v-model="urlsInput"
                rows="5"
                required
                placeholder="https://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies&#10;https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>

            <div class="mb-6">
              <label
                for="prompt"
                class="block text-gray-700 text-sm font-bold mb-2"
                >Prompt / Instructions:</label
              >
              <input
                id="prompt"
                v-model="prompt"
                type="text"
                required
                placeholder="e.g. Extract the GDP growth rate (be as detailed as possible)"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Scrape
            </button>
          </form>

          <hr class="my-8" />

          <div v-if="pendingMessage" class="text-green-500">
            <h3 class="text-lg font-bold mb-2">Status</h3>
            <p>{{ pendingMessage }}</p>
          </div>

          <div
            v-if="finalResult"
            class="bg-gray-100 rounded p-4 overflow-x-auto"
          >
            <h2 class="text-lg font-bold mb-2">Response Data</h2>
            <pre class="text-sm whitespace-pre-wrap">{{ finalResult }}</pre>
          </div>

          <div v-if="errorMessage" class="text-red-500">
            <h3 class="text-lg font-bold mb-2">Error</h3>
            <p>{{ errorMessage }}</p>
          </div>
        </div>
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
import { ref } from "vue";

const user = useSupabaseUser();
const supabase = useSupabaseClient();

async function logout() {
  await supabase.auth.signOut();
  navigateTo("/login");
}

type ParsedObject = {
  url: string;
  html?: string;
  error?: string;
};
// - TODO:
// remove the default values
const urlsInput = ref(
  `https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025\nhttps://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies`,
);
const prompt = ref("");
const responseData = ref();
const finalResult = ref(null);
const errorMessage = ref("");
const pendingMessage = ref("");

async function handleSubmit() {
  errorMessage.value = "";
  responseData.value = [];

  try {
    // Convert multiline URLs into an array
    const urls = urlsInput.value
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    // Make a POST request to our /api/scrape endpoint
    pendingMessage.value = "Scraping URLs...";
    const { data, success, error } = await $fetch("/api/scrape", {
      method: "POST",
      body: { urls },
    });

    // If there's an error field from the server, handle it
    if (!success) {
      errorMessage.value = error;
    } else {
      responseData.value = data;
      pendingMessage.value = "Processing HTML...";
      callAIProxy(data);
    }
  } catch (err: any) {
    errorMessage.value = err.message || "Unknown error";
  }
}

async function callAIProxy(scrapedPages: ParsedObject[]) {
  try {
    const { data, success, error } = await $fetch("/api/ai", {
      method: "POST",
      body: {
        scrapedPages,
        prompt: prompt.value,
      },
    });

    if (!success) {
      pendingMessage.value = "";
      console.error("AI error:", error);
      errorMessage.value = error;
    } else {
      // `data.data` is the AI response
      console.log("AI response:", data, success);
      pendingMessage.value = "";
      finalResult.value = data;
    }
  } catch (err) {
    console.error("Network or server error:", err);
  }
}
</script>
