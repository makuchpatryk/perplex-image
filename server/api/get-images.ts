import { ResponsePexel } from "~/modules/core/types";

export default defineEventHandler(async (event) => {
  const { per_page } = getQuery(event);
  try {
    const data = await $fetch<ResponsePexel>(
      `https://api.pexels.com/v1/search?query=people&per_page=${per_page}`,
      {
        headers: {
          Authorization:
            "ud9SuE2KtyDxsyox3rraivkqwz5VeEAqS9JBQV56fioidJFkETdDeNk1",
        },
      }
    );

    return data;
  } catch (err) {
    console.error(err);
  }

  return {};
});
