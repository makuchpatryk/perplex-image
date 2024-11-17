import { defineStore } from "pinia";
import type {
  ImagePieces,
  PexelPhoto,
  ResponsePexel,
  TODO,
} from "~/modules/core/types";

interface State {
  shuffledPieces: ImagePieces[];
  photos: PexelPhoto[];
  selectedImage?: PexelPhoto;
}

export const useImagesStore = defineStore({
  id: "images",
  state: (): State => ({
    selectedImage: void 0,
    photos: [],
    shuffledPieces: [],
  }),
  getters: {},
  actions: {
    setShuffledPieces(shuffledPieces: ImagePieces[]) {
      this.shuffledPieces = shuffledPieces;
    },
    async randomSelectImage(): Promise<void> {
      return Promise.resolve(
        (this.selectedImage =
          this.photos[Math.round(Math.random() * this.photos.length)])
      );
    },
    async setSelectedImage(image: PexelPhoto) {
      return Promise.resolve().then(() => {
        this.selectedImage = image;
      });
    },
    async getImages() {
      const { media } = await $fetch<ResponsePexel>(
        `/api/get-images/?per_page=${100}`
      );
      this.photos = media;

      await this.setSelectedImage(
          media[Math.floor(Math.random() * media.length)]
      );
    },
    async getImage(options: { id: TODO }) {
      const image = await $fetch<PexelPhoto>(
        `/api/get-image/?id=${options.id}`
      );

      await this.setSelectedImage(image);
    },
  },
});
