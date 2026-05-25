import type { ImagePhoto } from "~/modules/core/types";

export interface ImageAdapter {
  getImage(id: number): Promise<ImagePhoto>;
  getImages(): Promise<ImagePhoto[]>;
}
