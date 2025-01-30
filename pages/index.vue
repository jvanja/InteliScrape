<template>
  <div class="container">
    <h1>Mini Smart Scraper</h1>

    <form @submit.prevent="handleSubmit" class="form">
      <div>
        <label for="urls">Enter URLs (one per line):</label><br />
        <textarea
          id="urls"
          v-model="urlsInput"
          rows="5"
          placeholder="https://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies&#10;https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025"
        ></textarea>
      </div>

      <div>
        <label for="prompt">Prompt / Instructions:</label><br />
        <input
          id="prompt"
          v-model="prompt"
          type="text"
          placeholder="e.g. Extract the GDP growth rate (be as detailed as possible)"
        />
      </div>

      <button type="submit" style="margin-top: 1rem">Scrape</button>
    </form>

    <hr />

    <div v-if="pendingMessage" style="color: green">
      <h3>Status</h3>
      <p>{{ pendingMessage }}</p>
    </div>

    <!-- Display response data -->
    <div v-if="finalResult">
      <h2>Response Data</h2>
      <pre>{{ finalResult }}</pre>
    </div>

    <div v-if="errorMessage" style="color: red">
      <h3>Error</h3>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
    type ParsedObject = {
      url: string;
      html?: string;
      error?: string;
    };
// - TODO:
// remove the default values
const urlsInput = ref(`https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025\nhttps://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies`);
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
    pendingMessage.value = "Scraping URLs..."
    const { data, success, error } = await $fetch("/api/scrape", {
      method: "POST",
      body: { urls },
    });

    // If there's an error field from the server, handle it
    if (!success) {
      errorMessage.value = error;
    } else {
      responseData.value = data;
      pendingMessage.value = "Processing HTML..."
      callAIProxy(data)
    }
  } catch (err: any) {
    errorMessage.value = err.message || "Unknown error";
  }
}

async function callAIProxy(scrapedPages: ParsedObject[]) {
  try {
    const { data, success, error } = await $fetch('/api/ai', {
      method: 'POST',
      body: {
        scrapedPages,
        prompt: prompt.value
      }
    })
    
    if (!success) {
      pendingMessage.value = ""
      console.error('AI error:', error)
      errorMessage.value = error;
    } else {
      // `data.data` is the AI response
      console.log('AI response:', data, success)
      pendingMessage.value = ""
      finalResult.value = data
    }
  } catch (err) {
    console.error('Network or server error:', err)
  }
}
</script>

<style scoped>
/* .container { */
/*   max-width: 600px; */
/*   margin: 2rem auto; */
/*   font-family: sans-serif; */
/* } */
/* .form label { */
/*   font-weight: 600; */
/* } */
/* textarea, */
/* input { */
/*   width: 100%; */
/*   padding: 0.5rem; */
/*   font-size: 1rem; */
/* } */
/* button { */
/*   padding: 0.5rem 1rem; */
/*   cursor: pointer; */
/* } */
/* pre { */
/*   background: #f4f4f4; */
/*   padding: 1rem; */
/*   white-space: pre-wrap; */
/* } */
</style>
