<template>
  <div class="p-12 border border-purple-600 rounded">
    <!-- Form Section -->
    <form class="mb-4" @submit.prevent="confirmStart">
      <div class="mb-4">
        <label for="urls" class="block text-sm font-bold mb-2">
          Enter URLs (one per line):
        </label>
        <textarea
          id="urls"
          v-model="urlsInput"
          rows="5"
          required
          placeholder="https://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies&#10;https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025"
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
        ></textarea>
      </div>

      <div class="mb-6">
        <label for="prompt" class="block text-sm font-bold mb-2">
          Prompt / Instructions:
        </label>
        <input
          id="prompt"
          v-model="prompt"
          type="text"
          required
          placeholder="e.g. Extract the GDP growth rate (be as detailed as possible)"
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-800"
        />
      </div>

      <Button type="submit">Scrape</Button>
    </form>

    <!-- Status Messages -->
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

    <!-- Pre-Scraping Confirmation Dialog -->
    <AlertDialog v-model:open="startDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{dialogTitle}}</AlertDialogTitle>
          <AlertDialogDescription>{{dialogDecription}}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="dialogExecute">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()

/* ==========================================================================
 Reactive state
 ========================================================================== */
const urlsInput =
  ref(`https://www.gov.uk/government/publications/fuel-duty-extending-the-temporary-cut-in-rates-to-march-2025/extension-to-the-cut-in-fuel-duty-rates-to-march-2025
https://www.ecologie.gouv.fr/politiques-publiques/fiscalite-energies`)
const prompt = ref(
  'Extract all the fuel types from their corresponding excise tax rates. Use the following format "fuel_type, tax_rate, quantity_with_unit". Example: "Biodiesel, 0.53, 1L" or  "LPG, 0.3, 1KG". Return the data as CSV'
)
const finalResult = ref<string>('')
const errorMessage = ref<string>('')
const pendingMessage = ref<string>('')
const cost = ref<number>(0)
const startDialogOpen = ref<boolean>(false)
const dialogTitle = userStore.account_type ? 'Task is Starting' : 'No active subscription'
const dialogDecription = userStore.account_type ? 'Your request will run in the background. You can close your browser. You will receive an email when the task is complete.' : 'You need an active subscription to start this task.'
const dialogExecute = () => userStore.account_type ? executeScraping : navigateTo('/profile') 

/* ==========================================================================
 Workflow functions  
 ========================================================================== */
// Called when the form is submitted: open the pre-scraping dialog.
function confirmStart() {
  startDialogOpen.value = true
}

// Main function executed when the user confirms the dialog.
async function executeScraping() {
  startDialogOpen.value = false
  errorMessage.value = ''
  pendingMessage.value = ''

  try {
    // Convert multiline URLs into an array.
    const urls = urlsInput.value
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean)

    // Inform user about scraping.
    pendingMessage.value = 'Scraping URLs...'
    const scrapeResponse = await $fetch<{
      data: any
      success: boolean
      error: string
    }>('/api/scrape', {
      method: 'POST',
      body: { urls },
    })
    if (!scrapeResponse.success) throw new Error(scrapeResponse.error)
    const scrapedPages = scrapeResponse.data

    // Process scraped data via AI.
    pendingMessage.value = 'Processing data with AI...'
    const aiResponse = await $fetch<{
      data: any
      success: boolean
      error: string
      totalCost: number
    }>('/api/ai', {
      method: 'POST',
      body: { scrapedPages, prompt: prompt.value },
    })
    if (!aiResponse.success) throw new Error(aiResponse.error)
    cost.value = aiResponse.totalCost
    finalResult.value = aiResponse.data

    // Automatically save query (without prompting the user).
    await saveQuery()

    pendingMessage.value =
      'Task complete. An email will be sent with the results.'
  } catch (err: any) {
    errorMessage.value = err.message || 'Unknown error occurred'
  } finally {
    pendingMessage.value = ''
  }
}

// Automatically save the query to the database.
async function saveQuery() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  // Assume saveUserQuery is available globally or via auto-import
  await saveUserQuery({
    supabase,
    userId: user.value!.id,
    prompt: prompt.value,
    urls: urlsInput.value,
    results: finalResult.value,
    cost: cost.value,
  })
}
</script>
