import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const useSortAnimatorGenerator = <T extends object>(
  animator: Generator<T, void, unknown>
) => {
  const animatorRef = useRef(animator);
  const framesRef = useRef<T[]>([]);

  useEffect(() => {
    const frame = animatorRef.current.next();
    if (frame.done === undefined || !frame.done) {
      framesRef.current.push(frame.value);
    }
  }, []);

  const [frameIndex, setFrameIndex] = useState(0);

  const reset = useCallback(
    (animator: Generator<T, void, unknown>) => {
      animatorRef.current = animator;
      const frame = animatorRef.current.next();
      if (frame.done === undefined || !frame.done) {
        framesRef.current = [frame.value];
        setFrameIndex(0);
      }
    },
    []
  );

  const nextFrame = useCallback(() => {
    const frame = animatorRef.current.next();
    if (frame.done === undefined || !frame.done) {
      framesRef.current.push(frame.value);
    }
    setFrameIndex((prev) => {
      return Math.min(
        framesRef.current.length - 1,
        prev + 1
      );
    });
  }, []);

  const prevFrame = useCallback(() => {
    setFrameIndex((prev) => {
      return Math.max(0, prev - 1);
    });
  }, []);

  const frame = useMemo(() => {
    return framesRef.current.at(frameIndex) ?? null;
  }, [frameIndex]);

  return {
    reset,
    prevFrame,
    nextFrame,
    frame,
  };
};
