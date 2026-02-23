import type { ResponsePexel } from "~/modules/core/types";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { per_page } = getQuery(event);

  if (!config.pexelsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Brak klucza API Pexels. Ustaw zmienną środowiskową PEXELS_API_KEY.",
    });
  }

  // ...existing code...
  const perPage = Number(per_page);
  if (!per_page || !Number.isInteger(perPage) || perPage < 1 || perPage > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Parametr 'per_page' musi być liczbą całkowitą w zakresie 1–100.",
    });
  }

  try {
    return await $fetch<ResponsePexel>(
      `https://api.pexels.com/v1/collections/dyck2i1?per_page=${perPage}`,
      {
        headers: {
          Authorization: config.pexelsApiKey as string,
        },
      }
    );
  } catch (err: unknown) {
    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 502;
    throw createError({
      statusCode: status,
      statusMessage: "Pexels API Error",
      message: "Nie udało się pobrać listy zdjęć z Pexels API.",
    });
  }
});
