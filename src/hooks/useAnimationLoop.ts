import { useCallback, useRef, useState } from "react";

export const useAnimtionLoop = (
  animator: () => boolean,
  frames: number
) => {
  const intervalRef = useRef<number>(undefined);
  const [animationActive, setAnimationActive] =
    useState(false);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current === undefined) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    setAnimationActive(false);
  }, []);

  const playAnimation = useCallback(() => {
    if (intervalRef.current !== undefined) {
      return;
    }
    setAnimationActive(true);
    intervalRef.current = setInterval(() => {
      const done = animator();
      if (done) {
        stopAnimation();
      }
    }, 1000 / frames);
  }, [animator, frames, stopAnimation]);

  return {
    animationActive,
    playAnimation,
    stopAnimation,
  };
};
