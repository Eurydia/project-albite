import { useCallback, useRef } from "react";

export type UsePlayNoteOptions = {
  waveform?: OscillatorType;
  gain?: number;
  duration?: number;
  fadeDuration?: number;
};

export const usePlayNote = ({
  waveform = "sine",
  gain = 0.1,
  duration = 1,
  fadeDuration = 0.1,
}: UsePlayNoteOptions = {}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (audioCtxRef.current === null) {
      audioCtxRef.current = new window.AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playNote = useCallback(
    (frequency: number) => {
      const audioCtx = getAudioContext();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // configure oscillator
      osc.type = waveform;
      osc.frequency.setValueAtTime(
        frequency,
        audioCtx.currentTime
      );

      // configure gain envelope
      gainNode.gain.setValueAtTime(
        gain,
        audioCtx.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration - fadeDuration
      );

      // connect and play
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + duration);
    },
    [
      getAudioContext,
      waveform,
      gain,
      duration,
      fadeDuration,
    ]
  );

  return playNote;
};
