import { describe, it, expect, beforeEach, vi } from "vitest";
import { useImage } from "../../modules/core/composables/useImage";

describe("useImage", () => {
  describe("shuffle", () => {
    it("should return the same array instance (in-place mutation)", () => {
      const { shuffle } = useImage();
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result).toBe(arr);
    });

    it("should preserve all elements", () => {
      const { shuffle } = useImage();
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffle(arr);
      expect(arr.sort((a, b) => a - b)).toEqual(original.sort((a, b) => a - b));
    });

    it("should be deterministic with mocked Math.random returning 0", () => {
      const { shuffle } = useImage();
      const spy = vi.spyOn(Math, "random").mockReturnValue(0);
      const arr1 = [1, 2, 3, 4, 5];
      const arr2 = [1, 2, 3, 4, 5];
      shuffle(arr1);
      shuffle(arr2);
      expect(arr1).toEqual(arr2);
      spy.mockRestore();
    });

    it("should handle empty array without throwing", () => {
      const { shuffle } = useImage();
      const arr: number[] = [];
      expect(() => shuffle(arr)).not.toThrow();
      expect(arr).toEqual([]);
    });

    it("should handle single-element array", () => {
      const { shuffle } = useImage();
      const arr = [42];
      shuffle(arr);
      expect(arr).toEqual([42]);
    });
  });

  describe("imageToBase64", () => {
    beforeEach(() => {
      // Mock FileReader constructor that creates new instances for each call
      vi.stubGlobal(
        "FileReader",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.fn(function (this: any) {
          return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            readAsDataURL: vi.fn(function (this: any) {
              setTimeout(() => {
                this.result = "data:image/png;base64,abc123";
                this.onloadend?.();
              }, 0);
            }),
            result: null,
            onloadend: null,
          };
        })
      );

      // Mock $fetch to return a Blob
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).$fetch = vi.fn(() =>
        Promise.resolve(new Blob(["test"], { type: "image/png" }))
      );
    });

    it("should call $fetch with the provided URL", async () => {
      const { imageToBase64 } = useImage();
      const url = "https://example.com/image.png";
      imageToBase64(url, () => {});
      await new Promise((r) => setTimeout(r, 10));
      expect(globalThis.$fetch).toHaveBeenCalledWith(url);
    });

    it("should pass base64 result to callback via FileReader", async () => {
      const { imageToBase64 } = useImage();
      const callback = vi.fn();
      imageToBase64("https://example.com/image.png", callback);
      await new Promise((r) => setTimeout(r, 10));
      expect(callback).toHaveBeenCalledWith("data:image/png;base64,abc123");
    });

    it("should pass null to callback when FileReader result is null", async () => {
      // Override FileReader to return null result
      vi.stubGlobal(
        "FileReader",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.fn(function (this: any) {
          return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            readAsDataURL: vi.fn(function (this: any) {
              setTimeout(() => {
                this.result = null;
                this.onloadend?.();
              }, 0);
            }),
            result: null,
            onloadend: null,
          };
        })
      );

      const { imageToBase64 } = useImage();
      const callback = vi.fn();
      imageToBase64("https://example.com/image.png", callback);
      await new Promise((r) => setTimeout(r, 10));
      expect(callback).toHaveBeenCalledWith(null);
    });
  });
});
