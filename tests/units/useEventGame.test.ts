import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEventGame } from "../../modules/game/composables/useEventGame";
import { LevelsKeys } from "../../modules/core/constants";
import { ref } from "vue";
import type { ImagePhoto, ImagePieces } from "@core/types";
import { createTestPieces } from "./mocks/fixtures";

describe("useEventGame", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockProps: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGameData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStopwatchApi: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpenModal: any;

  beforeEach(() => {
    // Mock stopwatch
    mockStopwatchApi = {
      startStopwatch: vi.fn(),
      stopStopwatch: vi.fn(),
      resetStopwatch: vi.fn(),
      displayTime: ref("00:00:00"),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).useStopwatch = vi.fn(() => mockStopwatchApi);

    // Mock useImage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).useImage = vi.fn(() => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shuffle: (arr: any[]) => arr, // identity shuffle
    }));

    // Mock photo
    const mockPhoto: ImagePhoto = {
      id: 123,
      alt: "test",
      height: 1200,
      width: 800,
      liked: false,
      photographer: "Test",
      photographer_id: 1,
      photographer_url: "http://test.com",
      src: {
        landscape: "",
        large: "",
        large2x: "",
        medium: "",
        original: "",
        portrait: "",
        small: "",
        tiny: "",
        url: "",
      },
      url: "",
    };

    mockProps = {
      selectedImage: mockPhoto,
      level: LevelsKeys["9x13"],
    };

    mockGameData = {
      height: 1200,
      width: 800,
      url: "",
      imgSrc: "",
      isFinishedModalOpened: false,
      isPauseModalOpened: false,
      shuffledPieces: createTestPieces(9), // 9 pieces for testing
      highlightPositions: [],
      heightScreen: 0,
      moves: 0,
      selectedPositions: [],
    };

    mockOpenModal = vi.fn();
  });

  describe("Initialization", () => {
    it("should call useStopwatch and expose its API", () => {
      const api = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((globalThis as any).useStopwatch).toHaveBeenCalled();
      expect(api.displayTime).toBe(mockStopwatchApi.displayTime);
      expect(api.startStopwatch).toBe(mockStopwatchApi.startStopwatch);
    });
  });

  describe("toggleSelection", () => {
    it("should select unselected position without multi", () => {
      const { toggleSelection } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      toggleSelection(2, false);
      expect(mockGameData.selectedPositions).toEqual([2]);
    });

    it("should deselect already-selected position without multi", () => {
      mockGameData.selectedPositions = [2];
      const { toggleSelection } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      toggleSelection(2, false);
      expect(mockGameData.selectedPositions).toEqual([]);
    });

    it("should replace existing multi-selection with single position", () => {
      mockGameData.selectedPositions = [1, 3, 5];
      const { toggleSelection } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      toggleSelection(2, false);
      expect(mockGameData.selectedPositions).toEqual([2]);
    });

    it("should add to selection with multi", () => {
      mockGameData.selectedPositions = [1];
      const { toggleSelection } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      toggleSelection(3, true);
      expect(mockGameData.selectedPositions).toEqual([1, 3]);
    });

    it("should remove already-selected position with multi", () => {
      mockGameData.selectedPositions = [1, 3];
      const { toggleSelection } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      toggleSelection(1, true);
      expect(mockGameData.selectedPositions).toEqual([3]);
    });
  });

  describe("clearSelection and clearHighlight", () => {
    it("should clear selectedPositions", () => {
      mockGameData.selectedPositions = [1, 2, 3];
      const { clearSelection } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      clearSelection();
      expect(mockGameData.selectedPositions).toEqual([]);
    });

    it("should clear highlightPositions", () => {
      mockGameData.highlightPositions = [1, 2, 3];
      const { clearHighlight } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      clearHighlight();
      expect(mockGameData.highlightPositions).toEqual([]);
    });
  });

  describe("onSwap - single path", () => {
    it("should swap position fields between two pieces by slot lookup", () => {
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      onSwap({ position: 0, positionCurrent: 1 });
      const pieces = mockGameData.shuffledPieces;
      // After swap, pieces are sorted by position, so:
      // piece with originalIndex 0 should now be at position 1
      // piece with originalIndex 1 should now be at position 0
      const piece0 = pieces.find((p: ImagePieces) => p.originalIndex === 0);
      const piece1 = pieces.find((p: ImagePieces) => p.originalIndex === 1);
      expect(piece0?.position).toBe(1);
      expect(piece1?.position).toBe(0);
    });

    it("should increment moves by 1", () => {
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      const initialMoves = mockGameData.moves;
      onSwap({ position: 0, positionCurrent: 1 });
      expect(mockGameData.moves).toBe(initialMoves + 1);
    });

    it("should do nothing when position === positionCurrent", () => {
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      const pieceBefore = { ...mockGameData.shuffledPieces[0] };
      onSwap({ position: 0, positionCurrent: 0 });
      expect(mockGameData.shuffledPieces[0]).toEqual(pieceBefore);
    });

    it("should call openModal and stopStopwatch when puzzle becomes solved", () => {
      mockGameData.shuffledPieces = createTestPieces(2);
      mockGameData.shuffledPieces[0].position = 1;
      mockGameData.shuffledPieces[1].position = 0;
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      onSwap({ position: 0, positionCurrent: 1 });
      expect(mockOpenModal).toHaveBeenCalled();
      expect(mockStopwatchApi.stopStopwatch).toHaveBeenCalled();
    });

    it("should NOT call openModal when puzzle is still unsolved", () => {
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      onSwap({ position: 0, positionCurrent: 1 });
      expect(mockOpenModal).not.toHaveBeenCalled();
    });
  });

  describe("onSwap - group path", () => {
    it("should move all selected pieces by offset", () => {
      mockGameData.selectedPositions = [0, 1];
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      onSwap({ position: 0, positionCurrent: 3, selectedPositions: [0, 1] });
      const pieces = mockGameData.shuffledPieces;
      // Pieces at positions 0,1 should move to 3,4
      expect(
        pieces.some(
          (p: ImagePieces) => p.position === 3 && p.originalIndex === 0
        )
      ).toBe(true);
      expect(
        pieces.some(
          (p: ImagePieces) => p.position === 4 && p.originalIndex === 1
        )
      ).toBe(true);
    });

    it("should move displaced pieces to freed source slots", () => {
      mockGameData.selectedPositions = [0, 1];
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      // Moving pieces 0,1 to positions 2,3 displaces pieces at 2,3
      // They should go to freed slots 0,1
      onSwap({ position: 0, positionCurrent: 2, selectedPositions: [0, 1] });
      const pieces = mockGameData.shuffledPieces;
      expect(
        pieces.some(
          (p: ImagePieces) => p.position === 0 && p.originalIndex === 2
        )
      ).toBe(true);
      expect(
        pieces.some(
          (p: ImagePieces) => p.position === 1 && p.originalIndex === 3
        )
      ).toBe(true);
    });

    it("should update selectedPositions to new target slots", () => {
      mockGameData.selectedPositions = [0, 1];
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      onSwap({ position: 0, positionCurrent: 3, selectedPositions: [0, 1] });
      expect(mockGameData.selectedPositions).toEqual([3, 4]);
    });

    it("should increment moves by 1 for group swap", () => {
      mockGameData.selectedPositions = [0, 1];
      const { onSwap } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      const initialMoves = mockGameData.moves;
      onSwap({ position: 0, positionCurrent: 2, selectedPositions: [0, 1] });
      expect(mockGameData.moves).toBe(initialMoves + 1);
    });
  });

  describe("onDragEnd", () => {
    it("should clear highlightPositions", () => {
      mockGameData.highlightPositions = [1, 2, 3];
      const { onDragEnd } = useEventGame(mockProps, mockGameData, {
        openModal: mockOpenModal,
      });
      onDragEnd();
      expect(mockGameData.highlightPositions).toEqual([]);
    });
  });
});
