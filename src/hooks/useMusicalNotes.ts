import { useCallback, useRef } from "react";

export const MusicalScales = {
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

export type MusicalScaleOptions = {
  /** Your base scale degrees in semitones, e.g. Major = [0,2,4,5,7,9,11] */
  scalePattern?: readonly number[];
  /** MIDI note at pattern-degree 0, octave 0 (default = C4 = 60) */
  baseMidi?: number;
  /** Maximum octave you want before it wraps back to 0 */
  maxOctave?: number;
  /** If true, octaves wrap; if false, they clamp at maxOctave */
  wrapOctave?: boolean;
  duration?: number;
  fadeDuration?: number;
  waveform?: OscillatorType;
  gain?: number;
};

export const useMusicalScale = ({
  scalePattern = MusicalScales.Lydian,
  baseMidi = 60,
  maxOctave = 2,
  wrapOctave = true,
  duration = 1,
  fadeDuration = 0.1,
  waveform = "sine",
  gain = 0.2,
}: MusicalScaleOptions = {}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioContext = () => {
    if (audioCtxRef.current === null) {
      audioCtxRef.current = new window.AudioContext();
    }
    return audioCtxRef.current;
  };

  const mapValueToFrequency = useCallback(
    (value: number) => {
      const v = Math.max(1, Math.floor(value));

      const degree = (v - 1) % scalePattern.length;

      const rawOctave = Math.floor(
        (v - 1) / scalePattern.length
      );

      const octave = wrapOctave
        ? rawOctave % (maxOctave + 1)
        : Math.min(rawOctave, maxOctave);

      const midi =
        baseMidi + scalePattern[degree] + octave * 12;
      return 440 * Math.pow(2, (midi - 69) / 12);
    },
    [scalePattern, baseMidi, maxOctave, wrapOctave]
  );

  const playNote = useCallback(
    (value: number) => {
      const freq = mapValueToFrequency(value);
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
      waveform,
      gain,
      duration,
      fadeDuration,
    ]
  );

  return { playNote };
};
