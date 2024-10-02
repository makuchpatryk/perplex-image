export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  try {
    const image = await $fetch(`https://api.pexels.com/v1/photos/${id}`, {
      headers: {
        Authorization:
          "ud9SuE2KtyDxsyox3rraivkqwz5VeEAqS9JBQV56fioidJFkETdDeNk1",
      },
    });

    return image;
  } catch (err) {
    console.error(err);
  }

  return {};
});
