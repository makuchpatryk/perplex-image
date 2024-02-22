import { defineStore } from 'pinia';

interface State {
  shuffledPieces: ImagePieces[];
}

export const useImagesStore = defineStore({
    id: 'shuffledPieces',
    state: ():State => ({
      shuffledPieces: []
    }),
    getters: {},
    actions: {
      setShuffledPieces(shuffledPieces: ImagePieces[]) {
        this.shuffledPieces = shuffledPieces;
      }
    }
})