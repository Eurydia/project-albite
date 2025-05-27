import {
  AutorenewRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
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
        sx={{ gap: 1, flexWrap: "wrap" }}
      >
        <Button
          variant="contained"
          onClick={onPrevFrame}
        >
          <ChevronLeftRounded />
        </Button>
        <Button
          variant="contained"
          onClick={onShuffle}
        >
          <AutorenewRounded />
        </Button>
        <Button
          variant="contained"
          onClick={onNextFrame}
        >
          <ChevronRightRounded />
        </Button>
      </Toolbar>
    );
  }
);
