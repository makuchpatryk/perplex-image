export default defineEventHandler( async (event) => {
    const { per_page, number } = getQuery(event);
    const data = await $fetch(`https://api.pexels.com/v1/search?query=people&per_page=${per_page}`, {
        headers: {
            Authorization: "ud9SuE2KtyDxsyox3rraivkqwz5VeEAqS9JBQV56fioidJFkETdDeNk1"
        }
    });

    try {
        return {
            width: data.photos[number].width,
            height: data.photos[number].height,
            url: data.photos[number].src.large,
        }
    }
    catch (err) {
        console.error(err);
    }

    return {};
});

