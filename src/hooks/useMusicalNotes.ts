import { useCallback, useRef } from "react";

interface UseMusicalScaleOptions {
  duration?: number; // seconds
  fadeDuration?: number; // seconds
  scalePattern?: readonly number[]; // semitone intervals
  baseMidiNote?: number; // MIDI note for root (default C4 = 60)
  totalValues?: number; // total mapped items
  waveform?: OscillatorType; // 'sine' | 'square' | ...
  gain?: number; // 0–1
}

export const SCALES = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  NaturalMinor: [0, 2, 3, 5, 7, 8, 10],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Locrian: [0, 1, 3, 5, 6, 8, 10],
  MajorPentatonic: [0, 2, 4, 7, 9],
  MinorPentatonic: [0, 3, 5, 7, 10],
  BluesMinor: [0, 3, 5, 6, 7, 10],
} as const;

export const useMusicalScale = (
  options: UseMusicalScaleOptions = {}
) => {
  const {
    duration = 0.5,
    fadeDuration = 0.1,
    scalePattern = SCALES.Major,
    baseMidiNote = 60,
    waveform = "sine",
    gain = 0.2,
  } = options;

  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }
    return audioCtxRef.current;
  };

  const mapValueToFrequency = useCallback(
    (value: number, octaveOffset = 0): number => {
      const degree = (value - 1) % scalePattern.length;
      const octave =
        Math.floor((value - 1) / scalePattern.length) +
        octaveOffset;
      const midi =
        baseMidiNote + octave * 12 + scalePattern[degree];
      return 440 * Math.pow(2, (midi - 69) / 12);
    },
    [scalePattern, baseMidiNote]
  );

  const playNote = useCallback(
    (value: number, octaveOffset = 0) => {
      const freq = mapValueToFrequency(value, octaveOffset);
      const audioCtx = getAudioContext();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(
        freq,
        audioCtx.currentTime
      );

      gainNode.gain.setValueAtTime(
        gain,
        audioCtx.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration - fadeDuration
      );

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + duration);
    },
    [
      mapValueToFrequency,
      duration,
      fadeDuration,
      waveform,
      gain,
    ]
  );

  return { playNote };
};
