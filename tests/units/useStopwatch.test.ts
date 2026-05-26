import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useStopwatch } from "../../modules/core/composables/useStopwatch";

describe("useStopwatch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should have initial displayTime of 00:00:00", () => {
    const { displayTime } = useStopwatch();
    expect(displayTime.value).toBe("00:00:00");
  });

  it("should display 00:00:01 after 1 second", () => {
    const { displayTime, startStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(1000);
    expect(displayTime.value).toBe("00:00:01");
  });

  it("should display 00:01:05 after 65 seconds", () => {
    const { displayTime, startStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(65000);
    expect(displayTime.value).toBe("00:01:05");
  });

  it("should display 01:00:00 after 3600 seconds", () => {
    const { displayTime, startStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(3600000);
    expect(displayTime.value).toBe("01:00:00");
  });

  it("should be idempotent - calling startStopwatch twice does not double-tick", () => {
    const { displayTime, startStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(1000);
    startStopwatch();
    vi.advanceTimersByTime(1000);
    expect(displayTime.value).toBe("00:00:02");
  });

  it("should freeze display after stopStopwatch - advancing time has no effect", () => {
    const { displayTime, startStopwatch, stopStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(3000);
    stopStopwatch();
    const beforeTime = displayTime.value;
    vi.advanceTimersByTime(5000);
    expect(displayTime.value).toBe(beforeTime);
    expect(displayTime.value).toBe("00:00:03");
  });

  it("should handle pause/resume correctly - 3s elapsed, stop, 10s idle, resume, 2s more = 00:00:05", () => {
    const { displayTime, startStopwatch, stopStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(3000);
    stopStopwatch();
    vi.advanceTimersByTime(10000);
    startStopwatch();
    vi.advanceTimersByTime(2000);
    expect(displayTime.value).toBe("00:00:05");
  });

  it("should reset displayTime to 00:00:00", () => {
    const { displayTime, startStopwatch, resetStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(5000);
    resetStopwatch();
    expect(displayTime.value).toBe("00:00:00");
  });

  it("should start counting from zero after reset", () => {
    const { displayTime, startStopwatch, resetStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(5000);
    resetStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(2000);
    expect(displayTime.value).toBe("00:00:02");
  });

  it("should reflect current elapsed time when updateStopwatch is called manually", () => {
    const { displayTime, startStopwatch, updateStopwatch } = useStopwatch();
    startStopwatch();
    vi.advanceTimersByTime(3000);
    updateStopwatch();
    expect(displayTime.value).toBe("00:00:03");
  });
});
