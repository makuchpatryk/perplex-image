export async function useImage() {
  const imageToBase64 = (
    url: string,
    callback: (a: string | ArrayBuffer | null) => void
  ) => {
    $fetch<Blob>(url).then((blob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64String = reader.result;
        callback(base64String);
      };
    });
  };

  const shuffle = <T>(array: T[]): T[] => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  return { shuffle, imageToBase64 };
}
