<template>
  <div class="p-4 bg-white border border-gray-200 rounded shadow-sm">
    <form
      class="bg-secondary-50 shadow-md rounded px-8 pt-6 pb-8 mb-4"
      @submit.prevent="handleSubmit"
    >
      <div class="mb-4">
        <label for="urls" class="block text-gray-700 text-sm font-bold mb-2"
          >Enter URLs (one per line):</label
        >
        <textarea
          id="urls"
          v-model="urlsInput"
          rows="5"
          required
          placeholder="https://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies&#10;https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div class="mb-6">
        <label for="prompt" class="block text-gray-700 text-sm font-bold mb-2"
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

      <Button type="submit"> Scrape</Button>
    </form>

    <hr class="my-8" />

    <div v-if="pendingMessage" class="text-green-500">
      <h3 class="text-lg font-bold mb-2">Status</h3>
      <p>{{ pendingMessage }}</p>
    </div>

    <div
      v-if="finalResult"
      class="bg-gray-100 rounded p-4 overflow-x-auto mb-2"
    >
      <h2 class="text-lg font-bold mb-2">Response Data</h2>
      <pre class="text-sm whitespace-pre-wrap">{{ finalResult }}</pre>
    </div>

    <div v-if="cost" class="bg-blue-50 rounded p-4 overflow-x-auto">
      <div class="text-sm whitespace-pre-wrap">
        {{ `Total cost for this request: $${cost}` }}
      </div>
    </div>

    <div v-if="errorMessage" class="text-red-500">
      <h3 class="text-lg font-bold mb-2">Error</h3>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser, useSupabaseClient } from '#imports'

type ParsedObject = {
  url: string
  html?: string
  error?: string
}
// - TODO:
// remove the default values
const urlsInput = ref(
  `https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025\nhttps://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies`
)
const prompt = ref('')
const responseData = ref()
const finalResult = ref()
const errorMessage = ref('')
const pendingMessage = ref('')
const cost = ref(0)

async function handleSubmit() {
  errorMessage.value = ''
  responseData.value = []

  try {
    // save the query to the database
    pendingMessage.value = 'Saving the query to the database...'
    await saveQuery(urlsInput.value, prompt.value)

    // Convert multiline URLs into an array
    const urls = urlsInput.value
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean)

    // Make a POST request to our /api/scrape endpoint
    pendingMessage.value = 'Scraping URLs...'
    const { data, success, error } = await $fetch('/api/scrape', {
      method: 'POST',
      body: { urls },
    })

    if (!success) {
      errorMessage.value = error
    } else {
      responseData.value = data
      pendingMessage.value = 'Munching websites...'

      // Finally process the HTML using the AI call
      callAIProxy(data)
    }
  } catch (err) {
    errorMessage.value = (err as Error).message || 'Unknown error'
  }
}

async function callAIProxy(scrapedPages: ParsedObject[]) {
  try {
    const { data, success, error, totalCost } = await $fetch('/api/ai', {
      method: 'POST',
      body: {
        scrapedPages,
        prompt: prompt.value,
      },
    })

    if (!success) {
      pendingMessage.value = ''
      console.error('AI error:', error)
      errorMessage.value = error
    } else {
      // `data.data` is the AI response
      console.log('AI response:', data, success)
      pendingMessage.value = ''
      cost.value = totalCost
      finalResult.value = data
    }
  } catch (err) {
    console.error('Network or server error:', err)
  }
}

async function saveQuery(urls: string, prompt: string) {
  const user = useSupabaseUser()
  const userId = user.value!.id
  const supabase = useSupabaseClient()
  const insertedQuery = await saveUserQuery({
    supabase,
    userId,
    prompt,
    urls,
  })

  console.log('Saved query:', insertedQuery)
}
</script>
