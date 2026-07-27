import AutorenewRounded from "@mui/icons-material/AutorenewRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { type FC, memo, useCallback } from "react";
import { useAnimtionLoop } from "@/hooks/useAnimationLoop";
import { usePlayNote } from "@/hooks/usePlayNote";

type Props = {
  onNextFrame: () => boolean;
  onPrevFrame: () => void;
  onShuffle: () => void;
};
export const SorterAnimationToolbar: FC<Props> = memo(
  ({ onNextFrame, onPrevFrame, onShuffle }) => {
    const { animationActive, playAnimation, stopAnimation } = useAnimtionLoop(
      onNextFrame,
      12,
    );
    const playNote = usePlayNote({
      waveform: "sine",
    });

    const handlePausePlay = useCallback(() => {
      if (animationActive) {
        stopAnimation();
      } else {
        playAnimation();
      }
    }, [stopAnimation, playAnimation, animationActive]);

    const handleNextFrame = useCallback(() => {
      if (animationActive) {
        stopAnimation();
      }
      onNextFrame();
    }, [animationActive, onNextFrame, stopAnimation]);

    const handlePrevFrame = useCallback(() => {
      if (animationActive) {
        stopAnimation();
      }
      onPrevFrame();
    }, [onPrevFrame, animationActive, stopAnimation]);

    const handleShuffle = useCallback(() => {
      if (animationActive) {
        stopAnimation();
      }
      onShuffle();
      playNote(300);
    }, [animationActive, onShuffle, playNote, stopAnimation]);

    return (
      <Toolbar variant="dense" disableGutters sx={{ gap: 1, flexWrap: "wrap" }}>
        <Button variant="contained" onClick={handleShuffle}>
          <AutorenewRounded />
        </Button>
        <Button variant="contained" onClick={handlePrevFrame}>
          <ChevronLeftRounded />
        </Button>

        <Button variant="contained" onClick={handleNextFrame}>
          <ChevronRightRounded />
        </Button>
        <Button variant="contained" onClick={handlePausePlay}>
          {animationActive ? <PauseRounded /> : <PlayArrowRounded />}
        </Button>
      </Toolbar>
    );
  },
);
