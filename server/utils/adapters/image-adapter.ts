import type { ImagePhoto } from "@core/types";

export interface ImageAdapter {
  getImage(id: number): Promise<ImagePhoto>;
  getImages(): Promise<ImagePhoto[]>;
}
