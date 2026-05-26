import { describe, it, expect, beforeEach, vi } from "vitest";
import { useShuffle } from "../../modules/game/composables/useShuffle";
import { LevelsKeys } from "../../modules/core/constants";
import type { ImagePhoto, ImagePieces } from "@core/types";

describe("useShuffle", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockProps: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGameData: any;

  beforeEach(() => {
    // Mock useImage to return identity shuffle (no reordering)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).useImage = vi.fn(() => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shuffle: (arr: any[]) => arr,
    }));

    // Create mock photo object
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
      shuffledPieces: undefined,
      highlightPositions: [],
      heightScreen: 0,
      moves: 0,
      selectedPositions: [],
    };
  });

  it("should create 126 pieces for 9x13 level with 800x1200 image", () => {
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    expect(pieces).toHaveLength(126); // cols=9, rows=round(1.5*9)=14, 9*14=126
  });

  it("should create 345 pieces for 15x23 level", () => {
    mockProps.level = LevelsKeys["15x23"];
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    expect(pieces).toHaveLength(345); // cols=15, rows=round(1.5*15)=23, 15*23=345
  });

  it("should create 486 pieces for 18x26 level", () => {
    mockProps.level = LevelsKeys["18x26"];
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    expect(pieces).toHaveLength(486); // cols=18, rows=round(1.5*18)=27, 18*27=486
  });

  it("should have originalIndex equal to creation index", () => {
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    pieces.forEach((piece: ImagePieces, idx: number) => {
      expect(piece.originalIndex).toBe(idx);
    });
  });

  it("should have position === originalIndex with identity shuffle", () => {
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    pieces.forEach((piece) => {
      expect(piece.position).toBe(piece.originalIndex);
    });
  });

  it("should calculate piece width correctly", () => {
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    // width = (1000 - 9*2) / 9 = 982/9 ≈ 109.11px
    const expectedWidth = (1000 - 9 * 2) / 9;
    pieces.forEach((piece) => {
      const parsedWidth = parseFloat(piece.width);
      expect(parsedWidth).toBeCloseTo(expectedWidth, 1);
    });
  });

  it("should calculate piece height correctly based on aspect ratio", () => {
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    // height = ((1200/800) * (1000 - 9*2)) / round((1200/800) * 9)
    // = (1.5 * 982) / 6 = 1473 / 6 = 245.5px
    const aspectRatio = 1200 / 800;
    const numRows = Math.round(aspectRatio * 9);
    const expectedHeight = (aspectRatio * (1000 - 9 * 2)) / numRows;
    pieces.forEach((piece) => {
      const parsedHeight = parseFloat(piece.height);
      expect(parsedHeight).toBeCloseTo(expectedHeight, 1);
    });
  });

  it("should format backgroundPosition correctly", () => {
    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();
    const widthValue = (1000 - 9 * 2) / 9;
    const aspectRatio = 1200 / 800;
    const numRows = Math.round(aspectRatio * 9);
    const heightValue = (aspectRatio * (1000 - 9 * 2)) / numRows;

    pieces.forEach((piece: ImagePieces, idx: number) => {
      const col = idx % 9;
      const row = Math.floor(idx / 9);
      const expectedBgPos = `-${col * widthValue}px -${row * heightValue}px`;
      // Allow for floating point precision differences
      const bgPosParts = piece.backgroundPosition.match(/-?\d+\.?\d*/g);
      const expectedParts = expectedBgPos.match(/-?\d+\.?\d*/g);
      expect(bgPosParts?.[0]).toBeDefined();
      expect(bgPosParts?.[1]).toBeDefined();
      expect(parseFloat(bgPosParts?.[0] || "0")).toBeCloseTo(
        parseFloat(expectedParts?.[0] || "0"),
        1
      );
      expect(parseFloat(bgPosParts?.[1] || "0")).toBeCloseTo(
        parseFloat(expectedParts?.[1] || "0"),
        1
      );
    });
  });

  it("should update positions with reverse shuffle", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockReverseShuffle = vi.fn((arr: any[]) => {
      const reversed = [...arr].reverse();
      return reversed;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).useImage = vi.fn(() => ({
      shuffle: mockReverseShuffle,
    }));

    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();

    // After reverse shuffle, position should equal index in returned array
    pieces.forEach((piece: ImagePieces, idx: number) => {
      expect(piece.position).toBe(idx);
    });
  });

  it("should have positions that are a permutation of 0..N-1 with reverse shuffle", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockReverseShuffle = vi.fn((arr: any[]) => {
      const reversed = [...arr].reverse();
      return reversed;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).useImage = vi.fn(() => ({
      shuffle: mockReverseShuffle,
    }));

    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();

    const positions = pieces.map((p: ImagePieces) => p.position);
    const expectedPositions = Array.from(
      { length: pieces.length },
      (_, i) => i
    );
    expect(positions.sort((a: number, b: number) => a - b)).toEqual(
      expectedPositions
    );
  });

  it("should not reassign originalIndex - piece[0].originalIndex = N-1 with reverse shuffle", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockReverseShuffle = vi.fn((arr: any[]) => {
      const reversed = [...arr].reverse();
      return reversed;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).useImage = vi.fn(() => ({
      shuffle: mockReverseShuffle,
    }));

    const { shufflePieces } = useShuffle(mockProps, mockGameData);
    const pieces = shufflePieces();

    // First piece in result should have originalIndex from last piece
    expect(pieces[0].originalIndex).toBe(pieces.length - 1);
  });
});
