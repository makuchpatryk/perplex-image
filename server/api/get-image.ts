import { createSupabaseAdapter } from "~/server/utils/adapters/supabase-adapter";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getQuery(event);

  const photoId = Number(id);
  if (!id || !Number.isInteger(photoId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Parameter 'id' must be a non-negative integer.",
    });
  }

  const adapter = createSupabaseAdapter(config);
  return adapter.getImage(photoId);
});
