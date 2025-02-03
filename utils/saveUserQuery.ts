import type { SupabaseClient } from "@supabase/supabase-js";
interface SaveQueryOptions {
  supabase: SupabaseClient;
  userId: string; // or null if not logged in
  prompt: string;
  urls: string;
  results: string;
}

export default async function ({
  supabase,
  userId,
  prompt,
  urls,
  results,
}: SaveQueryOptions) {
  // Insert the query record
  const { data, error } = await supabase
    .from("queries")
    .insert([
      {
        user_id: userId,
        prompt,
        urls,
        results,
      },
    ])
    .select(); // to return the inserted rows (Supabase v2 syntax)

  if (error) {
    console.error("Error inserting query:", error.message);
    return null;
  }

  // data will be an array of inserted rows (usually length 1)
  return data[0];
}
