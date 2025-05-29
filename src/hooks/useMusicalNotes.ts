import { useCallback } from "react";
import {
  usePlayNote,
  type UsePlayNoteOptions,
} from "./usePlayNote";

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
} & UsePlayNoteOptions;

export const useMusicalScale = ({
  scalePattern = MusicalScales.Lydian,
  baseMidi = 60,
  maxOctave = 2,
  wrapOctave = true,
  ...rest
}: MusicalScaleOptions = {}) => {
  const _playNote = usePlayNote(rest);

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
    (value: number) =>
      _playNote(mapValueToFrequency(value)),
    [_playNote, mapValueToFrequency]
  );

  return { playNote };
};
