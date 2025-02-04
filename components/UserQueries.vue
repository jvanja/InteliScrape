<template>
  <div class="p-4 bg-white border border-gray-200 rounded shadow-sm">
    <h1 class="text-2xl font-bold mb-4">Your Queries</h1>

    <div v-if="isLoading" class="text-gray-600">Loading queries...</div>
    <div v-else-if="queries.length === 0" class="text-gray-600">
      No queries found.
    </div>
    <div v-else>
      <table class="min-w-full border-collapse bg-white shadow-sm text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-2 px-4 text-left font-semibold border-b">Prompt</th>
            <th class="py-2 px-4 text-left font-semibold border-b">URLs</th>
            <th class="py-2 px-4 text-left font-semibold border-b">
              Result
            </th>
            <th class="py-2 px-4 text-left font-semibold border-b">
              Cost
            </th>
            <th class="py-2 px-4 text-left font-semibold border-b">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="query in queries"
            :key="query.id"
            class="hover:bg-gray-100 transition-colors text-sm text-gray-500 hover:text-black"
          >
            <td class="py-2 px-4 border-b overflow-hidden text-ellipsis whitespace-nowrap max-w-1">{{ query.prompt }}</td>
            <td class="py-2 px-4 border-b overflow-hidden text-ellipsis whitespace-nowrap max-w-1">
              {{ query.urls }}
            </td>
            <td class="py-2 px-4 border-b overflow-hidden text-ellipsis whitespace-nowrap max-w-1">
              {{ query.results }}
            </td>
            <td class="py-2 px-4 border-b overflow-hidden text-ellipsis whitespace-nowrap max-w-1">
              {{ query.cost }}
            </td>
            <td class="py-2 px-4 border-b overflow-hidden text-ellipsis whitespace-nowrap max-w-1">
              {{ formatDate(query.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from "#imports";

interface QueryRecord {
  id: string;
  user_id: string;
  prompt: string;
  urls: string[];
  results: string;
  cost: number;
  created_at: string;
  updated_at: string;
}

// State
const queries = ref<QueryRecord[]>([]);
const isLoading = ref(true);

// Access Supabase client + current user
const supabase = useSupabaseClient();
const user = useSupabaseUser();

onMounted(async () => {
  isLoading.value = true;
  try {
    if (!user.value) {
      // If user is not logged in, you might redirect or show a message
      queries.value = [];
    } else {
      // Fetch queries for this specific user
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("user_id", user.value.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching queries:", error.message);
        queries.value = [];
      } else {
        queries.value = data as QueryRecord[];
      }
    }
  } finally {
    isLoading.value = false;
  }
});

/**
 * Format date strings into a more readable format.
 * You can customize or use a date-fns/moment library if desired.
 */
function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString(); // e.g., "1/28/2025, 10:05 AM"
}
</script>
