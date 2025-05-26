import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

export const useSortAnimatorGenerator = <T extends object>(
  animator: () => Generator<T, void, unknown>
) => {
  const framesRef = useRef<T[]>([]);
  const [gen, setGen] = useState<
    Generator<T, void, unknown>
  >(() => {
    const gen = animator();
    const next = gen.next();
    if (next.done === undefined || !next.done) {
      framesRef.current = [next.value];
    }
    return gen;
  });
  const [frameIndex, setFrameIndex] = useState<number>(0);

  const reset = useCallback(() => {
    const gen_ = animator();
    const next = gen_.next();
    if (next.done === undefined || !next.done) {
      framesRef.current = [next.value];
    }
    setGen(gen_);
    setFrameIndex(0);
  }, [animator]);

  const nextFrame = useCallback(() => {
    const frame = gen.next();
    if (frame.done === undefined || !frame.done) {
      framesRef.current.push(frame.value);
    }
    setFrameIndex((prev) => {
      return Math.min(
        framesRef.current.length - 1,
        prev + 1
      );
    });
  }, [gen]);

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
