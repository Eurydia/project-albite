import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const unwrappedNext = <T>(
  generator: Generator<T, void, unknown>
): T | null => {
  const next = generator.next();
  if (next.done === undefined || !next.done) {
    return next.value;
  }
  return null;
};

export const useSortAnimatorGenerator = <T extends object>(
  animator: () => Generator<T, void, unknown>
) => {
  const animatorRef = useRef(animator());
  const framesRef = useRef<(T | null)[]>([
    unwrappedNext(animatorRef.current),
  ]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const frame = animatorRef.current.next();
    if (frame.done === undefined || !frame.done) {
      framesRef.current.push(frame.value);
    }
  }, []);

  const reset = useCallback(() => {
    animatorRef.current = animator();
    const frame = animatorRef.current.next();
    if (frame.done === undefined || !frame.done) {
      framesRef.current = [frame.value];
      setFrameIndex(0);
    }
  }, [animator]);

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
