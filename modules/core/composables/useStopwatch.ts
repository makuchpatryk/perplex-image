export async function useStopwatch() {
  const startTime = ref<number>(0);
  let stopwatchInterval: string | number | NodeJS.Timeout | null | undefined =
    null;
  const elapsedPausedTime = ref<number>(0);
  const displayTime = ref<string>("00:00:00");

  const startStopwatch = () => {
    if (!stopwatchInterval) {
      startTime.value = new Date().getTime() - Number(elapsedPausedTime.value);
      stopwatchInterval = setInterval(updateStopwatch, 1000);
    }
  };

  const stopStopwatch = () => {
    if (stopwatchInterval) {
      clearInterval(stopwatchInterval);
    }
    elapsedPausedTime.value = new Date().getTime() - Number(startTime.value);
    stopwatchInterval = null;
  };

  const resetStopwatch = () => {
    stopStopwatch();
    elapsedPausedTime.value = 0;
    displayTime.value = "00:00:00";
  };

  const updateStopwatch = () => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - Number(startTime.value);
    const seconds = Math.floor(elapsedTime / 1000) % 60;
    const minutes = Math.floor(elapsedTime / 1000 / 60) % 60;
    const hours = Math.floor(elapsedTime / 1000 / 60 / 60);
    displayTime.value = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  };

  const pad = (number: number) => {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
  };

  return {
    startStopwatch,
    stopStopwatch,
    resetStopwatch,
    updateStopwatch,
    displayTime,
  };
}