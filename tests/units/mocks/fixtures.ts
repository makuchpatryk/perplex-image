import type { ImagePieces } from "@core/types";
import type { GameData } from "@game/types";

/**
 * Create test pieces array. Each piece has position, originalIndex, and other required fields.
 * @param count Total number of pieces
 * @returns Array of pieces with position === originalIndex (solved state)
 */
export function createTestPieces(count: number): ImagePieces[] {
  return Array.from({ length: count }, (_, i) => ({
    position: i,
    originalIndex: i,
    width: "100px",
    height: "100px",
    backgroundPosition: `0px 0px`,
  }));
}

/**
 * Create game data object with default/empty state.
 */
export function createTestGameData(
  shuffledPieces: ImagePieces[] = []
): GameData {
  return {
    shuffledPieces,
    selectedPositions: [],
    highlightPositions: [],
    moves: 0,
    height: 1200,
    width: 800,
    url: "",
    imgSrc: "",
    isFinishedModalOpened: false,
    isPauseModalOpened: false,
    heightScreen: 0,
  };
}

/**
 * Create a reverse-order shuffle: last piece goes first, etc.
 */
export function createReverseShuffle(pieces: ImagePieces[]): ImagePieces[] {
  const reversed = [...pieces].reverse();
  return reversed.map((piece, idx) => ({
    ...piece,
    position: idx,
  }));
}
