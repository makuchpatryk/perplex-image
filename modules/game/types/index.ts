import type { ImagePieces, PexelPhoto } from "~/modules/core/types";
import { LevelsKeys } from "~/modules/core/constants";

export interface GameProps {
  selectedImage: PexelPhoto;
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
  highlight: number | string;
  heightScreen: number;
  moves: number;
  selectedPositions: number[];
}

