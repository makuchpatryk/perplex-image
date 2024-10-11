import { defineStore } from "pinia";
import type { ImagePieces, PexelPhoto, ResponsePexel } from "~/types";

interface State {
  shuffledPieces: ImagePieces[];
  photos: PexelPhoto[];
  selectedImage: PexelPhoto;
}

export const useImagesStore = defineStore({
  id: "images",
  state: (): State => ({
    selectedImage: {} as PexelPhoto,
    photos: [],
    shuffledPieces: [],
  }),
  getters: {},
  actions: {
    setShuffledPieces(shuffledPieces: ImagePieces[]) {
      this.shuffledPieces = shuffledPieces;
    },
    setSelectedImage(image: PexelPhoto) {
      return Promise.resolve().then(() => {
        this.selectedImage = image;
      });
    },
    async getImages() {
      const data = await $fetch<ResponsePexel>(
        `/api/get-images/?per_page=${20}`
      );
      this.photos = data.photos;

      this.setSelectedImage(data.photos[3]);
    },
    async getImage(options: { id: any }) {
      const image = await $fetch<PexelPhoto>(
        `/api/get-image/?id=${options.id}`
      );

      this.setSelectedImage(image);
    },
  },
});
