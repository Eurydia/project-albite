import {
  AutorenewRounded,
  FastForwardRounded,
  FastRewindRounded,
} from "@mui/icons-material";
import { Button, Toolbar } from "@mui/material";
import { memo, type FC } from "react";

type Props = {
  onNextFrame: () => void;
  onPrevFrame: () => void;
  onShuffle: () => void;
};
export const SorterAnimationToolbar: FC<Props> = memo(
  ({ onNextFrame, onPrevFrame, onShuffle }) => {
    return (
      <Toolbar
        variant="dense"
        disableGutters
        sx={{ gap: { xs: 1, md: 2 }, flexWrap: "wrap" }}
      >
        <Button
          startIcon={<FastRewindRounded />}
          variant="contained"
          onClick={onPrevFrame}
        >
          Previous
        </Button>
        <Button
          startIcon={<AutorenewRounded />}
          variant="contained"
          onClick={onShuffle}
        >
          Shuffle
        </Button>
        <Button
          variant="contained"
          endIcon={<FastForwardRounded />}
          onClick={onNextFrame}
        >
          Next
        </Button>
      </Toolbar>
    );
  }
);
