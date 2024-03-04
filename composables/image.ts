export async function useImage(number='0') {
  const { url, width, height } = await $fetch(`/api/image/?per_page=${20}&&number=${number}`);

  const imageToBase64 = (
    url: string,
    callback: (a: string | ArrayBuffer | null) => void
  ) => {
    $fetch(url).then((blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64String = reader.result;
  
        callback(base64String);
      };
    });
  };

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;
  
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  };

  return { shuffle, imageToBase64, url, width, height }
}