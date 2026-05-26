import type { ResponseImage } from "@core/types";
import { createSupabaseAdapter } from "~/server/utils/adapters/supabase-adapter";

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig();
    const adapter = createSupabaseAdapter(config);
    const photos = await adapter.getImages();

    return {
      id: "supabase",
      media: photos,
      page: 1,
      per_page: photos.length,
      total_results: photos.length,
    } as ResponseImage;
  } catch (error) {
    throw error;
  }
});
