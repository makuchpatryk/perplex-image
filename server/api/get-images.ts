import { ResponsePexel } from "~/modules/core/types";

export default defineEventHandler(async (event) => {
  const { per_page } = getQuery(event);
  try {
    return await $fetch<ResponsePexel>(
      `https://api.pexels.com/v1/collections/dyck2i1?per_page=${per_page}`,
      {
        headers: {
          Authorization:
            "ud9SuE2KtyDxsyox3rraivkqwz5VeEAqS9JBQV56fioidJFkETdDeNk1",
        },
      }
    );
  } catch (err) {
    console.error(err);
  }

  return {};
});
