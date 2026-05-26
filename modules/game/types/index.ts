import type { ImagePieces, ImagePhoto } from "@core/types";
import { LevelsKeys } from "@core/constants";

export interface GameProps {
  selectedImage: ImagePhoto;
  level: LevelsKeys;
}

export interface GameData {
  height: number;
  width: number;
  url: string;
  imgSrc: string;
  isFinishedModalOpened: boolean;
  isPauseModalOpened: boolean;
  shuffledPieces: ImagePieces[] | undefined;
  highlightPositions: number[];
  heightScreen: number;
  moves: number;
  selectedPositions: number[];
}
