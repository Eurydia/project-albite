import { useAnimtionLoop } from "@/hooks/useAnimationLoop";
import {
  AutorenewRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  PauseRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import { Button, Toolbar } from "@mui/material";
import { memo, useCallback, type FC } from "react";

type Props = {
  onNextFrame: () => boolean;
  onPrevFrame: () => void;
  onShuffle: () => void;
};
export const SorterAnimationToolbar: FC<Props> = memo(
  ({ onNextFrame, onPrevFrame, onShuffle }) => {
    const {
      animationActive,
      playAnimation,
      stopAnimation,
    } = useAnimtionLoop(onNextFrame);

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
    }, [onShuffle, animationActive, stopAnimation]);

    return (
      <Toolbar
        variant="dense"
        disableGutters
        sx={{ gap: 1, flexWrap: "wrap" }}
      >
        <Button
          variant="contained"
          onClick={handleShuffle}
        >
          <AutorenewRounded />
        </Button>
        <Button
          variant="contained"
          onClick={handlePrevFrame}
        >
          <ChevronLeftRounded />
        </Button>

        <Button
          variant="contained"
          onClick={handleNextFrame}
        >
          <ChevronRightRounded />
        </Button>
        <Button
          variant="contained"
          onClick={handlePausePlay}
        >
          {animationActive ? (
            <PauseRounded />
          ) : (
            <PlayArrowRounded />
          )}
        </Button>
      </Toolbar>
    );
  }
);
