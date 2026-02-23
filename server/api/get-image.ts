export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = getQuery(event);

  // Walidacja: id musi być dodatnią liczbą całkowitą (zabezpieczenie przed SSRF)
  const photoId = Number(id);
  if (!id || !Number.isInteger(photoId) || photoId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Parametr 'id' musi być dodatnią liczbą całkowitą.",
    });
  }

  try {
    return await $fetch(`https://api.pexels.com/v1/photos/${photoId}`, {
      headers: {
        Authorization: config.pexelsApiKey as string,
      },
    });
  } catch (err: unknown) {
    const status =
      err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : 502;
    throw createError({
      statusCode: status,
      statusMessage: "Pexels API Error",
      message: "Nie udało się pobrać zdjęcia z Pexels API.",
    });
  }
});
